// Absolute Imports
import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { makeStyles } from "@material-ui/core";

// Store
import { RootContext } from "../stores/RootStore";

// Components
import GoBack from "../components/GoBack";
import DataLoader from "../components/DataLoader";
import Summarizer from "../components/Summarizer";
import WinnerSelect from "../components/WinnerSelect";
import WinnerModal from "../components/WinnerModal";

// Style
import YNMui from "../styles/YNMui";

const useStyles = makeStyles(theme => ({
  ...YNMui,
  entrantsBox: {
    width: "60%",
    height: "40vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative"
  },
  gStage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }
}));

const Giveaway = observer((props) => {
  const classes = useStyles();
  const { entriesStore } = useContext(RootContext);

  return (
    <div>
      <GoBack label="Start New Giveaway" path="/" action={() => { entriesStore.init(); }}/>
      <WinnerModal />
      <header className="App-header">
        <p style={{ marginBottom: 0, fontWeight: "bold" }}>{entriesStore.giveawayTitle.toUpperCase()}</p>
        <hr style={{ width: "60%", border: "1px solid #EBB233" }}></hr>
        <div className={classes.entrantsBox}>
          <div className={`${classes.gStage} ${entriesStore.showSummary ? classes.fadeIn : classes.fadeOut }`} onTransitionEnd={(e) => {
            if (e.propertyName === "opacity" && !entriesStore.showSummary)
              entriesStore.displayGiveaway();
          }}>
            <Summarizer />
          </div>
          <div className={`${classes.gStage} ${entriesStore.entryData ? classes.fadeOut : classes.fadeIn }`} onTransitionEnd={(e) => {
            if (e.propertyName === "opacity")
              entriesStore.displaySummary();
          }}>
            <DataLoader />
          </div>
          <div className={`${classes.gStage} ${!entriesStore.showGiveaway ? classes.fadeOut : classes.fadeIn }`} style={{ pointerEvents: !entriesStore.showGiveaway ? "none" : undefined }}>
            <WinnerSelect />
          </div>
        </div>
      </header>
    </div>
  );
});

export default Giveaway;