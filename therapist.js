console.log("sdfs");

// loading-tl з clearProps для кнопок
document.addEventListener("DOMContentLoaded", () => {
  const loadContainer = document.querySelector(".hero_container");
  const buttons = loadContainer.querySelectorAll(".btn-main, .btn-secondary");
  const mainTitle = document.querySelector("#main-title");
  const statsticsItems = document.querySelectorAll(
    ".therapists_statistics-item"
  );
  const bottom = document.querySelectorAll(
    ".therapists_statistics-item, .therapists_statistics-devider, .hero-therapist-link"
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

//join section
//join section
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".joining_container");
  const line = gallery.querySelector(".joining_contain");
  const items = gallery.querySelectorAll(".joining_item");

  let mm = gsap.matchMedia();

  mm.add("(min-width: 992px)", () => {
    const galleryWidth = gallery.offsetWidth;
    const lineWidth = line.scrollWidth;

    // Перевірка: чи довжина line більша за довжину gallery
    if (lineWidth > galleryWidth) {
      function getScrollAmount() {
        return -(lineWidth - galleryWidth);
      }

      // Створюємо timeline замість простого tween
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gallery,
          pin: true,
          start: "top top",
          end: () => `+=${getScrollAmount() * -1}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // Ділимо timeline на частини для кожного item
      const itemCount = items.length;
      const duration = 3; // Загальна тривалість
      const itemDuration = duration / itemCount; // Тривалість на кожен item

      items.forEach((item, index) => {
        const position = index * itemDuration; // Позиція в timeline
        const smallLine = item.querySelector(".joining_item-line-active");
        const itemNum = item.querySelector(".joining_item-num");

        // Анімація горизонтального скролу
        tl.to(
          line,
          {
            x: (getScrollAmount() / itemCount) * (index + 1),
            duration: itemDuration,
            ease: "none",
          },
          position
        );

        // Анімація num для всіх елементів
        if (itemNum) {
          tl.to(
            itemNum,
            {
              backgroundColor: "#BFE0DB",
              color: "#029C75",
              duration: 0.1,
              ease: "power1.inOut",
            },
            position
          );
        }

        // Анімація лінії для ВСІХ елементів (включаючи перший)
        if (smallLine) {
          tl.to(
            smallLine,
            {
              scaleX: 1,
              duration: itemDuration,
              ease: "none",
            },
            position
          );
        }
      });
    } else {
      // Випадок без горизонтального скролу - послідовна анімація
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gallery,
          start: "top center",
          end: "bottom center",
          toggleActions: "play none none reverse",
        },
      });

      items.forEach((item, index) => {
        const smallLine = item.querySelector(".joining_item-line-active");
        const itemNum = item.querySelector(".joining_item-num");

        // Анімація num (0.2с)
        if (itemNum) {
          tl.to(itemNum, {
            backgroundColor: "#BFE0DB",
            color: "#029C75",
            duration: 0.2,
            ease: "power1.inOut",
          });
        }

        // Анімація лінії (0.5с) - одразу після num
        if (smallLine) {
          tl.to(
            smallLine,
            {
              scaleX: 1,
              duration: 0.5,
              ease: "power2.out",
            },
            "-=0.1"
          ); // Невелике перекриття для плавності
        }
      });
    }

    return () => {
      // ScrollTrigger автоматично очищується
    };
  });
});

// items animation
document.addEventListener("DOMContentLoaded", () => {
  // item-1
  gsap.to("#whrite-text", {
    duration: 1,
    text: {
      value: "Hi! I’m Hanna",
    },
    repeat: -1,
    repeatDelay: 2,
  });
  //item-2
  const toolpits = document.querySelectorAll(".joining_item-visual-2_card");
  const duration = 0.5;
  const delay = 1.3;
  const dd = duration + delay;
  const cardsPerView = 3;
  let activeIndex = -1;
  let zIndex = 800;

  const tl = gsap.timeline({
    defaults: { duration: duration, ease: "power1.inOut" },
  });

  for (let i = 0; i < toolpits.length + cardsPerView; i++) {
    activeIndex++;
    if (activeIndex === toolpits.length) activeIndex = 0;
    const item = toolpits[activeIndex];
    zIndex--;
    tl.set(
      item,
      {
        scale: 1,
        yPercent: 0,
        "--card-opacity": 0.4,
        opacity: 1,
        filter: "blur(0rem)",
        delay: 0,
        zIndex: zIndex,
      },
      i * dd
    );
    tl.to(item, { scale: 1.3, yPercent: -50, "--card-opacity": 0.2 }, "<" + dd);
    tl.to(item, { scale: 1.6, yPercent: -100, "--card-opacity": 0 }, "<" + dd);
    tl.to(
      item,
      { scale: 1.3, yPercent: -150, opacity: 0, filter: "blur(0.5rem)" },
      "<" + dd
    );
  }

  const mainTl = gsap.timeline({
    repeat: -1,
    onUpdate: () => {
      const offset = dd * cardsPerView;
      if (tl.time() < offset - delay || tl.time() > tl.duration() - offset) {
        tl.time(offset - delay);
      }
    },
  });
  mainTl.to(tl, { duration: tl.duration(), ease: "none" });

  //item-3
  //item-4
  gsap.set("#signature", {
    attr: {
      fill: "none",
      stroke: "white",
      "stroke-width": 1.2,
    },
    drawSVG: "100% 100%",
  });
  gsap.to("#signature", {
    drawSVG: "0% 100%",
    duration: 2,
    ease: "none",
    repeat: -1,
    repeatDelay: 2,
  });

  gsap.set("#approve", { drawSVG: "100% 100%" });
  gsap.to("#approve", {
    drawSVG: "0% 100%",
    duration: 1,
    repeat: -1,
    repeatDelay: 3,
  });

  gsap.to(".joining_item-visual-active", {
    rotate: -15,
    duration: 2,
    yoyo: true,
    repeat: -1,
  });

  //item-5
  gsap.to(".joining_item-visual-5_circle", {
    backgroundColor: "#02B286",
    duration: 0.3,
    repeat: -1,
    yoyo: true,
    repeatDelay: 0.5, // затримка між повтореннями
  });
});
