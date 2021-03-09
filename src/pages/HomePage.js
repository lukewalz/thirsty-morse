import React, { useEffect, useState } from 'react'
import Widget from '../components/Widget';
import { Container, Row, Col } from 'reactstrap'
import { connect } from "react-redux";
import {
    Link
} from "react-router-dom";
import { loadUpdatedWagers } from "../redux/actions/userActions"
import { Paper, List, ListItem, makeStyles, Avatar } from '@material-ui/core/'
import { getGameById } from '../api/espnApi';
import { ArrowUpward, ArrowDownward } from '@material-ui/icons/';

function HomePage({ user, }) {
    const [currentWagers, setCurrentWagers] = useState([]);


    useEffect(() => {
        var wagerList = user.wagers.filter(e => e.status === 'pending');
        var newWagerList = Promise.all(wagerList.map(async element => {
            const r = await getGameById(element.sport, element.game_id);
            console.log(element);

            return {
                amount: element.amount,
                wager_date: element.wager_date,
                selection: element.selection,
                game_id: element.game_id,
                date: r.date,
                ouIcon: element.wager_type === 'ou' ? element.selection.split('@')[0] === 'u' ? <ArrowDownward /> : <ArrowUpward /> : [],
                logo1: element.wager_type !== 'ou' ? r.competitors.find(e => e.team.abbreviation === element.selection.split('@')[0]).team.logos[0].href : <ArrowUpward />
            };
        }))

        newWagerList.then(a => setCurrentWagers(a))

    }, [user])



    return (
        <Container>
            <h1>Dashboard</h1>
            <Row>
                <Col>
                    <Link to="/games/college-football">
                        <Widget image='https://cdn.mybookie.ag/wp-content/uploads/NCAAF-logo-2018-1.png' />
                    </Link>
                </Col>
                <Col>
                    <Link to="/games/nfl">
                        <Widget image="https://static.www.nfl.com/image/upload/v1554321393/league/nvfr7ogywskqrfaiu38m.svg" />
                    </Link>
                </Col>
            </Row><Row>
                <Col>
                    <Link to="/games/nba">
                        <Widget image="https://www.pngkit.com/png/full/89-893116_nba-logo-transparent-png-new-nba-finals-logo.png" />
                    </Link>
                </Col>
                <Col>
                    <Link to="/games/soccer">
                        <Widget image="https://pngimg.com/uploads/fifa/fifa_PNG1.png" />
                    </Link>
                </Col>
                <Col>
                    <Link to="/games/mens-college-basketball">
                        <Widget image="https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/NCAA_logo.svg/220px-NCAA_logo.svg.png" />
                    </Link>
                </Col>
            </Row>
            <h4>Pending Wagers</h4>
            {currentWagers ? <List style={{ 'background': 'white' }}>
                {currentWagers.map(wager =>
                    <ListItem divider dense style={{ 'display': 'flex', 'justifyContent': 'space-between' }} key={`${wager.game_id}_${wager.wager_date}`} >
                        <Avatar src={wager.logo1 ? wager.logo1 : ''} >
                            {wager.ouIcon ? wager.ouIcon : ''}
                        </Avatar>
                        <div>{wager.selection}</div>
                        <div>
                            {wager.amount}
                        </div>
                    </ListItem>)}
            </List> : []}
        </Container >
    )
}


function mapStateToProps(state) {

    return {
        user: state.user,
    };
}

const mapDispatchToProps = {
    loadUpdatedWagers,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);