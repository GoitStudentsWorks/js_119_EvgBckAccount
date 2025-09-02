import { refs } from './refs.js';
import {
  getArtistDetails,
  getArtistAlbums,
  showLoader,
  hideLoader,
} from './axios';
import { renderModalContent } from './render.js';

async function openModal(artistId = '65ada69eaf9f6d155db48612') {
  refs.modal.classList.add('active');
  document.body.classList.add('modal-open');
  refs.modalContent.innerHTML =
    '<div class="modal-loading">Loading artist details...</div>';
  showLoader();

  try {
    const [artistData, albumsData] = await Promise.all([
      getArtistDetails(artistId),
      getArtistAlbums(artistId),
    ]);
    refs.modalContent.innerHTML = '';
    renderModalContent(artistData, albumsData);
  } catch (error) {
    refs.modalContent.innerHTML = `<div class="modal-error">Failed to load artist details due to ${error}.</div>`;
  } finally {
    hideLoader();
    if (
      refs.modalContentWrapper.scrollHeight >
      refs.modalContentWrapper.offsetHeight
    ) {
      refs.modalContentWrapper.style.overflowY = 'scroll';
      refs.modalContentWrapper.style.overflowX = 'hidden';
    }
  }
}

export function handleModalOpening(e) {
  let id = '';
  if (
    e.target.nodeName === 'BUTTON' &&
    e.target.classList.contains('artists-learn-more-card-btn')
  ) {
    id = e.target.getAttribute('data-artist-id') || '';
    openModal(id);
    refs.modalClose.addEventListener('click', closeModal);
    refs.modal.addEventListener('click', ev => {
      if (ev.target === refs.modal) {
        closeModal();
      }
    });
  } else {
    return;
  }
}

function clearListeners() {
  refs.modalClose.removeEventListener('click', closeModal);
  refs.modal.removeEventListener('click', ev => {
    if (ev.target === refs.modal) {
      closeModal();
    }
  });
}

export function closeModal() {
  refs.modal.classList.remove('active');
  document.body.classList.remove('modal-open');
  clearListeners();

  setTimeout(() => {
    refs.modalContent.innerHTML = '';
  }, 300);
}
