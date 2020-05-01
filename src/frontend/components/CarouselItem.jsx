import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { setUserFavorite, deleteUserFavorite } from '../actions';
import '../assets/styles/components/CarouselItem.scss';
import playIcon from '../assets/static/play-icon.png';
import plusIcon from '../assets/static/plus-icon.png';
import removeIcon from '../assets/static/remove-icon.png';

const CarouselItem = props => {
    const { id, _id, cover, title, year, contentRating, source, duration, isList } = props;

    const handleSetFavorite = () => {
        props.setUserFavorite({
            id,
            _id,
            cover,
            title,
            year,
            contentRating,
            source,
            duration
        });
    };

    const handleDeleteFavorite = () => {
        props.deleteUserFavorite({
            id,
            _id,
            cover,
            title,
            year,
            contentRating,
            source,
            duration
        });
    };

    return (
        <div className="carousel-item">
            <img className="carousel-item__img" src={cover} alt={title} />
            <div className="carousel-item__details">
                <div>
                    <Link to={`/player/${_id}`}>
                        <img src={playIcon} alt="play" />
                    </Link>

                    {isList ?
                        <img
                            src={removeIcon}
                            alt="remove"
                            onClick={() => handleDeleteFavorite()}
                        /> :
                        <img
                            src={plusIcon}
                            alt="plus"
                            onClick={handleSetFavorite}
                        />
                    }

                </div>
                <p className="carousel-item__details--title">{title}</p>
                <p className="carousel-item__details--subtitle">{`${year} ${contentRating} ${duration}min`}</p>
            </div>
        </div>
    );
};

CarouselItem.propTypes = {
    cover: PropTypes.string,
    title: PropTypes.string,
    year: PropTypes.number,
    contentRating: PropTypes.string,
    duration: PropTypes.number
};

const mapDispatchToProps = {
    setUserFavorite,
    deleteUserFavorite
};

export default connect(null, mapDispatchToProps)(CarouselItem);
