import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../containers/Home';
import Login from '../containers/Login';
import Register from '../containers/Register';
import Player from '../containers/Player';
import NotFound from '../containers/NotFound';

const App = ({ isLogged }) => (
    <BrowserRouter>
        <Layout>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={() => isLogged ? <Redirect to="/"/> : <Login />} />
                <Route exact path="/register" component={() => isLogged ? <Redirect to="/"/> : <Register />} />
                <Route exact path="/player/:id" component={Player} />
                <Route component={NotFound} />
            </Switch>
        </Layout>
    </BrowserRouter>
);

export default App;
