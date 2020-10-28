import React, { useEffect, useState } from 'react';
import './App.css';
import { loadGames } from "./redux/actions/gameActions";
import { connect } from "react-redux";
import Matchup from './Matchup'
import { Container, Card, Button, Spinner } from 'reactstrap';
import {
    useParams
} from "react-router-dom";


function Games({ loadGames, games }) {
    var { sport, week } = useParams();

    useEffect(() => {
        loadGames(sport, week).then(() => setDoneLoading(true));
    }, [loadGames]);

    const [doneLoading, setDoneLoading] = useState(false);
    const [myPicks, setMyPicks] = useState(false);


    return (
        doneLoading ?
            <Container>
                <Button onClick={() => setMyPicks(!myPicks)}>{myPicks ? 'Show All Matchups' : 'Show Only My Picks'}</Button>
                {games?.map(
                    (item, index) => {
                        return <Card key={index} style={{ margin: 20 }}><Matchup game={item} myPicks={myPicks} /></Card>

                    }
                )}
            </Container>
            : <Container>      <Spinner type="grow" color="dark" />
            </Container>

    )
}


const mapDispatchToProps = {
    loadGames
};

function mapStateToProps(state) {
    return {
        games: state.games,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Games);
