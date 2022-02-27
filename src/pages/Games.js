import React, { useEffect, useState } from "react";
import "../App.css";
import { loadGames } from "../redux/actions/gameActions";
import { loadUpdatedWagers } from "../redux/actions/userActions";
import { connect } from "react-redux";
import { Paper, Typography } from "@material-ui/core/";
import Matchup from "./Matchup";
import { useParams } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Pagination, PaginationItem } from "@material-ui/lab";
import moment from "moment";

function Games({ loadGames, games, loadUpdatedWagers }) {
  const [day, setDay] = useState(moment().format("YYYYMMDD"));

  var { sport, league } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames(league, sport, day).then(() => setLoading(false));

    const interval = setInterval(() => {
      loadGames(league, sport, day);
    }, 10000);

    return () => clearInterval(interval);
  }, [sport, day, loadGames, league]);

  const handleChange = (event, value) => {
    setLoading(true);
    var newDay = moment()
      .add(value - 1, "days")
      .format("YYYYMMDD");
    setDay(newDay);
  };

  return (
    <div className="App">
      <Pagination count={7} onChange={(e, i) => handleChange(e, i)} />
      {!loading ? (
        games ? (
          games
            .slice()
            .sort((a, b) => (a.date > b.date ? 1 : -1))
            .map((item) => (
              <Paper elevation={10} key={item.id}>
                <Matchup sport={sport} league={league} game={item} />
              </Paper>
            ))
        ) : (
          <Typography>No games listed</Typography>
        )
      ) : (
        <div style={{ marginTop: 70 }}>
          <CircularProgress size={80} />
        </div>
      )}
    </div>
  );
}

const mapDispatchToProps = {
  loadGames,
  loadUpdatedWagers,
};

function mapStateToProps(state) {
  return {
    games: state.games,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Games);
