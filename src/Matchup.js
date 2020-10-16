import React, { useEffect } from 'react';
import './App.css';
import { connect } from "react-redux";
import { Row, Col, Badge, CardTitle } from 'reactstrap';




function Matchup({ ...props }) {
    return (
        console.log(props),
        props.game ?
            <div>
                <Row>
                    <Col>
                        <CardTitle>{props.game.away_team}</CardTitle>
                        <div>
                            {props.game.logos ? <><img alt={props.game.away_team} src={props.game?.logos[1][0]?.logos[0]} /><Badge color={props.game.home_points < props.game.away_points ? 'success' : 'danger'}>{props.game.away_points}</Badge></> : []}
                        </div>
                    </Col>

                    <Col>
                        <CardTitle>{props.game.home_team}</CardTitle>

                        <div>
                            {props.game.logos ? <><img alt={props.game.home_team} src={props.game?.logos[0][0]?.logos[0]} /><Badge color={props.game.home_points > props.game.away_points ? 'success' : 'danger'}>{props.game.home_points}</Badge></> : []}
                        </div>
                    </Col>
                </Row>
                <Badge>{props.game.lines ? props.game.lines : 'unavailable'}</Badge>
                <Badge>{formatDate(props.game.start_date)}</Badge>
                <Badge>{props.game.lines}</Badge>
                <Badge color='info'>{props.game.over_under}</Badge>
            </div > : []
    )
}

function formatDate(unix_timestamp) {
    var date = new Date(unix_timestamp);
    var formattedDate = date.toLocaleDateString();
    var formattedTime = date.toLocaleTimeString();

    return formattedDate + ' ' + formattedTime;
}

export default connect(null, null)(Matchup);


