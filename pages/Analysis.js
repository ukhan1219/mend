import { getWeeklyAnalysis } from '../ts/api/getWeeklyAnalysis.js';
import { readCookie } from '../ts/index.js';  // Import the named export

let analysis = "";
let userID = null;

function loadAnalysis() {
    const userInfo = readCookie();
    userID = userInfo.userID;

    if (userID > 0) {
        // Fetch analysis from the server using the API call
        getWeeklyAnalysis(userID).then(result => {
            analysis = result.analysisSummary || "No analysis available";
            document.getElementById('analysis-text').innerText = analysis;
        }).catch(error => {
            console.error("Error fetching analysis: ", error);
            document.getElementById('analysis-text').innerText = "Error fetching analysis.";
        });
    } else {
        document.getElementById('analysis-text').innerText = "User ID not found. Please log in.";
    }
}

// Call this function when the "View Weekly Analysis" button is clicked
window.loadAnalysis = loadAnalysis;
