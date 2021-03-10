import React from 'react';
import {
    Paper
} from '@material-ui/core';

function Widget(...props) {
    return (
        <Paper elevation={5} className='dashCard'>
            <img style={{ 'alignSelf': 'center' }} width='100%' src={props[0].image} alt="Card cap" />
        </Paper>
    )
}

export default Widget