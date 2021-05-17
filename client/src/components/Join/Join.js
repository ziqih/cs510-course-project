import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

import './Join.css';

const Join = ( {location} ) => {
    const { university, course } = queryString.parse(location.search);

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    console.log("Join");
    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Welcome to {university}-{course}</h1>
                <div>
                    <input placeholder="Name" className="input" type="text" onChange={(event) => setName(event.target.value)} /> 
                    <input placeholder="Room" className="input mt-20" type="text" onChange={(event) => setRoom(event.target.value)} />
                </div>
                <Link onClick={event => (!name || !room) ? event.preventDefault() : null} to={`/chat?name=${name}&room=${room}&university=${university}&course=${course}`}>
                    <button className="button mt-20" type="submit">Sign In</button>
                </Link>
            </div>
        </div>
    )
}

export default Join;