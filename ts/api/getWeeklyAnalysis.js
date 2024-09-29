import axios from 'axios';

export async function getWeeklyAnalysis(userID) {
    const response = await axios.get(`https://98.81.175.225/LAMPAPI/getweeklyanalysis.php?userID=${userID}`);
    return response.data;
}
