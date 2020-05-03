import { Redirect } from 'react-router';
import React from 'react';

import Home from '../containers/Home';
import Login from '../containers/Login';
import Register from '../containers/Register';
import Player from '../containers/Player';
import NotFound from '../containers/NotFound';

const serverRoutes = (isLogged) => {
    return [
        {
            exact: true,
            path: '/',
            component: isLogged ? Home : () => <Redirect to="/login" />
        },
        {
            exact: true,
            path: '/login',
            component: isLogged ? () => <Redirect to="/" /> : Login
        },
        {
            exact: true,
            path: '/register',
            component: isLogged ? () => <Redirect to="/" /> : Register
        },
        {
            exact: true,
            path: '/player/:id',
            component: isLogged ? Player : () => <Redirect to="/login" />
        },
        {
            name: 'NotFound',
            component: NotFound
        }
    ];
};

export default serverRoutes;
