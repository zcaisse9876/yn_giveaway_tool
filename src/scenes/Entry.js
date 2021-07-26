// Absolute Imports
import React, { useEffect, useContext } from "react";
import { observer } from "mobx-react-lite";
import { Button, makeStyles, TextField } from "@material-ui/core";
import { useHistory } from "react-router";

// Store
import { RootContext } from "../stores/RootStore";

// Components
import BackgroundGrid from "../components/BackgroundGrid";

// Styles
import YNMui from '../styles/YNMui';

// Assets
import logo from '../assets/yammie-logo-no-text.png';

const useStyles = makeStyles(theme => ({
  ...YNMui,
}));

const Entry = observer((props) => {
  const classes = useStyles();
  const history = useHistory();
  const { entriesStore } = useContext(RootContext);

  useEffect(() => {
    entriesStore.getYamGiveawayData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <img src={logo} className="App-logo" alt="logo" style={{ padding: ".3em" }} />
          <p style={{ marginRight: ".45em" }}>
            YAMMIE N00B
          </p>
        </div>
        <Button
          variant="contained"
          className={classes.yn_button}
          onClick={() => { history.push("/home") }}
          style={{ width: "30vmax", minWidth: 250, maxWidth: 600 }}
          size="large"
        >
          START GIVEAWAY
        </Button>
      </header>
    </div>
  );
});

export default Entry;