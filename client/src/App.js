import React from 'react';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {PAGE_HOME, PAGE_LOGIN, PAGE_MESSAGES, PAGE_PROFILE, PAGE_SIGNUP} from "./config.js";
import Home from "./features/pages/Home";
import Login from "./features/pages/Login";
import Signup from "./features/pages/Signup";
import Profile from "./features/pages/Profile";
import Messages from "./features/pages/Messages";
import Header from "./features/components/header/Header";

function App() {

    return (
        <div className={"w-full h-screen bg-gray-200 flex flex-col items-center relative overflow-y-auto"}>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/"
                           element={<Navigate to={PAGE_LOGIN} replace />} />
                    <Route path={`${PAGE_LOGIN}`} element={<Login />} />
                    <Route path={`${PAGE_SIGNUP}`} element={<Signup />} />
                    <Route path={`${PAGE_HOME}`} element={<Home />} />
                    <Route path={`${PAGE_PROFILE}/:username`} element={<Profile />} />
                    <Route path={`${PAGE_MESSAGES}`} element={<Messages />} />
                </Routes>
            </BrowserRouter>
        </div>

    );
}

export default App;
