import React, { useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getVideoSource } from '../actions'
import '../assets/styles/components/Player.scss'

const Player = props => {
    const { id } = props.match.params;

    useLayoutEffect(() => {
        props.getVideoSource(id);
    }, [])

    const [ movieMatched ] = props.moviesList.filter(movie => movie._id === id);
    const hasPlaying = movieMatched ? id === movieMatched._id : false

    return hasPlaying ? (
        <div className="Player">
            <video controls autoPlay>
                <source src={movieMatched.source} type="video/mp4" />
            </video>
            <div className="Player-back">
                <button type="button" onClick={() => props.history.goBack()} >
                    Regresar
                </button>
            </div>
        </div>
    ) : <Redirect to="/404/" />;
};

const mapStateToProps = state => {
    return {
        moviesList: [...state.mylist, ...state.trends, ...state.originals],
    }
}

const mapDispatchToProps = {
    getVideoSource
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);