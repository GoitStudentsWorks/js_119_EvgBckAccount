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

  const modalBiography = strBiographyEN || '';
  const splitAt = modalBiography.indexOf('.', 250);

  const collapsedBio =
    splitAt !== -1
      ? modalBiography.slice(0, splitAt + 1)
      : modalBiography.slice(0, 250);

  let expanded = false;

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
  <div id="modal-top-wrapper">
    <div id="modal-artist-photo">
      <img id="artist-photo" src="${photoSrc}" alt="${strArtist}" onerror="onerror=null;src='${getPlaceholderDataUri()}'"/>
    </div>
    <div id="artist-intro-wrapper">
      <div class="intro-box">
        <h4 class="artist-details-heading">Years active</h4>
        <p class="artist-details-info">${yearsActive}</p>
      </div>
      <div class="intro-box">
        <h4 class="artist-details-heading">Sex</h4>
        <p class="artist-details-info"> ${strGender ? strGender : ''}</p>
      </div>
      <div class="intro-box">
        <h4 class="artist-details-heading">Members</h4>
        <p class="artist-details-info"> ${intMembers ? intMembers : ''}</p>
      </div>
      <div class="intro-box">
        <h4 class="artist-details-heading">Country</h4>        <p class="artist-details-info"> ${
          strCountry ? strCountry.slice(strCountry.lastIndexOf(',') + 2) : ''
        }</p>
      </div>
      <div id="bio-data">
        <h4 class="artist-details-heading">Biography</h4>
        <p class="artist-details-info">${collapsedBio}</p>
        <button type="button" id="bio-load-more">
          <i class="bx bx-caret-down bx-tada-hover" style="color:#fff; background-color:transparent"></i>
        </button>
      </div>
      ${genresMarkup}
    </div>
  </div>
  ${albumsHTML}
`;

  refs.modalContent.insertAdjacentHTML('afterbegin', modalContentHTML);

  const artistBioText = document.querySelector(
    '#bio-data > .artist-details-info'
  );
  const modalBioIcon = document.querySelector('#bio-load-more > .bx');

  document.querySelector('#bio-load-more').addEventListener('click', () => {
    expanded = !expanded;
    if (expanded) {
      artistBioText.textContent = modalBiography;
      modalBioIcon.classList.replace('bx-caret-down', 'bx-caret-up');
    } else {
      artistBioText.textContent = collapsedBio;
      modalBioIcon.classList.replace('bx-caret-up', 'bx-caret-down');
    }
  });
}
