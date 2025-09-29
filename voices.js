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

    let isHovered = false;
    let isInView = false;

    // Function to control animation state
    const updateAnimationState = () => {
      const shouldPlay = isInView && !isHovered;
      allWrappers.forEach((wrapper) => {
        wrapper.style.animationPlayState = shouldPlay ? "running" : "paused";
      });
    };

    // Add hover pause functionality for marquee
    swiperElement.addEventListener("mouseenter", () => {
      console.log("marquee hover pause");
      isHovered = true;
      updateAnimationState();
    });

    swiperElement.addEventListener("mouseleave", () => {
      console.log("marquee hover resume");
      isHovered = false;
      updateAnimationState();
    });

    // Add Intersection Observer for viewport visibility
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isInView = entry.isIntersecting;
        console.log("marquee viewport:", isInView ? "visible" : "hidden");
        updateAnimationState();
      });
    }, {
      threshold: 0.1 // Trigger when at least 10% is visible
    });

    observer.observe(swiperElement);

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
