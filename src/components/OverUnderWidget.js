import React from 'react';
import { Chip, Paper } from '@material-ui/core';

export const OverUnderWidget = (props) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>

            {props.wager ? props.wager.map((e, i) => e.wager_type === 'ou' ?
                e.status === 'final' ?
                    e.selection.split('@')[0] === 'o' ?
                        <div key={i}><Chip style={{
                            backgroundColor: '#8bc34a', borderRadius: "50%",
                            width: 10,
                            height: 10,
                        }} onClick={g => { g.stopPropagation(); props.handleWagerClick(e) }} key={i} /></div> :
                        <div key={i}><Chip style={{
                            backgroundColor: '#8bc34a', borderRadius: "50%",
                            width: 10,
                            height: 10,
                        }} onClick={g => { g.stopPropagation(); props.handleWagerClick(e) }} key={i} /></div>
                    :
                    e.selection.split('@')[0] === 'o' ?
                        <div key={i}><Chip style={{
                            backgroundColor: '#8bc34a', borderRadius: "50%",
                            width: 10,
                            height: 10,
                        }} onClick={g => { g.stopPropagation(); props.handleWagerClick(e) }} key={i} /></div> :
                        <div key={i}><Chip style={{
                            backgroundColor: '#8bc34a', borderRadius: "50%",
                            width: 10,
                            height: 10,
                        }} onClick={g => { g.stopPropagation(); props.handleWagerClick(e) }} key={i} /></div>
                : []) : []}
            <b>{props.overUnder}</b>
        </div>

    )
}