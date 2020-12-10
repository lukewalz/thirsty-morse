import React, { useState } from 'react';
import '../App.css';
import { connect } from "react-redux";
import { Row, Col, Badge, Progress } from 'reactstrap';
import { WagerModal } from '../components/WagerModal'


function Matchup({ ...props }) {

    const [firstTeamLineIsFav] = useState(props.game.pickcenter[0] ?
        props.game.pickcenter[0].awayTeamOdds.favorite
            ? { line: parseFloat(props.game.pickcenter[0].details?.split(' -')[1]), isFav: false }
            : props.game.pickcenter[0].details ? { line: -parseFloat(props.game.pickcenter[0].details.split(' -')[1]), isFav: true } : { undefined }
        : { undefined });
    const [secondTeamLineIsFav] = useState(props.game.pickcenter[0] ?
        props.game.pickcenter[0].homeTeamOdds.favorite
            ? { line: parseFloat(props.game.pickcenter[0].details?.split(' -')[1]), isFav: false }
            : props.game.pickcenter[0] ? { line: -parseFloat(props.game.pickcenter[0].details.split(' -')[1]), isFav: true } : { undefined }
        : { undefined });
    const [firstTeamScore] = useState(parseInt(props.game.header.competitions[0].competitors[0].score));
    const [secondTeamScore] = useState(parseInt(props.game.header.competitions[0].competitors[1].score));
    const [actualOvers] = useState(parseInt(props.game.header.competitions[0].competitors[0].score) + parseInt(props.game.header.competitions[0].competitors[1].score));
    const [openModal, setOpenModal] = useState(false);



    return (
        props.game ?
            <>
                <WagerModal open={openModal} body={props.game.header.competitions[0].competitors[0].team.displayName} handleClose={() => setOpenModal(false)} />
                <Row>
                    <Col xs="5">{props.game.header.competitions[0].status.type.name === 'STATUS_SCHEDULED' ? new Date(props.game.header.competitions[0].date).toLocaleString() : props.game.header.competitions[0].status.type.description}</Col>
                    <Col xs="5">{ }</Col>
                </Row>
                <Row onClick={() => setOpenModal(true)}>
                    <Col>
                        <div className='teamSection'>
                            <div>

                                <img alt={props.game.header.competitions[0].competitors[0].team.displayName} src={props.game.header.competitions[0].competitors[0].team.logos[0].href} />
                                <Badge>{props.game.header.competitions[0].status.type.name === "STATUS_SCHEDULED" ? '' : props.game.header.competitions[0].competitors[0].score}</Badge>
                                <div className='teamTitle'>{props.game.header.competitions[0].competitors[0].team.displayName}</div>
                            </div>
                            {firstTeamLineIsFav.line}
                            <div xs='7'><Progress bar value={((firstTeamScore - secondTeamScore) + firstTeamLineIsFav.line) < 0 ? 0 : (firstTeamScore - secondTeamScore) + firstTeamLineIsFav.line}>COVERING</Progress></div>
                        </div>
                        <div className='teamSection'>
                            <div>
                                <img alt={props.game.header.competitions[0].competitors[1].team.displayName} src={props.game.header.competitions[0].competitors[1].team.logos[0].href} />
                                <Badge>{props.game.header.competitions[0].status.type.name === "STATUS_SCHEDULED" ? '' : props.game.header.competitions[0].competitors[1].score}</Badge>
                                <div className='teamTitle'>{props.game.header.competitions[0].competitors[1].team.displayName}</div>
                            </div>
                            {secondTeamLineIsFav.line}
                            <div xs='7'><Progress bar value={((secondTeamScore - firstTeamScore) + secondTeamLineIsFav.line) < 0 ? 0 : (secondTeamScore - firstTeamScore) + secondTeamLineIsFav.line}>COVERING</Progress></div>
                        </div>
                    </Col>
                </Row>
                <Row>

                    <>
                        <Progress bar
                            value={actualOvers}
                            max={props.game.pickcenter[0] ? props.game.pickcenter[0]?.overUnder : undefined}
                            color={determineOverUnderStatus(props.game, actualOvers)}>
                            {isNaN(actualOvers) ? 0 : actualOvers}/{props.game.pickcenter[0]?.overUnder}
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
        if (actualOvers <= competition.pickcenter[0]?.overUnder) {
            return 'warning';
        } else {
            return 'success';
        }
    }
}


export default connect(null, null)(Matchup);


