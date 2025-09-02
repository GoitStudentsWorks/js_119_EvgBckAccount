import axios from 'axios';

const API_BASE_URL = 'https://sound-wave.b.goit.study/api';
export const LIMIT = 8;

axios.defaults.baseURL = API_BASE_URL;

export async function fetchArtists(page = 1, limit = 8) {
  try {
    const response = await axios.get('/artists', {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Failed to fetch artists:',
      error.message,
      error.response?.status
    );
    return { artists: [], totalArtists: 0 };
  }
}

export async function fetchFeedbacks(limit = 10, page = 1) {
  try {
    const response = await axios.get('/feedbacks', {
      params: { limit, page },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching feedback list:',
      error.message,
      error.response?.status
    );
    throw error;
  }
}

export async function submitFeedback(feedbackData) {
  try {
    const response = await axios.post('/feedbacks', feedbackData);
    return response.data;
  } catch (error) {
    console.error(
      'Error submitting feedback:',
      error.message,
      error.response?.status
    );
    throw error;
  }
}

export async function checkApiStatus() {
  try {
    const response = await axios.get('/feedbacks', {
      params: { limit: 1, page: 1 },
    });
    return { status: 'online', message: 'API is accessible' };
  } catch (error) {
    console.error(
      'API status: Offline, error:',
      error.message,
      error.response?.status
    );
    return { status: 'offline', message: 'API is not accessible' };
  }
}