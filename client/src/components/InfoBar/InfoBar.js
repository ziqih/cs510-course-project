import React, { useState } from 'react';
import closeIcon from '../../icons/closeIcon.png';
import onlineIcon from '../../icons/onlineIcon.png';
import { Link } from 'react-router-dom';

import './InfoBar.css';

const InfoBar = ({ room, university, course, likeCourse, unlikeCourse, name }) => {
    const [likeButtonText, setLikeButtonText] = useState('Like');

    const likeAct = (name, university, course) => {
        if (likeButtonText == "Like"){
            setLikeButtonText("Unlike");
            likeCourse(name, university, course);
        } else {
            setLikeButtonText("Like");
            unlikeCourse(name, university, course);
        }
    }

    return (
    <div className="infoBar">
        <div className="leftInnerContainer"> 
            <img className="onlineIcon" src={onlineIcon} alt="online"/>
            <Link onClick={event => (!university || !course) ? event.preventDefault() : null} to={`/edit?university=${university}&course=${course}`}>
                <h3>{room}</h3>
            </Link>
    <button className="likeButton" onClick={event => (!university || !course) ? event.preventDefault() : likeAct(name, university, course)}>{likeButtonText}</button>
        </div>

        <div className="rightInnerContainer"> 
            <a href="/"><img src={closeIcon} alt="close"/></a>
        </div>
    </div>
)}

export default InfoBar;