import React, { useState } from 'react';
import './App.css';
import { connect } from "react-redux";
import { Row, Col, Badge, Input, CardTitle, CardBody } from 'reactstrap';
import { loadGameDetails } from "./redux/actions/gameActions";



function Matchup({ loadGameDetails, ...props }) {

    const [showSpread, changeShowSpread] = useState(false);
    const [showLogo, changeShowLogo] = useState(false)
    function handleClick(e) {
        loadGameDetails(e).then(() => { changeShowSpread(!showSpread); changeShowLogo(true) });
        console.log(props.game.logo)
    }

    return (
        <div>
            <Row onDoubleClick={() => handleClick(props.game)}>
                <Col style={{ color: props.game.logo ? props.game.logo[1][0].color : '', borderRadius: 9, backgroundColor: props.game.logo ? props.game.logo[1][0].alt_color : '' }}>
                    <CardTitle>{props.game.away_team}</CardTitle>
                    {showLogo ? <img src={props.game.logo ? props.game.logo[1][0].logos[0] : ''} /> : ''}
                </Col>
                <Col>
                    at
                </Col>
                <Col style={{ color: props.game.logo ? props.game.logo[1][0].color : '', borderRadius: 9, backgroundColor: props.game.logo ? props.game.logo[0][0].alt_color : '' }}>
                    <CardTitle>{props.game.home_team}</CardTitle>

                    {showLogo ? <img src={props.game.logo[0][0]?.logos[0]} /> : ''}
                </Col>
            </Row>
            <Badge>{showSpread ? props.game.lines : ''}</Badge>
            <Badge>{formatDate(props.game.start_date)}</Badge>
        </div>
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


