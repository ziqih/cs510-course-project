import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import SearchBox from '../Home/SearchBox/SearchBox';
import { Link } from 'react-router-dom';
import ScrollToBottom from 'react-scroll-to-bottom';


import './Question.css';

let socket; 

const Question = ( {location} ) => {
    const { id } = queryString.parse(location.search);
    const ENDPOINT = 'localhost:5000';
    const [question, setQuestion] = useState({});
    const [answers, setAnswers] = useState([]);
    const [answer, setAnswer] = useState('');
    const [user, setUser] = useState('');
    const [submitAnswer, setSubmitAnswer] = useState([]);

   
    useEffect(() => {
        socket = io(ENDPOINT);

        // initially show all questions
        socket.emit('getQuestion', { id: id, message: "Get Question" }, (message) => {
            console.log("getQuestion:", message["question"]);
            setQuestion(message["question"]);
            setAnswers(message["question"]["answers"]);
        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPOINT, location.search]); 

    const renderRow = (attribute, value) => {
        return (
            <div className="questionContainer" key={attribute}>
                <div className="questionBox">
                    <p className="questionText"><b>{attribute}</b>: {value}</p>
                </div>
            </div>
        );
    }
    
    useEffect(() => {
        if (submitAnswer.length === 0 || submitAnswer[0].length == 0) {
            return;
        }
        socket.emit("addAnswer", { id: id, answer: submitAnswer[0], user: submitAnswer[1] }, (message)=> {
            console.log("create answer", message);
        });
        
    }, [submitAnswer]);
    

    return (
    <div className="homeOuterContainer">
        <div className="homeInnerContainer">
            <h2 className="heading">Question {id}</h2>
              
            {renderRow("Title", question["title"])}
            {renderRow("Description", question["description"])}
            
            <h2 className="answersHeading">Answers</h2>
             <div className="answers">
                <ScrollToBottom>
                    {answers.map((key, i) => {
                    return (
                        <div className="courseContainer" key={i}>
                            <div className="courseBox">
                                <p className="sentText pl-10"><b>{key["user"]}</b></p>
                                <p className="courseText">{key["answer"]}</p>
                            </div>
                        </div>
                        );
                    })}
                </ScrollToBottom>
             </div>
             <h2 className="answersHeading">Answer it</h2>
             <input placeholder=" Username (optional)" className="homeInput" type="text" onChange={(event) => setUser(event.target.value)} />
             <input placeholder=" Enter your answer here..." className="homeInput" type="text" onChange={(event) => setAnswer(event.target.value)} />
             <button className="button mt-20" type="submit" onClick={(event) => setSubmitAnswer([answer, user])}>Submit</button>
        </div>
        

    </div>
    )
}

export default Question;