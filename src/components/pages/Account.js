import React, { useCallback, useEffect, useState } from "react";
import classes from "./Account.module.css";
import { useSelector } from "react-redux";
import UserTrail from '../UserTrail';
import hostURL from '../../hosturl'

const Account = (props) => {
  const [usersTrails, setUsersTrails] = useState([]);

  //Pagination
  const resultsPerPage = 6;
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);

  const userName = useSelector((state) => state.auth.userName);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const fetchUserTrails = useCallback(async () => {
    try {
      const response = await fetch(`${hostURL}/auth/fetch-user-trails`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (!response.ok) {
        throw new Error("Could not find users trails!");
      }
      const responseData = await response.json();
      setUsersTrails(responseData.submittedTrails);
      setResults(responseData.submittedTrails.slice(0, resultsPerPage));
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  useEffect(() => {
    fetchUserTrails();
  }, [fetchUserTrails]);

  useEffect(() => {
    setPage(1);
  }, [props.trails]);

  const pages = Math.ceil(usersTrails.length / resultsPerPage);

  useEffect(() => {
    const calcResults = (page) => {
      let startIndex = (page - 1) * resultsPerPage;
      let endIndex = startIndex + resultsPerPage;
      let results = usersTrails.slice(startIndex, endIndex);
      setResults(results);
    };

    calcResults(page);
  }, [page, usersTrails]);

  const prevPageHandler = () => {
    if (page === 1) return;
    setPage((prevState) => prevState - 1);
    window.scrollTo(0, 0);
  };

  const nextPageHandler = () => {
    if (page === pages) return;
    setPage((prevState) => prevState + 1);
    window.scrollTo(0, 0);
  };

  return (
    <div className={classes.account}>
      <h1 className={classes.title}>Your Account</h1>
      <div className={classes["user-info"]}>
        <h2>{`User Name: ${userName}`}</h2>
      </div>
      <h1>Your Submitted Trails</h1>
      <p>{`${usersTrails.length} trails`}</p>
      <ul className={classes["user-trails-list"]}>
        {results.map((trail) => {
          return (
            <UserTrail
              key={trail._id}
              id={trail._id}
              trailName={trail.trailName}
              state={trail.state}
              wildernessArea={trail.wildernessArea}
              miles={trail.miles}
              difficulty={trail.difficulty}
              description={trail.description}
              images={trail.images}
              onDeleteTrail={props.onDeleteTrail}
              onDelete={fetchUserTrails}
            />
          );
        })}
        {usersTrails.length === 0 && (
          <h3>YOU HAVE NOT SUBMITTED ANY TRAILS YET</h3>
        )}
      </ul>
      <div className={classes["pagination-container"]}>
        <div className={classes["button-container"]}>
          {page > 1 && (
            <button
              onClick={prevPageHandler}
              className={classes["pagination-button"]}
            >
              Prev
            </button>
          )}
        </div>
        <h3 className={classes["pagination-num"]}>{`${page} of ${pages}`}</h3>
        <div className={classes["button-container"]}>
          {page < pages && (
            <button
              onClick={nextPageHandler}
              className={classes["pagination-button"]}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
