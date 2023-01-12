import React, { useState, useEffect, useRef } from "react";
import classes from "./AddTrail.module.css";
import useValidation from '../../hooks/use-validation';
import ModalMessage from '../notifications/ModalMessage'
import hostURL from '../../hosturl';
import {useSelector} from 'react-redux'


const AddTrail = (props) => {
  const [isMessage, setIsMessage] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [message, setMessage] = useState("");

  const author = useSelector(state => state.auth.userName);
  console.log('author', author)
  const userId = localStorage.getItem('userId')

  // Validating User Inputs with custom useValidation hook
  const {
    enteredValue: trailName,
    valueIsValid: trailNameIsValid,
    hasError: trailNameHasError,
    valueChangeHandler: trailNameChangeHandler,
    valueBlurHandler: trailNameBlurHandler,
    reset: trailNameReset,
  } = useValidation((value) => value.trim() !== "");

  const {
    enteredValue: state,
    valueIsValid: stateIsValid,
    hasError: stateHasError,
    valueChangeHandler: stateChangeHandler,
    valueBlurHandler: stateBlurHandler,
    reset: stateReset,
  } = useValidation((value) => value.trim() !== "");

  const {
    enteredValue: wildernessArea,
    valueIsValid: wildernessAreaIsValid,
    hasError: wildernessAreaHasError,
    valueChangeHandler: wildernessAreaChangeHandler,
    valueBlurHandler: wildernessAreaBlurHandler,
    reset: wildernessAreaReset,
  } = useValidation((value) => value.trim() !== "");

  const {
    enteredValue: seasonStart,
    valueIsValid: seasonStartIsValid,
    hasError: seasonStartHasError,
    valueChangeHandler: seasonStartChangeHandler,
    valueBlurHandler: seasonStartBlurHandler,
    reset: seasonStartReset,
  } = useValidation((value) => value.trim() !== "");

  const {
    enteredValue: seasonEnd,
    valueIsValid: seasonEndIsValid,
    hasError: seasonEndHasError,
    valueChangeHandler: seasonEndChangeHandler,
    valueBlurHandler: seasonEndBlurHandler,
    reset: seasonEndReset,
  } = useValidation((value) => value.trim() !== "");

  const {
    enteredValue: longitude,
    valueIsValid: longitudeIsValid,
    hasError: longitudeHasError,
    valueChangeHandler: longitudeChangeHandler,
    valueBlurHandler: longitudeBlurHandler,
    reset: longitudeReset,
  } = useValidation(
    (value) => value.trim() !== "" && +value >= -180 && +value <= 180
  );

  const {
    enteredValue: latitude,
    valueIsValid: latitudeIsValid,
    hasError: latitudeHasError,
    valueChangeHandler: latitudeChangeHandler,
    valueBlurHandler: latitudeBlurHandler,
    reset: latitudeReset,
  } = useValidation(
    (value) => value.trim() !== "" && +value >= -90 && +value <= 90
  );

  const {
    enteredValue: miles,
    valueIsValid: milesIsValid,
    hasError: milesHasError,
    valueChangeHandler: milesChangeHandler,
    valueBlurHandler: milesBlurHandler,
    reset: milesReset,
  } = useValidation((value) => value.trim() !== "" && +value > 0);

  const {
    enteredValue: scenery,
    valueIsValid: sceneryIsValid,
    hasError: sceneryHasError,
    valueChangeHandler: sceneryChangeHandler,
    valueBlurHandler: sceneryBlurHandler,
    reset: sceneryReset,
  } = useValidation(
    (value) => value.trim() !== "" && +value <= 10 && +value >= 1
  );

  const {
    enteredValue: solitude,
    valueIsValid: solitudeIsValid,
    hasError: solitudeHasError,
    valueChangeHandler: solitudeChangeHandler,
    valueBlurHandler: solitudeBlurHandler,
    reset: solitudeReset,
  } = useValidation(
    (value) => value.trim() !== "" && +value <= 10 && +value >= 1
  );

  const {
    enteredValue: difficulty,
    valueIsValid: difficultyIsValid,
    hasError: difficultyHasError,
    valueChangeHandler: difficultyChangeHandler,
    valueBlurHandler: difficultyBlurHandler,
    reset: difficultyReset,
  } = useValidation(
    (value) => value.trim() !== "" && +value <= 10 && +value >= 1
  );

  const {
    enteredValue: description,
    valueIsValid: descriptionIsValid,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    valueBlurHandler: descriptionBlurHandler,
    reset: descriptionReset,
  } = useValidation((value) => value.trim() !== "");

  const [trailheadName, setTrailheadName] = useState("");
  const [season, setSeason] = useState("");
  const [image, setImage] = useState("");
  const [trailSubmited, setTrailSubmited] = useState(false);
  const [isUploading, setIsuploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  ///////// image upload state
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);

  const imageInputRef = useRef();
  // const imageChangeHandler = (event) => {
  //   setImage(event.target.files[0]);
  // };

  const resetImageInput = () => {
    imageInputRef.current.value = "";
  };

  const trailheadNameInputChangeHandler = (e) => {
    setTrailheadName(e.target.value);
  };

  useEffect(() => {
    setSeason([seasonStart, seasonEnd]);
  }, [seasonStart, seasonEnd]);

  let formIsValid = false;

  if (
    trailNameIsValid &&
    stateIsValid &&
    wildernessAreaIsValid &&
    seasonStartIsValid &&
    seasonEndIsValid &&
    longitudeIsValid &&
    latitudeIsValid &&
    milesIsValid &&
    sceneryIsValid &&
    solitudeIsValid &&
    difficultyIsValid &&
    descriptionIsValid
  ) {
    formIsValid = true;
  }

  // HANDLES FILE INPUT CHANGE FOR IMG UPLOAD
  // const imageChangeHandler = function (e) {
  //   for (let i = 0; i < e.target.files.length; i++) {
  //     const newImage = e.target.files[i];
  //     newImage["id"] = Math.random();
  //     setImages((prevState) => [...prevState, newImage]);
  //   }
  // };

  const imageChangeHandler = function (e) {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      setImages((prevState) => [...prevState, newImage]);
    }
  };

  // const postMultipleFiles = (fileList) => {
  //   const formData = new FormData();
  //   for (let i = 0; i < fileList.length; i++) {
  //     const newImage = fileList[i];
  //     formData.append("image", newImage);
  //   }
  // }

  const submitTrailHandler = async (event) => {
    event.preventDefault();
    console.log(images);
    if (!formIsValid) {
      setIsMessage(true);
      setIsErrorMessage(true);
      setMessage("Form info is invalid!");
      return;
    }
  
    // MUST USE FORMDATA TO INCLUDE A FILE/IMAGE
    const formData = new FormData();
    formData.append("trailName", trailName);
    formData.append("state", state);
    formData.append("wildernessArea", wildernessArea);
    formData.append("seasonStart", seasonStart);
    formData.append("seasonEnd", seasonEnd);
    // formData.append("bestSeason", [seasonStart, seasonEnd]);
    formData.append("longitude", longitude);
    formData.append("latitude", latitude);
    formData.append("miles", miles);
    formData.append("scenery", scenery);
    formData.append("solitude", solitude);
    formData.append("difficulty", difficulty);
    formData.append("description", description);
      formData.append("author", author);
      formData.append("authorId", userId);
    images.forEach(image => formData.append('image', image))

    ////

    ////

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${hostURL}/trails/submit-trail`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });
      if (!response.ok || response.status === 422) {
        throw new Error("Adding trail failed!");
      }
      const responseData = await response.json();
      console.log(responseData);
      setIsMessage(true);
      setMessage("Trail successfully submited!");
    } catch (err) {
      console.log(err);
    }
    setImages([]);
  };

  const closeModalHandler = () => {
    if (!isErrorMessage) {
      setIsMessage(false);
      setMessage("");
    } else {
      setIsMessage(false);
      setIsErrorMessage(false);
      setMessage("");
    }
  };

  const trailNameClasses = trailNameHasError
    ? `${classes["text-input-col"]} ${classes["invalid"]}`
    : classes["text-input-col"];

  const stateClasses = stateHasError
    ? `${classes["text-input-col"]} ${classes["invalid"]}`
    : classes["text-input-col"];

  const wildernessAreaClasses = wildernessAreaHasError
    ? `${classes["text-input-col"]} ${classes["invalid"]}`
    : classes["text-input-col"];

  const seasonStartClasses = seasonStartHasError
    ? `${classes["text-input-col"]} ${classes["invalid"]}`
    : classes["text-input-col"];

  const seasonEndClasses = seasonEndHasError
    ? `${classes["text-input-col"]} ${classes["invalid"]}`
    : classes["text-input-col"];

  const longitudeClasses = longitudeHasError
    ? `${classes["text-input-col"]} ${classes["invalid"]}`
    : classes["text-input-col"];

  const latitudeClasses = latitudeHasError
    ? `${classes["text-input-col"]} ${classes["invalid"]}`
    : classes["text-input-col"];

  const milesClasses = milesHasError
    ? `${classes["input-col"]} ${classes["invalid"]}`
    : classes["input-col"];

  const sceneryClasses = sceneryHasError
    ? `${classes["input-col"]} ${classes["invalid"]}`
    : classes["input-col"];

  const solitudeClasses = solitudeHasError
    ? `${classes["input-col"]} ${classes["invalid"]}`
    : classes["input-col"];

  const difficultyClasses = difficultyHasError
    ? `${classes["input-col"]} ${classes["invalid"]}`
    : classes["input-col"];

  const descriptionClasses = descriptionHasError
    ? `${classes["description-input"]} ${classes["invalid"]}`
    : classes["description-input"];

  return (
    <div className={classes["add-trail-section"]}>
      <h1>Enter Trail Information</h1>
      <form
        onSubmit={submitTrailHandler}
        className={classes["trail-form"]}
        encType="multipart/form-data"
      >
        <div className={classes["text-row"]}>
          <div className={trailNameClasses}>
            <label htmlFor="trail-name">Trail Name</label>
            <input
              className={classes["trail-name"]}
              type="text"
              id="trail-name"
              onChange={trailNameChangeHandler}
              onBlur={trailNameBlurHandler}
              value={trailName}
              required
            />
            {trailNameHasError && (
              <p className={classes["error-text"]}>
                Please entere a valid trail name
              </p>
            )}
          </div>
          <div className={stateClasses}>
            <label htmlFor="state">State</label>
            <input
              className={classes["state"]}
              type="text"
              id="state"
              onChange={stateChangeHandler}
              onBlur={stateBlurHandler}
              value={state}
              required
            />
            {stateHasError && (
              <p className={classes["error-text"]}>
                Please entere a valid state (Oregon etc...)
              </p>
            )}
          </div>
        </div>
        <div className={classes["text-row"]}>
          <div className={wildernessAreaClasses}>
            <label htmlFor="wilderness-area">Wilderness Area</label>
            <input
              className={classes["wilderness-area"]}
              type="text"
              id="wilderness-area"
              onChange={wildernessAreaChangeHandler}
              onBlur={wildernessAreaBlurHandler}
              value={wildernessArea}
              required
            />
            {wildernessAreaHasError && (
              <p className={classes["error-text"]}>
                Please entere a valid wilderness area (Goat Rocks Wilderness
                etc...)
              </p>
            )}
          </div>
          <div className={classes["text-input-col"]}>
            <label htmlFor="trailhead-name">Trailhead Name (optional)</label>
            <input
              className={classes["trailhead-name"]}
              type="text"
              id="trailhead-name"
              onChange={trailheadNameInputChangeHandler}
              value={trailheadName}
            />
          </div>
        </div>
        <div className={classes["text-row"]}>
          <div className={seasonStartClasses}>
            <label htmlFor="season-start">Season Start</label>
            <select
              id="season-start"
              name="season-start"
              value={seasonStart}
              onChange={seasonStartChangeHandler}
              onBlur={seasonStartBlurHandler}
              required
            >
              <optgroup label="Month">
                <option value="0">Select Month</option>
                <option value="1">January</option>
                <option value="2">Febuary</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </optgroup>
            </select>
            {seasonStartHasError && (
              <p className={classes["error-text"]}>
                Please select a start season
              </p>
            )}
          </div>

          <div className={seasonEndClasses}>
            <label htmlFor="season-start">Season End</label>
            <select
              id="season-end"
              name="season-end"
              value={seasonEnd}
              onChange={seasonEndChangeHandler}
              onBlur={seasonEndBlurHandler}
              required
            >
              <optgroup label="Month">
                <option value="0">Select Month</option>
                <option value="1">January</option>
                <option value="2">Febuary</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </optgroup>
            </select>
            {seasonEndHasError && (
              <p className={classes["error-text"]}>
                Please select an end season
              </p>
            )}
          </div>
        </div>
        <div className={classes["text-row"]}>
          <div className={longitudeClasses}>
            <label htmlFor="longitude">Longitude (trailhead)</label>
            <input
              className={classes["wilderness-area"]}
              type="number"
              id="longitude"
              onChange={longitudeChangeHandler}
              onBlur={longitudeBlurHandler}
              value={longitude}
              required
            />
            {longitudeHasError && (
              <p className={classes["error-text"]}>
                Please enter a valid longitude (right click on trailhead in
                google maps)
              </p>
            )}
          </div>

          <div className={latitudeClasses}>
            <label htmlFor="latitude">Latitude (trailhead) </label>
            <input
              className={classes["season"]}
              type="number"
              id="latitude"
              onChange={latitudeChangeHandler}
              onBlur={latitudeBlurHandler}
              value={latitude}
              required
            />
            {latitudeHasError && (
              <p className={classes["error-text"]}>
                Please enter a valid latitude (right click on trailhead in
                google maps)
              </p>
            )}
          </div>
        </div>

        <div className={classes["number-group"]}>
          <div className={milesClasses}>
            <label htmlFor="miles">Miles (round trip) </label>
            <input
              className={classes["number-input"]}
              type="number"
              id="miles"
              onChange={milesChangeHandler}
              onBlur={milesBlurHandler}
              value={miles}
              required
            />
            {milesHasError && (
              <p className={classes["error-text"]}>
                Please enter mileage of hike
              </p>
            )}
          </div>

          <div className={sceneryClasses}>
            <label htmlFor="scenery">Scenery (1-10)</label>
            <input
              className={classes["number-input"]}
              type="number"
              min="1"
              max="10"
              id="scenery"
              onChange={sceneryChangeHandler}
              onBlur={sceneryBlurHandler}
              value={scenery}
              required
            />
            {sceneryHasError && (
              <p className={classes["error-text"]}>
                Please rate scenery from 1 to 10
              </p>
            )}
          </div>
          <div className={solitudeClasses}>
            <label htmlFor="solitude">Solitude (1-10)</label>
            <input
              className={classes["number-input"]}
              type="number"
              min="1"
              max="10"
              id="solitude"
              onChange={solitudeChangeHandler}
              onBlur={solitudeBlurHandler}
              value={solitude}
              required
            />
            {solitudeHasError && (
              <p className={classes["error-text"]}>
                Please rate solitude from 1 to 10 (1=crowded, 10=alone)
              </p>
            )}
          </div>
          <div className={difficultyClasses}>
            <label htmlFor="difficulty">Difficulty (1-10)</label>
            <input
              className={classes["number-input"]}
              type="number"
              min="1"
              max="10"
              id="difficulty"
              onChange={difficultyChangeHandler}
              onBlur={difficultyBlurHandler}
              value={difficulty}
              required
            />
            {difficultyHasError && (
              <p className={classes["error-text"]}>
                Please rate difficulty from 1 to 10 (1=easy, 10=hard)
              </p>
            )}
          </div>
        </div>

        <div className={descriptionClasses}>
          <label htmlFor="description">Trail Description </label>
          <textarea
            className={"description"}
            type="text"
            id="description"
            onChange={descriptionChangeHandler}
            onBlur={descriptionBlurHandler}
            rows="10"
            cols="50"
            value={description}
            required
          />
          {descriptionHasError && (
            <p className={classes["error-text"]}>
              Please provide trail description
            </p>
          )}
        </div>

        <label htmlFor="image-upload">Upload Images (required)</label>
        <input
          id="file-input"
          ref={imageInputRef}
          type="file"
          multiple
          onChange={imageChangeHandler}
          // accept="image/jpg"
        />
        <progress value={progress} max="100" />
        <button type="submit">Submit Trail!</button>
      </form>
      {isMessage && (
        <ModalMessage onCloseModal={closeModalHandler} message={message} />
      )}
    </div>
  );
};

export default AddTrail;

