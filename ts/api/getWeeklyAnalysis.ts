import axios from 'axios';

export const getWeeklyAnalysis = async (userID: number)  => {
    const response = await axios.get(`/LAMPAPI/getWeeklyAnalysis.php?userID=${userID}`);
    return response.data;
};