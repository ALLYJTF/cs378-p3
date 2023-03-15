import "./styles.css";
import React, { useState } from "react";
import { useEffect } from "react";

export default function WeatherApp() {
  // City Buttons
  const [cities, setNewCity] = useState([
    <button
      className="cityButtons"
      key={0}
      onClick={() => displayWeather(30.27, -97.74)}
    >
      Austin
    </button>,
    <button
      className="cityButtons"
      key={1}
      onClick={() => displayWeather(32.77, -96.8)}
    >
      Dallas
    </button>,
    <button
      className="cityButtons"
      key={2}
      onClick={() => displayWeather(29.76, -95.36)}
    >
      Houston
    </button>
  ]);

  // Search Bar
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Weather Info
  const [weatherInfo, setWeatherInfo] = useState();

  // ----------------------------------------------------------------------

  function displayWeather(lat, long) {
    const json_info = fetchAPIData(
      "https://api.open-meteo.com/v1/forecast?latitude=" +
        lat +
        "&longitude=" +
        long +
        "&hourly=temperature_2m"
    );

    json_info.then(function (json) {
      json.hourly.time.slice(0, 12);
      json.hourly.temperature_2m.slice(0, 12);
      setWeatherInfo(
        <div>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Temperature</th>
              </tr>
            </thead>
            <tbody>
              {json.hourly.time.map((time, idx) => (
                <tr key={time}>
                  <td>{timeDisplay(time)}</td>
                  <td>
                    {tempInFarenheit(json.hourly.temperature_2m[idx])} °F{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    });
  }

  // ----------------------------------------------------------------------

  function timeDisplay(t) {
    let time = new Date(t).toLocaleTimeString();
    return (
      time.substring(0, time.length - 6) +
      " " +
      time.substring(time.length - 2, time.length)
    );
  }

  // ----------------------------------------------------------------------

  function tempInFarenheit(temp) {
    let farenheit = (temp * 9) / 5 + 32;
    return Math.round(farenheit * 100) / 100;
  }

  // ----------------------------------------------------------------------
  const appendNewCityButton = (lat, long, name) => {
    // Error Message
    if (isNaN(+lat) || isNaN(+long)) {
      setErrorMsg("Invalid Latitude or Longitude.");
      return;
    } else if (latitude === "" || longitude === "" || name === "") {
      setErrorMsg("Missing Latidue or Longitude.");
      return;
    } else {
      setErrorMsg("");
    }

    // Appending new City Button
    const newButton = (
      <button
        className="cityButtons"
        key={cities.length}
        onClick={() => displayWeather(lat, long)}
      >
        {name}
      </button>
    );

    setNewCity([...cities, newButton]);
    displayWeather(lat, long);
  };

  // ----------------------------------------------------------------------
  return (
    <div>
      {/* City Buttons */}
      <div className="btn_section">{cities}</div>

      {/* Search Bar */}
      <div className="search_section">
        <form>
          <input
            type="text"
            placeholder="Latitude"
            onChange={(e) => setLatitude(e.target.value)}
          />

          <input
            type="text"
            placeholder="Longitude"
            onChange={(e) => setLongitude(e.target.value)}
          />

          <button
            onClick={(e) => {
              e.preventDefault();
              appendNewCityButton(
                latitude,
                longitude,
                "Lat: " + String(latitude) + ", Long: " + String(longitude)
              );
            }}
          >
            +
          </button>

          {errorMsg && <p className="error"> {errorMsg} </p>}
        </form>
      </div>

      {/* Weather Info */}
      <div className="info_section">
        {weatherInfo}
        {useEffect(() => {
          displayWeather(30.27, -97.74);
        }, [])}
      </div>
    </div>
  );
}

async function fetchAPIData(url) {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (err) {
    console.log("Could not fetch data");
    return -1;
  }
}
