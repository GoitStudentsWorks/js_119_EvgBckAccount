// src/js/artists.js
// Працює без модалки. Рендерить 8 карток, Load More підвантажує ще.
// Іконки у <use> очікуються у public/ (наприклад: public/icons.svg, public/img/artists.svg)

import axios from 'axios';

// Базова адреса API
axios.defaults.baseURL = 'https://sound-wave.b.goit.study/api';

const LIMIT = 8;
let currentPage = 1;

window.addEventListener('DOMContentLoaded', initArtists);

function qs(sel) { return document.querySelector(sel); }

async function initArtists() {
  const listEl = qs('.artists-list');
  const loadBtn = qs('.artists-load-more-btn');
  const loaderEl = qs('.loader');

  if (!listEl || !loadBtn) {
    console.error('[artists] .artists-list або .artists-load-more-btn не знайдено у DOM');
    return;
  }

  // Початковий рендер
  await renderPage(1);

  // Події
  loadBtn.addEventListener('click', onLoadMore);
  listEl.addEventListener('click', onArtistCardClick);

  async function onLoadMore() {
    showLoader(true);
    loadBtn.style.display = 'none';

    currentPage += 1;
    const items = await fetchArtists(currentPage, LIMIT);

    listEl.insertAdjacentHTML('beforeend', createArtistsMarkup(items));
    toggleLoadMore(loadBtn, items.length);

    showLoader(false);
    if (loadBtn.style.display !== 'none') loadBtn.style.display = 'flex';
  }

  function showLoader(on) {
    loaderEl?.classList.toggle('visually-hidden', !on);
  }
}

async function renderPage(page) {
  const listEl = qs('.artists-list');
  const loadBtn = qs('.artists-load-more-btn');
  const loaderEl = qs('.loader');

  loaderEl?.classList.remove('visually-hidden');

  const items = await fetchArtists(page, LIMIT);
  listEl.innerHTML = createArtistsMarkup(items);
  toggleLoadMore(loadBtn, items.length);

  loaderEl?.classList.add('visually-hidden');
}

async function fetchArtists(page = 1, limit = LIMIT) {
  try {
    const { data } = await axios.get('/artists', {
      params: { page, limit },
      headers: { Accept: 'application/json' },
    });

    // Нормалізація форми відповіді
    const list = Array.isArray(data) ? data
      : Array.isArray(data?.artists) ? data.artists
      : Array.isArray(data?.results) ? data.results
      : data?.items ?? [];

    return list;
  } catch (e) {
    console.error('[artists] fetchArtists error:', e);
    return []; // фолбек, щоб рендер не падав
  }
}

function toggleLoadMore(btn, receivedLen) {
  // Якщо прийшло менше за limit — ховаємо кнопку
  btn.style.display = receivedLen < LIMIT ? 'none' : 'flex';
}

// ==== шаблон та хелпери ====

function createArtistsMarkup(arr = []) {
  return arr.map(({ _id, genres, strArtist, strArtistThumb, strBiographyEN }) => {
    const img = strArtistThumb || './img/placeholders/artist@1x.jpg'; // поклади плейсхолдер у public/img/placeholders/
    const name = strArtist || 'Unknown';
    const tags = toGenresArray(genres)
      .map(g => `<li class="artists-genres-item">${escapeHtml(cleanText(g))}</li>`)
      .join('');

    return `
<li class="artists-card-item">
  <img class="artists-image" src="${img}" alt="${escapeHtml(name)}" loading="lazy" />
  <ul class="artists-genres-list">${tags}</ul>
  <p class="artists-name">${escapeHtml(name)}</p>
  <p class="artists-information">${textClamp(strBiographyEN || '', 144)}</p>
  <button class="artists-learn-more-card-btn open-artist-modal" data-artist-id="${_id}">
    Learn More
    <svg class="caret-right-icon" width="8" height="16" aria-hidden="true" focusable="false">
      <use href="./icons-artists.svg#icon-caret-right"></use>
    </svg>
  </button>
</li>`;
  }).join('');
}

function toGenresArray(genres) {
  if (Array.isArray(genres)) return genres;
  if (typeof genres === 'string') {
    return genres.split(/[,/]/).map(s => s.trim()).filter(Boolean);
  }
  return [];
}

function cleanText(text = '') { return String(text).replace(/[,/]/g, ' '); }

function textClamp(text = '', maxDesktop = 144) {
  const w = window.innerWidth;
  const max = w < 768 ? 60 : w < 1440 ? 160 : maxDesktop;
  const s = String(text);
  return s.length > max ? s.slice(0, max) + '…' : s;
}

function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

// ==== тимчасово БЕЗ модалки ====
// Просто логай клік по "Learn More", щоб перевірити, що все працює
function onArtistCardClick(e) {
  const btn = e.target.closest('.open-artist-modal');
  if (!btn) return;
  const id = btn.dataset.artistId;
  if (id) console.log('[artists] clicked id:', id);
}
