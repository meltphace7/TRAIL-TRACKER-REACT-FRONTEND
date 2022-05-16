import { useState, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation'
import AddTrail from "./components/AddTrail";
import Footer from "./components/Footer";
import MainPage from './components/MainPage';
import TrailDetail from './components/TrailDetail'
import { Switch, Route, Redirect } from 'react-router-dom'
import { TRAIL_DATA } from './assets/trails'
import HomePage from './components/HomePage'
import TrailSearchResults from './components/TrailSearchResults'
import ScrollToTop from './components/ScrollToTop'
import Favorites from './components/Favorites';

function App() {
  // LOAD SUBMITED TRAILS FROM FIREBASE
  const [loadedTrails, setLoadedTrails] = useState([]);

  //FAVORITES 
   const [favorites, setFavorites] = useState(
     localStorage.getItem("favorite-trails")
       ? JSON.parse(localStorage.getItem("favorite-trails"))
       : []
   );

  
  const favoriteToggleHandler = function () {
    setFavorites(JSON.parse(localStorage.getItem("favorite-trails")));
    console.log('FAVORITE TOGGLED');
  }
  console.log(favorites);
    
 
  useEffect(() => {
    const fetchTrails = async () => {
      const response = await fetch(
        `https://trail-tracker-image-store-default-rtdb.firebaseio.com/trails.json`
      );
      const data = await response.json();

      const fetchedTrails = [];

      for (const key in data) {
        fetchedTrails.push({
          id: key,
          bestSeason: data[key].trail.bestSeason,
          description: data[key].trail.description,
          difficulty: data[key].trail.difficulty,
          imageURL: data[key].trail.imageURL,
          latitude: data[key].trail.latitude,
          longitude: data[key].trail.longitude,
          miles: data[key].trail.miles,
          scenery: data[key].trail.scenery,
          solitude: data[key].trail.solitude,
          state: data[key].trail.state,
          trailName: data[key].trail.trailName,
          wildernessArea: data[key].trail.wildernessArea,
        });
      }

      setLoadedTrails(fetchedTrails);
    };

    fetchTrails();
  }, []);


  const alphaSortedTrails = TRAIL_DATA.sort((a, b) =>
    a.trailName.localeCompare(b.trailName)
  );

  const [trails, setTrails] = useState(alphaSortedTrails);

  /// Favorite Trails ////////

  // const favoriteTrails = favoriteIDs.map(id => {
  //   const [faveTrail] = trails.filter(trail => trail.id === id);
  //   return faveTrail;
  // }
  // );

  // console.log(favoriteTrails);

  // const [favorites, setFavorites] = useState([]);

  // useEffect(() => {
  //   setFavorites(favoriteTrails)
  // }, [favoriteIDs])
 


  useEffect(() => {
    let allTrails = TRAIL_DATA;
    if (loadedTrails.length >= 1) {
      const combinedTrails = allTrails
        .concat(...loadedTrails)
        .sort((a, b) => a.trailName.localeCompare(b.trailName));
      // const alphaSortTrails = allTrails.sort((a, b) =>
      //   a.trailName.localeCompare(b.trailName)
      // );
      setTrails(combinedTrails)
    }
    
  }, [loadedTrails]);

  // const [trails, setTrails] = useState(alphaSortedTrails);
  const [filteredTrails, setFilteredTrails] = useState([]);
  const [filter, setFilter] = useState("");
  const trailID = localStorage.getItem("selectedTrail");
  const [selectTrail] = trails.filter((trail) => trail.id === +trailID);
  const [selectedTrail, setSelectedTrail] = useState(selectTrail);

  ////////////////////////////////////////////////
  const getAddTrailData = (trailData) => {
    setTrails((prevState) => {
      return [...prevState, trailData];
    });
  };

  const getFilter = (filterSetting) => {
    setFilter(filterSetting);
  };

  useEffect(() => {
    setFilteredTrails(trails);
  }, [trails]);

  // FILTERS TRAILS BASED ON FILTER TYPE AND FILTER QUERY
  useEffect(() => {
    if (filter === undefined || filter.filterType === "") {
      setFilteredTrails(trails);
      return;
    }
    if (filter.filterType === "All") {
      setFilteredTrails(trails);
    }
    if (filter.filterType === "by-state") {
      const filterTrails = trails.filter(
        (trail) => trail.state === filter.filterQuery
      );
      setFilteredTrails(filterTrails);
    }
    if (filter.filterType === "by-wilderness") {
      const filterTrails = trails.filter(
        (trail) => trail.wildernessArea === filter.filterQuery
      );
      setFilteredTrails(filterTrails);
    }
    if (filter.filterType === "by-season") {
      // FIND Inverted Date Hikes(where start month numbers > end month numbers)
      const invertedDateHikes = trails.filter(
        (trail) => +trail.bestSeason[0] > +trail.bestSeason[1]
      );
      // Filter Inverted Date hikes from standard
      const standardDateHikes = trails.filter(
        (trail) => +trail.bestSeason[0] < +trail.bestSeason[1]
      );
      // Apply Filter logic to Inverted Date hikes
      const matchingInvertedHikes = invertedDateHikes.filter(
        (trail) =>
          (+filter.filterQuery >= +trail.bestSeason[0] && 12) ||
          +filter.filterQuery <= +trail.bestSeason[1]
      );
      // Apply Filter Login to Standard Date Hikes
      const matchingStandardHikes = standardDateHikes.filter(
        (trail) =>
          +filter.filterQuery >= +trail.bestSeason[0] &&
          +filter.filterQuery <= +trail.bestSeason[1]
      );
      const seasonFilteredHikes = [
        ...matchingInvertedHikes,
        ...matchingStandardHikes,
      ];
      setFilteredTrails(seasonFilteredHikes);
    }
  }, [filter, trails]);

  // GETS Indiviual Trail data for TrailDetail rendering
  const getSelectedTrail = function (id) {
  
    const [selectTrail] = trails.filter((trail) => trail.id === id);
    setSelectedTrail(selectTrail);
    localStorage.setItem("selectedTrail", id);
  };

  console.log("RENDER");

  return (
    <div className="App">
      <Navigation trails={trails} onFilterSelect={getFilter} />
      <ScrollToTop />
      <Switch>
        <Route path="/" exact>
          <Redirect to="/home" />
        </Route>
        <Route path="/home">
          <HomePage
            trails={trails}
            onFilterSelect={getFilter}
            onTrailSelect={getSelectedTrail}
            trailFilter={filter}
          />
          {/* <MainPage trails={filteredTrails} /> */}
        </Route>
        <Route path="/favorites">
          <Favorites
            onTrailSelect={getSelectedTrail}
            onFavoriteToggle={favoriteToggleHandler}
            favorites={favorites}
          />
        </Route>
        <Route path="/addtrail">
          <AddTrail onAddTrail={getAddTrailData} />
        </Route>
        <Route path="/trails">
          <TrailSearchResults
            onTrailSelect={getSelectedTrail}
            filteredTrails={filteredTrails}
            trails={trails}
            trailFilter={filter}
            onFilterSelect={getFilter}
            onFavoriteToggle={favoriteToggleHandler}
            favorites={favorites}
          />
        </Route>
        <Route path="/trail-detail/:trailId">
          <TrailDetail
            trail={selectedTrail}
            trails={filteredTrails}
            onFavoriteToggle={favoriteToggleHandler}
          />
        </Route>
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
