import React, { useState } from 'react';
import './App.css';
import { connect } from "react-redux";
import { Row, Col, Badge } from 'reactstrap';

function Matchup({ ...props }) {
    const [formattedDate] = useState(formatDate(props.game.commence_time));
    const [averageLine] = useState(getAverageLine(props.game.sites));
    const [showDate, changeShowDate] = useState(false);


    return (
        <div onDoubleClick={() => changeShowDate(!showDate)}>
            {showDate ? <div>{formattedDate}</div> : ''}


            {props.game.teams[0] === props.game.home_team ?
                <Row>
                    <Col>
                        {props.game.teams[1]}
                        <Badge color='danger'>{averageLine[1]}</Badge>
                        {props.game.sites[0].odds.spreads.adjusted_points ? <Badge color='warning'>{props.game.sites[0].odds.spreads.adjusted_points[1]}</Badge> : ''}
                    </Col> at
                    <Col>{props.game.teams[0]}
                        <Badge color='danger'>{averageLine[0]}</Badge>
                        {props.game.sites[0].odds.spreads.adjusted_points ? <Badge color='warning'>{props.game.sites[0].odds.spreads.adjusted_points[0]}</Badge> : ''}
                    </Col>
                </Row> :
                <Row>
                    <Col>
                        {props.game.teams[0]}
                        <Badge color='danger'>{averageLine[0]}</Badge>
                        {props.game.sites[0].odds.spreads.adjusted_points ? <Badge color='warning'>{props.game.sites[0].odds.spreads.adjusted_points[0]}</Badge> : ''}
                    </Col> at
                    <Col>{props.game.teams[1]}
                        <Badge color='danger'>{averageLine[1]}</Badge>
                        {props.game.sites[0].odds.spreads.adjusted_points ? <Badge color='warning'>{props.game.sites[0].odds.spreads.adjusted_points[1]}</Badge> : ''}
                    </Col>
                </Row>
            }
            <div>{props.game.adjusted_line}</div>
        </div>
    )
}

function formatDate(unix_timestamp) {
    var date = new Date(unix_timestamp * 1000);

    var formattedDate = date.toLocaleDateString();
    var formattedTime = date.toLocaleTimeString();

    return formattedDate + ' ' + formattedTime;
}

function getAverageLine(sites) {
    sites = Array.from(sites);
    var spreads = sites[0].odds.spreads;
    return spreads.points;
}

export default connect(null, null)(Matchup);
