document.addEventListener("DOMContentLoaded", () => {
  // ACCESSIBILITY: Перевірка prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    gsap.set("[data-text-animation]", { opacity: 1 });
    console.log("Animations disabled due to prefers-reduced-motion");
    return;
  }

  // Чекаємо завантаження шрифтів
  document.fonts.ready.then(() => {
    const allElements = gsap.utils.toArray("[data-text-animation]");

    allElements.forEach((element) => {
      const animationType = element.getAttribute("data-text-animation");

      try {
        applyAnimation(animationType, element);
      } catch (error) {
        console.error(`Animation failed for element:`, element, error);
        gsap.set(element, { opacity: 1 });
      }
    });

    gsap.set("[data-text-animation]", { opacity: 1 });
  });
});

// REVERT: Функція для збереження SplitText інстансів
function storeSplitInstance(element, splitInstance) {
  if (!element._splitInstances) {
    element._splitInstances = [];
  }
  element._splitInstances.push(splitInstance);
}

// Хелпер для створення анімації - DRY principle
function createSplitAnimation(element, config) {
  const split = SplitText.create(element, {
    type: config.type, // тепер може бути "words,chars"
    mask: config.mask,
    wordsClass: "split-word",
    charsClass: "split-char",
    linesClass: "split-line",
    autoSplit: true,
  });

  storeSplitInstance(element, split);

  // Визначаємо, які елементи анімувати
  const targets =
    config.animateTarget === "chars"
      ? split.chars
      : config.animateTarget === "words"
      ? split.words
      : config.animateTarget === "lines"
      ? split.lines
      : split[
          config.type
            .replace(",", "")
            .replace("words", "")
            .replace("lines", "") || "chars"
        ];

  gsap.set(targets, config.from);
  gsap.to(targets, {
    ...config.to,
    scrollTrigger: {
      trigger: element,
      start: config.start || "top 60%",
      toggleActions: config.toggleActions || "play none none none",
      ...config.scrollTrigger,
    },
  });
}

// 📚 БІБЛІОТЕКА АНІМАЦІЙ - легко додавати/видаляти
const animationPresets = {
  "letters-blur": {
    type: "words,chars", // 👈 КЛЮЧОВА ЗМІНА: розбиваємо на слова І чари
    animateTarget: "chars", // 👈 але анімуємо тільки чари
    from: { opacity: 0, filter: "blur(5px)" },
    to: {
      opacity: 1,
      filter: "blur(0px)",
      duration: 1,
      ease: "power3.out",
      stagger: { amount: 0.5 },
    },
    start: "top 80%",
  },
};

// Функція застосування анімації
function applyAnimation(animationType, element) {
  const config = animationPresets[animationType];

  if (!config) {
    console.warn(`Animation type "${animationType}" is not defined`);
    return;
  }

  createSplitAnimation(element, config);
}

// Утиліти для керування анімаціями
const TextAnimations = {
  refresh: () => {
    ScrollTrigger.refresh();
  },

  killAll: () => {
    ScrollTrigger.getAll().forEach((st) => st.kill());

    document.querySelectorAll("[data-text-animation]").forEach((el) => {
      if (el._splitInstances) {
        el._splitInstances.forEach((instance) => {
          if (instance && typeof instance.revert === "function") {
            instance.revert();
          }
        });
        el._splitInstances = null;
      }
    });

    gsap.killTweensOf("*");
    console.log("All animations cleaned up");
  },

  isReducedMotion: () => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },

  // Додати нову анімацію динамічно
  addPreset: (name, config) => {
    animationPresets[name] = config;
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const start = "top 90%";
  const yOffsetDesktop = 50;
  const yOffsetMobile = 30;

  function cardsStaggerAppear(wrpClass, cardsClass) {
    const wrapper = document.querySelector(wrpClass);
    const cards = wrapper.querySelectorAll(cardsClass);

    let mm = gsap.matchMedia();

    mm.add("(min-width: 992px)", () => {
      gsap.set(cards, { opacity: 0, y: yOffsetDesktop });
      let cardsTl = gsap.timeline({ paused: true });
      cardsTl.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.15,
      });
      let st = ScrollTrigger.create({
        trigger: wrapper,
        start: start,
        onEnter: () => cardsTl.play(),
      });
      return () => {
        st.kill();
        cardsTl.kill();
        gsap.set(cards, { clearProps: "all" });
      };
    });

    mm.add("(max-width: 991.98px)", () => {
      gsap.set(cards, { opacity: 0, y: yOffsetMobile });
      let instances = [];
      cards.forEach((card) => {
        let cardsTl = gsap.timeline({ paused: true });

        cardsTl.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.75,
        });
        let st = ScrollTrigger.create({
          trigger: card,
          start: start,
          onEnter: () => cardsTl.play(),
        });
        instances.push({ st, cardsTl });
      });
      return () => {
        instances.forEach(({ st, cardsTl }) => {
          st.kill();
          cardsTl.kill();
        });
        gsap.set(cards, { clearProps: "all" });
      };
    });
  }

  function lineAppear(line) {
    const lineApps = document.querySelectorAll(line);

    lineApps.forEach((lineApp) => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.set(lineApp, { opacity: 0, y: yOffsetDesktop });
        let lineTl = gsap.timeline({ paused: true });
        lineTl.to(lineApp, {
          opacity: 1,
          y: 0,
          duration: 0.75,
        });
        let st = ScrollTrigger.create({
          trigger: lineApp,
          start: start,
          onEnter: () => lineTl.play(),
        });
        return () => {
          st.kill();
          lineTl.kill();
          gsap.set(lineApp, { clearProps: "all" });
        };
      });

      mm.add("(max-width: 767.98px)", () => {
        gsap.set(lineApp, { opacity: 0, y: yOffsetMobile });
        let lineTl = gsap.timeline({ paused: true });
        lineTl.to(lineApp, {
          opacity: 1,
          y: 0,
          duration: 0.75,
        });
        let st = ScrollTrigger.create({
          trigger: lineApp,
          start: start,
          onEnter: () => lineTl.play(),
        });
        return () => {
          st.kill();
          lineTl.kill();
          gsap.set(lineApp, { clearProps: "all" });
        };
      });
    });
  }

  lineAppear(".title-div");
  lineAppear(".two-btns-horiz");
  lineAppear(".professionals_contain-text");
  lineAppear(".journey-slide-nav");
  lineAppear(".swiper.is--journey");
  lineAppear(".swiper.is--prof");
  lineAppear(".pricing_contain");
  lineAppear(".press_contain");
  lineAppear(".swiper.is--voice-small");
  lineAppear(".swiper.is--marquee");
  lineAppear(".swiper.is--rating");
  lineAppear(".cta_contain");

  cardsStaggerAppear(".swiper-wrapper.blog_contain", ".swiper-slide.blog_item");
  cardsStaggerAppear(
    ".swiper-wrapper.is-voice-main",
    ".swiper-slide.is-voice-main"
  );
  cardsStaggerAppear(".faq_items", ".faq_item");
});
