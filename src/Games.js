import React, { useEffect } from 'react';
import './App.css';
import { loadGames } from "./redux/actions/gameActions";
import { connect } from "react-redux";
import Matchup from './Matchup'
import { Container, Card } from 'reactstrap';


function Games({ loadGames, games }) {
    useEffect(() => {
        loadGames();
    }, [loadGames]);


    return (
        <Container>
            {games?.map(
                (item, index) => {
                    return <Card key={index} style={{ margin: 20 }}><Matchup game={item} /></Card>

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
