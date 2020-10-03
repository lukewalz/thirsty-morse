import React, { useEffect, useState } from 'react';
import './App.css';
import { loadGames } from "./redux/actions/gameActions";
import { connect } from "react-redux";
import Matchup from './Matchup'
import { Container, Row, Col } from 'reactstrap';


function Games({ loadGames, games }) {
    useEffect(() => {
        loadGames();
    }, [loadGames]);

    var gameList = null;
    if (games) {
        gameList = Array.from(games);
    }


    return (
        <Container>
            {gameList?.map((e, i) => <Matchup key={i} game={e} />)}
        </Container>

    )
}


const mapDispatchToProps = {
    loadGames
};

function mapStateToProps(state) {
    return {
        games: state.gamesReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Games);
