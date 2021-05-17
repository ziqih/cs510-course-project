import React from 'react';
import './QuestionTab.css';
import { Link } from 'react-router-dom';

// import closeIcon from '../../../../icons/closeIcon.png';

const QuestionTab = ({ question }) => {
    return (
    <div className="courseContainer">
        <div className="courseBox">
            <Link onClick={event => (!question) ? event.preventDefault() : null} to={`/question?id=${question.id}`}>
                <p className="courseText">{question.title}</p>
            </Link>
            
            {/* <button className="closeButton" onClick={(event) => setDeleteCourses([university, course])}><img src={closeIcon} alt="delete course"/></button> */}
        </div>
    </div>
    )
}

export default QuestionTab;