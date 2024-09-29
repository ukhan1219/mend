import React, { useState, useEffect } from 'react';
import { getWeeklyAnalysis } from '../ts/api/getWeeklyAnalysis.js';
import readCookie from '../dist/index.js';

const Analysis = () => {
    const [analysis, setAnalysis] = useState("");
    const [userID, setUserID] = useState(null);

    useEffect(() => {
        const userInfo = readCookie();
        setUserID(userInfo.userID);

        const fetchAnalysis = async () => {
            if (userInfo.userID > 0) {
                const result = await getWeeklyAnalysis(userInfo.userID); // replace w dynamic
                setAnalysis(result.analysisSummary || "No analysis available"); 
            } else {
                setAnalysis("User ID not found. Please Log In.");
            }
        };

        fetchAnalysis();
    }, []);

    return (
        <div>
            <h1>Your Weekly Analysis</h1>
            <p>{analysis}</p>
        </div>
    );
};

export default Analysis;
