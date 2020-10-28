import React, { useState } from 'react';
import './App.css';
import { connect } from "react-redux";
import { Row, Col, Badge, Progress } from 'reactstrap';



function Matchup({ ...props }) {

    const [firstTeamLineIsFav] = useState(props.game.pickcenter[0].awayTeamOdds.favorite ? { line: parseFloat(props.game.pickcenter[0].details?.split(' -')[1]), isFav: false } : { line: -parseFloat(props.game.pickcenter[0].details?.split(' -')[1]), isFav: true });
    const [secondTeamLineIsFav] = useState(props.game.pickcenter[0].homeTeamOdds.favorite ? { line: parseFloat(props.game.pickcenter[0].details?.split(' -')[1]), isFav: false } : { line: -parseFloat(props.game.pickcenter[0].details?.split(' -')[1]), isFav: true });
    const [firstTeamScore] = useState(parseInt(props.game.header.competitions[0].competitors[0].score));
    const [secondTeamScore] = useState(parseInt(props.game.header.competitions[0].competitors[1].score));
    const [actualOvers] = useState(parseInt(props.game.header.competitions[0].competitors[0].score) + parseInt(props.game.header.competitions[0].competitors[1].score));
    return (
        props.game ?
            <>
                <Row>
                    <Col xs="5">{props.game.header.competitions[0].status.type.name === 'STATUS_SCHEDULED' ? new Date(props.game.header.competitions[0].date).toLocaleString() : props.game.header.competitions[0].status.type.description}</Col>
                    <Col xs="5">{}</Col>
                </Row>
                <Row>
                    <Col>
                        <div className='teamSection'>
                            <div>

                                <img alt={props.game.header.competitions[0].competitors[0].team.displayName} src={props.game.header.competitions[0].competitors[0].team.logos[0].href} />
                                <Badge>{props.game.header.competitions[0].status.type.name === "STATUS_SCHEDULED" ? '' : props.game.header.competitions[0].competitors[0].score}</Badge>
                                <div className='teamTitle'>{props.game.header.competitions[0].competitors[0].team.displayName}</div>
                            </div>
                            {firstTeamLineIsFav.line}
                            <div xs='7'><Progress bar value={firstTeamLineIsFav.isFav ? ((firstTeamScore - secondTeamScore) < 0 ? 0 : (firstTeamScore - secondTeamScore)) : ((firstTeamScore - secondTeamScore) < 0 ? 0 : (firstTeamScore - secondTeamScore))} max={Math.abs(firstTeamLineIsFav.line)}>{firstTeamScore}</Progress></div>
                        </div>
                        <div className='teamSection'>
                            <div>
                                <img alt={props.game.header.competitions[0].competitors[1].team.displayName} src={props.game.header.competitions[0].competitors[1].team.logos[0].href} />
                                <Badge>{props.game.header.competitions[0].status.type.name === "STATUS_SCHEDULED" ? '' : props.game.header.competitions[0].competitors[1].score}</Badge>
                                <div className='teamTitle'>{props.game.header.competitions[0].competitors[1].team.displayName}</div>
                            </div>
                            {secondTeamLineIsFav.line}
                            <div xs='7'><Progress bar value={secondTeamLineIsFav.isFav ? ((secondTeamScore - firstTeamScore) < 0 ? 0 : (secondTeamScore - firstTeamScore)) : ((secondTeamScore - firstTeamScore) < 0 ? 0 : (secondTeamScore - firstTeamScore))} max={Math.abs(secondTeamLineIsFav.line)}>{secondTeamScore}</Progress></div>
                        </div>
                    </Col>
                </Row>
                <Row>

                    <>
                        <Progress bar
                            value={actualOvers}
                            max={props.game.pickcenter[0].overUnder}
                            color={determineOverUnderStatus(props.game, actualOvers)}>
                            {actualOvers}/{props.game.pickcenter[0].overUnder}
                        </Progress>
                    </>
                </Row>

            </>
            : [])
}

function determineOverUnderStatus(competition, actualOvers) {
    if (competition.header.competitions[0].status.type.name === 'STATUS_FINAL') {
        if (actualOvers <= competition.pickcenter[0].overUnder) {
            return 'danger';
        } else {
            return 'success';
        }
    } else {
        if (actualOvers <= competition.pickcenter[0].overUnder) {
            return 'warning';
        } else {
            return 'success';
        }
    }
}

function getAdjustedScore(competition) {

    var firstScore = competition.header.competitions[0].competitors[0].score;
    var secondScore = competition.header.competitions[0].competitors[1].score;

    if (competition.pickcenter[0]) {
        var firstAdjScore = competition.pickcenter[0].awayTeamOdds.favorite ? competition.pickcenter[0].details.split(' -')[1] + firstScore : competition.pickcenter[0].details.split(' -')[1] - firstScore;
        var secondAdjScore = competition.pickcenter[0].homeTeamOdds.favorite ? competition.pickcenter[0].details.split(' -')[1] + secondScore : competition.pickcenter[0].details.split(' -')[1] - secondScore;
        return { firstAdjScore, secondAdjScore };
    }
    else {
        return { firstScore, secondScore }
    }


}


export default connect(null, null)(Matchup);


