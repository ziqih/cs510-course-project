import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css'; // Note: Make sure every .css have different component classNames

import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'
import TextContainer from '../TextContainer/TextContainer'

let socket; 


const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [university, setUniversity] = useState('');
    const [course, setCourse] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const ENDPOINT = 'localhost:5000';

    /**
     * User connects to server and join room
    */
    useEffect(() => {
        const { name, room, university, course } = queryString.parse(location.search);
        console.log(name, room, university, course);
        var roomName = `${university}-${course}-${room}`;

        socket = io(ENDPOINT);

        setName(name);
        setRoom(roomName);
        setUniversity(university);
        setCourse(course);
        
        socket.emit('join', { name, room: roomName }, () => {
            // alert(error);
        } );

        // Receive server message
        socket.on('message', (message) => { 
            setMessages(messages => [...messages, message]);
            socket.on("roomData", ({ users }) => {
                setUsers(users);
              });
        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPOINT, location.search]); // only re-connect when server or URL changed
    

    const sendMessage = (event) => {
        event.preventDefault();
        if (message) {
            socket.emit('sendMessage', message, () => {setMessage('')});
        }
    }

    const getUserInfo = (name) => {
        if (name) {
            socket.emit('getUser', { name }, (message) => {
                 console.log("Get User:", message);
            });
        }
    }

    const likeCourse = (username, university, course) => {
        if (!username || !course || !university) {
            return;
        }
        socket.emit('likeCourse', { name: username, course, university }, (message) => {
            console.log("likeCourse: ", message);
        })
    }

    const unlikeCourse = (username, university, course) => {
        if (!username || !course || !university) {
            return;
        }
        socket.emit('unlikeCourse', { name: username, course, university }, (message) => {
            console.log("unlike Course: ", message);
        })
    }

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} university={university} course={course} likeCourse={likeCourse} unlikeCourse={unlikeCourse} name={name}/>
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
            <TextContainer users={users} getUserInfo={getUserInfo}/>
        </div>
    )
}

export default Chat;