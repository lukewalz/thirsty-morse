import React, { useState } from 'react';
import '../App.css';
import { connect } from "react-redux";
import { Row, Col, Progress, Button, Alert, Collapse } from 'reactstrap';
import WagerModal from '../components/WagerModal'
import { OverUnderWidget } from '../components/OverUnderWidget'
import { Snackbar } from '@material-ui/core/'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';



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
    const [actualOvers] = useState(Number(props.game.competitors[0].score) + Number(props.game.competitors[1].score));
    const [openModal, setOpenModal] = useState(false);
    const [team1Abbreviation] = useState(props.game.competitors[0].team.abbreviation);
    const [team2Abbreviation] = useState(props.game.competitors[1].team.abbreviation)
    const [disabled, setDisabled] = useState(false);
    const [selectedWager, setSelectedWager] = useState();
    const [alertVisible, setAlertVisible] = useState(false);
    const [collapse, setCollapse] = useState(false);


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
                overUnder={props.game.odds ? props.game.odds.overUnder : null}
                disabled={disabled}
                selectedWager={selectedWager}
                handleClose={() => setOpenModal(false)}
                game_id={props.game.id}
                game_date={props.game.date}
                sport={props.sport}
            />
            <Alert color="danger" isOpen={alertVisible} toggle={onDismiss}>
                Game is finished or in progress
             </Alert>
            <div onClick={() => { props.game.status.type.state !== 'pre' ? setAlertVisible(true) : handleRowClick() }}>
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
                                    <img alt={props.game.competitors[0].team.displayName} src={props.game.competitors[0].team.logos ? props.game.competitors[0].team.logos[0].href : ''} />
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
                                    <img alt={props.game.competitors[1].team.displayName} src={props.game.competitors[1].team.logos ? props.game.competitors[1].team.logos[0].href : ''} />
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
                <Row>
                    <Col xs='3'>

                        <OverUnderWidget handleWagerClick={r => handleWagerClick(r)} wager={props.wagers}>{props.game.odds.overUnder}</OverUnderWidget>

                    </Col>
                    <Col xs='5'>
                        <Progress
                            value={actualOvers}
                            max={props.game.odds.overUnder}
                            color={determineOverUnderStatus(props.game, actualOvers)}>
                            {Number(actualOvers) + '/' + props.game.odds.overUnder}
                        </Progress>
                    </Col>
                    {props.game.status.type.state !== 'pre' && props.game.boxScore ?
                        <div>
                            <Col xs='2'>
                                <Button onClick={() => setCollapse(!collapse)}>{!collapse ? '+' : '-'}</Button>

                            </Col>
                        </div>
                        : []}
                </Row>

            }
            {
                props.game.status.type.state === 'in' ?
                    <div className='gameAlert'>
                        {props.game.lastPlay}
                    </div> : []
            }
            <Collapse isOpen={collapse}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>{props.game.competitors[0].team.abbreviation}</TableCell>
                                <TableCell align="left">{props.game.competitors[1].team.abbreviation}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.game.boxScore[0].statistics.map((e, i) => {
                                return <TableRow key={i}>
                                    <TableCell align="left">{e.label}</TableCell>
                                    <TableCell align="left">{e.displayValue}</TableCell>
                                    <TableCell align="left">{props.game.boxScore[1].statistics[i].displayValue}</TableCell>
                                </TableRow>
                            })

                            }
                        </TableBody>

                    </Table>
                </TableContainer>
            </Collapse>

        </div >
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


