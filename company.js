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
    0.25
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
    const targetNum = parseInt(numEl.dataset.num);

    // Визначаємо тривалість залежно від значення
    const duration = targetNum < 10 ? 0.5 : 1;

    // Створюємо об'єкт для анімації
    const counter = { value: 0 };

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
          const formattedNum = Math.floor(counter.value).toLocaleString(
            "en-US"
          );
          numEl.textContent = formattedNum;
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
          const formattedNum = Math.floor(counter.value).toLocaleString(
            "en-US"
          );
          numEl.textContent = formattedNum;
        },
      });
    });
  });
});
