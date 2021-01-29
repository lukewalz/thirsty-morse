import React from 'react';
import { Card, Button } from 'reactstrap'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

export const OverUnderWidget = (props) => {
    return (
        <Card style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>

            {props.wager ? props.wager.map((e, i) => e.wager_type === 'ou' ?
                e.status === 'final' ?
                    e.selection.split('@')[0] === 'o' ?
                        <div key={i}><Button style={{ backgroundColor: '#8bc34a' }} onClick={g => { g.stopPropagation(); props.handleWagerClick(e) }} key={i} >{e.outcome}</Button><ArrowUpwardIcon /></div> :
                        <div key={i}><Button style={{ backgroundColor: '#8bc34a' }} onClick={g => { g.stopPropagation(); props.handleWagerClick(e) }} key={i} >{e.outcome}</Button><ArrowDownwardIcon /></div>
                    :
                    e.selection.split('@')[0] === 'o' ?
                        <div key={i}><Button style={{ backgroundColor: '#8bc34a' }} onClick={g => { g.stopPropagation(); props.handleWagerClick(e) }} key={i} >{e.amount}</Button><ArrowUpwardIcon /></div> :
                        <div key={i}><Button style={{ backgroundColor: '#8bc34a' }} onClick={g => { g.stopPropagation(); props.handleWagerClick(e) }} key={i} >{e.amount}</Button><ArrowDownwardIcon /></div>
                : []) : []}
            <b style={{ fontSize: '20px' }}>{props.children}</b>
        </Card>

    )
}