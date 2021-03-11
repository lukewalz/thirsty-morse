import React, { useState, useEffect } from "react";
import { TextField, Typography, Button } from "@material-ui/core";
import { connect } from "react-redux";
import { login } from "../redux/actions/userActions";
import MuiAlert from "@material-ui/lab/Alert";
import CircularProgress from '@material-ui/core/CircularProgress';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default connect(({ user }) => ({ user }), { login })(props => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setErrors(props.user.error?.message)
    }, [props.user.error])

    const submitForm = () => {
        if (email === "" || password === "") {
            setErrors("Fields are required");
            return;
        }
        setLoading(true);
        props.login(email, password).catch(() => { setLoading(false); setErrors('Failed to log in') })
    };


    return (
        <form className='container'>
            <Typography variant="h5" style={{ marginBottom: 8 }}>
                Login
      </Typography>
            <TextField
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required={true}

            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required={true}

            />
            <Button
                variant="contained"
                color="primary"
                onClick={submitForm}
            >
                {loading ? <CircularProgress color='secondary' /> : 'Login'}
            </Button>

            {(props.errors || errors) && (
                <Alert severity="error" onClick={() => setErrors(null)}>
                    {props.errors || errors}
                </Alert>
            )}
        </form>
    );
});