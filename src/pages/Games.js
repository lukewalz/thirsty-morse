import React, { useEffect, useState } from 'react';
import '../App.css';
import { loadGames } from "../redux/actions/gameActions";
import { placeWager, loadUpdatedWagers } from "../redux/actions/userActions"
import { connect } from "react-redux";
import Matchup from './Matchup'
import { Card, Spinner } from 'reactstrap';
import {
    useParams
} from "react-router-dom";



function Games({ loadGames, placeWager, loadUpdatedWagers, user, games }) {
    var { sport, week } = useParams();

    useEffect(() => {
        loadGames(sport, week).then(() => { loadUpdatedWagers(); setDoneLoading(true) });

        const interval = setInterval(() => {
            loadGames(sport, week)
        }, 10000)

        return () => clearInterval(interval)

    }, [loadGames, sport, week]);

    const [doneLoading, setDoneLoading] = useState(false);


    return (
        doneLoading ?
            <div className="App">
                {games ? games.sort((a, b) => a.date > b.date ? 1 : -1)
                    .map(
                        (item, index) => {
                            if (item.status.type.name !== 'STATUS_CANCELED'
                                && item.status.type.name !== 'STATUS_POSTPONED'
                            ) {
                                return <Card key={index} style={{ margin: 20 }}><Matchup done={false} sport={sport} game={item} wagers={mapGamesToWagers(item, user.user.wagers)} placeWager={(e) => placeWager(e)} /></Card>
                            }
                            else {
                                return []
                            }

                        }
                    ) : []}
            </div>
            : <div className="App">
                <Spinner style={{ marginTop: '30px' }} type="grow" color="dark" />
            </div>

    )
}


const mapDispatchToProps = {
    loadGames,
    placeWager,
    loadUpdatedWagers
};

function mapGamesToWagers(game, wagers) {
    var newWagers = Object.assign({}, game);
    if (wagers) {
        newWagers = wagers.filter(e => e.game_id === game.id);
        return newWagers;
    }
    else {
        return wagers;
    }
}

function mapStateToProps(state) {
    return {

        games: state.games,
        user: state.user
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Games);
