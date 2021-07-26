// Absolute Imports
import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Button, makeStyles } from "@material-ui/core";

// Store
import { RootContext } from "../stores/RootStore";

// Components
import GoBack from "../components/GoBack";

// Style
import YNMui from "../styles/YNMui";

const useStyles = makeStyles(theme => ({
  ...YNMui,
  entrantsBox: {
    width: "60%",
    height: "40vh",
    display: "flex",
    justifyContent: "center",
    position: "relative"
  }
}));

const Giveaway = observer((props) => {
  const classes = useStyles();
  const { entriesStore } = useContext(RootContext);

  return (
    <div>
      <GoBack label="Start New Giveaway" path="/" />
      <header className="App-header">
        <p style={{ marginBottom: 0, fontWeight: "bold" }}>{entriesStore.giveawayTitle.toUpperCase()}</p>
        <hr style={{ width: "60%", border: "1px solid #EBB233" }}></hr>
        <div className={classes.entrantsBox}>
          {entriesStore.entryData === null &&
            <Button
              variant="contained"
              className={classes.yn_button}
              onClick={entriesStore.importData}
              style={{ width: "30vmax", minWidth: 250, maxWidth: 600, height: "3.5em" }}
              size="large"
            >
              IMPORT ENTRANT DATA
            </Button>
          }
        </div>
      </header>
    </div>
  );
});

export default Giveaway;