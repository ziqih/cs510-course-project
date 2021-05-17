import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

import { parseSearchBoxData } from './SearchBox/SearchBox';
import SearchBox from './SearchBox/SearchBox';
import Courses from './Courses/Courses';
import './Home.css';

let socket; 


const Home = ({ location }) => {
    const ENDPOINT = 'localhost:5000';

    const [joinUniversity, setJoinUniversity] = useState('');
    const [joinCourse, setJoinCourse] = useState('');
    const [createUniversity, setCreateUniversity] = useState('');
    const [createCourse, setCreateCourse] = useState('');
    const [newCourse, setNewCourse] = useState([]);

    const [deleteCourses, setDeleteCourses] = useState([]);
    const [courses, setCourses] = useState([]); // real-time course list
    const [joinCourses, setJoinCourses] = useState([]); // search course suggestion
    const [universities, setUniversites] = useState([]); // universities suggestion

    const [update, setUpdate] = useState(0); // alert course updates

    // Handle home join server
    useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit('homeJoin', { message: "Home joined!" }, () => {
        // alert(error);
    } );

    socket.emit('getUniversities', { message: "List Universites" }, (message) => {
        console.log("getUniversities:", message["universities"]);
        setUniversites(message["universities"]);
    });

    return () => {
        socket.emit('disconnect');
        socket.off();
    }
    }, [ENDPOINT, location.search]);    

    
    // Handle real-time course list
    useEffect(() => {
        if (!createUniversity) {
            return;
        }
        socket.emit('getCourses', {university: createUniversity}, (message) => {
            console.log("getCourses:", message["courses"]);
            setCourses(message["courses"]);
        });
    }, [createUniversity, update]);

    // Handle real-time search course suggestion
    useEffect(() => {
        if (!joinUniversity) {
            return;
        }
        socket.emit('getCourses', { university: joinUniversity }, (message) => {
            console.log("getCourses:", message["courses"]);
            setJoinCourses(message["courses"]);
        });
    }, [joinUniversity, update])

    // -----------------------------------------------------------------------------------
    // Handle courses create, delete
    const remindCourseUpdate = () => {
        if (update === 0) { // reminds other UseEffects to refresh course list
            setUpdate(update + 1);
        } else {
            setUpdate(update - 1);
        }
    }

    useEffect(() => {
        if (newCourse.length === 0) {
            return;
        }
        socket.emit("addCourse", {university: newCourse[0], course: newCourse[1] }, (message) => {
            console.log("addCourse: ", message);
            remindCourseUpdate();
        });
    }, [newCourse]);

    useEffect(() => {
        if (deleteCourses.length === 0) {
            return;
        }
        console.log("delete", deleteCourses[0], deleteCourses[1]);
        socket.emit('deleteCourse', { university: deleteCourses[0], courses: [deleteCourses[1]] }, (message) => {
            console.log("deleteCourse", message);
            remindCourseUpdate();
        });
    }, [deleteCourses])
    // -----------------------------------------------------------------------------------


    return (
        <div className="homeOuterContainer">
            <div className="homeInnerContainer">
                <h2 className="heading">Search</h2>
                <SearchBox placeholder="Search for University..." data={universities} setRecordKey={setJoinUniversity}/>
                <SearchBox placeholder="Search for Course..." data={parseSearchBoxData(joinCourses)} setRecordKey={setJoinCourse}/>
            
                <Link onClick={event => (!joinUniversity || !joinCourse) ? event.preventDefault() : null} to={`/questions?university=${joinUniversity}&course=${joinCourse}`}>
                    <button className="button mt-20" type="submit">Join</button>
                </Link>
            </div>

            {/* <div className="homeInnerContainer">
                <h2 className="heading">Create</h2>
                <SearchBox placeholder="Search for University..." data={universities} setRecordKey={setCreateUniversity}/>
                <input placeholder=" Create Course here..." className="homeInput" type="text" onChange={(event) => setCreateCourse(event.target.value)} />
                <button className="button mt-20" type="submit" onClick={(event) => setNewCourse([createUniversity, createCourse])}>Create</button>
            </div>
            
            <div className="homeInnerContainer">
                {(createUniversity) ? 
                <div>
                <h2 className="heading">{createUniversity} Courses</h2>
                <Courses courses={courses} deleteCourses={deleteCourses} setDeleteCourses={setDeleteCourses} university={createUniversity} /> 
                </div>
                : null }
            </div> */}
        </div>
        
        
    )
}

export default Home;