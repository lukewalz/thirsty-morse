import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import { Provider } from "react-redux";
import configureStore from './redux/configureStore'
import NavBar from "./components/Nav";
import { Typography, Divider } from "@material-ui/core";
import AuthRoute from "./components/AuthRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Login";
import Games from "./pages/Games.js";


const store = configureStore();

const IndexPage = () => (
  <>
    <Typography variant="h3">Welcome to the App</Typography>
    <Divider style={{ marginTop: 10, marginBottom: 10 }} />
    <Typography variant="h6">Feel free to take a look around</Typography>
  </>
);

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <NavBar />
        <div className="container">
          <Switch>
            <AuthRoute path="/home" render={props => <HomePage {...props} />} type="private" />
            <AuthRoute path="/login" type="guest">
              <LoginPage />
            </AuthRoute>
            <AuthRoute path='/games/:sport/:week?' render={props => <Games {...props} />} type="private" />
            <Route path="/" render={IndexPage} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}