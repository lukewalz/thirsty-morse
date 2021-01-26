import React, { useState, useEffect } from 'react';
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
import { connect } from "react-redux";
import { placeWager } from '../redux/actions/userActions';

function WagerModal({ placeWager, ...props }) {
    const [wagerType, setWagerType] = useState();
    const [selection, setSelection] = useState();
    const [amount, setAmount] = useState();

    useEffect(() => {
        setWagerType(props.selectedWager ? props.selectedWager.wager_type : '');
        setSelection(props.selectedWager ? props.selectedWager.selection : '');
        setAmount(props.selectedWager ? props.selectedWager.amount : '');
    }, [props.selectedWager, placeWager])


    if (props.disabled) {
        return (
            <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Place Wager</DialogTitle>
                <DialogContent style={{ display: "flex", flexDirection: "column", justifyContent: 'space-evenly' }}>

                    <div>
                        <InputLabel id="label">Type</InputLabel>

                        <Select displayEmpty labelId="label" defaultValue={wagerType} id="select" value={wagerType} onChange={val => setWagerType(val.target.value)}>
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
                                <FormControlLabel value={wagerType === 'ou' ? 'o@' + props.overUnder : (props.teams[0].team.abbreviation + '@' + props.line.spread)} control={<Radio color='primary' />} label={wagerType === 'ou' ? ('Over ' + props.overUnder) : (props.teams[0].team.abbreviation + '@' + props.line.spread)} />
                                <FormControlLabel value={wagerType === 'ou' ? 'u@' + props.overUnder : (props.teams[1].team.abbreviation + '@' + -props.line.spread)} control={<Radio color='primary' />} label={wagerType === 'ou' ? ('Under ' + props.overUnder) : (props.teams[1].team.abbreviation + '@' + -props.line.spread)} />
                            </RadioGroup>
                        </FormControl>

                    </div>


                    <div>
                        <TextField id="filled-basic" label="Wager Amount" variant="filled" value={amount} onChange={e => setAmount(e.target.value)} />
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
                        className="form-input"
                        size="large"
                        onClick={(e) => handleClick(e)}
                        color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
    else {
        return (<Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Wager Details</DialogTitle>
            <DialogContent style={{ display: "flex", flexDirection: "column", justifyContent: 'space-evenly' }}>

                <div>
                    <InputLabel id="label">Type</InputLabel>

                    <Select labelId="label" disabled={true} id="select" value={wagerType} >
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
                        <RadioGroup aria-label="selection" row name="selection" value={selection} >
                            <FormControlLabel value={selection} disabled={true} control={<Radio />} label={selection} />
                        </RadioGroup>
                    </FormControl>

                </div>


                <div>
                    <TextField id="filled-basic" disabled={true} label="Wager Amount" variant="filled" value={amount} />
                </div>


            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="secondary"
                    className="form-input"
                    size="large"
                    onClick={props.handleClose} >
                    Close
            </Button>
            </DialogActions>
        </Dialog>)
    }

    async function handleClick(event) {
        event.preventDefault();

        if (!wagerType || !selection || !amount) {
            console.log('All fields are required');
            return;
        }


        var game_date_ms = new Date(props.game_date).getTime();
        const wager = {
            game_id: props.game_id,
            wager_type: wagerType,
            selection,
            status: 'pending',
            outcome: 'tbd',
            amount,
            game_date: game_date_ms,
            sport: props.sport,
            matchup: props.teams.map(t => t.team.abbreviation).join(' vs ')
        }

        placeWager(wager);
    }
}

const mapDispatchToProps = {
    placeWager
};

export default connect(null, mapDispatchToProps)(WagerModal);
