import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import SearchBox from '../Home/SearchBox/SearchBox';
import { Link } from 'react-router-dom';
import QuestionTab from './QuestionTab/QuestionTab';
import ScrollToBottom from 'react-scroll-to-bottom';


import './Questions.css';

let socket; 

const Questions = ( {location} ) => {
    const { university, course } = queryString.parse(location.search);
    const ENDPOINT = 'localhost:5000';
    const [searchQuestion, setSearchQuestion] = useState('');
    const [questions, setQuestions] = useState([]); // search popup list
    const [newSearch, setNewSearch] = useState('');
    const [createTitle, setCreateTitle] = useState('');
    const [createDescription, setCreateDescription] = useState('');
    const [createQuestion, setCreateQuestion] = useState([]);
    const [update, setUpdate] = useState(0); // alert question updates

    const remindCourseUpdate = () => {
        if (update === 0) { // reminds other UseEffects to refresh course list
            setUpdate(update + 1);
        } else {
            setUpdate(update - 1);
        }
    }


    useEffect(() => {
        if (newSearch.length === 0) {
            return;
        }
        socket.emit("searchQuestion", { question: newSearch }, (message)=> {
            console.log("search question: ", newSearch, message);
            // remindSearchUpdate();
            setQuestions(message["questions"]);
            console.log("set", questions);
        });
        
    }, [newSearch]);

    useEffect(() => {
        if (createQuestion.length === 0) {
            return;
        }
        socket.emit("createQuestion", { title: createTitle, description: createDescription }, (message)=> {
            console.log("create question: ", message);
        });
        
    }, [createQuestion]);

   
    useEffect(() => {
        socket = io(ENDPOINT);

        // initially show all questions
        socket.emit('getQuestions', { message: "List Questions" }, (message) => {
            console.log("getQuestions:", message["questions"]);
            setQuestions(message["questions"]);
        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPOINT, location.search]); 
    
    
    

    return (
    <div className="homeOuterContainer">
        <div className="homeInnerContainer">
            <h2 className="heading">Welcome to {university}-{course}</h2>
            <input placeholder=" Search Question here..." className="homeInput" type="text" onChange={(event) => setSearchQuestion(event.target.value)} />
            <button className="button mt-20" type="submit" onClick={(event) => setNewSearch(searchQuestion)}>Search</button>

            {/* List of Questions */}
            <div className="courses">
            <ScrollToBottom>
            {questions.map((question, i) => <div key={i}><QuestionTab question={question} /></div>)}
            </ScrollToBottom>
             </div>
            
            <div>
                <h3 className="heading">Create Question</h3>
                <input placeholder=" Enter title here..." className="homeInput" type="text" onChange={(event) => setCreateTitle(event.target.value)} />
                <input placeholder=" Enter description here..." className="homeInput" type="text" onChange={(event) => setCreateDescription(event.target.value)} />
                <button className="button mt-20" type="submit" onClick={(event) => setCreateQuestion([createTitle, createDescription])}>Create</button>
            </div>
             
        </div>
        

    </div>
    )
}

export default Questions;