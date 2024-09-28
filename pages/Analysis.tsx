import React,  { useState, useEffect } from 'react';
import { getWeeklyAnalysis } from '../ts/api/getWeeklyAnalysis';
import {readCookie } from '../ts/index';

const Analysis: React.FC = () => {
    const [analysis,  setAnalysis] = useState<string>("");
    const [userID, setUserID] = useState<number | null>(null);

    useEffect(() => {
        const userInfo = readCookie();
        setUserID(userInfo.userID);

        const fetchAnalysis = async () => {
            if (userInfo.userID > 0) {
            const result = await getWeeklyAnalysis(userInfo.userID); //replace w dynamic
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