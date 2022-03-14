import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Chip,
} from "@material-ui/core";
import { connect } from "react-redux";
import { logout, loadUpdatedWagers } from "../redux/actions/userActions";
// import subscribePush from "../subscriptions";

function NavBar({ logout, user, loadUpdatedWagers }) {
  const [balance, setBalance] = useState(0);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    if (user.isAuthUser) {
      loadUpdatedWagers().then(() => {
        getBalance();
        getPending();
      });
    }

    function getBalance() {
      var balance = 0;
      user.wagers && user.wagers.length > 0
        ? user.wagers
            .filter((e) => e.status === "final")
            .map((w) => {
              return (balance += parseInt(w.result));
            })
        : setBalance(0);
      setBalance(balance);
    }

    function getPending() {
      var pending = 0;
      user.wagers.length > 0
        ? user.wagers
            .filter((e) => e.status === "pending")
            .map((w) => {
              return (pending += parseInt(w.amount || 0));
            })
        : setBalance(0);
      setPending(pending);
    }
  }, [loadUpdatedWagers, user, user.wagers.length]);

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6">TMSB</Typography>
        <div style={{ marginLeft: "auto" }}>
          {user.isAuthUser ? (
            <Box flexDirection="column">
              <Link to="/home">
                <Button>Dashboard</Button>
              </Link>
              <Link to="/my-account">
                <Button>Account</Button>
              </Link>
              <Button onClick={logout}>Logout</Button>
            </Box>
          ) : (
            <Box>
              <Link to="/login">
                <Button>Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </Box>
          )}
        </div>
      </Toolbar>
      <Box padding={0.5} alignSelf="flex-end">
        <Chip color="secondary" label={`Account Balance: ${balance}`} />
        <Chip color="secondary" label={`Max: 1000`} />
        <Chip color="secondary" label={`Pending: ${pending}`} />
      </Box>
    </AppBar>
  );
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

const mapDispatchToProps = {
  logout,
  loadUpdatedWagers,
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
