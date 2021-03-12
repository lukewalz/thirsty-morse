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
import { Pagination } from '@material-ui/lab';
import moment from 'moment';

function Games({ loadGames, games, loadUpdatedWagers }) {
    const [day, setDay] = useState(moment());

    var { sport } = useParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGames(sport, day).then(() => setLoading(false));

        const interval = setInterval(() => {
            loadGames(sport, day)
        }, 10000)

        return () => clearInterval(interval)

    }, [sport, day]);

    const handleChange = (event, value) => {
        var newDay = moment().add(value - 1, 'days').format('YYYYMMDD');
        setDay(newDay)
    };

    return (

        <div className="App">
            <Pagination
                count={3}
                onChange={(e, i) => handleChange(e, i)}
            />
            {!loading ?
                games.slice().sort((a, b) => a.date > b.date ? 1 : -1)
                    .map(
                        (item) => {
                            if (item.status.type.name !== 'STATUS_CANCELED'
                                && item.status.type.name !== 'STATUS_POSTPONED'
                                && item.status.type.name !== 'STATUS_FINAL'
                            ) {
                                return <Paper elevation={10} key={item.id}><Matchup sport={sport} game={item} /></Paper>
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
