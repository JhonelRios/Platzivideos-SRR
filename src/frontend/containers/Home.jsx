import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import Search from '../components/Search';
import Categories from '../components/Categories';
import Carousel from '../components/Carousel';
import CarouselItem from '../components/CarouselItem';
import useInitialState from '../hooks/useInitialState';

import '../assets/styles/App.scss';

const Home = ({ search, mylist, trends, originals }) => {
    return (
        <>
            <Header />
            <Search isHome />

            {search.length > 0 && (
                <Categories title="Resultados">
                    <Carousel>
                        {search.map(item => (
                            <CarouselItem key={item.id} {...item} />
                        ))}
                    </Carousel>
                </Categories>
            )}

            {mylist.length > 0 && (
                <Categories title="Mi lista">
                    <Carousel>
                        {mylist.map(item => (
                            <CarouselItem key={item.id} {...item} isList />
                        ))}
                    </Carousel>
                </Categories>
            )}

            <Categories title="Tendencias">
                <Carousel>
                    {trends.map(item => (
                        <CarouselItem key={item.id} {...item} />
                    ))}
                </Carousel>
            </Categories>

            <Categories title="Originales de PlatziVideo">
                <Carousel>
                    {originals.map(item => (
                        <CarouselItem key={item.id} {...item} />
                    ))}
                </Carousel>
            </Categories>
        </>
    );
};

const mapStateToProps = state => {
    return {
        search: state.search,
        mylist: state.mylist,
        trends: state.trends,
        originals: state.originals
    };
};

export default connect(mapStateToProps, null)(Home);
