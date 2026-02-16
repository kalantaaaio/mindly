console.log("hi");

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
        numEl.textContent = snapped.toLocaleString("en-US");
      },
      onComplete() {
        numEl.textContent = targetValue.toLocaleString("en-US");
      },
    });
  });
});
