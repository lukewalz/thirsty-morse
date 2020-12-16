import React, { useState } from 'react';
import '../App.css';
import { connect } from "react-redux";
import { Row, Col, Badge, Progress } from 'reactstrap';
import { WagerModal } from '../components/WagerModal'
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
    const [wagerType, setWagerType] = useState(props.game.placedWagers && props.game.placedWagers[0] ? props.game.placedWagers[0].wager_type : '');
    const [selection, setSelection] = useState(props.game.placedWagers && props.game.placedWagers[0] ? props.game.placedWagers[0].selection : '');
    const [amount, setAmount] = useState(props.game.placedWagers && props.game.placedWagers[0] ? props.game.placedWagers[0].amount : '');
    const [isWagered, setIsWagered] = useState(props.game ? props.game.placedWagers ? true : false : '')


    return (
        props.game && props.game.header.competitions[0].status.type.name !== 'STATUS_CANCELED' && props.game.header.competitions[0].status.type.name !== 'STATUS_POSTPONED' ?
            <>
                <WagerModal
                    setIsWagered={() => {
                        var wager = {
                            game_id: props.game.header.id,
                            wager_type: wagerType,
                            selection,
                            status: 'pending',
                            outcome: 'tbd',
                            amount
                        };
                        props.placeWager(wager);
                        setIsWagered(true);
                        setOpenModal(false)
                    }}
                    teams={props.game.header.competitions[0].competitors}
                    amount={amount}
                    setAmount={setAmount}
                    selection={selection}
                    wagerType={wagerType}
                    changeWagerType={e => setWagerType(e)}
                    changeSelection={(e => setSelection(e))}
                    open={openModal}
                    line={[firstTeamLineIsFav, secondTeamLineIsFav]}
                    overUnder={props.game.pickcenter ? props.game.pickcenter[0].overUnder : null}
                    handleClose={() => setOpenModal(false)} />
                <div onClick={() => { props.game.header.competitions[0].status.type.name === 'STATUS_FINAL' ? alert('Game has finished') : setOpenModal(true) }}>
                    <Row>
                        <Col xs="5">{props.game.header.competitions[0].status.type.name === 'STATUS_SCHEDULED' ? new Date(props.game.header.competitions[0].date).toLocaleString() : props.game.header.competitions[0].status.type.description}</Col>
                        <Col xs="5">{ }</Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className='teamSection' style={isWagered && selection === props.game.header.competitions[0].competitors[0].team.abbreviation + '@' + firstTeamLineIsFav.line ? { border: 'solid' } : {}}>
                                {isWagered && selection === props.game.header.competitions[0].competitors[0].team.abbreviation + '@' + firstTeamLineIsFav.line ? <Badge>{amount}</Badge> : ''}
                                <div>
                                    <img alt={props.game.header.competitions[0].competitors[0].team.displayName} src={props.game.header.competitions[0].competitors[0].team.logos[0].href} />
                                    <Badge>{props.game.header.competitions[0].status.type.name === "STATUS_SCHEDULED" ? '' : props.game.header.competitions[0].competitors[0].score}</Badge>
                                    <div className='teamTitle'>{props.game.header.competitions[0].competitors[0].team.displayName}</div>
                                </div>
                                {firstTeamLineIsFav.line}
                                {props.game.header.competitions[0].status.type.name !== 'STATUS_SCHEDULED' ?
                                    <div xs='7'><Progress value={((firstTeamScore - secondTeamScore) + firstTeamLineIsFav.line) < 0 ? 0 : (firstTeamScore - secondTeamScore) + firstTeamLineIsFav.line}>COVERING</Progress></div> : []}
                            </div>
                            <div className='teamSection' style={isWagered && selection === props.game.header.competitions[0].competitors[1].team.abbreviation + '@' + secondTeamLineIsFav.line ? { border: 'solid' } : {}}>
                                {isWagered && selection === props.game.header.competitions[0].competitors[1].team.abbreviation + '@' + secondTeamLineIsFav.line ? <Badge>{amount}</Badge> : ''}

                                <div>
                                    <img alt={props.game.header.competitions[0].competitors[1].team.displayName} src={props.game.header.competitions[0].competitors[1].team.logos[0].href} />
                                    <Badge>{props.game.header.competitions[0].status.type.name === "STATUS_SCHEDULED" ? '' : props.game.header.competitions[0].competitors[1].score}</Badge>
                                    <div className='teamTitle'>{props.game.header.competitions[0].competitors[1].team.displayName}</div>
                                </div>
                                {secondTeamLineIsFav.line}
                                {props.game.header.competitions[0].status.type.name !== 'STATUS_SCHEDULED' ?
                                    <div xs='7'><Progress value={((secondTeamScore - firstTeamScore) + secondTeamLineIsFav.line) < 0 ? 0 : (secondTeamScore - firstTeamScore) + secondTeamLineIsFav.line}>COVERING</Progress></div> : []}
                            </div>
                        </Col>
                    </Row>
                </div>

                {!isNaN(actualOvers) ?
                    <Row>
                        <Col xs='2'>
                            <OverUnderWidget type={wagerType} selection={selection} isWagered={isWagered}>{props.game.pickcenter[lineAvailable].overUnder}</OverUnderWidget>

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
                    <OverUnderWidget type={wagerType} selection={selection} isWagered={isWagered}>{props.game.pickcenter[lineAvailable].overUnder}</OverUnderWidget>}
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


