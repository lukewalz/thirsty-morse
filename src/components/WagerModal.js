import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export const WagerModal = (props) => {
    const [wagerType, setWagerType] = useState('');
    const [selection, setSelection] = useState('');
    const [amount, setAmount] = useState(0);

    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{props.disabled ? 'Place Wager' : 'View Wager'}</DialogTitle>
            <DialogContent style={{ display: "flex", flexDirection: "column", justifyContent: 'space-evenly' }}>

                <div>
                    <InputLabel id="label">Type</InputLabel>

                    <Select displayEmpty disabled={!props.disabled} labelId="label" defaultValue='Make a selection' id="select" value={wagerType} onChange={val => setWagerType(val.target.value)}>
                        <MenuItem value="">
                            Make a selection
                        </MenuItem>
                        <MenuItem value="sp">Spread</MenuItem>
                        <MenuItem value="ou">Over Under</MenuItem>
                    </Select>

                </div>
                <br />
                <br />
                <div>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Selection</FormLabel>
                        <RadioGroup aria-label="selection" row name="selection" value={selection} onChange={val => setSelection(val.target.value)}>
                            <FormControlLabel disabled={!props.disabled} value={props.wagerType === 'ou' ? 'o' : (props.teams[0].team.abbreviation + '@' + props.line[0].line)} control={<Radio />} label={props.wagerType === 'ou' ? ('Over ' + props.overUnder) : (props.teams[0].team.abbreviation + ' ' + props.line[0].line)} />
                            <FormControlLabel disabled={!props.disabled} value={props.wagerType === 'ou' ? 'u' : (props.teams[1].team.abbreviation + '@' + props.line[1].line)} control={<Radio />} label={props.wagerType === 'ou' ? ('Under ' + props.overUnder) : (props.teams[1].team.abbreviation + ' ' + props.line[1].line)} />
                        </RadioGroup>
                    </FormControl>

                </div>


                <div>
                    <TextField id="filled-basic" disabled={!props.disabled} label="Wager Amount" variant="filled" value={amount} onChange={e => setAmount(e.target.value)} />
                </div>


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
                    disabled={props.wagerType !== '' && props.selection !== '' && props.amount >= 10 ? false : true}
                    onClick={props.setIsWagered}
                    color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    )
}
