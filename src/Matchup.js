import React, { useState, useEffect } from 'react';
import './App.css';
import { connect } from "react-redux";
import { Row, Col, Badge, CardTitle, Progress, Modal, ModalFooter, ModalHeader, Button } from 'reactstrap';



function Matchup({ ...props }) {

    const [adjustedScore] = useState(props.game.competitions[0] ? getAdjustedScore(props.game.competitions[0]) : []);

    return (
        props.game.competitions[0] ?
            <>
                <Row>
                    <Col xs="5">{props.game.status.type.name === 'STATUS_SCHEDULED' ? new Date(props.game.date).toLocaleString() : props.game.status.type.description}</Col>
                    <Col xs="5">{}</Col>
                </Row>
                <Row>
                    <Col>
                        <div className='teamSection'>
                            <div>

                                <img src={props.game.competitions[0].competitors[0].team.logo} />
                                <Badge>{props.game.status.type.name === "STATUS_SCHEDULED" ? '' : props.game.competitions[0].competitors[0].score}</Badge>
                                <div className='teamTitle'>{props.game.competitions[0].competitors[0].team.displayName}</div>
                            </div>
                            {props.game.competitions[0].odds && adjustedScore.firstAdjScore > props.game.competitions[0].competitors[1].score ?
                                <div xs='7'><Progress bar value={adjustedScore.firstAdjScore} max={adjustedScore.firstAdjScore >= props.game.competitions[0].odds[0].details.split(' -')[1] ? adjustedScore.firstAdjScore : props.game.competitions[0].odds[0].details.split(' -')[1]} >{props.game.competitions[0].odds[0].details}</Progress></div>
                                : []}
                        </div>
                        <div className='teamSection'>
                            <div>
                                <img src={props.game.competitions[0].competitors[1].team.logo} />
                                <Badge>{props.game.status.type.name === "STATUS_SCHEDULED" ? '' : props.game.competitions[0].competitors[1].score}</Badge>
                                <div className='teamTitle'>{props.game.competitions[0].competitors[1].team.displayName}</div>
                            </div>

                            {props.game.competitions[0].odds && adjustedScore.secondAdjScore > props.game.competitions[0].competitors[0].score ?
                                <div xs='7'><Progress bar value={adjustedScore.secondAdjScore} max={adjustedScore.secondAdjScore >= props.game.competitions[0].odds[0].details.split(' -')[1] ? adjustedScore.secondAdjScore : props.game.competitions[0].odds[0].details.split(' -')[1]}>{props.game.competitions[0].odds[0].details}</Progress></div>
                                : []}
                        </div>
                    </Col>
                </Row>
                <Row>
                    {props.game.competitions[0].odds ?
                        <>
                            <Progress bar value={props.game.competitions[0].competitors[0].score + props.game.competitions[0].competitors[1].score} max={props.game.competitions[0].odds[0].overUnder < (props.game.competitions[0].competitors[0].score + props.game.competitions[0].competitors[1].score) ? (props.game.competitions[0].competitors[0].score + props.game.competitions[0].competitors[1].score) : props.game.competitions[0].odds[0].overUnder} >{(props.game.competitions[0].competitors[0].score + props.game.competitions[0].competitors[1].score)}</Progress>
                            <div style={{ textAlign: 'center' }}>{props.game.competitions[0].odds[0].overUnder}</div>
                        </>

                        : []}
                </Row>

            </>
            : [])
}

function getAdjustedScore(competition) {

    var firstScore = competition.competitors[0].score;
    var secondScore = competition.competitors[1].score;

    if (competition.odds) {
        var firstAdjScore = competition.odds[0].details.split(' -')[0] === competition.competitors[0].team.abbreviation ? -(parseFloat(competition.odds[0].details.split(' -')[1] + firstScore)) : Math.abs((firstScore - competition.odds[0].details.split(' -')[1]));
        var secondAdjScore = competition.odds[0].details.split(' -')[0] === competition.competitors[1].team.abbreviation ? -(parseFloat(competition.odds[0].details.split(' -')[1] + secondScore)) : Math.abs((secondScore - competition.odds[0].details.split(' -')[1]));

        return { firstAdjScore, secondAdjScore };
    }
    else {
        return { firstScore, secondScore }
    }


}


export default connect(null, null)(Matchup);


