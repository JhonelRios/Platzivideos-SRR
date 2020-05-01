import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';

import reducer from './reducers';

import App from './routes/App';

const getCookies = () => {
    try {
        const cookies = document.cookie.split(';').map((item) => item.trim());
        const entries = cookies.map((item) => item.split('='));
        const userCookies = Object.fromEntries(entries);
        return userCookies.id ? userCookies : {};
    } catch (error) {
        console.log(error);
    }
};

const getMoviesFromApi = async (token) => {
    const { data } = await axios({
        url: `http://localhost:3000/api/movies`,
        headers: { Authorization: `Bearer ${token}` },
        method: 'get',
    });

    return data.data;
};

const getUserMoviesFromApi = async (token) => {
    const { data } = await axios({
        url: `http://localhost:8000/user-movies`,
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
        method: 'get',
    });

    return data.data
}

const matchMovie = (movie, userMoviesList) => {
    const [ movieMatched ] = userMoviesList.filter(userMovie => userMovie._id === movie._id);

    if (movieMatched) {
        return !movie._id === movieMatched._id;
    }

    return true;
}

const main = async () => {
    const cookies = getCookies();
    let moviesList, userMoviesList, user, trends, originals;

    if (Object.keys(cookies).length > 0) {
        const { token, id, name, email } = cookies;

        try {
            moviesList = await getMoviesFromApi(token);
            const userMoviesIdList = await getUserMoviesFromApi(token);

            userMoviesList = moviesList.filter(movie => {
                const [ movieMatched ] = userMoviesIdList.filter(id => id.movieId === movie._id);

                if (movieMatched) {
                    return movie._id === movieMatched.movieId;
                }

                return false;
            });

            user = { id, name, email };
            trends = moviesList.filter((item) => item.contentRating === 'R');
            originals = moviesList.filter((item) => item.contentRating === 'G');

            if (userMoviesList.length > 0) {
                trends = trends.filter(movie => matchMovie(movie, userMoviesList));
                originals = originals.filter(movie => matchMovie(movie, userMoviesList));
            }

        } catch (error) {
            console.log(error);
        }
    }

    const initialState = {
        user: user || {},
        search: {},
        playing: {},
        mylist: userMoviesList|| [],
        trends: trends || [
            {
                id: 2,
                slug: 'tvshow-2',
                title: 'In the Dark',
                type: 'Scripted',
                language: 'English',
                year: 2009,
                contentRating: '16+',
                duration: 164,
                cover: 'http://dummyimage.com/800x600.png/99118E/ffffff',
                description:
                    'Vestibulum ac est lacinia nisi venenatis tristique',
                source: 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4',
            },
            {
                id: 3,
                slug: 'tvshow-3',
                title: 'Instinct',
                type: 'Adventure',
                language: 'English',
                year: 2002,
                contentRating: '16+',
                duration: 137,
                cover: 'http://dummyimage.com/800x600.png/302140/ffffff',
                description:
                    'Vestibulum ac est lacinia nisi venenatis tristique',
                source: 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4',
            },
            {
                id: 4,
                slug: 'tvshow-4',
                title: 'Grand Hotel',
                type: 'Comedy',
                language: 'English',
                year: 2014,
                contentRating: '16+',
                duration: 163,
                cover: 'http://dummyimage.com/800x600.png/5472FF/ffffff',
                description:
                    'Vestibulum ac est lacinia nisi venenatis tristique',
                source: 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4',
            },
            {
                id: 5,
                slug: 'tvshow-5',
                title: 'Stargate Atlantis',
                type: 'Scripted',
                language: 'English',
                year: 2014,
                contentRating: '16+',
                duration: 194,
                cover: 'http://dummyimage.com/800x600.png/B36F20/ffffff',
                description:
                    'Vestibulum ac est lacinia nisi venenatis tristique',
                source: 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4',
            },
            {
                id: 6,
                slug: 'tvshow-6',
                title: 'Final Space',
                type: 'Scripted',
                language: 'English',
                year: 2017,
                contentRating: '16+',
                duration: 124,
                cover: 'http://dummyimage.com/800x600.png/CCC539/ffffff',
                description:
                    'Vestibulum ac est lacinia nisi venenatis tristique',
                source: 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4',
            },
            {
                id: 7,
                slug: 'tvshow-7',
                title: 'The InBetween',
                type: 'Drama',
                language: 'English',
                year: 2011,
                contentRating: '16+',
                duration: 179,
                cover: 'http://dummyimage.com/800x600.png/FF7A90/ffffff',
                description:
                    'Vestibulum ac est lacinia nisi venenatis tristique',
                source: 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4',
            },
        ],
        originals: originals || [
            {
                id: 8,
                slug: 'tvshow-8',
                title: 'Stargate Atlantis',
                type: 'Action',
                language: 'English',
                year: 2012,
                contentRating: '16+',
                duration: 148,
                cover: 'http://dummyimage.com/800x600.png/306880/ffffff',
                description:
                    'Vestibulum ac est lacinia nisi venenatis tristique',
                source: 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4',
            },
            {
                id: 9,
                slug: 'tvshow-9',
                title: 'Alien Highway',
                type: 'Action',
                language: 'English',
                year: 2019,
                contentRating: '16+',
                duration: 128,
                cover: 'http://dummyimage.com/800x600.png/604180/ffffff',
                description:
                    'Vestibulum ac est lacinia nisi venenatis tristique',
                source: 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4',
            },
            {
                id: 10,
                slug: 'tvshow-10',
                title: 'Elementary',
                type: 'Animation',
                language: 'English',
                year: 2011,
                contentRating: '16+',
                duration: 346,
                cover: 'http://dummyimage.com/800x600.png/FF91BA/ffffff',
                description:
                    'Vestibulum ac est lacinia nisi venenatis tristique',
                source: 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4',
            },
            {
                id: 11,
                slug: 'tvshow-11',
                title: 'Strange Angel',
                type: 'War',
                language: 'English',
                year: 2015,
                contentRating: '16+',
                duration: 226,
                cover: 'http://dummyimage.com/800x600.png/45807C/ffffff',
                description:
                    'Vestibulum ac est lacinia nisi venenatis tristique',
                source: 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4',
            },
            {
                id: 12,
                slug: 'tvshow-12',
                title: 'Private Eyes',
                type: 'Comedy',
                language: 'English',
                year: 2018,
                contentRating: '16+',
                duration: 190,
                cover: 'http://dummyimage.com/800x600.png/577380/ffffff',
                description:
                    'Vestibulum ac est lacinia nisi venenatis tristique',
                source: 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4',
            },
            {
                id: 13,
                slug: 'tvshow-13',
                title: 'NCIS: Los Angeles',
                type: 'Drama',
                language: 'English',
                year: 2010,
                contentRating: '16+',
                duration: 160,
                cover: 'http://dummyimage.com/800x600.png/5472FF/ffffff',
                description:
                    'Vestibulum ac est lacinia nisi venenatis tristique',
                source: 'https://mdstrm.com/video/58333e214ad055d208427db5.mp4',
            },
        ],
    };

    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(
        reducer,
        initialState,
        composeEnhancers(applyMiddleware(thunk))
    );

    ReactDOM.render(
        <Provider store={store}>
            <App isLogged={initialState.user.id} />
        </Provider>,

        document.getElementById('app')
    );
};

main();