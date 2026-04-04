const track = document.querySelector(".carousel-track");
const cards = Array.from(document.querySelectorAll(".carousel-card"));
const nextBtn = document.querySelector("[data-next-btn]");
const prevBtn = document.querySelector("[data-prev-btn]");
const dotsContainer = document.querySelector(".progress-carousel");

let index = 0;
let cardWidth = 0;
let isAnimating = false;

function setupInfinite() {
  const clonesBefore = cards.map(card => card.cloneNode(true));
  const clonesAfter = cards.map(card => card.cloneNode(true));

  clonesBefore.forEach(clone => track.prepend(clone));
  clonesAfter.forEach(clone => track.append(clone));
}

function updateSizes() {
  const card = document.querySelector(".carousel-card");
  const gap = 10;

  cardWidth = card.offsetWidth + gap;

  moveTo(index, false);
}

function moveTo(i, animate = true) {
  const visibleCenterOffset = (track.parentElement.offsetWidth / 2) - (cardWidth / 2);

  if (animate) {
    track.style.transition = "transform 0.4s ease";
    isAnimating = true;
  } else {
    track.style.transition = "none";
  }

  track.style.transform = `translateX(${-(i * cardWidth) + visibleCenterOffset}px)`;

  updateActive();
}

function updateActive() {
  const allCards = document.querySelectorAll(".carousel-card");
  const wrappedIndex = ((index % allCards.length) + allCards.length) % allCards.length;

  allCards.forEach(card => card.classList.remove("active"));

  const active = allCards[wrappedIndex];
  if (active) active.classList.add("active");

  updateDots();
}

function checkLoop() {
  const total = document.querySelectorAll(".carousel-card").length;
  const realCount = cards.length;

  if (index >= total - realCount) {
    index -= realCount;
    moveTo(index, false);
    isAnimating = false;
  }

  if (index < realCount) {
    index += realCount;
    moveTo(index, false);
    isAnimating = false;
  }
}

track.addEventListener("transitionend", () => {
  if (!isAnimating) return;
  isAnimating = false;
  checkLoop();
});

nextBtn.addEventListener("click", () => {
  if (isAnimating) return;
  index++;
  moveTo(index);
});

prevBtn.addEventListener("click", () => {
  if (isAnimating) return;
  index--;
  moveTo(index);
});

function createDots() {
  cards.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.classList.add("progress-dot");

    dot.addEventListener("click", () => {
      if (isAnimating) return;
      index = i + cards.length; // центр
      moveTo(index);
    });

    dotsContainer.appendChild(dot);
  });
}

function updateDots() {
  const dots = document.querySelectorAll(".progress-dot");
  const realIndex = ((index - cards.length) % cards.length + cards.length) % cards.length;

  dots.forEach(dot => dot.classList.remove("active"));
  if (dots[realIndex]) dots[realIndex].classList.add("active");
}

function init() {
  setupInfinite();
  createDots();

  index = cards.length; // старт з центру

  updateSizes();
}

window.addEventListener("resize", updateSizes);

init();