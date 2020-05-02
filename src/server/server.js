const express = require('express');
const webpack = require('webpack');
const session = require('express-session');
const passport = require('passport');
const boom = require('@hapi/boom');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const helmet = require('helmet');
const cors = require('cors');

const { config } = require('./config');

// SSR
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import routes from '../frontend/routes/serverRoutes';
import reducer from '../frontend/reducers';
import initialState from '../frontend/initialState';

// Start Express app
const app = express();

// Middlewares
app.use(cors({ credentials: true, origin: 'http://localhost:8080' }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
    session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Express integration with Webpack for development env.
if (config.dev) {
    const webpackConfig = require('../../webpack.config');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const compiler = webpack(webpackConfig);
    const serverConfig = { port: config.port, hot: true };

    app.use(webpackDevMiddleware(compiler, serverConfig));
    app.use(webpackHotMiddleware(compiler));
}

// *** SSR IMPLEMENTATION ***

// HTML with our App response as a string
const setResponse = (html, preloadedState) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PlatziVideo</title>
            <link rel="stylesheet" href="assets/main.css" type="text/css">
        </head>
        <body>
            <div id="app">${html}</div>
            <script>
                window.__PRELOADED_STATE__ = ${JSON.stringify(
                    preloadedState
                ).replace(/</g, '\\u003c')}
            </script>
            <script src="bundle.js" type="text/javascript"></script>
        </body>
        </html>
    `;
};

// Render React App function
const renderApp = (req, res) => {
    const store = createStore(reducer, initialState);
    const preloadedState = store.getState();
    const html = renderToString(
        <Provider store={store}>
            <StaticRouter location={req.url} context={{}}>
                {renderRoutes(routes)}
            </StaticRouter>
        </Provider>
    );

    res.send(setResponse(html, preloadedState));
};

// Rout to render our App
app.get('*', renderApp);

// *** API REQUESTS ***

// Basic Strategy
require('./utils/auth/strategies/basic');

// OAuth Strategy
require('./utils/auth/strategies/oauth');

// Twitter Strategy
require('./utils/auth/strategies/twitter');

// Facebook Strategy
require('./utils/auth/strategies/facebook');

app.post('/auth/sign-in', async (req, res, next) => {
    passport.authenticate('basic', (error, data) => {
        try {
            if (error || !data) {
                next(boom.unauthorized());
            }

            const { token, ...user } = data;

            req.login(data, { session: false }, async (error) => {
                if (error) {
                    next(error);
                }

                res.cookie('token', token, {
                    httpOnly: !config.dev,
                    secure: !config.dev
                });

                res.status(200).json(user.user);
            });
        } catch (error) {
            next(error);
        }
    })(req, res, next);
});

app.post('/auth/sign-up', async (req, res, next) => {
    const { body: user } = req;

    try {
        const { data } = await axios({
            url: `${config.apiUrl}/api/auth/sign-up`,
            method: 'post',
            data: user
        });

        res.status(201).json({
            name: user.name,
            email: user.email,
            id: data.data
        });
    } catch (error) {
        next(error);
    }
});

app.get('/user-movies', async (req, res, next) => {
    try {
        const { token, id: userId } = req.cookies;

        const { data, status } = await axios({
            url: `${config.apiUrl}/api/user-movies`,
            headers: { Authorization: `Bearer ${token}` },
            method: 'get',
            data: { userId }
        });

        if (status !== 200) {
            return next(boom.badImplementation());
        }

        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
});

app.post('/user-movies', async (req, res, next) => {
    try {
        const { body } = req;
        const { token, id } = req.cookies;

        const userMovie = {
            userId: id,
            movieId: body.movieId
        };

        const { data, status } = await axios({
            url: `${config.apiUrl}/api/user-movies`,
            headers: { Authorization: `Bearer ${token}` },
            method: 'post',
            data: userMovie
        });

        if (status !== 201) {
            return next(boom.badImplementation());
        }

        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
});

app.delete('/user-movies/:userMovieId', async (req, res, next) => {
    try {
        const { userMovieId } = req.params;
        const { token, id: userId } = req.cookies;

        const { data: userMovies } = await axios({
            url: `${config.apiUrl}/api/user-movies`,
            headers: { Authorization: `Bearer ${token}` },
            method: 'get',
            data: { userId }
        });

        const [userMovieMatched] = userMovies.data.filter(
            (item) => item.movieId === userMovieId
        );

        const { data, status } = await axios({
            url: `${config.apiUrl}/api/user-movies/${userMovieMatched._id}`,
            headers: { Authorization: `Bearer ${token}` },
            method: 'delete'
        });

        if (status !== 200) {
            return next(boom.badImplementation());
        }

        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
});

app.get(
    '/auth/google-oauth',
    passport.authenticate('google-oauth', {
        scope: ['email', 'profile', 'openid']
    })
);

app.get(
    '/auth/google-oauth/callback',
    passport.authenticate('google-oauth', { session: false }),
    (req, res, next) => {
        if (!req.user) {
            next(boom.unauthorized);
        }

        const { token, ...user } = req.user;

        res.cookie('token', token, {
            httpOnly: !config.dev,
            secure: !config.dev
        });

        res.status(200).json(user);
    }
);

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get(
    '/auth/twitter/callback',
    passport.authenticate('twitter', { session: false }),
    (req, res, next) => {
        if (!req.user) {
            next(boom.unauthorized());
        }

        const { token, ...user } = req.user;

        res.cookie('token', token, {
            httpOnly: !config.dev,
            secure: !config.dev
        });

        res.status(200).json(user);
    }
);

app.get(
    '/auth/facebook',
    passport.authenticate('facebook', {
        scope: ['email']
    })
);

app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', { session: false }),
    (req, res, next) => {
        if (!req.user) {
            next(boom.unauthorized());
        }

        const { token, ...user } = req.user;

        res.cookie('token', token, {
            httpOnly: !config.dev,
            secure: !config.dev
        });

        res.status(200).json(user);
    }
);

app.listen(config.port, () => {
    console.log(`Escuchando en http://localhost:${config.port}`);
});
