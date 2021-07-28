import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { makeStyles, CircularProgress, Button } from "@material-ui/core";
import { CheckCircle, Error } from "@material-ui/icons";

import { RootContext } from "../stores/RootStore";
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
  mySpinner: {
    height: "calc(5px + 1vmin) !important",
    width: "calc(5px + 1vmin) !important",
    color: "#EBB233",
  },
  myError: {
    height: "calc(7px + 1vmin) !important",
    width: "calc(7px + 1vmin) !important",
    color: "#EB3333",
  },
  mySuccess: {
    height: "calc(7px + 1vmin) !important",
    width: "calc(7px + 1vmin) !important",
    color: "#50EB33",
  }
}));

const DataLoader = observer((props) => {
  const classes = useStyles();
  const { entriesStore } = useContext(RootContext);

  return (
    <div
      onDragLeave={(e) => {
        e.preventDefault();
      }}
      onDragOver={(e) => {
        let event = e;
        event.stopPropagation();
        event.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();

        const files = e?.dataTransfer?.files;
        if (!files?.length) return;
        const file = files[0];
        console.log(file.path);

      }}
    >
        <Button
          variant="contained"
          className={classes.yn_button}
          onClick={() => { entriesStore.importData() }}
          style={{ width: "30vmax", minWidth: 250, maxWidth: 600, height: "3.5em" }}
          disabled={entriesStore.loadingEntryData}
          size="large"
        >
          IMPORT ENTRANT DATA
        </Button>
      {entriesStore.error && !entriesStore.loadingEntryData &&
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <p className="yn-danger-text sub-text" style={{ marginRight: ".5em", fontWeight: "bold" }}>
            {entriesStore.error.toUpperCase()}
          </p>
          <Error className={classes.myError} />
        </div>
      }
      { entriesStore.loadingEntryData &&
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <p
            className={`${entriesStore.successfulData ? 'yn-success-text' : 'yn-primary-text'} sub-text`}
            style={{ marginRight: ".5em", fontWeight: 'bold' }}
          >
            {entriesStore.loadingMessage}
          </p>
          {entriesStore.successfulData ?
            <CheckCircle className={classes.mySuccess} />
          :
            <CircularProgress className={classes.mySpinner} />
          }
        </div>
      }
    </div>
  );
});

export default DataLoader;