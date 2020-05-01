import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import gravatar from '../utils/gravatar';
import { logoutRequest } from '../actions';
import classNames from 'classnames';
import '../assets/styles/components/Header.scss';
import logo from '../assets/static/logo-platzi-video.png';
import userIcon from '../assets/static/usuario-64.png';

const Header = props => {
    const { user, isLogin, isRegister } = props;
    const hasUser = Object.keys(user).length > 0;

    const headerStyle = classNames('header', {
        isLogin,
        isRegister
    });

    const handleLogout = () => {
        document.cookie = 'email=';
        document.cookie = 'name=';
        document.cookie = 'id=';
        document.cookie = 'token='
        props.logoutRequest({});
        window.location.href = '/';
    };

    return (
        <header className={headerStyle}>
            <Link to="/">
                <img className="header__img" src={logo} alt="PlatziVideo" />
            </Link>

            <div className="header__menu">
                <div className="header__menu--profile">
                    {hasUser ? 
                        <img src={gravatar(user.email)} alt={user.email} /> :
                        <img src={userIcon} alt="Profile Image" />
                    }
                    <p>Perfil</p>
                </div>
                <ul>

                    {hasUser ?
                        <li>
                            <Link to="/">{user.name}</Link>
                        </li> :
                        null
                    }

                    {hasUser ?
                        <li><a href="#logout" onClick={handleLogout}>Cerrar Sesión</a></li> :
                        <li>
                            <Link to="/login">Iniciar Sesión</Link>
                        </li>
                    }

                </ul>
            </div>
        </header>
    );
};

Header.propTypes = {
    user: PropTypes.object,
    logoutRequest: PropTypes.func
};

const mapStateToProps = state => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = {
    logoutRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
