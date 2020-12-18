import React, { useEffect, useState } from 'react';
import '../App.css';
import { loadGames } from "../redux/actions/gameActions";
import { placeWager } from "../redux/actions/userActions"
import { connect } from "react-redux";
import Matchup from './Matchup'
import { Card, Spinner } from 'reactstrap';
import {
    useParams
} from "react-router-dom";



function Games({ loadGames, placeWager, user, games }) {
    var { sport, week } = useParams();

    useEffect(() => {
        loadGames(sport, week).then(() => setDoneLoading(true));
    }, [loadGames, user]);

    const [doneLoading, setDoneLoading] = useState(false);


    return (
        doneLoading ?
            <div className="App">
                {games.map(
                    (item, index) => {
                        if (item.header.competitions[0].status.type.name !== 'STATUS_CANCELED'
                            && item.header.competitions[0].status.type.name !== 'STATUS_POSTPONED'
                        ) {
                            return <Card key={index} style={{ margin: 20 }}><Matchup done={false} game={item} wagers={mapGamesToWagers(item, user.user.wagers)} placeWager={(e) => placeWager(e)} /></Card>
                        }
                        else {
                            return <></>
                        }

                    }
                )}

            </div>
            : <div className="App">
                <Spinner style={{ marginTop: '30px' }} type="grow" color="dark" />
            </div>

    )
}


const mapDispatchToProps = {
    loadGames,
    placeWager
};

function mapGamesToWagers(game, wagers) {
    var newWagers = Object.assign({}, game);
    if (wagers) {
        newWagers = wagers.filter(e => e.game_id === game.header.id);
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
