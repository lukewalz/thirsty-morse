import React, { useState, useEffect } from "react";
import { TextField, Typography, Button } from "@material-ui/core";
import { connect } from "react-redux";
import { register } from "../redux/actions/userActions";
import MuiAlert from "@material-ui/lab/Alert";
import CircularProgress from '@material-ui/core/CircularProgress';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default connect(({ user }) => ({ user }), { register })(props => {
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
        props.register(email, password, firstName, lastName).catch(() => { setLoading(false); setErrors('Failed to register') })
    };

    return (
        <form className='container'>
            <Typography variant="h5" >
                Register
      </Typography>
            <TextField
                label="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
            />
            <TextField
                label="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
            />
            <TextField
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value.toLowerCase())}
            />

            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={submitForm}
            >{loading ? <CircularProgress color='secondary' /> : 'Register'}
            </Button>

            {(props.errors || errors) && (
                <Alert severity="error" onClick={() => setErrors(null)}>
                    {props.errors || errors}
                </Alert>
            )}
        </form>
    );
});