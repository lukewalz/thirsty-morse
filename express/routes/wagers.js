const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const common = require("../helpers/common");
require("dotenv").config();

router.post("/", async (req, res) => {
  const token = process.env.API_KEY;
  try {
    jwt.verify(req.headers["x-auth-token"], token);
    const tokenId = jwt.decode(req.headers["x-auth-token"], token)._id;

    const user = await User.findOne({ _id: req.body._id });

    if (user) {
      req.body.wagers.wager_date = Date.now();

      if (user._id.toString() === tokenId.toString()) {
        const wagerIsValid = await common.validateWager(req.body.wagers);
        if (wagerIsValid) {
          const newUser = await User.findByIdAndUpdate(
            { _id: user._id },
            { $push: { wagers: req.body.wagers } },
            { new: true }
          );

          res.status(200).send(newUser.wagers[newUser.wagers.length - 1]);
        } else {
          res.status(400).send("Line has changed");
        }
      } else {
        res.status(403).send("Incorrect credentials");
      }
    } else {
      res.status(404).send("Could not find user");
    }
  } catch (er) {
    res.status(401).send("Must use a valid token");

    throw new Error(er);
  }
});

router.get("/", async (req, res) => {
  const token = process.env.API_KEY;
  try {
    jwt.verify(req.headers["x-auth-token"], token);
    const tokenId = jwt.decode(req.headers["x-auth-token"], token)._id;
    const user = await User.findOne({ _id: req.query.id });
    if (user) {
      if (user._id === tokenId) {
        if (user.wagers) {
          res.status(200).send(user.wagers);
        } else {
          res.status(200).send([]);
        }
      } else {
        res.status(401).send("Incorrect credentials");
      }
    } else {
      res.status(404).send("Could not find user");
    }
  } catch (er) {
    res.status(401).send("Must use a valid token");

    throw new Error(er);
  }
});

module.exports = router;
