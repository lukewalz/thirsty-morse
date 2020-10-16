import React, { useEffect, useState } from 'react';
import './App.css';
import { loadGames } from "./redux/actions/gameActions";
import { connect } from "react-redux";
import Matchup from './Matchup'
import { Container, Card, Button } from 'reactstrap';


function Games({ loadGames, games }) {
    useEffect(() => {
        loadGames();
    }, [loadGames]);

    const [myPicks, setMyPicks] = useState(false);


    return (
        <Container>
            <Button onClick={() => setMyPicks(!myPicks)}>{myPicks ? 'Show All Matchups' : 'Show Only My Picks'}</Button>
            {games?.map(
                (item, index) => {
                    return <Card key={index} style={{ margin: 20 }}><Matchup game={item} myPicks={myPicks} /></Card>

                }
            )}
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
