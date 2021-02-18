import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Badge } from "@material-ui/core";
import { connect } from "react-redux";
import { logout, loadUpdatedWagers } from "../redux/actions/userActions";
import subscribePush from '../subscriptions';



function NavBar({ logout, user, loadUpdatedWagers }) {

    useEffect(() => {
        console.log('reloading')
        askUserPermission().then((e) => {

            if (e === 'granted' && user.isAuthUser) {
                subscribePush()
                    .then(() => loadUpdatedWagers()
                        .then(getBalance()))
            }
        })

        function getBalance() {
            console.log('getting balance')
            var balance = 0;
            user.wagers && user.wagers.length > 0 ? user.wagers.filter(e => e.status === 'final').map(w => {
                return balance += parseInt(w.result);
            }) : setBalance(0);
            setBalance(balance);
        }

    }, [user.wagers.length]);

    const [balance, setBalance] = useState();

    function isPushNotificationSupported() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => {

                    })
                    .catch(err => {

                    })
            })
        }
    }

    async function askUserPermission() {
        if (typeof Notification !== 'undefined') {
            return await Notification.requestPermission();
        }
    }

    isPushNotificationSupported();


    return (
        <AppBar position="static" style={{ display: "flex", backgroundColor: '#78b13f' }}>
            <Toolbar>
                <Typography variant="h6">TMSB</Typography>
                <div style={{ marginLeft: "auto" }}>
                    {user.isAuthUser ? (
                        <div>
                            <Badge>{balance}</Badge>
                            <Link to="/home">
                                <Button>Dashboard</Button>
                            </Link>
                            <Link to="/my-account">
                                <Button>Account</Button>
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
    logout,
    loadUpdatedWagers
};


export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
