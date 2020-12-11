import React from 'react';
import { Card } from 'reactstrap'
import ImportExportIcon from '@material-ui/icons/ImportExport';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

export const OverUnderWidget = (props) => {
    return (
        <Card style={{ display: 'flex', justifyContent: 'center' }}>
            {props.isWagered && props.type === 'ou' ?
                props.selection === 'o' ?
                    <div style={{ border: 'solid' }}><ArrowUpwardIcon /></div> :
                    <div style={{ border: 'solid' }}><ArrowDownwardIcon /></div> : <ImportExportIcon />}
            <b style={{ fontSize: '30px' }}>{props.children}</b>
        </Card>
    )
}