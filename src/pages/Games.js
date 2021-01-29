import React, { useEffect } from 'react';
import '../App.css';
import { loadGames } from "../redux/actions/gameActions";
import { loadUpdatedWagers } from "../redux/actions/userActions"
import { connect } from "react-redux";
import { Card } from 'reactstrap';
import Matchup from './Matchup'
import {
    useParams
} from "react-router-dom";


function Games({ loadGames, games, loadUpdatedWagers }) {
    var { sport, week } = useParams();

    useEffect(() => {
        loadUpdatedWagers();

        loadGames(sport, week);

        const interval = setInterval(() => {
            loadGames(sport, week)
        }, 60000)

        return () => clearInterval(interval)

    }, []);

    return (
        <div className="App">
            {games ?
                games.map(
                    (item, index) => {
                        if (item.status.type.name !== 'STATUS_CANCELED'
                            && item.status.type.name !== 'STATUS_POSTPONED'
                        ) {
                            return <Card key={item.id} style={{ margin: 20 }}><Matchup sport={sport} game={item} /></Card>
                        }
                        else {
                            return []
                        }

                    }
                ) : []}
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
