import axios from 'axios';
axios.defaults.baseURL = 'https://sound-wave.b.goit.study/api';

//Artist Details Modal - backend request function
export async function getArtistDetails(id) {
  const details = await axios.get('/artist', {
    params: {
      id: id,
    },
  });

  return details.data;
}
