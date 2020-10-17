import React, { useState, useEffect } from 'react';
import './App.css';
import { connect } from "react-redux";
import { Row, Col, Badge, CardTitle, Progress, Modal, ModalFooter, ModalHeader, Button } from 'reactstrap';



function Matchup({ ...props }) {
    useEffect(() => {
        if (props.game) {
            var w = localStorage.getItem(props.game.id);
            var v = determineOutcome(props.game, w);;

            console.log(v);

            if (w) {
                setWager({ placed: w ? true : false, isWin: v, teamBet: w })
            }
        }
        if (!props.myPicks) {
            setShowMatchup(true)
        } else if (w) {
            setShowMatchup(true)
        }
        else {
            setShowMatchup(false)
        }
    }, [props.game, props.myPicks])

    const [showMatchup, setShowMatchup] = useState(true);
    const [wager, setWager] = useState({ placed: false, isWin: false, teamBet: null });
    const [modal, setModal] = useState(false);
    const toggle = (item) => {
        setModal(!modal);
        if (item === null) {
            setWager({ placed: item ? false : false, isWin: false, teamBet: null });
            item !== null ? localStorage.setItem(props.game.id, item) : localStorage.removeItem(props.game.id)
        }
        else if (typeof (item) !== "string") {
            setWager({ placed: wager.placed, isWin: false, teamBet: wager.teamBet });
        }
        else {
            var winner = props.game.home_points !== null ? determineOutcome(props.game, item) : false;
            setWager({ placed: item ? true : false, isWin: winner, teamBet: item });
            item !== null ? localStorage.setItem(props.game.id, item) : localStorage.removeItem(props.game.id)
        }
    };

    return (
        props.game && showMatchup ?
            <div className={wager ? wager.placed ? 'glow' : '' : ''} onClick={() => setModal(!modal)}>
                <Modal isOpen={modal} toggle={toggle} >
                    <ModalHeader toggle={toggle}>Which team did you take?</ModalHeader>
                    <ModalFooter>
                        <Button style={props.game.logos[1][0] ? { backgroundColor: props.game.logos[1][0].color } : { backgroundColor: 'azure' }} onClick={() => toggle(props.game.away_team)}>{props.game.away_team}</Button>
                        <Button style={props.game.logos[0][0] ? { backgroundColor: props.game.logos[0][0].color } : { backgroundColor: 'azure' }} onClick={() => toggle(props.game.home_team)}>{props.game.home_team}</Button>{' '}
                        <Button onClick={() => toggle(null)}>Did not bet this</Button>
                    </ModalFooter>
                </Modal>

                <Row>
                    <Col xs="2">
                        <Badge color={props.game.home_points < props.game.away_points ? 'success' : 'danger'}>{props.game.away_points}</Badge>
                    </Col>

                    <Col xs="4" style={wager.teamBet === props.game.away_team && wager.isWin ? { border: 'solid' } : { border: 'none' }}>
                        <CardTitle style={wager.teamBet === props.game.away_team ? { textDecoration: 'underline' } : { textDecoration: 'none' }}>{props.game.away_team}</CardTitle>
                        <div>
                            {props.game.logos ? <><img alt={props.game.away_team} src={props.game?.logos[1][0]?.logos[0].replace('http', 'https')} /></> : []}
                        </div>
                    </Col>

                    <Col xs="4" style={wager.teamBet === props.game.home_team && wager.isWin ? { border: 'solid' } : { border: 'none' }}>

                        <CardTitle style={(wager.teamBet === props.game.home_team ? { textDecoration: 'underline' } : { textDecoration: 'none' })}>{props.game.home_team}</CardTitle>

                        <div>
                            {props.game.logos ? <><img alt={props.game.home_team} src={props.game?.logos[0][0]?.logos[0].replace('http', 'https')} /></> : []}
                        </div>
                    </Col>
                    <Col xs="2">
                        <Badge color={props.game.home_points > props.game.away_points ? 'success' : 'danger'}>{props.game.home_points}</Badge>
                    </Col>
                </Row>

                {/* {wager.placed && wager.isWin === true ? <div className='check' /> : ''}
                {wager.placed && !wager.isWin ? <div style={{ color: 'red' }}>X</div> : ''}
    {wager.placed && wager.isWin === 'PUSH' ? <div>PUSH</div> : ''} */}

                <Badge>{formatDate(props.game.start_date)}</Badge>
                <Badge>{props.game.lines}</Badge>
                {props.game.lines ?
                    <>
                        <div style={{ marginTop: '30px', border: 'solid', borderWidth: 'thin' }}>
                            <div className="text-center">Over/ Under</div>
                            <Progress bar value={((props.game.home_points + props.game.away_points) <= props.game.over_under ? props.game.home_points + props.game.away_points : props.game.over_under)} max={props.game.over_under} >{props.game.over_under}</Progress>
                        </div>
                        {/*<div style={{ marginTop: '30px', border: 'solid', borderWidth: 'thin' }}>
                            <div className="text-center">Spread</div>
                            <Progress bar value={getBarValue(props.game)} max={props.game.lines} >{getBarValue(props.game)}</Progress>
                </div> */}
                    </> : 'unavailable'}

            </div > : ''
    )
}

function getBarValue(game) {
    var gameClone = Object.assign({}, game);
    var favorite = gameClone.lines.split(' -')[0];
    var trueSpread;

    if (favorite === gameClone.home_team) {
        return gameClone.home_points - gameClone.away_points;
    }
    else {
        return gameClone.away_points - gameClone.home_points
    }
}
function determineOutcome(game, teamBet) {
    if (game.home_points === null && game.away_points === null) {
        return false;
    }
    var favorite = game.lines.split(' -');
    var alteredGame = Object.assign({}, game);
    if (favorite[0] === alteredGame.home_team) {
        alteredGame.home_points -= favorite[1]
    } else {
        alteredGame.away_points -= favorite[1]
    }

    var winner;
    if (alteredGame.start_date > Date.now()) {
        return false;
    }
    else if (alteredGame.home_points === alteredGame.away_points) {
        winner = 'PUSH';
        return winner;
    } else if (alteredGame.home_points > alteredGame.away_points) {
        console.log(alteredGame)
        winner = alteredGame.home_team;
    } else {
        winner = alteredGame.away_team;
    }

    console.log(teamBet, winner)
    return teamBet === winner;

}

function formatDate(unix_timestamp) {
    var date = new Date(unix_timestamp);
    var formattedDate = date.toLocaleDateString();
    var formattedTime = date.toLocaleTimeString();

    return formattedDate + ' ' + formattedTime;
}

export default connect(null, null)(Matchup);


