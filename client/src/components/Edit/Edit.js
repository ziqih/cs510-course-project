import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';

import './Edit.css';

let socket; 


const Edit = ( {location} ) => {
    const { university, course } = queryString.parse(location.search);
    const ENDPOINT = 'localhost:5000';
    const [courseInfo, setCourseInfo] = useState({});
    const [update, setUpdate] = useState([]);
    const [show, setShow] = useState(false);
    const [change, setChange] = useState({});

    useEffect(() => {
        socket = io(ENDPOINT);

        socket.emit('getCourse', { message: "getCourse", university, course }, (message) => {
            console.log("getCourse:", message["course"]);
            setCourseInfo(message["course"]);
        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPOINT, location.search]);   

    useEffect(() => {
        if (update.length === 0) {
            return;
        }
        socket.emit('updateCourse', { message: "updateCourse", university, course, attribute: update[0], value: update[1] }, (message) => {
            console.log(message);
        });
        console.log(update);
    }, [update]);

    const handleChange = (name, e) => {
        change[name] = e.target.value;
        setChange(change);
      }

    const _renderObject = (object) => {
		// unique key issue: https://stackoverflow.com/questions/28329382/understanding-unique-keys-for-array-children-in-react-js
        return Object.keys(object).map((row, i) => {
            return (
            <div key={i}>
            <button className="entryButton mt-20" type="submit" onClick={(event) => show ? setShow(false) : setShow(true)}> <b>{row}:</b> {object[row]}</button>
                { (show && row !== "course" && row !== "University_Name")
                    ? <div> 
                        <input placeholder="Update value here..." className="editInput" type="text" 
                            onChange={(event) => handleChange(`input-${i}`, event)}/> 
                        <button className="button mt-20" type="submit" onClick={(event) => setUpdate([row,change[`input-${i}`]])}>Submit</button>
                    </div>
                    : null 
                }
            </div>
            )
        })
    }
    

    return (
    <div className="editOuterContainer">
        <h2 className="heading">Edit Course Info</h2>
        <div className="editInnerContainer">
            {_renderObject(courseInfo)}
            <Link to="/">
                <button className="button mt-20" type="submit">Return</button>
            </Link>

        </div>
    </div>
    )
}

export default Edit;