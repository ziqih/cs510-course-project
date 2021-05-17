import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import './Courses.css';

import Course from './Course/Course';

const Courses = ({ courses, deleteCourses, setDeleteCourses, university }) => {
    return (
        <div className="courses">
            <ScrollToBottom>
            {courses.map((course, i) => <div key={i}><Course course={course} deleteCourses={deleteCourses} setDeleteCourses={setDeleteCourses} university={university} /></div>)}
            </ScrollToBottom>
        </div>
    );
}

export default Courses;