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
    type: config.type,
    mask: config.mask,
    [`${config.type}Class`]: `split-${config.type.slice(0, -1)}`,
    autoSplit: true,
  });

  storeSplitInstance(element, split);

  const targets = split[config.type];
  gsap.set(targets, config.from);
  gsap.to(targets, {
    ...config.to,
    scrollTrigger: {
      trigger: element,
      start: config.start || "top 60%",
      toggleActions: config.toggleActions || "play none none reverse",
      ...config.scrollTrigger,
    },
  });
}

// 📚 БІБЛІОТЕКА АНІМАЦІЙ - легко додавати/видаляти
const animationPresets = {
  "letters-blur": {
    type: "chars",
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

  function cardsStaggerAppear(wrpClass, cardsClass) {
    const wrapper = document.querySelector(wrpClass);
    const cards = wrapper.querySelectorAll(cardsClass);

    gsap.set(cards, { opacity: 0, y: 50 });
    let mm = gsap.matchMedia();
    mm.add("(min-width: 992px)", () => {
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
      gsap.set(lineApp, { opacity: 0, y: 50 });
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
