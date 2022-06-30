import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import './css/reset.css';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Home from './components/Home.js';
import NewEntrance from './components/Entrance/NewEntrance.js';
import EditEntrance from './components/Entrance/EditEntrance.js';
import NewExit from './components/Exit/NewExit.js';
import EditExit from './components/Exit/EditExit.js';

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
                    <Route path="/entrance/add" element={<NewEntrance />} />
                    <Route path="/exit/add" element={<NewExit />} />
                    <Route path="/entrance/edit/:entranceId" element={<EditEntrance />} />
                    <Route path="/exit/edit/:exitId" element={<EditExit />} />
                </Routes>
            </UserContext.Provider>
        </BrowserRouter>
    )
}

ReactDOM.render(<App />, document.querySelector(".root"));