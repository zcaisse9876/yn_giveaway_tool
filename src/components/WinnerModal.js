import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { observer } from "mobx-react-lite";
import Confetti from "react-confetti";

import YNMui from "../styles/YNMui";

import { RootContext } from "../stores/RootStore";

import StateMap from "../config/StateMap";

const useStyles = makeStyles({
  ...YNMui,
  text: {
    color: "white",
    fontSize: "2vmin",
    cursor: "pointer",
    "&:hover": {
      color: "#EBB233",
    }
  },
  invisible: {
    opacity: 0,
  }
});

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
};

const getState = (state) => {
  if (!state)
    return "UNKNOWN";

  if (!state?.toUpperCase)
    return state;

  const uState = state.toUpperCase();

  if (!StateMap[uState])
    return uState;

  return StateMap[uState];
};

const WinnerModal = observer((props) => {
  const [winDim, setWinDim] = useState(getWindowDimensions());
  const classes = useStyles();
  const { entriesStore } = useContext(RootContext);

  useEffect(() => {
    const handleResize = () => {
      setWinDim(getWindowDimensions());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={entriesStore.showWinner ? classes.fadeIn : classes.invisible }
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        pointerEvents: entriesStore.showWinner ? undefined : "none",
        zIndex: 9998,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {entriesStore.showWinner && <Confetti width={winDim?.width || 0} height={winDim?.height || 0} colors={["#EBB233"]} /> }
      <div style={{ width: "75%", height: "50%", backgroundColor: "#171717", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <p className="sub-title-2" style={{ color: "white", fontWeight: "bold", margin: 0, textAlign: "center" }}>{`CONGRATULATIONS ${entriesStore?.winningEntrant?.number}`}</p>
        <p className="yn-primary-text sub-title" style={{ fontWeight: "bold", marginTop: "2%", marginBottom: "2%", textAlign: "center" }}>{`${entriesStore?.winningEntrant?.NAME}`.toUpperCase()}</p>
        <p className="sub-title-2" style={{ color: "white", margin: 0, textAlign: "center" }}>{`FROM ${getState(entriesStore?.winningEntrant?.STATE)}`.toUpperCase()}</p>
        <p className="sub-text" style={{ color: "white", marin: 0, textAlign: "center" }}>
          {`(Data row ${entriesStore?.winningEntrant?.row === undefined ? 0 : entriesStore.winningEntrant.row + entriesStore.dataRowOffset + entriesStore.dataHeaderOffset })`}
        </p>
      </div>
    </div>
  )
});

export default WinnerModal;