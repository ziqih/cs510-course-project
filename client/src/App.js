import React from 'react';

import Chat from './components/Chat/Chat';
import Join from './components/Join/Join';
import Home from './components/Home/Home';
import Edit from './components/Edit/Edit';
import User from './components/User/User';
import Questions from './components/Questions/Questions';
import Question from './components/Question/Question';

import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {
    console.log("start App");
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/questions" exact component={Questions} />
      <Route path="/question" exact component={Question}/>
      <Route path="/join" exact component={Join} />
      <Route path="/chat" component={Chat} />
      <Route path="/edit" component={Edit} />
      <Route path="/user" component={User} />
    </Router>
  );
}

export default App;