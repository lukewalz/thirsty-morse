import React, { Component } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography } from "@material-ui/core";
import { connect } from "react-redux";

import { logout } from "../redux/actions/userActions";

function NavBar({ user, logout, ...props }) {
    return (
        <AppBar position="static" style={{ display: "flex" }}>
            <Toolbar>
                <Typography variant="h6">LSPN</Typography>
                <div style={{ marginLeft: "auto" }}>
                    {user.isAuthUser ? (
                        <>
                            <Link to="/home">
                                <Button color="inherit">Home</Button>
                            </Link>
                            <Link to="/my-account">
                                <Button color="inherit">My Account</Button>
                            </Link>
                            <Button color="inherit" onClick={logout}>
                                Logout
                </Button>
                        </>
                    ) : (
                            <Link to="/login">
                                <Button color="inherit">Login</Button>
                            </Link>
                        )}
                </div>
            </Toolbar>
        </AppBar>
    );
}


export default connect(({ user }) => ({ user }), { logout })(
    NavBar
);