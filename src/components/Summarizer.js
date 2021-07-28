import React, { useContext, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useCountUp } from 'react-countup';

import { RootContext } from "../stores/RootStore";

const DataLoader = observer((props) => {
  const { entriesStore } = useContext(RootContext);
  const CUR1 = useRef(null);
  const CUR2 = useRef(null);
  const CUR3 = useRef(null);
  const entries = entriesStore.entryData || [];
  const spread = entriesStore.spreadArray || [];
  const totalStates = entriesStore.totalStates || 0;

  const { start: s1 } = useCountUp({
    ref: CUR1,
    start: 0,
    duration: 1,
    end: entries.length,
    suffix: " ENTRANTS",
  });

  const { start: s2 } = useCountUp({
    ref: CUR2,
    start: 0,
    duration: 1,
    end: spread.length,
    suffix: " ENTRIES",
  });

  const { start: s3 } = useCountUp({
    ref: CUR3,
    start: 0,
    duration: 1,
    end: totalStates,
    suffix: " STATES",
  });

  useEffect(() => {
    const startCountUp = () => {
      console.log("Starting Count Up");
      s1();
      s2();
      s3();
    };

    if (entriesStore.showSummary === true)
      startCountUp();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entriesStore.showSummary]);

  return (
    <>
      <div ref={CUR1} className="yn-primary-text" style={{ fontWeight: "bold", marginBottom: ".5em" }} />
      <div ref={CUR2} className="yn-primary-text" style={{ fontWeight: "bold", marginBottom: ".5em" }} />
      <div ref={CUR3} className="yn-primary-text" style={{ fontWeight: "bold" }} />
    </>
  );
});

export default DataLoader;