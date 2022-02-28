import Cookies from "universal-cookie";
const _ = require("lodash");

export async function login(username, password) {
  const path =
    process.env.NODE_ENV === "development"
      ? "http://localhost:9000/.netlify/functions/server/auth"
      : "/.netlify/functions/server/auth";
  var userData = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Incorrect login info");
      }
    })
    .catch((er) => {
      throw Error(er);
    })
    .then((token) => {
      const cookies = new Cookies();
      cookies.set("userSession", token);
      return getUser(username, token).then((response) => response);
    })
    .catch((er) => {
      throw Error(er);
    })
    .then((user) => user);

  return userData;
}

async function getUser(username, token) {
  const path =
    process.env.NODE_ENV === "development"
      ? "http://localhost:9000/.netlify/functions/server/users"
      : "/.netlify/functions/server/users";
  return fetch(path + "?username=" + username, {
    headers: {
      "x-auth-token": token,
    },
  })
    .then((response) => response.json())
    .then((t) => t);
}

export async function register(username, password, firstName, lastName) {
  const path =
    process.env.NODE_ENV === "development"
      ? "http://localhost:9000/.netlify/functions/server/users"
      : "/.netlify/functions/server/users";
  var userData = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, firstName, lastName }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 400) {
        throw new Error("Username already exists");
      } else {
        throw new Error("User failed to add");
      }
    })
    .catch((er) => {
      throw Error(er);
    })
    .then((user) => {
      const cookies = new Cookies();
      cookies.set("userSession", user.token);

      var u = _.pick(user, ["_id", "username", "firstName", "lastName"]);
      return u;
    });
  return userData;
}

export async function placeWager(wager) {
  const cookies = new Cookies();
  const token = cookies.get("userSession");
  const _id = JSON.parse(localStorage.getItem("user"))._id;
  const {
    game_id,
    wager_type,
    selection,
    status,
    outcome,
    amount,
    game_date,
    sport,
    matchup,
    boost,
  } = wager;
  const parsedAmount = parseFloat(amount);
  const path =
    process.env.NODE_ENV === "development"
      ? "http://localhost:9000/.netlify/functions/server/wagers"
      : "/.netlify/functions/server/wagers";
  return fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token,
    },
    body: JSON.stringify({
      _id: _id,
      wagers: {
        game_id,
        wager_type,
        selection,
        status,
        outcome,
        amount: parsedAmount,
        game_date,
        sport,
        matchup,
        boost,
      },
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 400) {
        throw new Error("Username already exists");
      } else {
        throw new Error("User failed to add");
      }
    })
    .catch((er) => {
      throw Error(er);
    });
}

export async function getWagers() {
  const cookies = new Cookies();
  const token = cookies.get("userSession");
  const _id = JSON.parse(localStorage.getItem("user"))._id;

  const path =
    process.env.NODE_ENV === "development"
      ? "http://localhost:9000/.netlify/functions/server/wagers"
      : "/.netlify/functions/server/wagers";
  return fetch(path + "?id=" + _id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Wagers could not be retrieved");
      }
    })
    .catch((er) => { });
}

export async function addSubscription(e) {
  const cookies = new Cookies();
  const token = cookies.get("userSession");

  const _id = JSON.parse(localStorage.getItem("user"))._id;
  const path =
    process.env.NODE_ENV === "development"
      ? "http://localhost:9000/.netlify/functions/server/users"
      : "/.netlify/functions/server/users";
  return fetch(path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token,
    },
    body: JSON.stringify({ _id, e }),
  })
    .then((response) => { })
    .catch((er) => { });
}
