import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import './App.css';
import Login  from "./components/Login";
import Chats from "./components/Chats";
import { AuthProvider } from "./contexts/AuthContext";

function App() {

  return (
    <div className="bg-dark">
      <Router>
        <AuthProvider>
          <Switch>
            <Route path="/chats" component={Chats} />
            <Route path="/" component={Login} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
