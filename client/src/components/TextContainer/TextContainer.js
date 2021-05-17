import React from 'react';
import { Link } from 'react-router-dom';

import onlineIcon from '../../icons/onlineIcon.png';

import './TextContainer.css';

const TextContainer = ({ users, getUserInfo }) => (
  <div className="textContainer">
    {
      users
        ? (
          <div>
            <h1>Room Members:</h1>
            <div className="activeContainer">
              <h2>
                {users.map(({name}) => (
                  <div key={name} className="activeItem">
                    <Link onClick={event => (!name) ? event.preventDefault() : getUserInfo(name)} to={`/user?name=${name}`}>{name}</Link>
                    <img alt="Online Icon" src={onlineIcon}/>
                  </div>
                ))}
              </h2>
            </div>
          </div>
        )
        : null
    }
  </div>
);

export default TextContainer;