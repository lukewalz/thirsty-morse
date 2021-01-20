import { Container } from 'reactstrap'
import { connect } from "react-redux";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { loadUpdatedWagers } from "../redux/actions/userActions"
import { loadGames } from "../redux/actions/gameActions"
import React, { useEffect, useState } from 'react';



function MyAccount({ loadUpdatedWagers, loadGames, user }) {

    useEffect(() => {
        loadUpdatedWagers()
    }, []);

    return (
        <Container>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date Placed</TableCell>
                            <TableCell align="right">Sport</TableCell>
                            <TableCell align="right">Game</TableCell>
                            <TableCell align="right">Game Date</TableCell>
                            <TableCell align="right">Selection</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="right">Result</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {user && user.wagers ? user.wagers.map((row) => (
                            <TableRow key={row.wager_date}>
                                <TableCell component="th" scope="row">
                                    {formatDate(row.wager_date)}
                                </TableCell>
                                <TableCell align="right">{row.sport.toUpperCase()}</TableCell>
                                <TableCell align="right">{row.matchup}</TableCell>
                                <TableCell align="right">
                                    {formatDate(row.game_date)}
                                </TableCell>
                                <TableCell align="right">{row.selection}</TableCell>
                                <TableCell align="right">{row.amount}</TableCell>
                                <TableCell align="right">{row.outcome.toUpperCase()}</TableCell>
                            </TableRow>
                        )) : []}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
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
        user: state.user.user,
        games: state.games
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);