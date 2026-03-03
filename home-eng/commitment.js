// cards opacity anim
document.addEventListener("DOMContentLoaded", () => {
  const cards = gsap.utils.toArray(".commitment_card");

  cards.forEach((card, i) => {
    const cardBg = card.querySelector(".commitment_card-bg");
    gsap.to(cardBg, {
      opacity: 0.7,
      ease: "none",
      scrollTrigger: {
        trigger: card,
        start: `top top`,
        end: "bottom top",
        scrub: true,
      },
    });
  });
});
// first card of second setion
document.addEventListener("DOMContentLoaded", () => {
  const firstCard = document.querySelectorAll(".commitment_card")[0];
  const toggle = firstCard.querySelector(".commitment_card-drop");
  const cardsHeightCfg = ["16.25rem", "14.31rem", "16.25rem"];
  const tableCards = firstCard.querySelectorAll(".commitment_drop-table-card");
  const cardHead = firstCard.querySelector("h3");
  const cardP = firstCard.querySelector("p");
  const cardBtm = firstCard.querySelector(".commitment_drop-table-text");
  const nums = firstCard.querySelectorAll(".num-anim");

  // Змінна для відстеження чи анімація вже була запущена
  let animationPlayed = false;

  // Створюємо matchMedia
  let mm = gsap.matchMedia();

  // Функція створення timeline анімації для десктопа
  function createDesktopAnimationTimeline() {
    // Встановлюємо початкові стани
    gsap.set(cardHead, { opacity: 0, y: 20 });
    gsap.set(cardP, { opacity: 0, y: 20 });
    gsap.set(cardBtm, { opacity: 0, y: 20 });

    // Створюємо timeline
    let firstCardTl = gsap.timeline({ paused: true });

    firstCardTl.to(cardHead, { opacity: 1, y: 0, duration: 0.5 });
    firstCardTl.to(cardP, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
    firstCardTl.to(cardBtm, { opacity: 1, y: 0, duration: 0.5 }, 0.5);

    // Анімація карток
    tableCards.forEach((k, i) => {
      firstCardTl.to(
        k,
        {
          height: cardsHeightCfg[i],
          duration: 0.5,
        },
        0.3
      );
    });

    // Анімація цілих чисел
    nums.forEach((numEl) => {
      const targetValue = parseInt(numEl.getAttribute("data-num"));
      firstCardTl.to(
        { value: 0 },
        {
          value: targetValue,
          duration: 1.0,
          ease: "power1.in",
          onUpdate: function () {
            numEl.textContent = Math.floor(this.targets()[0].value);
          },
        },
        0.1
      );
    });

    return firstCardTl;
  }

  // Функція створення timeline анімації для мобільних
  function createMobileAnimationTimeline() {
    // Створюємо timeline
    let firstCardTl = gsap.timeline({ paused: true });

    // Анімація цілих чисел
    nums.forEach((numEl) => {
      const targetValue = parseInt(numEl.getAttribute("data-num"));
      firstCardTl.to(
        { value: 0 },
        {
          value: targetValue,
          duration: 1.0,
          ease: "power1.in",
          onUpdate: function () {
            numEl.textContent = Math.floor(this.targets()[0].value);
          },
        },
        0.1
      );
    });

    return firstCardTl;
  }

  // Медіа-запит для екранів більше 991px (анімація по скроллу)
  mm.add("(min-width: 992px)", () => {
    console.log("🟢 Запуск анімації - екран більше 991px");

    const firstCardTl = createDesktopAnimationTimeline();

    // Створюємо ScrollTrigger
    ScrollTrigger.create({
      trigger: firstCard,
      start: "top 70%",
      end: "bottom top",
      onEnter: () => {
        console.log("🔵 ScrollTrigger onEnter");
        firstCardTl.play();
        animationPlayed = true;
      },
    });

    // Cleanup функція
    return () => {
      console.log("🔴 Cleanup - вимкнення анімації для екранів менше 992px");

      // Скидаємо всі GSAP стилі
      gsap.set([cardHead, cardP, cardBtm], { clearProps: "all" });
      tableCards.forEach((card) => {
        gsap.set(card, { clearProps: "all" });
      });

      // Повертаємо числа до початкових значень
      nums.forEach((numEl) => {
        const targetValue = parseInt(numEl.getAttribute("data-num"));
        numEl.textContent = targetValue;
      });
    };
  });

  // Медіа-запит для екранів менше 992px (анімація по кліку)
  mm.add("(max-width: 991px)", () => {
    console.log("🟡 Запуск анімації - екран менше 992px");

    const firstCardTl = createMobileAnimationTimeline();

    // Обробник кліку на toggle
    const handleToggleClick = () => {
      if (!animationPlayed) {
        console.log("🔵 Toggle click - запуск анімації з затримкою");
        // Запускаємо анімацію з затримкою 0.4с
        setTimeout(() => {
          firstCardTl.play();
          animationPlayed = true;
        }, 400);
      }
    };

    toggle.addEventListener("click", handleToggleClick);

    // Cleanup функція
    return () => {
      console.log("🔴 Cleanup - вимкнення анімації для екранів більше 992px");
      toggle.removeEventListener("click", handleToggleClick);

      // Скидаємо всі GSAP стилі
      gsap.set([cardBtm], { clearProps: "all" });
      tableCards.forEach((card) => {
        gsap.set(card, { clearProps: "all" });
      });

      // Повертаємо числа до початкових значень
      nums.forEach((numEl) => {
        const targetValue = parseInt(numEl.getAttribute("data-num"));
        numEl.textContent = targetValue;
      });
    };
  });
});

// second card animation
document.addEventListener("DOMContentLoaded", () => {
  const secondCard = document.querySelectorAll(".commitment_card")[1];
  const toggle = secondCard.querySelector(".commitment_card-drop");
  const blocks = document.querySelectorAll(".commitment_drop-visual-card");
  const cardHead = secondCard.querySelector("h3");
  const cardP = secondCard.querySelector("p");
  const cardBtm = secondCard.querySelector(".commitment_drop-table-text");

  const photos = secondCard.querySelectorAll(".commitment_drop-visual-img");
  const circles = secondCard.querySelectorAll(
    "#circle-1, #circle-2, #circle-3"
  );

  // Змінна для відстеження чи анімація вже була запущена
  let animationPlayed = false;

  // Створюємо matchMedia
  let mm = gsap.matchMedia();

  // Функція створення timeline анімації для десктопа
  function createDesktopAnimationTimeline() {
    // Встановлюємо початкові стани
    gsap.set(cardHead, { opacity: 0, y: 20 });
    gsap.set(cardP, { opacity: 0, y: 20 });
    gsap.set(cardBtm, { opacity: 0, y: 20 });
    circles.forEach((c) => {
      gsap.set(c, { drawSVG: "0%" });
    });
    photos.forEach((p) => {
      gsap.set(p, { opacity: 0, scale: 0.6 });
    });
    blocks.forEach((b) => {
      gsap.set(b, { opacity: 0 });
    });

    // Створюємо timeline
    let secondCardTl = gsap.timeline({ paused: true });

    // Timeline анімації
    blocks.forEach((b) => {
      secondCardTl.to(b, { opacity: 1, duration: 0.3 }, 0);
    });
    secondCardTl.to(cardHead, { opacity: 1, y: 0, duration: 0.5 }, 0);
    secondCardTl.to(cardP, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
    secondCardTl.to(cardBtm, { opacity: 1, y: 0, duration: 0.5 }, 0.5);

    secondCardTl.fromTo(
      circles[0],
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 0.5 },
      0
    );
    secondCardTl.fromTo(
      "#icon-1",
      { scale: 1 },
      {
        scale: 1.2,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      },
      "-=0.2"
    );
    secondCardTl.fromTo(
      circles[1],
      { drawSVG: "0% 0%" },
      { drawSVG: "0% 50%", duration: 0.5 }
    );
    secondCardTl.fromTo(
      "#icon-2",
      { scale: 1 },
      {
        scale: 1.2,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      },
      "-=0.1"
    );
    secondCardTl.fromTo(
      circles[2],
      { drawSVG: "50% 50%" },
      { drawSVG: "50% 150%", duration: 0.5 }
    );
    secondCardTl.fromTo(
      "#icon-2",
      { scale: 1 },
      {
        scale: 1.2,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      },
      "-=0.1"
    );
    secondCardTl.to(circles[1], { drawSVG: "100%", duration: 0.5 });

    secondCardTl.fromTo(
      "#icon-1",
      { scale: 1 },
      {
        scale: 1.2,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      },
      "-=0.1"
    );

    secondCardTl.to(photos[0], { opacity: 1, scale: 1, duration: 0.3 }, 0.15);
    secondCardTl.to(photos[1], { opacity: 1, scale: 1, duration: 0.3 }, 1.2);
    secondCardTl.to(photos[2], { opacity: 1, scale: 1, duration: 0.3 }, 1.8);

    return secondCardTl;
  }

  // Функція створення timeline анімації для мобільних
  function createMobileAnimationTimeline() {
    // Встановлюємо початкові стани (БЕЗ cardHead і cardP)
    gsap.set(cardBtm, { opacity: 0, y: 20 });
    circles.forEach((c) => {
      gsap.set(c, { drawSVG: "0%" });
    });
    photos.forEach((p) => {
      gsap.set(p, { opacity: 0, scale: 0.6 });
    });
    blocks.forEach((b) => {
      gsap.set(b, { opacity: 0 });
    });

    // Створюємо timeline
    let secondCardTl = gsap.timeline({ paused: true });

    // Timeline анімації (БЕЗ cardHead і cardP)
    blocks.forEach((b) => {
      secondCardTl.to(b, { opacity: 1, duration: 0.3 }, 0);
    });
    secondCardTl.to(cardBtm, { opacity: 1, y: 0, duration: 0.5 }, 0);

    secondCardTl.fromTo(
      circles[0],
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 0.5 },
      0
    );
    secondCardTl.fromTo(
      "#icon-1",
      { scale: 1 },
      {
        scale: 1.2,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      },
      "-=0.2"
    );
    secondCardTl.fromTo(
      circles[1],
      { drawSVG: "0% 0%" },
      { drawSVG: "0% 50%", duration: 0.5 }
    );
    secondCardTl.fromTo(
      "#icon-2",
      { scale: 1 },
      {
        scale: 1.2,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      },
      "-=0.1"
    );
    secondCardTl.fromTo(
      circles[2],
      { drawSVG: "50% 50%" },
      { drawSVG: "50% 150%", duration: 0.5 }
    );
    secondCardTl.fromTo(
      "#icon-2",
      { scale: 1 },
      {
        scale: 1.2,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      },
      "-=0.1"
    );
    secondCardTl.to(circles[1], { drawSVG: "100%", duration: 0.5 });

    secondCardTl.fromTo(
      "#icon-1",
      { scale: 1 },
      {
        scale: 1.2,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      },
      "-=0.1"
    );

    secondCardTl.to(photos[0], { opacity: 1, scale: 1, duration: 0.3 }, 0.15);
    secondCardTl.to(photos[1], { opacity: 1, scale: 1, duration: 0.3 }, 1.2);
    secondCardTl.to(photos[2], { opacity: 1, scale: 1, duration: 0.3 }, 2);

    return secondCardTl;
  }

  // Медіа-запит для екранів більше 991px (анімація по скроллу)
  mm.add("(min-width: 992px)", () => {
    console.log("🟢 Запуск анімації - екран більше 991px");

    const secondCardTl = createDesktopAnimationTimeline();

    // Створюємо ScrollTrigger
    ScrollTrigger.create({
      trigger: secondCard,
      start: "top 70%",
      end: "bottom top",
      onEnter: () => {
        console.log("🔵 ScrollTrigger onEnter");
        secondCardTl.play();
        animationPlayed = true;
      },
    });

    // Cleanup функція
    return () => {
      console.log("🔴 Cleanup - вимкнення анімації для екранів менше 992px");
      gsap.set([cardHead, cardP, cardBtm, ...blocks, ...photos, ...circles], {
        clearProps: "all",
      });
    };
  });

  // Медіа-запит для екранів менше 992px (анімація по кліку)
  mm.add("(max-width: 991px)", () => {
    console.log("🟡 Запуск анімації - екран менше 992px");

    const secondCardTl = createMobileAnimationTimeline();

    // Обробник кліку на toggle
    const handleToggleClick = () => {
      if (!animationPlayed) {
        console.log("🔵 Toggle click - запуск анімації з затримкою");
        // Запускаємо анімацію з затримкою 0.4с
        setTimeout(() => {
          secondCardTl.play();
          animationPlayed = true;
        }, 400);
      }
    };

    toggle.addEventListener("click", handleToggleClick);

    // Cleanup функція
    return () => {
      console.log("🔴 Cleanup - вимкнення анімації для екранів більше 992px");
      toggle.removeEventListener("click", handleToggleClick);
      gsap.set([cardBtm, ...blocks, ...photos, ...circles], {
        clearProps: "all",
      });
    };
  });
});

// third card animation
document.addEventListener("DOMContentLoaded", () => {
  const thirdCard = document.querySelectorAll(".commitment_card")[2];
  const toggle = thirdCard.querySelector(".commitment_card-drop");
  const cardHead = thirdCard.querySelector("h3");
  const cardP = thirdCard.querySelector("p");
  const cardBtm = thirdCard.querySelector(".commitment_drop-table-text");

  const tooltips = thirdCard.querySelectorAll(".commitment_drop-lock-tooltip");
  const lock = thirdCard.querySelector(".commitment_drop-lock-img");

  // Змінна для відстеження чи анімація вже була запущена
  let animationPlayed = false;

  // Створюємо matchMedia
  let mm = gsap.matchMedia();

  // Функція створення timeline анімації для десктопа
  function createDesktopAnimationTimeline() {
    // Встановлюємо початкові стани
    gsap.set(cardHead, { opacity: 0, y: 20 });
    gsap.set(cardP, { opacity: 0, y: 20 });
    gsap.set(cardBtm, { opacity: 0, y: 20 });

    gsap.set(lock, { opacity: 0, y: 20 });
    tooltips.forEach((t) => {
      gsap.set(t, { opacity: 0 });
    });

    // Створюємо timeline
    let thirdCardTl = gsap.timeline({ paused: true });

    // Timeline анімації
    thirdCardTl.to(cardHead, { opacity: 1, y: 0, duration: 0.5 }, 0);
    thirdCardTl.to(cardP, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
    thirdCardTl.to(cardBtm, { opacity: 1, y: 0, duration: 0.5 }, 0.5);

    thirdCardTl.to(lock, { opacity: 1, y: 0, duration: 0.5 }, 0);
    thirdCardTl.to(tooltips[0], { opacity: 1, rotate: 0, duration: 0.5 }, 0.3);
    thirdCardTl.to(tooltips[1], { opacity: 1, rotate: 0, duration: 0.5 }, 0.5);
    thirdCardTl.to(tooltips[2], { opacity: 1, rotate: 0, duration: 0.5 }, 0.7);
    thirdCardTl.fromTo(
      lock,
      { scale: 1 },
      {
        scale: 1.1,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      },
      "-=0.1"
    );

    return thirdCardTl;
  }

  // Функція створення timeline анімації для мобільних
  function createMobileAnimationTimeline() {
    // Встановлюємо початкові стани (БЕЗ cardHead і cardP)
    gsap.set(cardBtm, { opacity: 0, y: 20 });

    gsap.set(lock, { opacity: 0, y: 20 });
    tooltips.forEach((t) => {
      gsap.set(t, { opacity: 0 });
    });

    // Створюємо timeline
    let thirdCardTl = gsap.timeline({ paused: true });

    // Timeline анімації (БЕЗ cardHead і cardP)
    thirdCardTl.to(cardBtm, { opacity: 1, y: 0, duration: 0.5 }, 0);

    thirdCardTl.to(lock, { opacity: 1, y: 0, duration: 0.5 }, 0);
    thirdCardTl.to(tooltips[0], { opacity: 1, rotate: 0, duration: 0.5 }, 0.3);
    thirdCardTl.to(tooltips[1], { opacity: 1, rotate: 0, duration: 0.5 }, 0.5);
    thirdCardTl.to(tooltips[3], { opacity: 1, rotate: 0, duration: 0.5 }, 0.7);
    thirdCardTl.fromTo(
      lock,
      { scale: 1 },
      {
        scale: 1.1,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      },
      "-=0.1"
    );

    return thirdCardTl;
  }

  // Медіа-запит для екранів більше 991px (анімація по скроллу)
  mm.add("(min-width: 992px)", () => {
    console.log("🟢 Запуск анімації - екран більше 991px");

    const thirdCardTl = createDesktopAnimationTimeline();

    // Створюємо ScrollTrigger
    ScrollTrigger.create({
      trigger: thirdCard,
      start: "top 70%",
      end: "bottom top",
      onEnter: () => {
        console.log("🔵 ScrollTrigger onEnter");
        thirdCardTl.play();
        animationPlayed = true;
      },
    });

    // Cleanup функція
    return () => {
      console.log("🔴 Cleanup - вимкнення анімації для екранів менше 992px");
      gsap.set([cardHead, cardP, cardBtm, lock, ...tooltips], {
        clearProps: "all",
      });
    };
  });

  // Медіа-запит для екранів менше 992px (анімація по кліку)
  mm.add("(max-width: 991px)", () => {
    console.log("🟡 Запуск анімації - екран менше 992px");

    const thirdCardTl = createMobileAnimationTimeline();

    // Обробник кліку на toggle
    const handleToggleClick = () => {
      if (!animationPlayed) {
        console.log("🔵 Toggle click - запуск анімації з затримкою");
        // Запускаємо анімацію з затримкою 0.4с
        setTimeout(() => {
          thirdCardTl.play();
          animationPlayed = true;
        }, 400);
      }
    };

    toggle.addEventListener("click", handleToggleClick);

    // Cleanup функція
    return () => {
      console.log("🔴 Cleanup - вимкнення анімації для екранів більше 992px");
      toggle.removeEventListener("click", handleToggleClick);
      gsap.set([cardBtm, lock, ...tooltips], { clearProps: "all" });
    };
  });
});

// fourth card animation
document.addEventListener("DOMContentLoaded", () => {
  const fourthCard = document.querySelectorAll(".commitment_card")[3];
  const toggle = fourthCard.querySelector(".commitment_card-drop");
  const cardHead = fourthCard.querySelector("h3");
  const cardP = fourthCard.querySelector("p");
  const tooltips = fourthCard.querySelectorAll(".commitment_drop-tooltip");
  const arrows = fourthCard.querySelectorAll(".commitment_drop-tooltip-arr");
  const lines = fourthCard.querySelectorAll(".commitment_drop-tooltip-l");
  const icon = fourthCard.querySelector("#card-icon-card-4");
  console.log(icon);
  const block = fourthCard.querySelector(".commitment_drop-visual-main");

  // Змінна для відстеження чи анімація вже була запущена
  let animationPlayed = false;

  // Створюємо matchMedia
  let mm = gsap.matchMedia();

  // Функція створення timeline анімації для десктопа
  function createDesktopAnimationTimeline() {
    // Встановлюємо початкові стани
    gsap.set(cardHead, { opacity: 0, y: 20 });
    gsap.set(cardP, { opacity: 0, y: 20 });
    gsap.set(block, { opacity: 0, y: 20 });

    tooltips.forEach((t) => {
      gsap.set(t, { opacity: 0, y: 10 });
    });
    arrows.forEach((a) => {
      gsap.set(a, { opacity: 0 });
    });
    lines.forEach((l) => {
      gsap.set(l, { drawSVG: "0%" });
    });

    // Створюємо timeline
    let fourthCardTl = gsap.timeline({ paused: true });

    // Timeline анімації
    fourthCardTl.to(cardHead, { opacity: 1, y: 0, duration: 0.5 }, 0);
    fourthCardTl.to(cardP, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
    fourthCardTl.to(block, { opacity: 1, y: 0, duration: 0.5 }, 0);

    lines.forEach((line, index) => {
      fourthCardTl.fromTo(
        line,
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 1 },
        index * 0.2
      );
    });

    arrows.forEach((arr, i) => {
      fourthCardTl.to(arr, { opacity: 1, duration: 0.3 }, 1 + i * 0.2);
    });

    tooltips.forEach((t, i) => {
      fourthCardTl.to(t, { opacity: 1, y: 0, duration: 0.3 }, 1.2 + i * 0.2);
    });

    fourthCardTl.add(
      [
        gsap.fromTo(
          block,
          { scale: 1 },
          {
            scale: 1.2,
            duration: 0.15,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
          }
        ),
        gsap.fromTo(
          icon,
          { rotate: 0 },
          {
            rotate: 360,
            duration: 0.3,
            ease: "power2.out",
          }
        ),
      ],
      "-=0.5"
    );

    return fourthCardTl;
  }

  // Функція створення timeline анімації для мобільних
  function createMobileAnimationTimeline() {
    // Встановлюємо початкові стани (БЕЗ cardHead і cardP)
    gsap.set(block, { opacity: 0, y: 20 });

    tooltips.forEach((t) => {
      gsap.set(t, { opacity: 0, y: 10 });
    });
    arrows.forEach((a) => {
      gsap.set(a, { opacity: 0 });
    });
    lines.forEach((l) => {
      gsap.set(l, { drawSVG: "0%" });
    });

    // Створюємо timeline
    let fourthCardTl = gsap.timeline({ paused: true });

    // Timeline анімації (БЕЗ cardHead і cardP)
    fourthCardTl.to(block, { opacity: 1, y: 0, duration: 0.5 }, 0);

    lines.forEach((line, index) => {
      fourthCardTl.fromTo(
        line,
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 1 },
        index * 0.2
      );
    });

    arrows.forEach((arr, i) => {
      fourthCardTl.to(arr, { opacity: 1, duration: 0.3 }, 1 + i * 0.2);
    });

    tooltips.forEach((t, i) => {
      fourthCardTl.to(t, { opacity: 1, y: 0, duration: 0.3 }, 1.2 + i * 0.2);
    });

    fourthCardTl.add(
      [
        gsap.fromTo(
          block,
          { scale: 1 },
          {
            scale: 1.2,
            duration: 0.15,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
          }
        ),
        gsap.fromTo(
          icon,
          { rotate: 0 },
          {
            rotate: 360,
            duration: 0.3,
            ease: "power2.out",
          }
        ),
      ],
      "-=0.5"
    );

    return fourthCardTl;
  }

  // Медіа-запит для екранів більше 991px (анімація по скроллу)
  mm.add("(min-width: 992px)", () => {
    console.log("🟢 Запуск анімації - екран більше 991px");

    const fourthCardTl = createDesktopAnimationTimeline();

    // Створюємо ScrollTrigger
    ScrollTrigger.create({
      trigger: fourthCard,
      start: "top 70%",
      end: "bottom top",
      onEnter: () => {
        console.log("🔵 ScrollTrigger onEnter");
        fourthCardTl.play();
        animationPlayed = true;
      },
    });

    // Cleanup функція
    return () => {
      console.log("🔴 Cleanup - вимкнення анімації для екранів менше 992px");
      gsap.set([cardHead, cardP, block, ...tooltips, ...arrows, ...lines], {
        clearProps: "all",
      });
    };
  });

  // Медіа-запит для екранів менше 992px (анімація по кліку)
  mm.add("(max-width: 991px)", () => {
    console.log("🟡 Запуск анімації - екран менше 992px");

    const fourthCardTl = createMobileAnimationTimeline();

    // Обробник кліку на toggle
    const handleToggleClick = () => {
      if (!animationPlayed) {
        console.log("🔵 Toggle click - запуск анімації з затримкою");
        // Запускаємо анімацію з затримкою 0.4с
        setTimeout(() => {
          fourthCardTl.play();
          animationPlayed = true;
        }, 400);
      }
    };

    toggle.addEventListener("click", handleToggleClick);

    // Cleanup функція
    return () => {
      console.log("🔴 Cleanup - вимкнення анімації для екранів більше 992px");
      toggle.removeEventListener("click", handleToggleClick);
      gsap.set([block, ...tooltips, ...arrows, ...lines], {
        clearProps: "all",
      });
    };
  });
});
