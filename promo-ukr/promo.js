// loading-tl з clearProps для кнопок
window.addEventListener("load", () => {
  const loadContainer = document.querySelector(".hero_container");
  const buttons = loadContainer.querySelectorAll(".btn-main");
  const mainTitle = document.querySelector("#main-title");
  const mainPar = document.querySelector("#main-p");
  const splitText = SplitText.create(mainTitle, {
    type: "lines",
    mask: "lines",
    linesClass: "split-line",
    autoSplit: true,
  });

  const splitPar = SplitText.create(mainPar, {
    type: "lines",
    mask: "lines",
    linesClass: "split-line",
    autoSplit: true,
  });

  // Початкові стани
  gsap.set(buttons, { opacity: 0, y: 20 });
  gsap.set(splitText.lines, { opacity: 0, yPercent: 100 });
  gsap.set(splitPar.lines, { opacity: 0, yPercent: 100 });

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
      .set(mainPar, { opacity: 1 })
      .to(
        splitPar.lines,
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          stagger: 0.15,
        },
        "-=0.5",
      )
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
  });
});

// promo section number animation
document.addEventListener("DOMContentLoaded", () => {
  const numbers = document.querySelectorAll(".promo_meet-number");

  numbers.forEach((item) => {
    const numEl = item.querySelector(".title-68");
    const targetValue = parseInt(numEl.dataset.value);
    const countType = numEl.dataset.count; // "ten" | "hundred" | "num"

    // Крок залежно від типу
    const step = countType === "hundred" ? 100 : countType === "ten" ? 10 : 1;

    // Snap-значення — округлюємо до кроку
    const snap = gsap.utils.snap(step);

    const counter = { value: 0 };

    gsap.to(counter, {
      value: targetValue,
      duration: 1,
      ease: "power1.out",
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      onUpdate() {
        const snapped = snap(counter.value);
        numEl.textContent = snapped.toLocaleString("en-US").replace(/,/g, " ");
      },
      onComplete() {
        numEl.textContent = targetValue.toLocaleString("en-US").replace(/,/g, " ");
      },
    });
  });
});

//join section
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".joining_container");
  const items = gallery.querySelectorAll(".joining_item");

  let mm = gsap.matchMedia();

  mm.add("(min-width: 992px)", () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: gallery,
        start: "top 30%",
        end: "bottom 30%",
        toggleActions: "play none none reverse",
      },
    });

    items.forEach((item) => {
      const smallLine = item.querySelector(".joining_item-line-active");
      const itemNum = item.querySelector(".joining_item-num");

      if (itemNum) {
        tl.to(itemNum, {
          backgroundColor: "#e5f5ff",
          color: "#0288d1",
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
          "-=0.1",
        );
      }
    });
  });

  mm.add("(max-width: 991.98px)", () => {
    items.forEach((item) => {
      const smallLine = item.querySelector(".joining_item-line-active");
      const itemNum = item.querySelector(".joining_item-num");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 70%",
          end: "bottom 70%",
          scrub: true,
        },
      });

      if (itemNum) {
        tl.to(itemNum, {
          backgroundColor: "#e5f5ff",
          color: "#0288d1",
          duration: 0.2,
          ease: "power1.inOut",
        });
      }

      if (smallLine) {
        tl.to(
          smallLine,
          {
            scaleY: 1,
            duration: 0.5,
            ease: "none",
          },
          "-=0.1",
        );
      }
    });
  });
});

//professionals title anim
document.addEventListener("DOMContentLoaded", () => {
  let mm = gsap.matchMedia();

  mm.add("(min-width: 480px)", () => {
    const tl = gsap.timeline({ paused: true, ease: "power2.out" });
    const tooltips = document.querySelectorAll(
      ".professionals_contain-tooltip",
    );

    tooltips.forEach((tooltip, i) => {
      const avatar = tooltip.querySelector(
        ".professionals_contain-tooltip_avatar",
      );
      const city = tooltip.querySelector(
        ".professionals_contain-tooltip_country",
      );

      if (i === 0 || i === 2) {
        gsap.set(city, { rotateZ: -15, opacity: 0 });
      } else {
        gsap.set(city, { rotateZ: 15, opacity: 0 });
      }
      gsap.set(avatar, { y: -20, opacity: 0 });
      const startTime = i * 0.15;

      // Анімація аватару
      tl.to(
        avatar,
        {
          y: 0,
          opacity: 1,
          duration: 0.15,
        },
        startTime,
      );

      tl.to(
        city,
        {
          opacity: 1,
          rotateZ: 0,
          duration: 0.25,
        },
        startTime + 0.05,
      );
    });

    // Створюємо ScrollTrigger
    ScrollTrigger.create({
      trigger: ".professionals_contain-text",
      start: "top 70%",
      onEnter: () => {
        tl.play();
      },
    });
  });

  mm.add("(max-width: 479px)", () => {
    const tl = gsap.timeline({ paused: true, ease: "power2.out" });
    const tooltips = document.querySelectorAll(
      ".professionals_contain-tooltip",
    );
    const order = [4, 3, 1, 2, 0, 5];
    const angles = [-22.75, 0, 0, -11.75, 0, 0];

    order.forEach((idx, step) => {
      const tooltip = tooltips[idx];
      if (!tooltip) return;

      const avatar = tooltip.querySelector(
        ".professionals_contain-tooltip_avatar",
      );
      const cities = tooltip.querySelectorAll(
        ".professionals_contain-tooltip_country",
      );
      const city = cities[1];

      if (idx === 0 || idx === 2) {
        gsap.set(city, { rotateZ: -15, opacity: 0 });
      } else {
        gsap.set(city, { rotateZ: 15, opacity: 0 });
      }
      gsap.set(avatar, { y: -20, opacity: 0 });

      const startTime = step * 0.15;

      tl.to(
        avatar,
        {
          y: 0,
          opacity: 1,
          duration: 0.15,
        },
        startTime,
      );

      tl.to(
        city,
        {
          opacity: 1,
          rotateZ: angles[step],
          duration: 0.25,
        },
        startTime + 0.05,
      );
    });

    ScrollTrigger.create({
      trigger: ".professionals_contain-text",
      start: "top 70%",

      onEnter: () => {
        tl.play();
      },
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
