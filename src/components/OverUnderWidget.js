import React from 'react';
import { Chip, Paper } from '@material-ui/core';

export const OverUnderWidget = (props) => {
    return (
        <Paper style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>

            {props.wager ? props.wager.map((e, i) => e.wager_type === 'ou' ?
                e.status === 'final' ?
                    e.selection.split('@')[0] === 'o' ?
                        <div key={i}><Chip label={e.outcome} style={{ backgroundColor: '#8bc34a' }} onClick={g => { g.stopPropagation(); props.handleWagerClick(e) }} key={i} /></div> :
                        <div key={i}><Chip label={e.outcome} style={{ backgroundColor: '#8bc34a' }} onClick={g => { g.stopPropagation(); props.handleWagerClick(e) }} key={i} /></div>
                    :
                    e.selection.split('@')[0] === 'o' ?
                        <div key={i}><Chip label={e.selection} style={{ backgroundColor: '#8bc34a' }} onClick={g => { g.stopPropagation(); props.handleWagerClick(e) }} key={i} /></div> :
                        <div key={i}><Chip label={e.selection} style={{ backgroundColor: '#8bc34a' }} onClick={g => { g.stopPropagation(); props.handleWagerClick(e) }} key={i} /></div>
                : []) : []}
            <b style={{ fontSize: '20px' }}>{props.overUnder}</b>
        </Paper>

    )
}