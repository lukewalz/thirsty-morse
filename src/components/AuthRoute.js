import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router";

const AuthRoute = props => {
    const { user, type } = props;
    if (type === "guest" && user.isAuthUser) return <Redirect to="/home" />;
    else if (type === "private" && !user.isAuthUser) return <Redirect to="/" />;

    return <Route {...props} />;
};

const mapStateToProps = ({ user }) => ({
    user
});

export default connect(mapStateToProps)(AuthRoute);