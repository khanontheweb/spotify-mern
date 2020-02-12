import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SearchUser from './components/search-user.component';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Route path="/" exact component={SearchUser} />
      </div>
    </Router>
  );
}

export default App;
