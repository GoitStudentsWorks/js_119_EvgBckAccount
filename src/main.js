import './js/artists.js';
import axios from 'axios';
import iziToast from 'izitoast';
import boxicons from 'boxicons';

import { refs } from './js/refs';
import { closeModal, handleModalOpening } from './js/handlers';


document.addEventListener("DOMContentLoaded", () => {
  const logoLinks = document.querySelectorAll(".logo, .logo-mobile");

  logoLinks.forEach((logo) => {
    logo.addEventListener("click", (e) => {
      e.preventDefault(); // блокуємо стандартний #scroll
      window.location.reload(); // повний reset сторінки
    });
  });
  
  const openBtn = document.getElementById("open-menu");
  const closeBtn = document.getElementById("close-menu");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = mobileMenu?.querySelectorAll(".nav-list-mobile a") || [];

  if (!openBtn || !closeBtn || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.classList.add("open");
    mobileMenu.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    openBtn.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    mobileMenu.classList.remove("open");
    setTimeout(() => mobileMenu.classList.add("hidden"), 300);
    document.body.style.overflow = "";
    openBtn.setAttribute("aria-expanded", "false");
    openBtn.focus(); // повертаємо фокус на бургер
  };

  // Відкрити/закрити
  openBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);

  // Закриття по кліку на пункт меню
  mobileLinks.forEach((a) => a.addEventListener("click", closeMenu));

  // Закриття по кліку поза меню
  document.addEventListener("click", (e) => {
    if (
      mobileMenu.classList.contains("open") &&
      !mobileMenu.contains(e.target) &&
      e.target !== openBtn
    ) {
      closeMenu();
    }
  });

  // Закриття по Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
      closeMenu();
    }
  });

  if (refs.artists) {
  refs.artists.addEventListener('click', handleModalOpening);
}
  
  window.addEventListener("hashchange", () => {
    if (mobileMenu.classList.contains("open")) closeMenu();
  });

  // Закрити при ресайзі на ширину планшета/десктопа
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && mobileMenu.classList.contains("open")) {
      closeMenu();
    }
  });
});

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

