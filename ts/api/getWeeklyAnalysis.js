// getWeeklyAnalysis.js
export async function getWeeklyAnalysis(userID) {
    try {
        const response = await axios.get(`https://98.81.175.225/LAMPAPI/getweeklyanalysis.php?userID=${userID}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly analysis:', error);
        throw error;
    }
}
