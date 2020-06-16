import React, { useEffect, useCallback, useReducer} from 'react';
import { getCurrentTime } from '../shared/functions';
import BarChart from './TimeBar/BarChart';

function reducer(state, action){
    switch (action.type){ 
        case "SET_COUNTRY": 
            return {...state,
                country: action.payload
            }
        case "SET_CURRENTTIME": 
            return {...state,
                currentTime: action.payload
            }
        case "SET_UTC_OFFSET": 
            return {...state,
                utcOffset: action.payload
            }
        default:
            return;
    }
}

function TimeBar({data, property, utcCurrentTime}) {
    const [{country, currentTime, utcOffset}, dispatch] = useReducer(reducer, {
        country: '', 
        currentTime: '',
        utcOffset: ''});

    const handleSelectedCountry = useCallback((event)=> {
        dispatch({type: "SET_COUNTRY", payload: event.target.value });
        if (utcCurrentTime.length>0){ 
            const utcOffset = data.features.filter(feature => feature.properties.name===event.target.value)[0].properties[property[1]];
            const utcTime = getCurrentTime(utcCurrentTime, utcOffset);
            dispatch({type: "SET_UTC_OFFSET", payload: utcOffset});
            dispatch({type: "SET_CURRENTTIME", payload: utcTime});
        }
    }, [data.features, property, utcCurrentTime]);

    useEffect(()=>{
        if (utcOffset.length>0 && utcCurrentTime.length>0){ 
            const utcTime = getCurrentTime(utcCurrentTime, utcOffset);
            dispatch({type: "SET_CURRENTTIME", payload: utcTime});
        }
    }, [utcCurrentTime, utcOffset]);

    return (
        <>
            <h2>Time Bar for country {country}</h2>
            <select
                value={country}
                onChange={handleSelectedCountry}
            >
                <option> </option>
                {data.features.map((item, index) => ( 
                    <option key={index} value={item.properties.name}>
                        {item.properties.name}
                    </option>
                ))}
            </select>
            {currentTime && (
                <>
                    <p>{country} is now {currentTime}</p>
                    <small>During DST period, add 1 hr ahead from it.</small>
                </>
            )}
            <BarChart currentTime={currentTime} />
        </>
    );    
}

export default TimeBar;