import React, { useEffect, useState } from 'react';
import '../App.css';
import { loadGames } from "../redux/actions/gameActions";
import { loadUpdatedWagers } from "../redux/actions/userActions"
import { connect } from "react-redux";
import { Paper } from '@material-ui/core/'
import Matchup from './Matchup'
import {
    useParams
} from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';



function Games({ loadGames, games, loadUpdatedWagers }) {
    var { sport, week } = useParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGames(sport, week).then(() => setLoading(false));

        const interval = setInterval(() => {
            loadGames(sport, week)
        }, 10000)

        return () => clearInterval(interval)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sport, week]);

    return (
        <div className="App">
            {!loading ?
                games.slice().sort((a, b) => a.date > b.date ? 1 : -1)
                    .map(
                        (item) => {
                            if (item.status.type.name !== 'STATUS_CANCELED'
                                && item.status.type.name !== 'STATUS_POSTPONED'
                            ) {
                                return <Paper elevation={10} key={item.id} style={{ margin: 20, padding: 20 }}><Matchup sport={sport} game={item} /></Paper>
                            }
                            else {
                                return []
                            }

                        }
                    ) : <div style={{ marginTop: 70 }}><CircularProgress size={80} /></div>}
        </div>
    )
}


const mapDispatchToProps = {
    loadGames,
    loadUpdatedWagers
};

function mapStateToProps(state) {
    return {
        games: state.games,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Games);
