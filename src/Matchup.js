import React, { useEffect, useState } from 'react';
import './App.css';
import { connect } from "react-redux";
import { Button } from 'reactstrap';
import { Row, Col, Alert, Badge, Input } from 'reactstrap';

function Matchup({ ...props }) {
    const [formattedDate] = useState(formatDate(props.game.commence_time));
    const [averageLine] = useState(getAverageLine(props.game.sites));
    const [editable, setIsEditable] = useState();

    return (
        <div>
            {props.game.teams[0] === props.game.home_team ?
                <Row><Col>{props.game.teams[1]}<Badge color='danger'>{averageLine[0]}</Badge><Input disabled={editable} onDoubleClick={() => setIsEditable(!editable)} onSubmit={() => alert()} style={{ width: 50, display: 'inline-block' }} /></Col> at <Col>{props.game.teams[0]}<Badge>{averageLine[0]}</Badge><Input disabled={editable} onDoubleClick={() => setIsEditable(!editable)} onKeyDown={() => alert('hi')} style={{ width: 50, display: 'inline-block' }} /></Col></Row> :
                <Row><Col>{props.game.teams[0]}<Badge color='danger'>{averageLine[0]}</Badge><Input disabled={editable} onDoubleClick={() => setIsEditable(!editable)} onSubmit={() => alert()} style={{ width: 50, display: 'inline-block' }} /></Col> at <Col>{props.game.teams[1]}<Badge>{averageLine[1]}</Badge><Input disabled={editable} onDoubleClick={() => setIsEditable(!editable)} onSubmit={() => alert()} style={{ width: 50, display: 'inline-block' }} /></Col></Row>
            }
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
