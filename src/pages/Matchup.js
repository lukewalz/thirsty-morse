import React, { useState, useEffect } from 'react';
import '../App.css';
import { connect } from "react-redux";
import { Row, Col, Progress, Button, Alert, Collapse } from 'reactstrap';
import WagerModal from '../components/WagerModal'
import { OverUnderWidget } from '../components/OverUnderWidget'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip'
import { placeWager } from "../redux/actions/userActions"



function Matchup({ placeWager, user, ...props }) {

    const [wagers, setWagers] = useState(user.wagers);

    useEffect(() => {
        var t = user.wagers.length > 0 ? user.wagers.filter(w => w.game_id === props.game.id) : [];
        setWagers(t);
    }, [user.wagers, props.game]);

    const [firstTeamScore] = useState(parseInt(props.game.teams[0].score));
    const [secondTeamScore] = useState(parseInt(props.game.teams[1].score));
    const [openModal, setOpenModal] = useState(false);

    const [disabled, setDisabled] = useState(false);
    const [selectedWager, setSelectedWager] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [collapse, setCollapse] = useState(false);


    const onDismiss = () => setAlertVisible(false);

    async function handleWagerClick(w) {
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
                teams={props.game.teams}
                open={openModal}
                line={props.game.odds}
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
            <div onClick={() => { props.game.status.status_id !== 2 ? setAlertVisible(true) : handleRowClick() }}>
                <Row>
                    <Col xs="5">{props.game.status.status_line ? props.game.status.status_line : props.game.date}</Col>
                    <Col xs="5">{ }</Col>
                </Row>
                <Row>
                    <Col>
                        <div className='teamSection'>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                {wagers.length > 0 ? wagers.map((e, i) => e.selection.split('@')[0] === props.game.teams[0].name ? <Chip label={e.status !== 'final' ? '$' + e.amount : e.outcome} style={{ backgroundColor: '#8bc34a' }} key={i} onClick={g => { g.stopPropagation(); handleWagerClick(e) }} /> : '') : ''}
                            </div>
                            <div>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-evenly', width: '35%',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    alignItems: 'center'
                                }}>
                                    <img width={500} alt={props.game.teams[0].name} src={props.game.teams[0].logoUrl} />
                                    {props.game.status.status_id !== 2 ?
                                        <div className='score'>
                                            {props.game.teams[0].score}
                                        </div> : []}

                                </div>
                                <div className='teamTitle'>{props.game.teams[0].name}</div>
                            </div>
                            <div>{props.game.odds && props.game.odds.ml ? props.game.odds.ml[0].title : ''}</div>

                            {props.game.status.status_id !== 2 && props.game.odds ?
                                <div xs='7'>
                                    <Progress value={(firstTeamScore - secondTeamScore) + props.game.odds.sp} />
                                </div> : []}
                        </div>
                        <div className='teamSection'>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                {wagers.length > 0 ? wagers.map((e, i) => e.selection.split('@')[0] === props.game.teams[1].name ? <Chip label={e.status !== 'final' ? '$' + e.amount : e.outcome} style={{ backgroundColor: '#8bc34a' }} key={i} onClick={g => { g.stopPropagation(); handleWagerClick(e) }} /> : '') : ''}
                            </div>
                            <div>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-evenly', width: '35%',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    alignItems: 'center'
                                }}>

                                    <img width={500} alt={props.game.teams[1].name} src={props.game.teams[1].logoUrl} />
                                    {props.game.status.status_id !== 2 ?

                                        <div className='score'>
                                            {props.game.teams[1].score}
                                        </div> : []}
                                </div>
                                <div className='teamTitle'>{props.game.teams[1].name}</div>
                            </div>
                            <div>{props.game.odds && props.game.odds.ml ? props.game.odds.ml[1].title : ''}</div>
                            {props.game.status.status_id !== 2 && props.game.odds ?
                                <div xs='7'>
                                    <Progress value={(secondTeamScore - firstTeamScore) - props.game.odds.sp} />
                                </div> : []}
                        </div>
                    </Col>
                </Row>
            </div>

            {props.game.odds ?
                <Row>
                    <Col xs='3'>

                        <OverUnderWidget handleWagerClick={r => handleWagerClick(r)} wager={wagers} overUnder={props.game.odds.ou}>{props.game.odds.ou}</OverUnderWidget>

                    </Col>
                    <Col xs='5'>
                        <Progress
                            value={props.game.odds.ou[0].text.split(' ')[1]}
                            max={props.game.odds.ou}
                            color={determineOverUnderStatus(props.game, props.game.odds.ou[0].text.split(' ')[1])}>
                            {!isNaN(props.game.odds.ou[0].text.split(' ')[1]) ? Number(props.game.odds.ou[0].title.split(' ')[1]) + '/' + props.game.odds.ou[0].title.split(' ')[1] : '0/' + props.game.odds.ou[0].title.split(' ')[1]}
                        </Progress>
                    </Col>
                    {props.game.status.status_id !== 2 && props.game.boxScore ?
                        <div>
                            <Col xs='2'>
                                <Button onClick={() => setCollapse(!collapse)}>{!collapse ? '+' : '-'}</Button>

                            </Col>
                        </div>
                        : []}
                </Row>

                : []}
            {
                props.game.status.status_id !== 2 ?
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
                                <TableCell>{props.game.teams[0].name}</TableCell>
                                <TableCell>{props.game.teams[1].name}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.game.boxScore ? props.game.boxScore[0].statistics.map((e, i) => {
                                return <TableRow key={i}>
                                    <TableCell align="left">{e.label}</TableCell>
                                    <TableCell align="left">{props.game.boxScore[1].statistics[i] ? props.game.boxScore[1].statistics[i].displayValue : 'fuck'}</TableCell>
                                    <TableCell align="left">{e.displayValue}</TableCell>
                                </TableRow>
                            })
                                : []
                            }
                        </TableBody>

                    </Table>
                </TableContainer>
            </Collapse>

        </div>
    )
}

function determineOverUnderStatus(competition, actualOvers) {
    if (competition.status.statud_id === 3) {
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

const mapDispatchToProps = {
    placeWager
}

function mapStateToProps(state) {
    return {
        user: state.user,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Matchup);


