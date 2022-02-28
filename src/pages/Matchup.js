import React, { useState, useEffect } from "react";
import "../App.css";
import { connect } from "react-redux";
import { Row, Col, Progress, Button, Alert, Collapse } from "reactstrap";
import WagerModal from "../components/WagerModal";
import { OverUnderWidget } from "../components/OverUnderWidget";
import Chip from "@material-ui/core/Chip";
import { placeWager } from "../redux/actions/userActions";
import { Typography } from "@material-ui/core";

function Matchup({ placeWager, user, ...props }) {
  const [wagers, setWagers] = useState(user.wagers);

  useEffect(() => {
    var t =
      user.wagers.length > 0
        ? user.wagers.filter((w) => w.game_id === props.game.id)
        : [];
    setWagers(t);
  }, [user.wagers, props.game]);

  const [firstTeamScore] = useState(parseInt(props.game.competitors[0].score));
  const [secondTeamScore] = useState(parseInt(props.game.competitors[1].score));
  const [actualOvers] = useState(
    Number(props.game.competitors[0].score) +
    Number(props.game.competitors[1].score)
  );
  const [openModal, setOpenModal] = useState(false);
  const [team1Abbreviation] = useState(props.game.competitors[0].abbreviation);
  const [team2Abbreviation] = useState(props.game.competitors[1].abbreviation);
  const [disabled, setDisabled] = useState(false);
  const [selectedWager, setSelectedWager] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);

  const onDismiss = () => setAlertVisible(false);

  async function handleWagerClick(w) {
    setDisabled(false);
    setSelectedWager(w);
    setOpenModal(true);
  }

  function handleRowClick() {
    setDisabled(true);
    setOpenModal(true);
  }

  return (
    <div>{props.game.odds && props.game.odds > 0 &&
      <WagerModal
        teams={props.game.competitors}
        open={openModal}
        line={props.game.odds}
        overUnder={props.game.odds ? props.game.odds.overUnder : null}
        disabled={disabled}
        selectedWager={selectedWager}
        handleClose={() => setOpenModal(false)}
        game_id={props.game.id}
        game_date={props.game.date}
        sport={props.sport}
        league={props.league}
      />}
      <Alert color="danger" isOpen={alertVisible} toggle={onDismiss}>
        Game is finished or in progress
      </Alert>
      <div
        onClick={() => {
          props.game.status !== "pre"
            ? setAlertVisible(true)
            : handleRowClick();
        }}
      >
        <Row>
          <Col>
            {props.game.fullStatus?.type.name === "STATUS_SCHEDULED"
              ? new Date(props.game.date).toLocaleString()
              : props.game.fullStatus?.type.detail}
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="teamSection">
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                {wagers.length > 0
                  ? wagers.map((e, i) =>
                    e.selection.split("@")[0] === team1Abbreviation ? (
                      <Chip
                        style={{
                          backgroundColor: "#8bc34a",
                          borderRadius: "50%",
                          width: 10,
                          height: 10,
                        }}
                        key={i}
                        onClick={(g) => {
                          g.stopPropagation();
                          handleWagerClick(e);
                        }}
                      />
                    ) : (
                      ""
                    )
                  )
                  : ""}
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    width: "35%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    alignItems: "center",
                  }}
                >
                  <img
                    width={500}
                    alt={props.game.competitors[0].displayName}
                    src={
                      props.game.competitors[0].logo
                        ? props.game.competitors[0].logo
                        : "https://webstockreview.net/images/circle-clipart-transparent-background-7.jpg"
                    }
                  />
                  {props.game.fullStatus?.type.name !== "STATUS_SCHEDULED" ? (
                    <div className="score">
                      {props.game.fullStatus?.type.name === "STATUS_SCHEDULED"
                        ? ""
                        : props.game.competitors[0].score}
                    </div>
                  ) : (
                    []
                  )}
                </div>
                <div className="teamTitle">
                  {props.game.competitors[0].displayName}
                </div>
              </div>
              {props.game.odds ? <>
                <Typography color='primary'>{props.game.odds?.homeTeamOdds.moneyLine}</Typography>

                <Typography color='primary'>
                  {props.game.odds?.spread !== 0
                    ? props.game.odds?.spread
                    : "PICK" +
                    " (" +
                    props.game.odds?.homeTeamOdds.spreadOdds +
                    ")"}
                </Typography></> : 'TBD'}
              {props.game.fullStatus?.type.name !== "STATUS_SCHEDULED" ? (
                <div xs="7">
                  <Progress
                    value={
                      firstTeamScore - secondTeamScore + props.game.odds?.spread
                    }
                  />
                </div>
              ) : (
                []
              )}
            </div>
            <div className="teamSection">
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                {wagers.length > 0
                  ? wagers.map((e, i) =>
                    e.selection.split("@")[0] === team2Abbreviation ? (
                      <Chip
                        style={{
                          backgroundColor: "#8bc34a",
                          borderRadius: "50%",
                          width: 10,
                          height: 10,
                        }}
                        key={i}
                        onClick={(g) => {
                          g.stopPropagation();
                          handleWagerClick(e);
                        }}
                      />
                    ) : (
                      ""
                    )
                  )
                  : ""}
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    width: "35%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    alignItems: "center",
                  }}
                >
                  <img
                    width={500}
                    alt={props.game.competitors[1].displayName}
                    src={
                      props.game.competitors[1].logo
                        ? props.game.competitors[1].logo
                        : "https://webstockreview.net/images/circle-clipart-transparent-background-7.jpg"
                    }
                  />
                  {props.game.fullStatus?.type.name !== "STATUS_SCHEDULED" ? (
                    <div className="score">
                      {props.game.fullStatus?.type.name === "STATUS_SCHEDULED"
                        ? ""
                        : props.game.competitors[1].score}
                    </div>
                  ) : (
                    []
                  )}
                </div>
                <div className="teamTitle">
                  {props.game.competitors[1].displayName}
                </div>
              </div>
              {props.game.odds ?
                <>
                  <Typography color='primary'>{props.game.odds.awayTeamOdds.moneyLine}</Typography>
                  <Typography color='primary'>
                    {props.game.odds && props.game.odds !== 0
                      ? -props.game.odds.spread
                      : "PICK" +
                      " (" +
                      props.game.odds.awayTeamOdds.spreadOdds +
                      ")"}
                  </Typography>
                </> : 'TBD'
              }
              {props.game.fullStatus?.type.name !== "STATUS_SCHEDULED" ? (
                <div xs="7">
                  <Progress
                    value={
                      secondTeamScore - firstTeamScore - props.game.odds?.spread
                    }
                  />
                </div>
              ) : (
                []
              )}
            </div>
          </Col>
        </Row>
      </div>

      {
        <Row>
          <Col xs="3">
            <OverUnderWidget
              handleWagerClick={(r) => handleWagerClick(r)}
              wager={wagers}
              overUnder={props.game.odds?.overUnder}
            >
              {props.game.odds?.overUnder}
            </OverUnderWidget>
          </Col>
          <Col>
            <Progress
              value={actualOvers}
              max={props.game.odds?.overUnder}
              color={determineOverUnderStatus(props.game, actualOvers)}
            >
              {!isNaN(actualOvers)
                ? Number(actualOvers) + "/" + props.game.odds?.overUnder
                : "0/" + props.game.odds?.overUnder}
            </Progress>
          </Col>
        </Row>
      }
      {props.game.status === "in" && (
        <div className="gameAlert">{props.game.situation?.lastPlay?.text}</div>
      )}

    </div>
  );
}

function determineOverUnderStatus(competition, actualOvers) {
  if (competition.fullStatus.type.name === "STATUS_FINAL") {
    if (actualOvers <= competition.odds?.overUnder) {
      return "danger";
    } else {
      return "success";
    }
  } else {
    if (actualOvers <= competition.odds?.overUnder) {
      return "warning";
    } else {
      return "success";
    }
  }
}

const mapDispatchToProps = {
  placeWager,
};

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Matchup);
