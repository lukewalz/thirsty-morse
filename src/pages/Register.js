import React, { useState, useEffect } from "react";
import { TextField, Typography, Button } from "@material-ui/core";
import { connect } from "react-redux";
import { register } from "../redux/actions/userActions";
import MuiAlert from "@material-ui/lab/Alert";
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';



function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default connect(({ isLoading, user }) => ({ isLoading, user }), { register })(props => {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setErrors(props.user.error?.message)
    }, [props.user.error])

    const submitForm = () => {
        if (email === "" || password === "" || firstName === "" || lastName === "") {
            setErrors("Fields are required");
            return;
        }
        setLoading(true)
        props.register(email, password, firstName, lastName).then(() => setLoading(false));
    };

    return (
        <form className='container'>
            <Typography variant="h5" style={{ marginBottom: 8 }}>
                Register
      </Typography>
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value.toLowerCase())}
            />
            <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                className="form-input"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
            />
            <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                className="form-input"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
            />
            <TextField
                label="Password"
                variant="outlined"
                fullWidth
                className="form-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                className="form-input"
                size="large"
                onClick={submitForm}
            >{loading ? <CheckIcon /> : 'REGISTER'}
            </Button>

            {(props.errors || errors) && (
                <Alert severity="error" onClick={() => setErrors(null)}>
                    {props.errors || errors}
                </Alert>
            )}
        </form>
    );
});