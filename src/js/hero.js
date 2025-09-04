document.addEventListener('DOMContentLoaded', () => {
  // Получаем колонки, в которые будут вставляться карточки артистов
  const heroColumnOne = document.querySelector('.hero-column-one');
  const heroColumnTwo = document.querySelector('.hero-column-two');

  // Прерываем выполнение, если колонки не найдены
  if (!heroColumnOne || !heroColumnTwo) return;

  // Получаем все карточки артистов и сортируем их по data-artist-index
  const allArtistCards = Array.from(document.querySelectorAll('.hero-artist-card')).sort((a, b) => {
    return parseInt(a.dataset.artistIndex) - parseInt(b.dataset.artistIndex);
  });

  // Создаем копию массива карточек — он будет использоваться для текущего порядка
  let currentOrder = [...allArtistCards];

  // Функция для ротации карточек
  const rotateArtists = () => {
    // Запоминаем текущие позиции каждой карточки (до перестановки)
    const firstPositions = new Map();
    currentOrder.forEach(card => {
      firstPositions.set(card.dataset.artistIndex, card.getBoundingClientRect());
    });

    // Циклически сдвигаем карточки на 2 позиции вперед (примерно как в исходном коде)
    const newOrder = currentOrder.slice(2).concat(currentOrder.slice(0, 2));
    currentOrder = newOrder;

    // Очищаем обе колонки перед вставкой новых карточек
    heroColumnOne.replaceChildren();
    heroColumnTwo.replaceChildren();

    // Вставляем карточки в колонки по очереди: чётные в левую, нечётные в правую
    currentOrder.forEach((card, index) => {
      const targetColumn = index % 2 === 0 ? heroColumnOne : heroColumnTwo;
      targetColumn.appendChild(card);
    });

    // Анимируем плавный переход карточек к новым позициям
    currentOrder.forEach(card => {
      const lastPosition = card.getBoundingClientRect(); // Новая позиция
      const firstPosition = firstPositions.get(card.dataset.artistIndex); // Старая позиция

      // Если старая позиция не найдена — сбрасываем transform
      if (!firstPosition) {
        card.style.transform = '';
        return;
      }

      // Вычисляем разницу координат (смещение)
      const deltaX = firstPosition.left - lastPosition.left;
      const deltaY = firstPosition.top - lastPosition.top;

      // Сначала мгновенно "прыгаем" на старую позицию без анимации
      card.style.transition = 'none';
      card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

      // Форсируем пересчёт стилей (иначе анимация может не сработать)
      card.offsetWidth;

      // Затем плавно возвращаем карточку в новую позицию
      card.style.transition = 'transform 2s ease-in-out';
      card.style.transform = 'translate(0, 0)';
    });
  };

  // Идентификатор интервала для последующей очистки
  let animationIntervalId;

  // Запуск анимации: первая итерация с задержкой, затем по интервалу
  const startAnimation = (initialDelay = 1000, subsequentDelay = 4000) => {
    clearInterval(animationIntervalId); // Очищаем прошлый интервал, если был

    // Запускаем первую перестановку с начальной задержкой
    setTimeout(() => {
      rotateArtists();
      // Запускаем регулярную ротацию
      animationIntervalId = setInterval(rotateArtists, subsequentDelay);
    }, initialDelay);
  };

  // Запускаем анимацию при загрузке страницы
  startAnimation();

  // Получаем кнопку "Explore" и секцию артистов
  const exploreBtn = document.querySelector('.explore-btn');
  const artistsSection = document.getElementById('artist-section');

  // Если элементы найдены, добавляем плавную прокрутку при клике
  if (exploreBtn && artistsSection) {
    exploreBtn.addEventListener('click', event => {
      event.preventDefault(); // Отменяем стандартное поведение ссылки
      artistsSection.scrollIntoView({ behavior: 'smooth' }); // Плавно прокручиваем к секции
    });
  }
});



