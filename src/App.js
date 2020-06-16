import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Globe from './components/Globe';
import TimeBar from './components/TimeBar';
import axios from 'axios';
import geoData from "./data/GeoChartworldgeo.json";

import './App.css';

const property = ["time_zone", "utc_offset", "dst"];

function App() {
  const [utcCurrentTime, setUtcCurrentTime] = useState('');
  const [updateUtc, setUpdateUtc] = useState(true);

  useEffect(()=>{
    if (updateUtc){ 
    axios.get('http://worldclockapi.com/api/json/utc/now')
      .then(res =>{
          if (res.data && res.data.currentDateTime){
              const utcCurrentTime = res.data.currentDateTime;
              setUtcCurrentTime(utcCurrentTime);    
              setUpdateUtc(false);   
              console.log(utcCurrentTime);       
          }
      })
      .catch(error=>{
        console.log(error);
      });
    }
  }, [updateUtc]);
 

  return (
    <Router>
      <div>           
        <Switch>
          <Route exact path="/">
            <Globe data={geoData} property={property} utcCurrentTime={utcCurrentTime}/>
          </Route>
          <Route exact path="/timebar">
            <TimeBar data={geoData} property={property} utcCurrentTime={utcCurrentTime}/>
          </Route>
        </Switch>
          
        <div className="navbar">            
          <Link to="/">Clickable Globe Map</Link>&nbsp;&nbsp; | &nbsp;&nbsp;<Link to="/timebar">Time Bar</Link>
        </div>
        <p className="currentUTC"
          onClick={e=>setUpdateUtc(true)}
        >
          UTC current time: {utcCurrentTime}
        </p>
      </div>     
      </Router>
  );
}

export default App;
