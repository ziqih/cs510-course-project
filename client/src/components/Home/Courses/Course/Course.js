import React from 'react';
import './Course.css';
import { Link } from 'react-router-dom';

import closeIcon from '../../../../icons/closeIcon.png';

const Course = ({ course, deleteCourses, setDeleteCourses, university }) => {
    return (
    <div className="courseContainer">
        <div className="courseBox">
            <Link onClick={event => (!university || !course) ? event.preventDefault() : null} to={`/questions?university=${university}&course=${course}`}>
                <p className="courseText">{course}</p>
            </Link>
            
            <button className="closeButton" onClick={(event) => setDeleteCourses([university, course])}><img src={closeIcon} alt="delete course"/></button>
        </div>
    </div>
    )
}

export default Course;