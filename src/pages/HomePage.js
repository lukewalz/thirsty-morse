import React, { useEffect, useState } from 'react'
import Widget from '../components/Widget';
import { connect } from "react-redux";
import {
    Link
} from "react-router-dom";
import { loadUpdatedWagers } from "../redux/actions/userActions"
import {
    Paper, List, ListItem, makeStyles, Avatar, Grid
} from '@material-ui/core/'
import { getGameById } from '../api/espnApi';
import { ArrowUpward, ArrowDownward } from '@material-ui/icons/';

function HomePage({ user, }) {
    const [currentWagers, setCurrentWagers] = useState([]);



    useEffect(() => {

        populateWagers()

        const interval = setInterval(() => {
            populateWagers()
        }, 10000)

        return () => clearInterval(interval)

        function populateWagers() {
            var wagerList = user.wagers.filter(e => e.status === 'pending');
            var newWagerList = Promise.all(wagerList.map(async element => {
                const r = await getGameById(element.sport, element.game_id);
                if (r.status.type.state === 'in') {
                    return {
                        status: r.status.type.detail,
                        score: { home: r.competitors[0].score, away: r.competitors[1].score, leading_team: r.competitors[0].score > r.competitors[1].score ? r.competitors[0].team.abbreviation : r.competitors[1].team.abbreviation },
                        amount: element.amount,
                        wager_date: element.wager_date,
                        selection: element.selection,
                        game_id: element.game_id,
                        date: r.date,
                        ouIcon: element.wager_type === 'ou' ? element.selection.split('@')[0] === 'u' ? <ArrowDownward /> : <ArrowUpward /> : [],
                        logo1: element.wager_type !== 'ou' ? r.competitors.find(e => e.team.abbreviation === element.selection.split('@')[0]).team.logos[0].href : ''
                    };
                }


            }))

            newWagerList.then(a => {
                a = a.filter(function (element) {
                    return element !== undefined;
                });
                setCurrentWagers(a)
            })
        }
    }, [user])



    return (

        <Grid container
            justify="space-evenly"
            className='App'>

            <Grid container item justify='space-evenly'>
                {/* <Link to="/games/nba">
                    <Widget image="https://www.pngkit.com/png/full/89-893116_nba-logo-transparent-png-new-nba-finals-logo.png" />
                </Link> */}

                <Link to="/games/nfl">
                    <Widget image="https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/National_Football_League_logo.svg/188px-National_Football_League_logo.svg.png" />
                </Link>
                <Link to="/games/soccer">
                    <Widget image="https://pngimg.com/uploads/fifa/fifa_PNG1.png" />
                </Link>

                <Link to="/games/college-football">
                    <Widget image="https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/NCAA_football_icon_logo.svg/1200px-NCAA_football_icon_logo.svg.png" />
                </Link>

                {/* <Link to="/games/college-basketball">
                    <Widget image="https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/NCAA_logo.svg/220px-NCAA_logo.svg.png" />
                </Link> */}
                {/*<Link to="/games/nhl">
                    <Widget image="https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nhl.png?transparent=true" />
    </Link>*/}
            </Grid>
            <Grid container item justify='space-evenly' direction='column' style={{ marginTop: '30px' }} >
                {currentWagers?.length > 0 && <>
                    <List subheader={<b>In Progress</b>} style={{ 'background': 'white', width: 'inherit' }}>
                        {currentWagers.map(wager =>
                            <ListItem divider style={{ 'display': 'flex', 'justifyContent': 'space-between' }} key={`${wager.game_id}_${wager.wager_date}`} >
                                <Avatar src={wager.logo1 && wager.logo1} >
                                    {wager.ouIcon && wager.ouIcon}
                                </Avatar>
                                <div>{wager.selection}</div>
                                <div>{wager.status}</div>
                                <div>{`${wager.score.home} - ${wager.score.away} ${wager.score.leading_team}`}</div>
                            </ListItem>)}
                    </List></>}
            </Grid>

        </Grid >
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
