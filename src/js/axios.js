import axios from 'axios';
import iziToast from 'izitoast';
import { refs } from './refs';
let loadingCount = 0;

axios.defaults.baseURL = 'https://sound-wave.b.goit.study/api';
axios.defaults.timeout = 10000;

export function showLoader() {
  loadingCount++;
  if (refs.loader && loadingCount === 1) {
    refs.loader.classList.add('active');
  }
}

export function hideLoader() {
  loadingCount = Math.max(0, loadingCount - 1);
  if (refs.loader && loadingCount === 0) {
    refs.loader.classList.remove('active');
  }
}

export function showError(message, title = 'Error') {
  iziToast.error({
    title,
    message,
    position: 'topRight',
    timeout: 7000,
  });
}

export function showSuccess(message, title = 'Success') {
  iziToast.success({
    title,
    message,
    position: 'topRight',
    timeout: 2000,
  });
}

// axios.interceptors.request.use(
//   config => {
//     showLoader();
//     return config;
//   },
//   error => {
//     hideLoader();
//     showError('Request error');
//     return Promise.reject(error);
//   }
// );

// axios.interceptors.response.use(
//   response => {
//     hideLoader();
//     return response;
//   },
//   error => {
//     hideLoader();
//     const message = error.response
//       ? `Error ${error.response.status}: ${error.response.statusText}`
//       : 'Network error, please check your connection';
//     showError(message);
//     return Promise.reject(error);
//   }
// );

export async function getArtistDetails(id) {
  const response = await axios.get(`/artists/${id}`);
  console.log(response.data);
  return response.data;
}

export async function getArtistAlbums(id) {
  const response = await axios.get(`/artists/${id}/albums`);
  return response.data;
}
