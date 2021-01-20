import React, { useState } from 'react';
import '../App.css';
import { connect } from "react-redux";
import { Row, Col, Progress, Button, Alert } from 'reactstrap';
import WagerModal from '../components/WagerModal'
import { OverUnderWidget } from '../components/OverUnderWidget'



function Matchup({ ...props }) {
    const [firstTeamLineIsFav] = useState(
        props.game.odds ? props.game.odds.awayTeamOdds.favorite
            ? { line: parseFloat(props.game.odds.details?.split(' -')[1]), isFav: false }
            : props.game.odds.details ? { line: -parseFloat(props.game.odds.details.split(' -')[1]), isFav: true } : { undefined } : { undefined }
    );
    const [secondTeamLineIsFav] = useState(
        props.game.odds ? props.game.odds.homeTeamOdds.favorite
            ? { line: parseFloat(props.game.odds.details?.split(' -')[1]), isFav: false }
            : props.game.odds ? { line: -parseFloat(props.game.odds.details.split(' -')[1]), isFav: true } : { undefined } : { undefined }
    );
    const [firstTeamScore] = useState(parseInt(props.game.competitors[0].score));
    const [secondTeamScore] = useState(parseInt(props.game.competitors[1].score));
    const [actualOvers] = useState(parseInt(props.game.competitors[0].score) + parseInt(props.game.competitors[1].score));
    const [openModal, setOpenModal] = useState(false);
    const [team1Abbreviation] = useState(props.game.competitors[0].team.abbreviation);
    const [team2Abbreviation] = useState(props.game.competitors[1].team.abbreviation)
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
        <div>
            <WagerModal
                teams={props.game.competitors}
                open={openModal}
                line={[firstTeamLineIsFav, secondTeamLineIsFav]}
                overUnder={props.game.odds && props.game.odds[0] ? props.game.odds[0].overUnder : null}
                disabled={disabled}
                selectedWager={selectedWager}
                handleClose={() => setOpenModal(false)}
                game_id={props.game.id}
                game_date={props.game.date}
                sport={props.sport}
            />
            <Alert color="danger" isOpen={alertVisible} toggle={onDismiss}>
                Game has finished
             </Alert>
            <div onClick={() => { props.game.status.type.name === 'STATUS_FINAL' ? setAlertVisible(true) : handleRowClick() }}>
                <Row>
                    <Col xs="5">{props.game.status.type.name === 'STATUS_SCHEDULED' ? new Date(props.game.date).toLocaleString() : props.game.status.type.name === 'STATUS_FINAL' && props.game.status.type.name === 'STATUS_HALF' ? props.game.status.type.description : props.game.status.type.description + ' ' + props.game.status.type.detail}</Col>
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
                                    <img alt={props.game.competitors[0].team.displayName} src={props.game.competitors[0].team.logos[0].href} />
                                    {props.game.status.type.name !== "STATUS_SCHEDULED" ?
                                        <div className='score'>
                                            {props.game.status.type.name === "STATUS_SCHEDULED" ? '' : props.game.competitors[0].score}
                                        </div> : []}

                                </div>
                                <div className='teamTitle'>{props.game.competitors[0].team.displayName}</div>
                            </div>
                            {firstTeamLineIsFav.line}
                            {props.game.status.type.name !== 'STATUS_SCHEDULED' ?
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
                                    <img alt={props.game.competitors[1].team.displayName} src={props.game.competitors[1].team.logos[0].href} />
                                    {props.game.status.type.name !== "STATUS_SCHEDULED" ?

                                        <div className='score'>
                                            {props.game.status.type.name === "STATUS_SCHEDULED" ? '' : props.game.competitors[1].score}
                                        </div> : []}
                                </div>
                                <div className='teamTitle'>{props.game.competitors[1].team.displayName}</div>
                            </div>
                            {secondTeamLineIsFav.line}
                            {props.game.status.type.name !== 'STATUS_SCHEDULED' ?
                                <div xs='7'><Progress value={((secondTeamScore - firstTeamScore) + secondTeamLineIsFav.line) < 0 ? 0 : (secondTeamScore - firstTeamScore) + secondTeamLineIsFav.line}>COVERING</Progress></div> : []}
                        </div>
                    </Col>
                </Row>
            </div>

            {
                !isNaN(actualOvers) ?
                    <Row>
                        <Col xs='3'>

                            <OverUnderWidget wager={props.wagers}>{props.game.odds.overUnder}</OverUnderWidget>

                        </Col>
                        <Col xs='7'>
                            <Progress
                                value={actualOvers}
                                max={props.game.odds.overUnder}
                                color={determineOverUnderStatus(props.game, actualOvers)}>
                                {actualOvers + '/' + props.game.odds.overUnder}
                            </Progress>
                        </Col>

                    </Row>
                    :
                    <OverUnderWidget handleWagerClick={r => handleWagerClick(r)} wager={props.wagers}>{props.game.odds ? props.game.odds.overUnder : null}</OverUnderWidget>
            }
        </div>
    )
}

function determineOverUnderStatus(competition, actualOvers) {
    if (competition.status.type.name === 'STATUS_FINAL') {
        if (actualOvers <= competition.odds.overUnder) {
            return 'danger';
        } else {
            return 'success';
        }
    } else {
        if (actualOvers <= competition.odds.overUnder) {
            return 'warning';
        } else {
            return 'success';
        }
    }
}

export default connect(null, null)(Matchup);


