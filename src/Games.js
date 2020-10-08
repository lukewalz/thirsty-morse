import React, { useEffect, useState } from 'react';
import './App.css';
import { loadGames, loadGameDetails } from "./redux/actions/gameActions";
import { connect } from "react-redux";
import Matchup from './Matchup'
import { Container, Card } from 'reactstrap';



function Games({ loadGames, games }) {
    useEffect(() => {
        loadGames();
    }, [loadGames]);

    return (
        <Container>
            {games?.map((e, i) => {
                return <Card key={i} style={{ margin: 20 }} body outline color="info"><Matchup game={e} /></Card>
            })}
        </Container>

    )
}


const mapDispatchToProps = {
    loadGames,
    loadGameDetails
};

function mapStateToProps(state) {
    return {
        games: state.games,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Games);
