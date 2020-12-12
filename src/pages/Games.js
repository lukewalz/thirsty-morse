import React, { useEffect, useState } from 'react';
import '../App.css';
import { loadGames } from "../redux/actions/gameActions";
import { placeWager } from "../redux/actions/userActions"
import { connect } from "react-redux";
import Matchup from './Matchup'
import { Container, Card, Button, Spinner } from 'reactstrap';
import {
    useParams
} from "react-router-dom";



function Games({ loadGames, placeWager, user, games }) {
    var { sport, week } = useParams();

    useEffect(() => {
        loadGames(sport, week).then(() => setDoneLoading(true));
    }, [games, placeWager]);

    const [doneLoading, setDoneLoading] = useState(false);


    return (
        doneLoading ?
            <div className="App">
                {games?.map(
                    (item, index) => {
                        return <Card key={index} style={{ margin: 20 }}><Matchup done={false} game={mapGamesToWagers(item, user.user.wagers)} wagers={user.wagers} placeWager={(e) => { placeWager(e); doneLoading(true) }} /></Card>

                    }
                )}
            </div>
            : <div className="App">
                <Spinner type="grow" color="dark" />
            </div>

    )
}


const mapDispatchToProps = {
    loadGames,
    placeWager
};

function mapGamesToWagers(game, wagers) {

    var newGame = Object.assign({}, game);
    if (wagers) {
        newGame.placedWagers = wagers.filter(e => e.game_id === game.header.id);
        return newGame;
    }
    else {
        return game;
    }
}

function mapStateToProps(state) {
    return {

        games: state.games,
        user: state.user
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Games);
