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
    "#pr-line-1, #pr-line-2, #pr-line-3, #pr-line-4"
  );
  const mobLines = providersSection.querySelectorAll(
    "#pr-line-1-mob, #pr-line-2-mob, #pr-line-3-mob, #pr-line-4-mob"
  );
  const pcCircles = providersSection.querySelectorAll(
    "#pr-circle-1, #pr-circle-2, #pr-circle-3, #pr-circle-4, #pr-circle-5, #pr-circle-6"
  );
  const mobCircles = providersSection.querySelectorAll(
    "#pr-circle-1-mob, #pr-circle-2-mob, #pr-circle-3-mob, #pr-circle-4-mob"
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
        { drawSVG: "100%", duration: 0.5 }
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
      { drawSVG: "100%", duration: 0.5 }
    )
      .to(mobCircles[0], { opacity: 1, duration: 0.1 })
      .to(tooltips[0], { opacity: 1, y: 0, rotate: -3, duration: 0.3 })
      .to(mobCircles[1], { opacity: 1, duration: 0.1 })
      .fromTo(
        mobLines[1],
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 0.3 }
      )
      .to(mobCircles[2], { opacity: 1, duration: 0.1 })
      .to(tooltips[1], { opacity: 1, y: 0, rotate: 3, duration: 0.3 })
      .to(mobCircles[3], { opacity: 1, duration: 0.1 })
      .fromTo(
        mobLines[2],
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 0.3 }
      )
      .to(mobCircles[4], { opacity: 1, duration: 0.1 })
      .to(tooltips[2], { opacity: 1, y: 0, rotate: -3, duration: 0.3 })

      .to(mobCircles[5], { opacity: 1, duration: 0.1 })
      .fromTo(
        mobLines[3],
        { drawSVG: "100% 100%" },
        { drawSVG: "0% 100%", duration: 0.5 }
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
