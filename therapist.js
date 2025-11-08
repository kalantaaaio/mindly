// loading-tl з clearProps для кнопок
document.addEventListener("DOMContentLoaded", () => {
  const loadContainer = document.querySelector(".hero_container");
  const buttons = loadContainer.querySelectorAll(".btn-main, .btn-secondary");
  const mainTitle = document.querySelector("#main-title");
  const statsticsItems = document.querySelectorAll(
    ".therapists_statistics-item"
  );
  const bottom = document.querySelectorAll(
    ".therapists_statistics-item, .therapists_statistics-devider, .hero-therepist-link"
  );
  const splitText = SplitText.create(mainTitle, {
    type: "lines",
    mask: "lines",
    linesClass: "split-line",
    autoSplit: true,
  });

  // Main timeline
  const masterTl = gsap.timeline();
  // Початкові стани
  gsap.set(buttons, { opacity: 0, y: 20 });
  gsap.set(splitText.lines, { opacity: 0, yPercent: 100 });
  gsap.set(bottom, { opacity: 0, y: 20 });
  // Show main title and split text animation
  masterTl
    .set(mainTitle, { opacity: 1 })
    .to(splitText.lines, {
      yPercent: 0,
      opacity: 1,
      duration: 1,
      ease: "power4.out",
      stagger: 0.15,
    })
    .to(
      buttons,
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
        onComplete: () => {
          // Очищуємо всі GSAP inline стилі для кнопок
          gsap.set(buttons, {
            clearProps: "transform,opacity,y",
            opacity: 1,
          });

          // Додаємо клас для позначення завершення анімації (опціонально)
          buttons.forEach((btn) => {
            btn.classList.add("gsap-animation-complete");
          });
        },
      },
      "-=0.5"
    );
  gsap.to(bottom, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: "power4.out",
    stagger: 0.2,
  });
  // Анімація лічильників у статистиці
  statsticsItems.forEach((card) => {
    const numEl = card.querySelector(".text-num");
    const targetNum = parseInt(numEl.dataset.num);

    // Створюємо об'єкт для анімації
    const counter = { value: 0 };

    gsap.to(counter, {
      value: targetNum,
      duration: 3,
      ease: "none",
      onUpdate: function () {
        const formattedNum = Math.floor(counter.value).toLocaleString("en-US");
        numEl.textContent = formattedNum;
      },
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const platform = document.querySelector(".platform_contain");
  const cards = platform.querySelectorAll(".platform_item");
  const cardOne = cards[0];
  const cardTwo = cards[1];

  const cardOnePar = cardOne.querySelector(".u-flex-vert-16");
  const cardPhone = cardOne.querySelector("img");
  const cardTooltipOne = cardTwo.querySelector(".platform_item-tooltip-1");
  const bell = cardTooltipOne.querySelector(".platform_item-tooltip-img");
  const tooltipOneText = cardTooltipOne.querySelector("p");

  const cardTooltipTwo = cardTwo.querySelector(".platform_item-tooltip-2");
  const starRatingTwo = cardTooltipTwo.querySelector(".star-rating-white");
  const starNumber = cardTooltipTwo.querySelector(".rating-tooltip");
  const targetNum = 4.9;
  // Створюємо об'єкт для анімації
  const counter = { value: 0 };

  gsap.set(cardOnePar, { opacity: 0, y: 20 });
  gsap.set(cardPhone, { opacity: 0, y: 100 });
  gsap.set(cardTooltipOne, { xPercent: 40 });
  gsap.set(tooltipOneText, { opacity: 0, y: 10 });
  gsap.set(bell, { rotate: 8 });
  gsap.set(starRatingTwo, {
    clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
  });
  let firstCardTl = gsap.timeline({ paused: true });

  firstCardTl.to(cardOnePar, { opacity: 1, y: 0, duration: 0.3 });
  firstCardTl.to(cardPhone, { opacity: 1, y: 0, duration: 0.7 }, 0);

  ScrollTrigger.create({
    trigger: cardOne,
    start: "top 70%",
    onEnter: () => {
      firstCardTl.play();
    },
  });

  let firstTooltipTl = gsap.timeline({ paused: true });

  firstTooltipTl.to(bell, {
    rotate: -8,
    duration: 0.8,
    yoyo: true,
    repeat: -1,
  });
  firstTooltipTl.to(
    cardTooltipOne,
    { xPercent: 0, duration: 0.4, ease: "power4.out" },
    0.5
  );
  firstTooltipTl.to(tooltipOneText, { opacity: 1, y: 0, duration: 0.2 }, 0.9);

  ScrollTrigger.create({
    trigger: cardTooltipOne,
    start: "top 60%",

    onEnter: () => {
      firstTooltipTl.play();
    },
  });

  let secondTooltipTl = gsap.timeline({ paused: true });

  secondTooltipTl.to(starRatingTwo, {
    clipPath: "polygon(100% 0%, 100% 0, 100% 100%, 100% 100%)",
    duration: 1.5,
    ease: "none",
  });
  secondTooltipTl.to(
    counter,
    {
      value: targetNum,
      duration: 1.5,
      ease: "power1.out",
      onUpdate: function () {
        const formattedNum = counter.value.toFixed(1);
        starNumber.textContent = formattedNum;
      },
    },
    0
  );

  ScrollTrigger.create({
    trigger: cardTooltipTwo,
    start: "top 70%",
    markers: true,
    onEnter: () => {
      secondTooltipTl.play();
    },
  });
});
