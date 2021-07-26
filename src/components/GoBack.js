import React from "react";
import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
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
    <div style={{ position: "absolute", top: 0, left: "1em" }}>
      <p
        className={classes.text}
        onClick={() => {
          history.push(props.path);
        }}
      >
        {props.label.toUpperCase()}
      </p>
    </div>
  )
};

export default GoBack;