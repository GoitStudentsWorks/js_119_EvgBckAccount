import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import 'css-star-rating/css/star-rating.css';
import { fetchFeedbacks } from './api';

let swiper; 

const swiperWrapper = document.querySelector('.swiper-wrapper');
const paginationContainer = document.querySelector('.feedback-pagination');

async function loadFeedbacks() {
  try {
    const response = await fetchFeedbacks(10, 1);
    const feedbacks = response.data;

    feedbacks.forEach(({ rating, descr, name }) => {
      const slide = createFeedbackSlide({ rating, text: descr, user: name });
      swiperWrapper.appendChild(slide);
    });

    initSwiper();
  } catch (error) {
    console.error('Oops...Error', error.message);
  }
}

function createFeedbackSlide({ rating, text, user }) {
  const slide = document.createElement('div');
  slide.classList.add('swiper-slide');
  const roundedRating = Math.round(rating);
  slide.innerHTML = `
    <div class="feedback-card">
      <div class="feedback-stars">${renderStars(roundedRating)}</div>
      <p class="feedback-text">"${text}"</p>
      <p class="feedback-user">${user}</p>
    </div>
  `;
  return slide;
}

function renderStars(count) {
  const max = 5;
  let starsHTML = '';
  for (let i = 1; i <= max; i++) {
    const starClass = i <= count ? 'star-filled' : 'star-outline';
    starsHTML += `
     <svg class="star-icon ${starClass}" width="24" height="24">
        <use href="./img/icons/symbol-defs.svg#${
          i <= count ? 'icon-star-filled' : 'icon-star-outline'
        }"></use>
      </svg>
    `;
  }
  return starsHTML;
}

function initSwiper() {
  swiper = new Swiper('.feedback-swiper', {
    loop: false,
    navigation: {
      nextEl: '.feedback-button-next',
      prevEl: '.feedback-button-prev',
    },
    grabCursor: true,
    on: {
      slideChange: updateCustomPagination,
    },
  });

  renderCustomPagination(); 
  setupPaginationClicks();  
}

function renderCustomPagination() {
  paginationContainer.innerHTML = '';

  const total = swiper.slides.length;
  const current = swiper.activeIndex;

  if (total === 0) return;

  const first = 0;
  const middle = Math.floor(total / 2);
  const last = total - 1;

  const bulletData = [first, middle, last];

  bulletData.forEach(index => {
    const bullet = document.createElement('span');
    bullet.classList.add('swiper-pagination-bullet');
    bullet.setAttribute('data-slide-index', index);
    if (current === index) {
      bullet.classList.add('swiper-pagination-bullet-active');
    }
    paginationContainer.appendChild(bullet);
  });
}

function updateCustomPagination() {
  renderCustomPagination();
}

function setupPaginationClicks() {
  paginationContainer.addEventListener('click', event => {
    const bullet = event.target.closest('.swiper-pagination-bullet');
    if (!bullet) return;
    const index = parseInt(bullet.getAttribute('data-slide-index'), 10);
    swiper.slideTo(index);
  });
}

loadFeedbacks();
