import axios from 'axios';
import iziToast from 'izitoast';
import boxicons from 'boxicons';

import { refs } from './js/refs';
import { closeModal, handleModalOpening } from './js/handlers';


refs.modalClose.addEventListener('click', closeModal);

refs.modal.addEventListener('click', ev => {
  if (ev.target === refs.modal) {
    closeModal();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && refs.modal.classList.contains('active')) {
    closeModal();
  }
});

