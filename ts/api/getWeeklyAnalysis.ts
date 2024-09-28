import axios from 'axios';

export const getWeeklyAnalysis = async (userID: number)  => {
    const response = await axios.get(`/api/getWeeklyAnalysis.php?userID=${userID}`);
    return response.data;
};