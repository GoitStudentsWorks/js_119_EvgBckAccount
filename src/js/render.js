import boxicons from 'boxicons';
import 'boxicons/css/boxicons.min.css';
import simpleSvgPlaceholder from '@cloudfour/simple-svg-placeholder';
import { refs } from './refs';

function formatDuration(ms) {
  if (!ms) return '0:00';

  let totalSeconds = Math.floor(ms / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;

  if (hours > 0) {
    return (
      hours +
      ':' +
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds : seconds)
    );
  }

  return minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
}

function formatYearsActive(start, end) {
  if (start && end) return `${start}–${end}`;
  if (start) return `${start}–present`;
  return 'No information';
}

function getPlaceholderDataUri(text = 'No Image', width = 150, height = 150) {
  const svgString = simpleSvgPlaceholder({
    width,
    height,
    text,
    fontSize: 14,
    fontFamily: '"IBM Plex Sans", sans-serif',
    fillColor: '#ddd',
    textColor: '#aaa',
    backgroundColor: '#f0f0f0',
  });

  const base64 = btoa(svgString);
  return `data:image/svg+xml;base64,${base64}`;
}

export function renderModalContent(artist, albums) {
  const {
    strArtist,
    strArtistThumb,
    intFormedYear,
    intDiedYear,
    strGender,
    intMembers,
    strCountry,
    strBiographyEN,
    genres,
  } = artist;

  const { albumsList } = albums;

  const yearsActive = formatYearsActive(intFormedYear, intDiedYear);

  const genresMarkup = [...genres]
    ? `
  <ul id="genres-list">${genres
    .map(
      genre => `<li class="genre">
          <p class="genre-text">${genre}</p>
        </li>`
    )
    .join('')}</ul>
  `
    : '<ul id="genres-list"></ul>';
  const photoSrc = strArtistThumb || getPlaceholderDataUri('No Image');

  let albumsHTML = '';
  if (albumsList && albumsList.length) {
    albumsHTML = `
      <h3 id="albums-title">Albums</h3>
      <ul id="albums-list">
        ${albumsList.map(album => createAlbumHTML(album)).join('')}
      </ul>
    `;
  }

  const modalContentHTML = `
  <h1 id="artist-name">${strArtist}</h1>
  <div id="modal-artist-photo">
    <img id="artist-photo" src="${photoSrc}" alt="${strArtist}" onerror="this.onerror=null;this.src='${getPlaceholderDataUri()}'"/>
  </div> 
  <div id="artist-intro-wrapper">
    <div id="intro-data">
      <h4 class="artist-details-heading">Years active</h4>
      <p class="artist-details-info">${yearsActive}</p>
      <h4 class="artist-details-heading">Sex</h4>
      <p class="artist-details-info"> ${strGender ? strGender : ''}</p>
      <h4 class="artist-details-heading">Members</h4>
      <p class="artist-details-info"> ${intMembers ? intMembers : ''}</p>
      <h4 class="artist-details-heading">Country</h4>
      <p class="artist-details-info"> ${
        strCountry ? strCountry.slice(strCountry.lastIndexOf(',') + 2) : ''
      }</p>
    </div>
    <div id="bio-data">
      <h4 class="artist-details-heading">Biography</h4>
      <p class="artist-details-info"> ${
        strBiographyEN ? strBiographyEN : ''
      }</p>
    </div>
  </div>
  ${genresMarkup}
  ${albumsHTML}
`;
  refs.modalContent.insertAdjacentHTML('afterbegin', modalContentHTML);
}

function createAlbumHTML(album) {
  const { tracks, strAlbum } = album;
  let tracksHTML = '';
  if (tracks && tracks.length) {
    tracksHTML = `
          <div id="track-list-headers">
            <span>Track</span>
            <span>Time</span>
            <span>Link</span>
          </div>
          <ul>
          ${tracks
            .map(
              ({ strTrack, intDuration, movie }) => `
            <li class="song">
              <span class="track-name">${strTrack}</span>
              <span class="track-duration">${
                formatDuration(intDuration) || 'N/A'
              }</span>
              <span class="track-link">
                ${
                  movie
                    ? `<a href="${movie}" target="_blank" rel="noopener noreferrer">
                      <i class="bx bxl-youtube bx-tada" style="color: #fff"></i>
                    </a>
                    `
                    : '<span></span>'
                }
              </span>
            </li>`
            )
            .join('')}
          </ul>
      `;
  }

  return `
    <li class="album">
      <h4 class="album-details-heading">${strAlbum}</h4>
      ${tracksHTML}
    </li>
  `;
}

// export function renderArtistBioDetails(response) {
//   const {
//     strArtist,
//     strArtistThumb,
//     intFormedYear,
//     intDiedYear,
//     strGender,
//     intMembers,
//     strCountry,
//     strBiographyEN,
//     genres,
//     albumsList,
//   } = response;
//   const indexNullText = `${resp.intFormedYear}-${
//     resp.intDiedYear ? resp.intDiedYear : 'present'
//   }`;

//   const textArray = [
//     indexNullText,
//     strGender,
//     intMembers,
//     strCountry,
//     strBiographyEN,
//   ];
//   refs.artistName.textContent = strArtist;
//   refs.artistPhoto.setAttribute('src', strArtistThumb);
//   refs.artistDetailsInfo.forEach((elem, i) => {
//     elem.textContent = textArray[i];
//   });

//   const genresMarkup = genres
//     .map(
//       genre => `<li class="genre">
//         <p class="genre-text">${genre}</p>
//       </li>`
//     )
//     .join('');
//   refs.genresList.insertAdjacentHTML('beforeend', genresMarkup);

//   const albumsMarkup = albumsList
//     .map(({ strAlbum, tracks }) => {
//       const tracksRendered = tracks
//         .map(({ strTrack, intDuration, movie }) => {
//           const videoCheck = movie
//             ? `<i class="bx bx-youtube"><a href="${movie}"></a></i>`
//             : '';
//           return `
//       <tr class="song">
//                 <td>${strTrack}</td>
//                 <td>${intDuration}</td>
//                 <td>${videoCheck}</td>
//               </tr>
//   `;
//         })
//         .join('');

//       return `
//     <li>
//           <table class="album">
//             <caption class="artist-album-heading">
//               ${strAlbum}
//             </caption>
//             <thead>
//               <tr id="list-headers">
//                 <th>Track</th>
//                 <th>Time</th>
//                 <th>Link</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${tracksRendered}
//             </tbody>
//           </table>
//         </li>
//     `;
//     })
//     .join('');

//   refs.albumsList.insertAdjacentHTML('afterbegin', albumsMarkup);
// }
