import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import { Provider } from "react-redux";
import configureStore from "./redux/configureStore";
import NavBar from "./components/Nav";
import { Typography, Divider, Container } from "@material-ui/core";
import AuthRoute from "./components/AuthRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Games from "./pages/Games.js";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import CssBaseline from "@material-ui/core/CssBaseline";
import MyAccount from "./pages/MyAccount";

const store = configureStore();

const IndexPage = () => (
  <Container
    style={{
      marginTop: 70,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <Typography variant="h3">Thirsty Morse Sportsbook</Typography>
    <Divider style={{ marginTop: 10, marginBottom: 10 }} />
    <Typography variant="h6">
      The only online sports book where you can track wagers realtime
    </Typography>
  </Container>
);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <Router>
          <NavBar />
          <Switch>
            <AuthRoute
              path="/home"
              render={(props) => <HomePage {...props} />}
              type="private"
            />
            <AuthRoute path="/login" type="guest">
              <LoginPage />
            </AuthRoute>
            <AuthRoute path="/register" type="guest">
              <RegisterPage />
            </AuthRoute>
            <AuthRoute
              path="/games/:sport/:league/:week?"
              render={(props) => <Games {...props} />}
              type="private"
            />
            <AuthRoute
              path="/my-account"
              render={(props) => <MyAccount {...props} />}
              type="private"
            />
            <Route path="/" render={IndexPage} />
          </Switch>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}
