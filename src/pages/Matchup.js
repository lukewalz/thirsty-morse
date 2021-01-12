import React, { useState } from 'react';
import '../App.css';
import { connect } from "react-redux";
import { Row, Col, Progress, Button, Alert } from 'reactstrap';
import WagerModal from '../components/WagerModal'
import { OverUnderWidget } from '../components/OverUnderWidget'



function Matchup({ ...props }) {
    var lineAvailable = props.game.pickcenter.findIndex(e => e.details);

    const [firstTeamLineIsFav] = useState(props.game.pickcenter[lineAvailable] ?
        props.game.pickcenter[lineAvailable].awayTeamOdds.favorite
            ? { line: parseFloat(props.game.pickcenter[lineAvailable].details?.split(' -')[1]), isFav: false }
            : props.game.pickcenter[lineAvailable].details ? { line: -parseFloat(props.game.pickcenter[lineAvailable].details.split(' -')[1]), isFav: true } : { undefined }
        : { undefined });
    const [secondTeamLineIsFav] = useState(props.game.pickcenter[lineAvailable] ?
        props.game.pickcenter[lineAvailable].homeTeamOdds.favorite
            ? { line: parseFloat(props.game.pickcenter[lineAvailable].details?.split(' -')[1]), isFav: false }
            : props.game.pickcenter[lineAvailable] ? { line: -parseFloat(props.game.pickcenter[lineAvailable].details.split(' -')[1]), isFav: true } : { undefined }
        : { undefined });
    const [firstTeamScore] = useState(parseInt(props.game.header.competitions[0].competitors[0].score));
    const [secondTeamScore] = useState(parseInt(props.game.header.competitions[0].competitors[1].score));
    const [actualOvers] = useState(parseInt(props.game.header.competitions[0].competitors[0].score) + parseInt(props.game.header.competitions[0].competitors[1].score));
    const [openModal, setOpenModal] = useState(false);
    const [team1Abbreviation] = useState(props.game.header.competitions[0].competitors[0].team.abbreviation);
    const [team2Abbreviation] = useState(props.game.header.competitions[0].competitors[1].team.abbreviation)
    const [disabled, setDisabled] = useState(false);
    const [selectedWager, setSelectedWager] = useState();
    const [alertVisible, setAlertVisible] = useState(false);

    const onDismiss = () => setAlertVisible(false);

    function handleWagerClick(w) {
        setDisabled(false);
        setSelectedWager(w);
        setOpenModal(true);
    }

    function handleRowClick() {
        setDisabled(true);
        setOpenModal(true);
    }

    return (
        <>
            <WagerModal
                teams={props.game.header.competitions[0].competitors}
                open={openModal}
                line={[firstTeamLineIsFav, secondTeamLineIsFav]}
                overUnder={props.game.pickcenter && props.game.pickcenter[0] ? props.game.pickcenter[0].overUnder : null}
                disabled={disabled}
                selectedWager={selectedWager}
                handleClose={() => setOpenModal(false)}
                game_id={props.game.header.id}
                game_date={props.game.header.competitions[0].date}
            />
            <Alert color="danger" isOpen={alertVisible} toggle={onDismiss}>
                Game has finished
             </Alert>
            <div onClick={() => { props.game.header.competitions[0].status.type.name === 'STATUS_FINAL' ? setAlertVisible(true) : handleRowClick() }}>
                <Row>
                    <Col xs="5">{props.game.header.competitions[0].status.type.name === 'STATUS_SCHEDULED' ? new Date(props.game.header.competitions[0].date).toLocaleString() : props.game.header.competitions[0].status.type.name === 'STATUS_FINAL' && props.game.header.competitions[0].status.type.name === 'STATUS_HALF' ? props.game.header.competitions[0].status.type.description : props.game.header.competitions[0].status.type.description + ' ' + props.game.header.competitions[0].status.type.detail}</Col>
                    <Col xs="5">{ }</Col>
                </Row>
                <Row>
                    <Col>
                        <div className='teamSection'>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                {props.wagers ? props.wagers.map((e, i) => e.selection.split('@')[0] === team1Abbreviation ? <Button style={{ backgroundColor: '#8bc34a' }} key={i} onClick={g => { g.stopPropagation(); handleWagerClick(e) }}>{e.status !== 'final' ? '$' + e.amount : e.outcome}</Button> : '') : ''}
                            </div>
                            <div>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-evenly', width: '35%',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    alignItems: 'center'
                                }}>
                                    <img alt={props.game.header.competitions[0].competitors[0].team.displayName} src={props.game.header.competitions[0].competitors[0].team.logos[0].href} />
                                    {props.game.header.competitions[0].status.type.name !== "STATUS_SCHEDULED" ?
                                        <div className='score'>
                                            {props.game.header.competitions[0].status.type.name === "STATUS_SCHEDULED" ? '' : props.game.header.competitions[0].competitors[0].score}
                                        </div> : []}

                                </div>
                                <div className='teamTitle'>{props.game.header.competitions[0].competitors[0].team.displayName}</div>
                            </div>
                            {firstTeamLineIsFav.line}
                            {props.game.header.competitions[0].status.type.name !== 'STATUS_SCHEDULED' ?
                                <div xs='7'><Progress value={((firstTeamScore - secondTeamScore) + firstTeamLineIsFav.line) < 0 ? 0 : (firstTeamScore - secondTeamScore) + firstTeamLineIsFav.line}>COVERING</Progress></div> : []}
                        </div>
                        <div className='teamSection'>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                {props.wagers ? props.wagers.map((e, i) => e.selection.split('@')[0] === team2Abbreviation ? <Button style={{ backgroundColor: '#8bc34a' }} key={i} onClick={g => { g.stopPropagation(); handleWagerClick(e) }}>{e.status !== 'final' ? '$' + e.amount : e.outcome}</Button> : '') : ''}
                            </div>
                            <div>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-evenly', width: '35%',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    alignItems: 'center'
                                }}>
                                    <img alt={props.game.header.competitions[0].competitors[1].team.displayName} src={props.game.header.competitions[0].competitors[1].team.logos[0].href} />
                                    {props.game.header.competitions[0].status.type.name !== "STATUS_SCHEDULED" ?

                                        <div className='score'>
                                            {props.game.header.competitions[0].status.type.name === "STATUS_SCHEDULED" ? '' : props.game.header.competitions[0].competitors[1].score}
                                        </div> : []}
                                </div>
                                <div className='teamTitle'>{props.game.header.competitions[0].competitors[1].team.displayName}</div>
                            </div>
                            {secondTeamLineIsFav.line}
                            {props.game.header.competitions[0].status.type.name !== 'STATUS_SCHEDULED' ?
                                <div xs='7'><Progress value={((secondTeamScore - firstTeamScore) + secondTeamLineIsFav.line) < 0 ? 0 : (secondTeamScore - firstTeamScore) + secondTeamLineIsFav.line}>COVERING</Progress></div> : []}
                        </div>
                    </Col>
                </Row>
            </div>

            {
                !isNaN(actualOvers) ?
                    <Row>
                        <Col xs='3'>

                            <OverUnderWidget wager={props.wagers}>{props.game.pickcenter[lineAvailable].overUnder}</OverUnderWidget>

                        </Col>
                        <Col xs='7'>
                            <Progress
                                value={actualOvers}
                                max={props.game.pickcenter[0] ? props.game.pickcenter[0]?.overUnder : undefined}
                                color={determineOverUnderStatus(props.game, actualOvers)}>
                                {actualOvers + '/' + props.game.pickcenter[lineAvailable].overUnder}
                            </Progress>
                        </Col>

                    </Row>
                    :
                    <OverUnderWidget handleWagerClick={r => handleWagerClick(r)} wager={props.wagers}>{props.game.pickcenter[lineAvailable]?.overUnder}</OverUnderWidget>
            }
        </>
    )
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


