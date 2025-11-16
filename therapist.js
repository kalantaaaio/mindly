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

  let mm = gsap.matchMedia();

  // Десктоп і планшет (min-width: 480px)
  mm.add("(min-width: 480px)", () => {
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
      onEnter: () => {
        secondTooltipTl.play();
      },
    });

    return () => {
      // Очищення при зміні breakpoint
      firstCardTl.kill();
      firstTooltipTl.kill();
      secondTooltipTl.kill();
    };
  });

  // Мобільна версія (max-width: 479.98px)
  mm.add("(max-width: 479.98px)", () => {
    gsap.set(cardOnePar, { opacity: 0, y: 20 });
    gsap.set(cardPhone, { opacity: 0, y: 100 });
    gsap.set(cardTooltipOne, { yPercent: 60, scale: 0.8 }); // Змінено на yPercent
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
      { yPercent: 0, scale: 1, duration: 0.4, ease: "power4.out" }, // Змінено на yPercent
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
      onEnter: () => {
        secondTooltipTl.play();
      },
    });

    return () => {
      // Очищення при зміні breakpoint
      firstCardTl.kill();
      firstTooltipTl.kill();
      secondTooltipTl.kill();
    };
  });
});

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

      const itemCount = items.length;
      const duration = 3;
      const itemDuration = duration / itemCount;

      items.forEach((item, index) => {
        const position = index * itemDuration;
        const smallLine = item.querySelector(".joining_item-line-active");
        const itemNum = item.querySelector(".joining_item-num");

        tl.to(
          line,
          {
            x: (getScrollAmount() / itemCount) * (index + 1),
            duration: itemDuration,
            ease: "none",
          },
          position
        );

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

        if (itemNum) {
          tl.to(itemNum, {
            backgroundColor: "#BFE0DB",
            color: "#029C75",
            duration: 0.2,
            ease: "power1.inOut",
          });
        }

        if (smallLine) {
          tl.to(
            smallLine,
            {
              scaleX: 1,
              duration: 0.5,
              ease: "power2.out",
            },
            "-=0.1"
          );
        }
      });
    }

    return () => {
      // ScrollTrigger автоматично очищується
    };
  });

  // Мобільна версія (max-width: 991.98px)
  mm.add("(max-width: 991.98px)", () => {
    items.forEach((item) => {
      const smallLine = item.querySelector(".joining_item-line-active");
      const itemNum = item.querySelector(".joining_item-num");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 70%",
          end: "bottom 70%",
          scrub: true, // Додано scrub
        },
      });

      // Анімація num
      if (itemNum) {
        tl.to(itemNum, {
          backgroundColor: "#BFE0DB",
          color: "#029C75",
          duration: 0.2,
          ease: "power1.inOut",
        });
      }

      // Анімація лінії з scaleY
      if (smallLine) {
        tl.to(
          smallLine,
          {
            scaleY: 1,
            duration: 0.5,
            ease: "none", // Змінено на "none" для scrub
          },
          "-=0.1"
        );
      }
    });

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
  gsap.to("#heart", {
    scale: 1.1,
    duration: 0.4,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1,
    repeatDelay: 0.2,
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
  gsap.set("#pathSegment1", { drawSVG: "0%" });
  gsap.set("#pathSegment2", { drawSVG: "0% 0%" });
  gsap.set("#pathSegment3", { drawSVG: "0% 0%" });
  gsap.set("#pathSegment4", { drawSVG: "100% 100%" });
  gsap.set(
    ".joining_item-tooltip.is--1, .joining_item-tooltip.is--2, .joining_item-tooltip.is--3",
    { opacity: 0, y: -5 }
  );

  gsap.set("#locationMarker1", { y: -5, x: 5, opacity: 0 });
  gsap.set("#locationMarker2", { y: -3, x: -5, opacity: 0 });
  gsap.set("#locationMarker3", { y: -3, x: 5, opacity: 0 });
  gsap.set("#chat, #calendar, #wallet", { opacity: 0 });

  let pathTl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

  pathTl.to("#pathSegment1", { drawSVG: "100%", duration: 0.5 });
  pathTl.to("#chat", { opacity: 1, duration: 0.1 });
  pathTl.to("#locationMarker1", { y: 0, x: 0, opacity: 1, duration: 0.2 });
  pathTl.to(
    ".joining_item-tooltip.is--1",
    {
      y: 0,
      opacity: 1,
      duration: 0.2,
    },
    ">"
  );
  pathTl.to("#pathSegment2", { drawSVG: "100%", duration: 0.5 }, ">");
  pathTl.to("#calendar", { opacity: 1, duration: 0.1 });
  pathTl.to("#locationMarker2", { y: 0, x: 0, opacity: 1, duration: 0.2 });
  pathTl.to(
    ".joining_item-tooltip.is--2",
    {
      y: 0,
      opacity: 1,
      duration: 0.2,
    },
    ">"
  );
  pathTl.to("#pathSegment3", { drawSVG: "100%", duration: 0.5 }, ">");
  pathTl.to("#wallet", { opacity: 1, duration: 0.1 });
  pathTl.to("#locationMarker3", { y: 0, x: 0, opacity: 1, duration: 0.2 });
  pathTl.to(
    ".joining_item-tooltip.is--3",
    {
      y: 0,
      opacity: 1,
      duration: 0.2,
    },
    ">"
  );
  pathTl.to("#pathSegment4", { drawSVG: "0% 100%", duration: 0.5 }, ">");

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
  // Анімація для останньої картки (min-width: 480px)
  let mmFive = gsap.matchMedia();

  mmFive.add("(min-width: 480px)", () => {
    gsap.set(".joining_item-visuals-5_icon", { opacity: 0, scale: 0.8 });
    gsap.set(".joining_item-visual-5", { scale: 0.8, yPercent: -16 });
    gsap.set(".joining_item-visual-5_text", {
      opacity: 0,
      scale: 0.8,
      xPercent: 20,
    });

    gsap.to(".joining_item-visual-5_circle", {
      backgroundColor: "#02B286",
      duration: 0.3,
      repeat: -1,
      yoyo: true,
      repeatDelay: 0.5,
    });

    let lastCardTL = gsap.timeline({ repeat: -1 });

    lastCardTL.to(".joining_item-visual-5", {
      scale: 1,
      yPercent: 0,
      duration: 1.5,
    });

    lastCardTL.to(".joining_item-visuals-5_icon", {
      opacity: 1,
      scale: 1,
      duration: 0.3,
    });

    lastCardTL.to(".joining_item-visual-5_text", {
      opacity: 1,
      scale: 1,
      xPercent: 0,
      duration: 0.3,
    });

    lastCardTL.to(
      ".joining_item-visuals-5_icon",
      { opacity: 0, duration: 0.3 },
      "+=1.5"
    );

    lastCardTL.to(
      ".joining_item-visual-5_text",
      {
        opacity: 0,
        scale: 0.8,
        xPercent: 20,
        duration: 0.3,
      },
      "<"
    );

    lastCardTL.to(
      ".joining_item-visual-5",
      {
        scale: 0.8,
        yPercent: -16,
        duration: 1.5,
      },
      "+=0.3"
    );

    return () => {
      // Очищення анімацій при зміні breakpoint
      lastCardTL.kill();
    };
  });

  mmFive.add("(max-width: 479.98px)", () => {
    gsap.set(".joining_item-visuals-5_icon", { opacity: 0, scale: 0.7 });
    gsap.set(".joining_item-visual-5", { scale: 0.7, yPercent: -16 });
    gsap.set(".joining_item-visual-5_text", {
      opacity: 0,
      scale: 0.8,
      xPercent: 20,
    });

    gsap.to(".joining_item-visual-5_circle", {
      backgroundColor: "#02B286",
      duration: 0.3,
      repeat: -1,
      yoyo: true,
      repeatDelay: 0.5,
    });

    let lastCardTL = gsap.timeline({ repeat: -1 });

    lastCardTL.to(".joining_item-visual-5", {
      scale: 0.9,
      yPercent: 0,
      duration: 1.5,
    });

    lastCardTL.to(".joining_item-visuals-5_icon", {
      opacity: 1,
      scale: 1,
      duration: 0.3,
    });

    lastCardTL.to(".joining_item-visual-5_text", {
      opacity: 1,
      scale: 1,
      xPercent: 0,
      duration: 0.3,
    });

    lastCardTL.to(
      ".joining_item-visuals-5_icon",
      { opacity: 0, duration: 0.3 },
      "+=1.5"
    );

    lastCardTL.to(
      ".joining_item-visual-5_text",
      {
        opacity: 0,
        scale: 0.8,
        xPercent: 20,
        duration: 0.3,
      },
      "<"
    );

    lastCardTL.to(
      ".joining_item-visual-5",
      {
        scale: 0.7,
        yPercent: -16,
        duration: 1.5,
      },
      "+=0.3"
    );

    return () => {
      // Очищення анімацій при зміні breakpoint
      lastCardTL.kill();
    };
  });
});
