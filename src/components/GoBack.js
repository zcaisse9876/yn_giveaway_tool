import React from "react";
import { useHistory } from "react-router";
import { makeStyles, Button } from "@material-ui/core";

import YNMui from "../styles/YNMui";

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
});

const GoBack = (props) => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: 9999, display: "flex", justifyContent: "space-between" }}>
      <Button
        variant="contained"
        className={classes.yn_button_2}
        onClick={() => {
          if (props.action) {
            props.action();
          }
          history.push(props.path);
        }}
      >
        {props.label.toUpperCase()}
      </Button>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", paddingRight: "1em" }}>
        <p className="sub-text" style={{ marginRight: ".45em", color: "white", fontWeight: "bold", margin: 0 }}>
          YAMMIE N00B
        </p>
      </div>
    </div>
  )
};

export default GoBack;