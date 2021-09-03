import { Container } from 'reactstrap'
import { connect } from "react-redux";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Chip } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { loadUpdatedWagers } from "../redux/actions/userActions"
import { loadGames } from "../redux/actions/gameActions"
import React, { useEffect } from 'react';
import { Typography } from '@material-ui/core';



function MyAccount({ loadUpdatedWagers, user }) {

    useEffect(() => {
        loadUpdatedWagers();
        const interval = setInterval(() => {
            loadUpdatedWagers()
        }, 10000)

        return () => clearInterval(interval)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getBalance = () => {
        let balance = 0;
        user.wagers && user.wagers.length > 0 && user.wagers.filter(e => e.status === 'final').map(w => {
            return balance += parseInt(w.result);
        })

        return 0;
    }

    const pending = user.user.balance;
    const wallet = getBalance();
    const max = 1000;

    const balance = (max - (pending + wallet));
    return (
        <div className="App">

            <Container>
                <Chip variant='outlined' color='primary' label={user.user.username} />
                <Typography>{`Max: $${max}`}</Typography>
                <Typography>{`Pending: $${pending}`}</Typography>
                <Typography>{`Wallet: $${wallet}`}</Typography>
                <Typography>{`Balance: $${balance}`}</Typography>

                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date Placed</TableCell>
                                <TableCell align="right">Sport</TableCell>
                                <TableCell align="right">Game</TableCell>
                                <TableCell align="right">Selection</TableCell>
                                <TableCell align="right">Amount Bet</TableCell>
                                <TableCell align="right">Result</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {user.wagers.length > 0 ? user.wagers.map((row) => (
                                <TableRow key={row.wager_date}>
                                    <TableCell component="th" scope="row">
                                        {formatDate(row.wager_date)}
                                    </TableCell>
                                    <TableCell align="right">{row.sport.toUpperCase()}</TableCell>
                                    <TableCell align="right">{row.matchup}</TableCell>
                                    <TableCell align="right">{row.selection}</TableCell>
                                    <TableCell align="right">{row.amount}</TableCell>
                                    <TableCell align="right">{row.result ? Math.round(row.result) : row.result}</TableCell>
                                </TableRow>
                            )) : []}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </div>
    );
}


function formatDate(date) {
    var d = new Date(date);
    return d.toLocaleString();
}


const mapDispatchToProps = {
    loadUpdatedWagers,
    loadGames
};


function mapStateToProps(state) {
    return {
        user: state.user,
        games: state.games
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);