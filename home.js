console.log("hello");

document.addEventListener("DOMContentLoaded", () => {
  const companySection = document.querySelector(".company.u-section");
  const cards = companySection.querySelectorAll(".company_grid-item");

  let mm = gsap.matchMedia();

  cards.forEach((card) => {
    const numEl = card.querySelector(".text-num");
    const targetNum = parseInt(numEl.dataset.num);

    // Створюємо об'єкт для анімації
    const counter = { value: 0 };

    // Для екранів >= 992px - тріггер секція
    mm.add("(min-width: 992px)", () => {
      gsap.to(counter, {
        value: targetNum,
        duration: 2,
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
        duration: 2,
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
