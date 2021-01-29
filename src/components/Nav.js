import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Badge } from "@material-ui/core";
import { connect } from "react-redux";
import { logout } from "../redux/actions/userActions";


function NavBar({ logout, user }) {

    useEffect(() => {
        function getBalance() {
            var balance = 0;
            user.wagers.length > 0 ? user.wagers.filter(e => e.status === 'final').map(w => {
                return balance += parseInt(w.result);
            }) : setBalance(0);
            setBalance(balance);
        }
        getBalance();
    }, [user]);

    const [balance, setBalance] = useState();


    return (
        <AppBar position="static" style={{ display: "flex", backgroundColor: '#78b13f' }}>
            <Toolbar>
                <Typography variant="h6">LSPN</Typography>
                <div style={{ marginLeft: "auto" }}>
                    {user.isAuthUser ? (
                        <div>
                            <Badge>{balance}</Badge>
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


function mapStateToProps(state) {
    return {
        user: state.user
    };
}

const mapDispatchToProps = {
    logout
};


export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
