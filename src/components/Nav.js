import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Badge } from "@material-ui/core";
import { connect } from "react-redux";

import { logout } from "../redux/actions/userActions";

function NavBar({ user, logout, ...props }) {
    return (
        <AppBar position="static" style={{ display: "flex", backgroundColor: '#78b13f' }}>
            <Toolbar>
                <Typography variant="h6">LSPN</Typography>
                <div style={{ marginLeft: "auto" }}>
                    {user.isAuthUser ? (
                        <div>
                            <Badge>{getBalance(user)}</Badge>
                            <Link to="/home">
                                <Button>Dashboard</Button>
                            </Link>
                            <Link to="/my-account">
                                <Button>My Account</Button>
                            </Link>
                            <Button onClick={logout}>
                                Logout
                </Button>
                        </div>
                    ) : (
                            <div>
                                <Link to="/login">
                                    <Button>Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button>Register</Button>
                                </Link>
                            </div>
                        )}
                </div>
            </Toolbar>
        </AppBar>
    );
}

function getBalance(user) {

    if (user.user.wagers) {
        var balance = 0;
        user.user.wagers.map(w => {
            if (w.outcome === 'win') {
                balance += parseInt(w.amount)
            }
            else if (w.outcome === 'loss') {
                balance -= parseInt(w.amount)
            }
        });
        return '$' + balance;
    }
    else {
        return '$0'
    }
}


export default connect(({ user }) => ({ user }), { logout })(
    NavBar
);