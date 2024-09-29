import { getWeeklyAnalysis } from '../ts/api/getWeeklyAnalysis.js';
import readCookie from '../ts/index.js';  // Adjust path as needed

// Manually managing state with variables
let analysis = "";
let userID = null;

function loadAnalysis() {
    const userInfo = readCookie();
    userID = userInfo.userID;

    if (userID > 0) {
        getWeeklyAnalysis(userID).then(result => {
            analysis = result.analysisSummary || "No analysis available";
            document.getElementById('analysis').innerText = analysis;
        });
    } else {
        document.getElementById('analysis').innerText = "User ID not found. Please log in.";
    }
}

// Call this function when the page loads
window.onload = function() {
    loadAnalysis();
};
