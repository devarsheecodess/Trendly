import React, { useState, useEffect } from 'react'
import axios from 'axios';

const Dashboard = () => {
    const [id, setId] = useState(localStorage.getItem('userId'));
    const [google, setGoogle] = useState(localStorage.getItem('google'));
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    function getCookieValue(cookieName) {
        console.log(2)
        const cookies = document.cookie.split("; ");
        const cookie = cookies.find(row => row.startsWith(`${cookieName}=`));
        return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
    }

    useEffect(() => {
        if (google && !id) {
            const userId = getCookieValue("userId");
            localStorage.setItem('userId', userId);
            setId(userId);
        }
    })

    useEffect(() => {
    }, [id])

    return (
        <div>
            <h1>Welcome to the dashboard {id}</h1>
        </div>
    )
}

export default Dashboard
