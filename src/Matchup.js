import React, { useEffect } from 'react';
import './App.css';
import { connect } from "react-redux";
import { Row, Col, Badge, CardTitle } from 'reactstrap';
import { loadGameDetails } from "./redux/actions/gameActions";
import LazyLoad from 'react-lazyload';




function Matchup({ loadGameDetails, ...props }) {

    useEffect(() => {
        loadGameDetails(props.game)
    }, [props.game]);

    return (
        <div>
            <Row>
                <Col>
                    <CardTitle>{props.game.away_team}</CardTitle>
                    <div>
                        {props.game.team_data ? <LazyLoad once={true} height={200}><img alt={props.game.away_team} src={props.game.team_data[1][0]?.logos[0]} /></LazyLoad> : []}
                    </div>
                </Col>

                <Col>
                    <CardTitle>{props.game.home_team}</CardTitle>

                    <div>
                        {props.game.team_data ? <LazyLoad once={true} height={200}><img alt={props.game.home_team} src={props.game.team_data[0][0]?.logos[0]} /></LazyLoad> : []}
                    </div>
                </Col>
            </Row>
            <Badge color='danger'>{props.game.lines ? props.game.lines : 'unavailable'}</Badge>
            <Badge>{formatDate(props.game.start_date)}</Badge>
        </div >
    )
}

function formatDate(unix_timestamp) {
    var date = new Date(unix_timestamp);
    var formattedDate = date.toLocaleDateString();
    var formattedTime = date.toLocaleTimeString();

    return formattedDate + ' ' + formattedTime;
}

const mapDispatchToProps = {
    loadGameDetails
};


export default connect(null, mapDispatchToProps)(Matchup);


