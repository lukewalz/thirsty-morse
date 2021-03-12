import React from 'react';
import {
    Paper,
    makeStyles
} from '@material-ui/core';

const useStyles = makeStyles({
    card: {
        display: 'flex',
        width: '200px',
        height: '200px',
        justifyContent: 'center',
        marginBottom: '10px'
    },
});

function Widget(...props) {
    const classes = useStyles();
    return (
        <Paper elevation={5} className={classes.card}>
            <img style={{ 'alignSelf': 'center', width: '55%' }} src={props[0].image} alt="Card cap" />
        </Paper>
    )
}

export default Widget