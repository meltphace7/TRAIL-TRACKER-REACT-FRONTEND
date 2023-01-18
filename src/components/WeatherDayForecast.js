import React, { useEffect } from "react";
import classes from "./WeatherDayForecast.module.css";

const WeatherDayForecast = (props) => {
  const [weather] = props.weather;
  const icon = weather.icon;
  const weatherDescription = weather.description;
  const high = Math.round(props.highTemp);
  const low = Math.round(props.lowTemp);
  const dateNumberFormat = props.date;
  const dateString = new Date(dateNumberFormat * 1000).toString();
  const day = dateString.slice(0, 3);

  useEffect(() => {}, []);

  return (
    <div className={classes["day-container"]}>
      <h1>{day}</h1>
      <h3>{weatherDescription}</h3>
      <img
        src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
        alt="weather icon"
      />
      <p>{`High: ${high}° F`}</p>
      <p>{`Low: ${low}° F`}</p>
    </div>
  );
};

export default WeatherDayForecast;
