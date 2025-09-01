import { openModal } from './modal.js';

export async function handleModalOpening(e) {
  const btn = e.target.closest('.artists-learn-more-card-btn');
  if (!btn) return;

  const id = btn.getAttribute('data-artist-id') || '';
  if (id) {
    openModal(id);
  } else {
    console.warn('Artist ID not found');
  }
}
