import axios from 'axios';

export async function getWeeklyAnalysis(userID) {
    const response = await fetch(`https://98.81.175.225/LAMPAPI/getWeeklyAnalysis.php?userID=${userID}`);
    const result = await response.json();
    return result;
}
