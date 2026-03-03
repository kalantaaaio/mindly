// loading-tl з clearProps для кнопок
window.addEventListener("load", () => {
  const loadContainer = document.querySelector(".hero_container");
  const buttons = loadContainer.querySelectorAll(".btn-main");
  const mainTitle = document.querySelector("#main-title");

  const avatarsContainer = loadContainer.querySelector(
    ".hero_container-avatars",
  );
  const avatars = avatarsContainer.querySelectorAll(
    ".hero_container-avatar, .hero_small-text",
  );

  const splitText = SplitText.create(mainTitle, {
    type: "lines",
    mask: "lines",
    linesClass: "split-line",
    autoSplit: true,
  });

  // Початкові стани
  gsap.set(buttons, { opacity: 0, y: 20 });
  gsap.set(splitText.lines, { opacity: 0, yPercent: 100 });
  gsap.set(avatars, { opacity: 0, y: 20 });

  requestAnimationFrame(() => {
    const masterTl = gsap.timeline();

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
            gsap.set(buttons, {
              clearProps: "transform,opacity,y",
              opacity: 1,
            });

            buttons.forEach((btn) => {
              btn.classList.add("gsap-animation-complete");
            });
          },
        },
        "-=0.5",
      );
    // Анімація аватарів (без clearProps, якщо hover не потрібен)
    gsap.to(avatars, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power4.out",
      stagger: 0.05,
    });
  });
});

// drops
document.addEventListener("DOMContentLoaded", () => {
  function drop(
    parentClass,
    dropClass,
    toggleClass,
    openClass,
    stopClosingAt = 2,
  ) {
    const parent = document.querySelector(parentClass);
    if (!parent) return;
    const drops = parent.querySelectorAll(dropClass);
    drops.forEach((drop) => {
      // Перевіряємо чи співпадають класи дропа і тоггла
      const isToggleSameAsDrop = dropClass === toggleClass;

      // Якщо класи співпадають - тогглом є сам дроп, інакше шукаємо тоггл всередині
      const toggle = isToggleSameAsDrop
        ? drop
        : drop.querySelector(toggleClass);

      if (!toggle) return; // Якщо тоггл не знайдено, пропускаємо

      toggle.addEventListener("click", () => {
        const isMobile = window.innerWidth < stopClosingAt;
        if (!isMobile) {
          drops.forEach((d) => {
            if (d !== drop) d.classList.remove(openClass);
          });
        }
        drop.classList.toggle(openClass);
      });
    });
  }

  drop(".faq_items", ".faq_item", ".drop-toggle", "open", 991);
});

// pricing animation
document.addEventListener("DOMContentLoaded", () => {
  const pricing = document.querySelector(".pricing_cards");
  const cards = pricing.querySelectorAll(".pricing_card");

  let mm = gsap.matchMedia();
  let pricingTl;

  // Функція для очищення стилів
  function clearStyles() {
    gsap.set(cards[0], { clearProps: "all" });
    gsap.set(cards[2], { clearProps: "all" });
    if (pricingTl) {
      pricingTl.kill();
      pricingTl = null;
    }
  }

  // Медіа-запит для десктопу
  mm.add("(min-width: 992px)", () => {
    // Встановлюємо початкові стилі
    gsap.set(cards[0], { transformOrigin: "100% 0%", rotate: -7 });
    gsap.set(cards[2], { transformOrigin: "0% 0%", rotate: 7 });

    // Створюємо анімацію
    pricingTl = gsap.timeline({
      scrollTrigger: {
        trigger: pricing,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    pricingTl.to(cards[0], { rotate: 0, duration: 1 }, 0);
    pricingTl.to(cards[2], { rotate: 0, duration: 1 }, 0);

    // Функція очищення при виході з медіа-запиту
    return () => {
      clearStyles();
    };
  });

  // Медіа-запит для мобільних пристроїв
  mm.add("(max-width: 991px)", () => {
    clearStyles();
  });
});

// marquees
function setupTestimonialsMarquee(selector, enableMobileSwiper = true) {
  const marquees = Array.from(document.querySelectorAll(selector));
  if (!marquees.length) return;

  let swiper = null;
  let resizeTimeout = null;
  let marqueeWrappers = [];
  let intersectionObservers = [];
  let isHovered = [];
  let isInView = [];

  function debounce(func, delay) {
    return function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(func, delay);
    };
  }

  // Функція очищення marquee
  function cleanupMarquee() {
    intersectionObservers.forEach((observer) => {
      if (observer) observer.disconnect();
    });
    intersectionObservers = [];

    // Видаляємо клоновані wrapper'и
    marqueeWrappers.forEach((wrappers, marqueeIndex) => {
      wrappers.forEach((wrapper, index) => {
        if (index > 0) {
          wrapper.remove();
        }
      });

      // Очищаємо стилі оригінального wrapper'а
      const originalWrapper =
        marquees[marqueeIndex]?.querySelector(".swiper-wrapper");
      if (originalWrapper) {
        originalWrapper.style.animation = "";
        originalWrapper.style.animationPlayState = "";
      }
    });

    marqueeWrappers = [];
    marquees.forEach((marquee) =>
      marquee.classList.remove("is-marquee-active"),
    );
  }

  // Функція ініціалізації marquee для великих екранів
  function initMarquee() {
    marquees.forEach((marqueeElement, marqueeIndex) => {
      const swiperWrapper = marqueeElement.querySelector(".swiper-wrapper");
      if (!swiperWrapper) return;

      marqueeElement.classList.add("is-marquee-active");

      // Дублюємо wrapper для ефекту marquee
      const clonedWrapper = swiperWrapper.cloneNode(true);
      marqueeElement.appendChild(clonedWrapper);

      const wrappers = [swiperWrapper, clonedWrapper];

      // Для екранів 1920px+ додаємо третій дублікат
      if (window.innerWidth >= 1920) {
        const thirdWrapper = swiperWrapper.cloneNode(true);
        marqueeElement.appendChild(thirdWrapper);
        wrappers.push(thirdWrapper);
      }

      // Визначаємо напрямок анімації (непарні marquees йдуть у зворотному напрямку)
      const isReversed = marqueeIndex % 2 === 1;
      const animationName = isReversed ? "marquee-reversed" : "marquee";

      // Додаємо анімацію
      wrappers.forEach((wrapper) => {
        wrapper.style.animation = `${animationName} 90s linear infinite`;
      });

      marqueeWrappers[marqueeIndex] = wrappers;

      // Функція контролю стану анімації
      const updateAnimationState = () => {
        const shouldPlay = isInView[marqueeIndex] && !isHovered[marqueeIndex];
        wrappers.forEach((wrapper) => {
          wrapper.style.animationPlayState = shouldPlay ? "running" : "paused";
        });
      };

      // Hover pause
      marqueeElement.addEventListener("mouseenter", () => {
        isHovered[marqueeIndex] = true;
        updateAnimationState();
      });

      marqueeElement.addEventListener("mouseleave", () => {
        isHovered[marqueeIndex] = false;
        updateAnimationState();
      });

      // Intersection Observer для видимості у viewport
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isInView[marqueeIndex] = entry.isIntersecting;
            updateAnimationState();
          });
        },
        { threshold: 0.1 },
      );

      observer.observe(marqueeElement);
      intersectionObservers[marqueeIndex] = observer;
    });
  }

  // Функція для малих екранів: переміщення всіх слайдів в перший marquee
  function initMobileSwiper() {
    const firstMarquee = marquees[0];
    if (!firstMarquee) return;

    const firstWrapper = firstMarquee.querySelector(".swiper-wrapper");
    if (!firstWrapper) return;

    // Переносимо всі slides з інших marquees в перший
    marquees.forEach((marquee, index) => {
      if (index === 0) return;

      const wrapper = marquee.querySelector(".swiper-wrapper");
      if (!wrapper) return;

      const slides = Array.from(wrapper.querySelectorAll(".swiper-slide"));
      slides.forEach((slide) => {
        firstWrapper.appendChild(slide);
      });

      // Видаляємо інші marquees
      marquee.remove();
    });

    // Ініціалізуємо Swiper на першому marquee
    if (!swiper) {
      swiper = new Swiper(firstMarquee, {
        slidesPerView: "auto",
        spaceBetween: 12,
        centeredSlides: true,
      });
    }
  }

  // Головна функція обробки
  function handleSlider() {
    if (window.innerWidth >= 992) {
      // Великі екрани: marquee
      if (swiper) {
        swiper.destroy(true, true);
        swiper = null;
      }
      if (marqueeWrappers.length === 0) {
        initMarquee();
      }
    } else {
      // Малі екрани
      if (enableMobileSwiper) {
        // Swiper режим
        cleanupMarquee();
        if (!swiper) {
          initMobileSwiper();
        }
      } else {
        // Marquee режим на всіх брейкпоінтах
        if (swiper) {
          swiper.destroy(true, true);
          swiper = null;
        }
        if (marqueeWrappers.length === 0) {
          initMarquee();
        }
      }
    }
  }

  // Ініціалізація при завантаженні
  handleSlider();

  // ResizeObserver з debounce
  const resizeObserver = new ResizeObserver(
    debounce(() => {
      handleSlider();
    }, 250),
  );

  resizeObserver.observe(document.body);

  // Cleanup функція
  return () => {
    resizeObserver.disconnect();
    cleanupMarquee();
    if (swiper) {
      swiper.destroy(true, true);
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  setupTestimonialsMarquee(".swiper.is--marquee");
});

//providers section animation
document.addEventListener("DOMContentLoaded", () => {
  const providersSection = document.querySelector(".providers.u-section");

  // Перевірка чи існує секція
  if (!providersSection) {
    console.warn("Providers section not found");
    return;
  }

  const tooltips = providersSection.querySelectorAll(".providers_tooltip");
  const pcLines = providersSection.querySelectorAll(
    "#pr-line-1, #pr-line-2, #pr-line-3, #pr-line-4",
  );
  const mobLines = providersSection.querySelectorAll(
    "#pr-line-1-mob, #pr-line-2-mob, #pr-line-3-mob, #pr-line-4-mob",
  );
  const pcCircles = providersSection.querySelectorAll(
    "#pr-circle-1, #pr-circle-2, #pr-circle-3, #pr-circle-4, #pr-circle-5, #pr-circle-6",
  );
  const mobCircles = providersSection.querySelectorAll(
    "#pr-circle-1-mob, #pr-circle-2-mob, #pr-circle-3-mob, #pr-circle-4-mob, #pr-circle-5-mob, #pr-circle-6-mob",
  );

  let mm = gsap.matchMedia();
  let animationPlayed = false;

  function createDesktopAnimationTimeline() {
    // Початкові стани
    gsap.set(pcCircles, { opacity: 0 });
    gsap.set(tooltips, { rotate: 0, opacity: 0, y: 20 });
    gsap.set(pcLines, { drawSVG: "0%" });

    const tl = gsap.timeline({ paused: true });

    // Line 1 + circles
    tl.fromTo(pcLines[0], { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5 })
      .to(pcCircles[0], { opacity: 1, duration: 0.1 })
      .to(tooltips[0], { opacity: 1, y: 0, rotate: -5, duration: 0.3 })
      .to(pcCircles[1], { opacity: 1, duration: 0.1 })

      // Line 2
      .fromTo(pcLines[1], { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5 })
      .to(pcCircles[2], { opacity: 1, duration: 0.1 })
      .to(tooltips[1], { opacity: 1, y: 0, rotate: 5, duration: 0.3 })
      .to(pcCircles[3], { opacity: 1, duration: 0.1 })

      // Line 3
      .fromTo(pcLines[2], { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5 })
      .to(pcCircles[4], { opacity: 1, duration: 0.1 })
      .to(tooltips[2], { opacity: 1, y: 0, rotate: -5, duration: 0.3 })
      .to(pcCircles[5], { opacity: 1, duration: 0.1 })

      // Line 4
      .fromTo(
        pcLines[3],
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 0.5 },
      );

    return tl;
  }

  function createMobileAnimationTimeline() {
    // Початкові стани
    gsap.set(mobCircles, { opacity: 0 });
    gsap.set(tooltips, { rotate: 0, opacity: 0, y: 20 });
    gsap.set(mobLines, { drawSVG: "0%" });

    // Для останньої лінії встановлюємо початковий стан "100% 100%" (не намальована)
    gsap.set(mobLines[3], { drawSVG: "100% 100%" });

    const tl = gsap.timeline({ paused: true });

    tl.fromTo(
      mobLines[0],
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 0.5 },
    )
      .to(mobCircles[0], { opacity: 1, duration: 0.1 })
      .to(tooltips[0], { opacity: 1, y: 0, rotate: -3, duration: 0.3 })
      .to(mobCircles[1], { opacity: 1, duration: 0.1 })
      .fromTo(
        mobLines[1],
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 0.3 },
      )
      .to(mobCircles[2], { opacity: 1, duration: 0.1 })
      .to(tooltips[1], { opacity: 1, y: 0, rotate: 3, duration: 0.3 })
      .to(mobCircles[3], { opacity: 1, duration: 0.1 })
      .fromTo(
        mobLines[2],
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 0.3 },
      )
      .to(mobCircles[4], { opacity: 1, duration: 0.1 })
      .to(tooltips[2], { opacity: 1, y: 0, rotate: -3, duration: 0.3 })

      .to(mobCircles[5], { opacity: 1, duration: 0.1 })
      .fromTo(
        mobLines[3],
        { drawSVG: "100% 100%" },
        { drawSVG: "0% 100%", duration: 0.5 },
      );

    return tl;
  }

  // Desktop (scroll-triggered animation)
  mm.add("(min-width: 992px)", () => {
    const providersCardTl = createDesktopAnimationTimeline();

    const scrollTrigger = ScrollTrigger.create({
      trigger: providersSection,
      start: "top 70%",
      end: "bottom top",
      onEnter: () => {
        if (!animationPlayed) {
          console.log("🔵 Desktop animation started");
          providersCardTl.play();
          animationPlayed = true;
        }
      },
    });

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up desktop animation");
      scrollTrigger.kill();
      providersCardTl.kill();
      gsap.set([...pcCircles, ...tooltips, ...pcLines], { clearProps: "all" });
      animationPlayed = false;
    };
  });

  // Mobile (scroll-triggered animation)
  mm.add("(max-width: 991px)", () => {
    const providersCardTl = createMobileAnimationTimeline();

    const scrollTrigger = ScrollTrigger.create({
      trigger: providersSection,
      start: "top 50%",
      end: "bottom top",
      onEnter: () => {
        if (!animationPlayed) {
          console.log("🟡 Mobile animation started");
          providersCardTl.play();
          animationPlayed = true;
        }
      },
    });

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up mobile animation");
      scrollTrigger.kill();
      providersCardTl.kill();
      gsap.set([...mobCircles, ...tooltips, ...mobLines], {
        clearProps: "all",
      });
      animationPlayed = false;
    };
  });
});

//company section number animation
document.addEventListener("DOMContentLoaded", () => {
  const companySection = document.querySelector(".company.u-section");
  const cards = companySection.querySelectorAll(".company_grid-item");
  const sticker = companySection.querySelector(".company_badge");
  let mm = gsap.matchMedia();

  let stickerAppearTl = gsap.timeline({ paused: true });
  stickerAppearTl.from(
    sticker,
    {
      opacity: 0,
      scale: 0.5,
      yPercent: -100,
      xPercent: 80,
      duration: 0.5,
    },
    0.25,
  );
  ScrollTrigger.create({
    trigger: companySection,
    start: "top 70%",
    onEnter: () => {
      stickerAppearTl.play();
    },
  });

  cards.forEach((card) => {
    const numEl = card.querySelector(".text-num");
    const targetNum = parseFloat(numEl.dataset.num);
    const decimals =
      numEl.dataset.numDec !== undefined ? parseInt(numEl.dataset.numDec) : 0;

    // Визначаємо тривалість залежно від значення
    const duration = targetNum < 10 ? 0.25 : 1;

    // Створюємо об'єкт для анімації
    const counter = { value: 0 };

    const formatNum = (val) => {
      if (decimals > 0) {
        return val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      return Math.floor(val).toLocaleString("en-US");
    };

    // Для екранів >= 992px - тріггер секція
    mm.add("(min-width: 992px)", () => {
      gsap.to(counter, {
        value: targetNum,
        duration: duration,
        ease: "power1.out",
        scrollTrigger: {
          trigger: companySection,
          start: "top 60%",
          toggleActions: "play none none none",
        },
        onUpdate: function () {
          numEl.textContent = formatNum(counter.value);
        },
      });
    });

    // Для екранів < 992px - тріггер кожна картка окремо
    mm.add("(max-width: 991px)", () => {
      gsap.to(counter, {
        value: targetNum,
        duration: duration,
        ease: "power1.out",
        scrollTrigger: {
          trigger: card,
          start: "top 70%",
          toggleActions: "play none none none",
        },
        onUpdate: function () {
          numEl.textContent = formatNum(counter.value);
        },
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const sticker = document.querySelector(".guestion_sticker");
  const block = document.querySelector(".question_grid");
  let stickerAppearTl = gsap.timeline({ paused: true });
  stickerAppearTl.from(
    sticker,
    {
      opacity: 0,
      scale: 0.5,
      yPercent: -100,
      xPercent: 80,
      duration: 0.5,
    },
    0.25,
  );
  ScrollTrigger.create({
    trigger: block,
    start: "top 70%",
    onEnter: () => {
      stickerAppearTl.play();
    },
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const sticker = document.querySelector(".providers_sticker");
  const block = document.querySelector(".providers_contain-wrp");
  let stickerAppearTl = gsap.timeline({ paused: true });
  stickerAppearTl.from(
    sticker,
    {
      opacity: 0,
      scale: 0.5,
      yPercent: -100,
      xPercent: 80,
      duration: 0.5,
    },
    0.25,
  );
  ScrollTrigger.create({
    trigger: block,
    start: "top 70%",
    onEnter: () => {
      stickerAppearTl.play();
    },
  });
});
