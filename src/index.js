import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import './css/reset.css';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Home from './components/Home.js';
import NewEntrance from './components/NewEntrance.js';
import NewExit from './components/NewExit.js';
import EditTransaction from './components/EditTransaction.js';

import UserContext from './contexts/UserContext.js';

function App() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        token: ""
    });

    return (
        <BrowserRouter>
            <UserContext.Provider value={{ user, setUser }}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/add/entrance" element={<NewEntrance />} />
                    <Route path="/add/exit" element={<NewExit />} />
                    <Route path="/edit/:transactionId" element={<EditTransaction />} />
                </Routes>
            </UserContext.Provider>
        </BrowserRouter>
    )
}

ReactDOM.render(<App />, document.querySelector(".root"));