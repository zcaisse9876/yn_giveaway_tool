import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";

import downup from "../assets/1down5up.png";
import faired from "../assets/faired.png";
import dual from "../assets/dual.png";
import naked from "../assets/naked.png";
import yn from "../assets/yn.png"

// Generate a random number between min, max inclusive.
const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// Width of each background image box in pixels
const bBoxD = 100;
// All possible background images
const bgImages = [downup, faired, dual, naked, yn];

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
};

// This just calculates how many images we will need in order to fill the background grid for the window size
// Returns an array of length n images of randomaly generated indexes between 0 and the length of bgImages.
// i.e. randomly selecting images for each background cell
const getBackgroundBoxes = (curBackground, boxD) => {
  const { width, height } = getWindowDimensions();
  const nCols = Math.ceil(width / boxD);
  const nRows = Math.ceil(height / boxD);
  const nbBox = nRows * nCols;
  let newBBoxes = [...curBackground];

  if (curBackground.length === 0) {
    for (let i = 0; i < nbBox; i++)
      newBBoxes.push(randomIntFromInterval(0, bgImages.length - 1));
  } else if (curBackground.length < nbBox) {
    for (let i = 0; i < nbBox - curBackground.length + 1; i++)
      newBBoxes.push(randomIntFromInterval(0, bgImages.length - 1));
  } else if (curBackground.length > nbBox) {
    newBBoxes = newBBoxes.slice(0, nbBox);
  }

  return newBBoxes;
};

const useStyles = makeStyles(theme => ({
  grid: {
    width: "100%",
    display: "grid",
    justifyItems: "center",
    "grid-gap": "10px",
    justifyContent: "center",
    "grid-template-columns": "repeat(auto-fill, 100px)",
  },
  item: {
    width: "100px",
    height: "100px",
  },
  bgRoot: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%", 
    height: "100%",
    backgroundColor: "#171717",
    zIndex: -1,
    display: "flex",
    overflow: "hidden",
  },
  bgImg: {
    width: "90px",
    height: "100px",
    opacity: .15,
  }
}));

const BackgroundGrid = (props) => {
  const classes = useStyles();
  const [boxes, setBoxes] = useState(getBackgroundBoxes([], bBoxD));

  // On window resize, recalcalculate the number of background squares needed to fill screen
  useEffect(() => {
    const handleResize = () => {
      setBoxes(getBackgroundBoxes(boxes || [], bBoxD));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.bgRoot}>
      <div className={classes.grid}>
        {boxes && boxes.map((ii, i) => (
          <div className={classes.item} key={`bi-${ii}-${i}`}>
            <img className={classes.bgImg} src={bgImages[ii]} alt=""  />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundGrid;