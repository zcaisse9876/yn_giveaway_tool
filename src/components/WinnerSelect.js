import React, { useContext, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { makeStyles, Button, Modal, Backdrop, Fade } from "@material-ui/core";
import { useCountUp } from 'react-countup';

import { RootContext } from "../stores/RootStore";
import YNMui from "../styles/YNMui";

const useStyles = makeStyles(theme => ({
  ...YNMui,
  noScrollBar: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    overflowY: "scroll",
    pointerEvents: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const getName = (name) => {
  if (!name?.toUpperCase)
    return name;

  return name.toUpperCase();
};

let scrollYA = 0;
let animationID = null;
const defaultScrollSpeed = 900;
const spinningScrollSpeed = 50;
let scrollSpeed = defaultScrollSpeed;

const getScrollSpeed = () => {
  const { innerHeight } = window;
  const pixels = Math.ceil(innerHeight / scrollSpeed);
  return pixels;
}

const WinnerSelect = observer((props) => {
  const classes = useStyles();
  const { entriesStore } = useContext(RootContext);
  const selectionsWin = useRef(null);
  const [started, setStarted] = useState(false);
  const [winner, setWinner] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (entriesStore.showGiveaway && animationID == null) {
      const elem = selectionsWin.current;
      const animate = () => {
        if (elem.scrollTop >= (elem.scrollHeight - elem.offsetHeight)) {
          scrollYA = 0;
          elem.scrollTo(0, scrollYA);
        } else {
          scrollYA = scrollYA + getScrollSpeed();
          elem.scrollTo(0, scrollYA);
        }
        animationID = window.requestAnimationFrame(animate);
      };
      animate();
    }

    if (!entriesStore.showGiveaway) {
      scrollYA = 0;
      selectionsWin.current.scrollTo(0, 0);
      window.cancelAnimationFrame(animationID);
      scrollSpeed = defaultScrollSpeed;
      animationID = null;
    }
  }, [entriesStore.showGiveaway]);

  useEffect(() => {
    return () => {
      scrollYA = 0;
      scrollSpeed = defaultScrollSpeed;
    };
  }, []);

  const CUR = useRef(null);

  const { start } = useCountUp({
    ref: CUR,
    start: 0,
    duration: 7,
    end: winner,
    onEnd: () => {
      if (!entriesStore.winningEntrant || entriesStore.showWinner) return;
      console.log('ended');
      setTimeout(() => {
        entriesStore.setShowWinner(true);
        window.cancelAnimationFrame(animationID);
      }, 500);
    },
  });

  const startGiveaway = async () => {
    if (entriesStore.winningEntrant) return;
    setStarted(true);
    const winningNumber = await entriesStore.generateRandomInt(0, entriesStore.spreadArray.length - 1);
    setWinner(winningNumber);
    const winID = entriesStore.spreadArray[winningNumber];
    const winIndex = entriesStore.entryData.findIndex((obj) => obj.ID === winID);
    entriesStore.setWinningEntrant({
      ...entriesStore.entryData[winIndex],
      row: winIndex + 1,
      number: winningNumber,
    });
    scrollSpeed = spinningScrollSpeed;
    start();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", alignItems: "center" }}>
      <div style={{ margin: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ marginTop: 0, marginBottom: 0 }}>{`WINNER:`}&nbsp;</p>
        <p className="yn-primary-text" style={{ marginTop: 0, marginBottom: 0, fontWeight: "bold", display: started ? "none" : undefined }}>{'TBD'}&nbsp;</p>
        <div ref={CUR} className="yn-primary-text" style={{ marginTop: 0, marginBottom: 0, fontWeight: "bold", display: started ? undefined : "none" }} />
        {!started && <Button
          variant="contained"
          className={classes.yn_button}
          onClick={() => { startGiveaway(); }}
          style={{ width: "5vmax", minWidth: 80, maxWidth: 600 }}
          size="large"
        >
          Start
        </Button>}
      </div>
      <hr style={{ width: "60%", border: "1px solid white", marginBottom: 0 }}></hr>
      <div style={{ width: "100%", flex: 1, position: "relative" }}>
        <div ref={selectionsWin} className={classes.noScrollBar}>
          {entriesStore?.entryData?.length && entriesStore.entryData.map((entry, i) => (
            <div style={{ display: "flex"}} key={`entry-${i}`}>
              <p
                className="yn-primary-text"
                style={{ fontSize: "calc(5px + 2vmin)", fontWeight: "bold" }}
              >{`${getName(entry.NAME)}`.toUpperCase()}</p>
              <p style={{ fontSize: "calc(5px + 2vmin)", fontWeight: "bold", fontColor: "white" }}>&nbsp;WITH&nbsp;</p>
              <p className="yn-primary-text" style={{ fontSize: "calc(5px + 2vmin)", fontWeight: "bold" }}>{` ${getName(entry.ENTRIES)}`.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={showModal}
        onClose={() => { setShowModal(false); }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showModal}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Transition modal</h2>
            <p id="transition-modal-description">react-transition-group animates me.</p>
          </div>
        </Fade>
      </Modal>
    </div>
  );
});

export default WinnerSelect;