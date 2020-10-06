import React, { useEffect } from 'react';
import './App.css';
import { changeGame, loadGames } from "./redux/actions/gameActions";
import { connect } from "react-redux";
import Matchup from './Matchup'
import { Container } from 'reactstrap';


function Games({ loadGames, games, changeGame }) {
    useEffect(() => {
        loadGames();
    }, [loadGames]);


    var gameList = null;
    if (games) {
        gameList = Array.from(games);
    }

    function handleChange(game, value) {
        changeGame(game, value);
    }


    return (
        <Container>
            {gameList?.sort((a, b) => (Math.abs(a.sites[0].odds.spreads.adjusted_points[0] - a.sites[0].odds.spreads?.points[0])) < (Math.abs(b.sites[0].odds.spreads.adjusted_points[0] - b.sites[0].odds.spreads.points[0])) ? 1 : -1).map((e, i) => <Matchup key={i} game={e} onChange={handleChange} />)}
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
