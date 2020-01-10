import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

const gtfs = require("gtfs-realtime-bindings");

const App: React.FC = () => {
  const [gtfsData, setGtfsData] = useState({} as any);
  const [timerId, setTimerId] = useState();

  const updateGtfsData = () =>
    fetch("Http://localhost:3001")
      .then(res => res.arrayBuffer())
      .then(data => {
        const gtfsDecoded = gtfs.transit_realtime.FeedMessage.decode(
          new Uint8Array(data)
        ).entity.filter(
          (entity: any) =>
            entity &&
            entity.tripUpdate &&
            entity.tripUpdate.stopTimeUpdate &&
            entity.tripUpdate.stopTimeUpdate.length
        );

        setGtfsData(gtfsDecoded);

        console.log("GTFS:", gtfsDecoded);
      })
      .catch(e => {
        console.error(e);
      });

  useEffect(() => {
    if (!timerId) {
      updateGtfsData(); // TODO: Figure out why the first request doesn't await/lags behind

      setTimerId(
        setInterval(() => {
          updateGtfsData();
        }, 10000)
      );
    }

    return function cleanup() {
      clearInterval(timerId);
    };
  }, [timerId]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        Text!{/* <p>{JSON.stringify(gtfsData)}</p> */}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
