import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';

import './User.css';

let socket; 

const Course = ({ course, university }) => {
    return (
    <div className="courseContainer">
        <div className="courseBox">
            <Link onClick={event => (!university || !course) ? event.preventDefault() : null} to={`/join?university=${university}&course=${course}`}>
            <p className="courseText">{university}-{course}</p>
            </Link>
        </div>
    </div>
    )
}

const User = ( {location} ) => {
    const { name } = queryString.parse(location.search);
    const ENDPOINT = 'localhost:5000';
    const [user, setUser] = useState({});
    const [likes, setLikes] = useState([]);
    const [recommend, setRecommend] = useState([]);
   
    useEffect(() => {
        socket = io(ENDPOINT);

        socket.emit('getUser', { name }, (message) => {
            console.log("Get User:", message);
            setUser(message.user);
            console.log(message.user);
            console.log("recommend get user", message.user);
            getRecommendation(message.user.likes);
        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPOINT, location.search]); 
    
    const getRecommendation = (likes) => {
        socket.emit('recommend', { likes }, (message) => {
            console.log('get recommend course: ', message.courses);
            setRecommend(message.courses);
        })
    }

    const _renderLikes = (object) => {
        return Object.keys(object).map((row, i) => {
            return (
            <div key={i}>
                { (row != "_id" && row != "likes") ? <div className="entryButton mt-20" type="submit"> <b>{row}:</b> {object[row]}</div> : null}
                { row == "likes" ? <div className="entryButton mt-20"><h2>Likes</h2></div> : null }
                { row == "likes" ? object[row].map((like) => {
                    var splits = like.split("-");
                    const university = splits[0];
                    const course = splits[1];
                    return <Course key={like} course={course} university={university}/>
                }): null }
            </div>
            )
        })
    }

    const _renderRecommend = (recommend) => {
        return (recommend.map((entry, i) => {
            var splits = entry.split("-");
            var university = splits[0];
            var course = splits[1];
            return <Course key={`recommend-${i}`} course={course} university={university}/>
        }))
    }
    

    return (
    <div className="editOuterContainer">
        <h2 className="heading">Edit Course Info</h2>
        <div className="editInnerContainer">
            {_renderLikes(user)}
            <div className="entryButton mt-20"><h2>Recommend</h2></div>
            {_renderRecommend(recommend)}
            <Link to="/">
                <button className="button mt-20" type="submit">Return</button>
            </Link>
        </div>
    </div>
    )
}

export default User;