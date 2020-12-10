import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export const WagerModal = (props) => {
    const [type, setType] = useState();
    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Place Wager</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.message}
                </DialogContentText>
                <InputLabel id="label">Type</InputLabel>
                <Select labelId="label" id="select" value={type} onSelect={val => setType(val.target.value)}>
                    <MenuItem value="10">Spread</MenuItem>
                    <MenuItem value="20">OverUnder</MenuItem>
                    <MenuItem value="30">Moneyline</MenuItem>
                </Select>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="secondary"
                    className="form-input"
                    size="large"
                    onClick={props.handleClose} >
                    Cancel
          </Button>
                <Button variant="contained"
                    color="primary"
                    className="form-input"
                    size="large"
                    onClick={props.handleClose} color="primary">
                    Submit
          </Button>
            </DialogActions>
        </Dialog>)
}
