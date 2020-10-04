import React, { useEffect, useRef } from 'react';
import './App.css';
import { changeGame, loadGames } from "./redux/actions/gameActions";
import { connect } from "react-redux";
import Matchup from './Matchup'
import { Container } from 'reactstrap';


function Games({ loadGames, games, changeGame }) {
    useEffect(() => {
        loadGames();
    }, [loadGames]);

    const ref = useRef(null);


    var gameList = null;
    if (games) {
        gameList = Array.from(games);
    }

    function handleChange(game, value) {
        changeGame(game, value);
    }


    return (
        <Container>
            {gameList?.map((e, i) => <Matchup key={i} game={e} onChange={handleChange} />)}
        </Container>

    )
}


const mapDispatchToProps = {
    loadGames,
    changeGame
};

function mapStateToProps(state) {
    return {
        games: state.gamesReducer
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Games);
