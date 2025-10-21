console.log("ss");

document.addEventListener("DOMContentLoaded", () => {
  function setupSliderMain() {
    const swiperElement = document.querySelector(".swiper.is-voice-main");
    if (!swiperElement) return;

    const swiperWrapper = swiperElement.querySelector(".swiper-wrapper");
    if (!swiperWrapper) return;

    let swiper = null;
    let resizeTimeout = null;

    function debounce(func, delay) {
      return function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(func, delay);
      };
    }

    function handleSwiper() {
      if (window.innerWidth < 992) {
        if (!swiper) {
          swiper = new Swiper(swiperElement, {
            slidesPerView: "auto",
            spaceBetween: 10,
            centeredSlides: true,
            initialSlide: 1,
          });
        }
      } else {
        if (swiper) {
          swiper.destroy(true, true);
          swiper = null;
        }
      }
    }

    handleSwiper();

    const resizeObserver = new ResizeObserver(
      debounce(() => {
        handleSwiper();
      }, 250)
    );

    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
      if (swiper) {
        swiper.destroy(true, true);
      }
    };
  }

  function setupSliderMarquee() {
    const swiperElement = document.querySelector(".swiper.is--voice-small");
    if (!swiperElement) return;

    const swiperWrapper = swiperElement.querySelector(".swiper-wrapper");
    if (!swiperWrapper) return;

    let swiper = null;
    let resizeTimeout = null;
    let marqueeWrappers = [];
    let intersectionObserver = null;
    let isHovered = false;
    let isInView = false;

    function debounce(func, delay) {
      return function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(func, delay);
      };
    }

    // Функція очищення marquee
    function cleanupMarquee() {
      if (intersectionObserver) {
        intersectionObserver.disconnect();
        intersectionObserver = null;
      }

      // Видаляємо клоновані wrapper'и
      marqueeWrappers.forEach((wrapper, index) => {
        if (index > 0) {
          // Не видаляємо оригінальний wrapper
          wrapper.remove();
        }
      });

      // Очищаємо стилі оригінального wrapper'а
      if (swiperWrapper) {
        swiperWrapper.style.animation = "";
        swiperWrapper.style.animationPlayState = "";
      }

      marqueeWrappers = [];
      swiperElement.classList.remove("is-marquee");
    }

    // Функція ініціалізації marquee
    function initMarquee() {
      swiperElement.classList.add("is-marquee");

      // Дублюємо wrapper для ефекту marquee
      const clonedWrapper = swiperWrapper.cloneNode(true);
      swiperElement.appendChild(clonedWrapper);

      marqueeWrappers = [swiperWrapper, clonedWrapper];

      // Для екранів 1920px+ додаємо третій дублікат
      if (window.innerWidth >= 1920) {
        const thirdWrapper = swiperWrapper.cloneNode(true);
        swiperElement.appendChild(thirdWrapper);
        marqueeWrappers.push(thirdWrapper);
      }

      // Додаємо анімацію
      marqueeWrappers.forEach((wrapper) => {
        wrapper.style.animation = "marquee 60s linear infinite";
      });

      // Функція контролю стану анімації
      const updateAnimationState = () => {
        const shouldPlay = isInView && !isHovered;
        marqueeWrappers.forEach((wrapper) => {
          wrapper.style.animationPlayState = shouldPlay ? "running" : "paused";
        });
      };

      // Hover pause
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

      // Intersection Observer для видимості у viewport
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isInView = entry.isIntersecting;
            updateAnimationState();
          });
        },
        { threshold: 0.1 }
      );

      intersectionObserver.observe(swiperElement);
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
        // Малі екрани: swiper
        cleanupMarquee();
        if (!swiper) {
          swiper = new Swiper(swiperElement, {
            slidesPerView: "auto",
            spaceBetween: 12,
          });
        }
      }
    }

    // Ініціалізація при завантаженні
    handleSlider();

    // ResizeObserver з debounce
    const resizeObserver = new ResizeObserver(
      debounce(() => {
        handleSlider();
      }, 250)
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

  // Ініціалізація
  setupSliderMain();
  setupSliderMarquee();
});
