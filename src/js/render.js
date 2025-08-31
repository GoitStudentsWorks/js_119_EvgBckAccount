// src/js/render.js
export function showLoader() {
  document.querySelector('.loader-container')?.classList.remove('hidden');
}

export function hideLoader() {
  document.querySelector('.loader-container')?.classList.add('hidden');
}
