import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../actions';
import Header from '../components/Header';
import '../assets/styles/components/Login.scss';

const Register = props => {
    const [form, setValues] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleInput = event => {
        setValues({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = event => {
        event.preventDefault();
        props.registerUser(form, '/');
        // props.history.push('/');
    };

    return (
        <>
            <Header isRegister />
            <section className="login">
                <section className="login__container">
                    <h2>Regístrate</h2>
                    <form
                        className="login__container--form"
                        onSubmit={handleSubmit}
                    >
                        <input
                            name="name"
                            className="inputLoginForm"
                            type="text"
                            placeholder="Nombre"
                            onChange={handleInput}
                        />
                        <input
                            name="email"
                            className="inputLoginForm"
                            type="email"
                            placeholder="Correo"
                            onChange={handleInput}
                        />
                        <input
                            name="password"
                            className="inputLoginForm"
                            type="password"
                            placeholder="Contraseña"
                            onChange={handleInput}
                        />
                        <button className="button">Regístrame</button>
                    </form>
                    <p className="login__container--login">
                        <Link to="/login">Iniciar sesión</Link>
                    </p>
                </section>
            </section>
        </>
    );
};

const mapDispatchToProps = {
    registerUser
};

export default connect(null, mapDispatchToProps)(Register);
