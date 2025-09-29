// Function to setup marquee for large screens or swiper for mobile
function setupSlider() {
  const swiperElement = document.querySelector(".swiper.is--voice-small");
  const swiperWrapper = swiperElement.querySelector(".swiper-wrapper");

  if (window.innerWidth >= 992) {
    // Large screens: convert to marquee
    swiperElement.classList.add("is-marquee");

    // Duplicate wrapper content for marquee effect
    const originalWrapper = swiperWrapper.cloneNode(true);
    swiperElement.appendChild(originalWrapper);

    // For 1920px+: add one more duplicate (triple)
    let thirdWrapper;
    if (window.innerWidth >= 1920) {
      thirdWrapper = originalWrapper.cloneNode(true);
      swiperElement.appendChild(thirdWrapper);
    }

    // Add basic marquee animation to all wrappers
    const allWrappers = [swiperWrapper, originalWrapper];
    if (thirdWrapper) allWrappers.push(thirdWrapper);

    allWrappers.forEach((wrapper) => {
      if (!wrapper.style.animation) {
        wrapper.style.animation = "marquee 20s linear infinite";
      }
    });

    // Add hover pause functionality for marquee
    swiperElement.addEventListener("mouseenter", () => {
      console.log("marquee pause");
      allWrappers.forEach((wrapper) => {
        wrapper.style.animationPlayState = "paused";
      });
    });

    swiperElement.addEventListener("mouseleave", () => {
      console.log("marquee resume");
      allWrappers.forEach((wrapper) => {
        wrapper.style.animationPlayState = "running";
      });
    });
  } else {
    // Small screens: use regular swiper
    const swiper = new Swiper(".swiper.is--voice-small", {
      slidesPerView: "auto",
      spaceBetween: 12,
      allowTouchMove: true,
      freeMode: true,
      freeModeMomentum: false,
    });
  }
}

// Initialize on load
setupSlider();
