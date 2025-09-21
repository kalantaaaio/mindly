// tooltipsAvatars
document.addEventListener("DOMContentLoaded", () => {
  const tooltips = document.querySelectorAll(".hero_container-tooltip");
  const toltipParent = document.querySelector(".hero_container-tooltips");
  const avatars = document.querySelector(".hero_container-avatars");

  // Перевірка наявності елементів
  if (!toltipParent || !avatars) {
    console.error("Не знайдено необхідні елементи");
    return;
  }

  // Ховер для батьківського елемента
  toltipParent.addEventListener("mouseenter", () => {
    gsap.to(avatars, { opacity: 0, duration: 1 });
  });

  toltipParent.addEventListener("mouseleave", () => {
    gsap.to(avatars, { opacity: 1, duration: 1 });
  });

  // Обробка кожного tooltip
  tooltips.forEach((tooltip, index) => {
    const text = tooltip.querySelector(".is--second-part");

    if (!text) {
      console.warn(`Текст не знайдено для tooltip ${index}`);
      return;
    }

    // Зберігаємо таймлайн для кожного tooltip
    let currentTimeline = null;

    tooltip.addEventListener("mouseenter", () => {
      console.log(`🟢 Tooltip ${index} mouseenter`);

      // Убиваємо попередню анімацію
      if (currentTimeline) {
        currentTimeline.kill();
      }

      // Створюємо нову анімацію
      currentTimeline = gsap.timeline();
      currentTimeline
        .set(text, { maxWidth: 0 }) // Скидаємо початковий стан
        .to(text, {
          maxWidth: 600,
          duration: 1,
          ease: "power2.inOut",
          delay: 0.2,
        });
    });

    tooltip.addEventListener("mouseleave", () => {
      console.log(`🔴 Tooltip ${index} mouseleave`);

      // Убиваємо попередню анімацію
      if (currentTimeline) {
        currentTimeline.kill();
      }

      // Створюємо анімацію закриття
      currentTimeline = gsap.timeline();
      currentTimeline.to(text, {
        maxWidth: 0,
        duration: 1,
        ease: "power2.inOut",
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const tooltips = document.querySelectorAll(".hero_container-tooltip_wrp");
  let currentOpenTooltip = null;

  tooltips.forEach((tooltip) => {
    const mainPart = tooltip.querySelector(".hero_container-tooltip");
    const tooltipBg = tooltip.querySelector(".hero_container-tooltip-bg");
    const bigPart = tooltip.querySelector(".hero_container-tooltip-flip");
    const innerText = bigPart.querySelectorAll(".text-14");
    const close = tooltip.querySelector(".close-tooltip");

    let flipDuration = 0.3;

    function flip(forwards) {
      let state = Flip.getState(tooltipBg);
      if (forwards) {
        bigPart.appendChild(tooltipBg);
      } else {
        mainPart.appendChild(tooltipBg);
      }
      Flip.from(state, { duration: flipDuration });
    }

    let tl = gsap.timeline({ paused: true });
    tl.set(bigPart, { display: "flex" });
    tl.from(bigPart, {
      opacity: 0,
      duration: flipDuration,
      ease: "none",
      onStart: () => {
        flip(true);
        gsap.to(tooltipBg, { opacity: 1, duration: flipDuration });
      },
    });
    tl.from(innerText, {
      opacity: 0,
      yPercent: 50,
      duration: 0.2,
      stagger: { amount: 0.1 },
      onReverseComplete: () => {
        flip(false);
        gsap.to(tooltipBg, { opacity: 0.2, duration: flipDuration });
      },
    });

    // Функція для відкриття тултіпа
    function openTooltip() {
      // Закриваємо поточний відкритий тултіп, якщо він є
      if (currentOpenTooltip && currentOpenTooltip !== tooltip) {
        currentOpenTooltip.timeline.reverse();
      }

      // Відкриваємо новий тултіп
      tl.play();
      currentOpenTooltip = tooltip;
      currentOpenTooltip.timeline = tl;
    }

    // Функція для закриття тултіпа
    function closeTooltip() {
      tl.reverse();
      if (currentOpenTooltip === tooltip) {
        currentOpenTooltip = null;
      }
    }

    // Обробник кліку на тултіп (відкриття)
    mainPart.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentOpenTooltip === tooltip) {
        // Якщо цей тултіп вже відкритий, закриваємо його
        closeTooltip();
      } else {
        // Інакше відкриваємо його
        openTooltip();
      }
    });

    // Обробник кліку на кнопку close
    if (close) {
      close.addEventListener("click", (e) => {
        e.stopPropagation();
        closeTooltip();
      });
    }

    // Запобігаємо закриттю при кліку всередині розгорнутого тултіпа
    bigPart.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });

  // Закриття тултіпа при кліку поза ним
  document.addEventListener("click", () => {
    if (currentOpenTooltip) {
      currentOpenTooltip.timeline.reverse();
      currentOpenTooltip = null;
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  var swiper = new Swiper(".swiper.is--journey", {
    slidesPerView: "auto",
    spaceBetween: "2%",
  });
  const slideToggles = document.querySelectorAll(".journey-slide-nav_item");
  slideToggles[0].classList.add("is-active");

  // Отримуємо фоновий елемент
  let backgroundElement = document.querySelector(
    ".journey-slide-nav_item.is-active .journey-slide-nav_item-bg"
  );

  // Функція для анімації переходу між тогглами
  function animateToggleTransition(fromToggle, toToggle) {
    if (fromToggle === toToggle) return;

    // Знаходимо індекси та напрямок
    const currentIndex = Array.from(slideToggles).indexOf(fromToggle);
    const newIndex = Array.from(slideToggles).indexOf(toToggle);

    // Створюємо timeline
    const tl = gsap.timeline();

    slideToggles.forEach((t) => {
      t.classList.remove("is-active");
    });
    toToggle.classList.add("is-active");
  }

  // Обробник кліків на тогли
  slideToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const currentActive = document.querySelector(
        ".journey-slide-nav_item.is-active"
      );

      if (currentActive === toggle) return;

      // Запускаємо анімацію
      animateToggleTransition(currentActive, toggle);

      // Логіка для свайпера
      const slideTo = toggle.dataset.slide;
      const targetSlide = document.getElementById(slideTo);
      const slideIndex = Array.from(swiper.slides).indexOf(targetSlide);
      if (slideIndex !== -1) {
        swiper.slideTo(slideIndex);
      }
    });
  });

  // Додаємо обробник для Swiper slideChange
  swiper.on("slideChange", function () {
    const activeSlideIndex = swiper.activeIndex;
    const activeSlide = swiper.slides[activeSlideIndex];

    // Знаходимо відповідний тоггл для активного слайда
    const targetToggle = Array.from(slideToggles).find((toggle) => {
      const slideTo = toggle.dataset.slide;
      const targetSlide = document.getElementById(slideTo);
      return targetSlide === activeSlide;
    });

    if (targetToggle) {
      const currentActive = document.querySelector(
        ".journey-slide-nav_item.is-active"
      );

      // Запускаємо анімацію тільки якщо це інший тоггл
      if (currentActive !== targetToggle) {
        animateToggleTransition(currentActive, targetToggle);
      }
    }
  });

  // Об'єкт для відстеження, які чати вже були запущені
  const renderedChats = new Set();

  // MutationObserver для відстеження змін класів у слайдах
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const slide = mutation.target;
        const slideId = slide.id;

        // Перевіряємо, чи з'явився клас swiper-slide-active
        if (
          slide.classList.contains("swiper-slide-active") &&
          slideId &&
          !renderedChats.has(slideId)
        ) {
          const chat = chats[slideId];
          if (chat) {
            chat.render();
            renderedChats.add(slideId);
          }
        }
      }
    });
  });

  // class for adding a person
  class Charakter {
    static characters = {};

    constructor(name, role, positon, photo, arrow, color) {
      this.name = name;
      this.role = role;
      this.positon = positon;
      this.photo = photo;
      this.arrow = arrow;
      this.color = color;
    }

    static create(id, name, role, positon, photo, arrow, color) {
      this.characters[id] = new Charakter(
        name,
        role,
        positon,
        photo,
        arrow,
        color
      );
      return this.characters[id];
    }

    static get(id) {
      return this.characters[id];
    }
  }

  class Chat {
    constructor(slide) {
      this.slide = document.querySelector(slide);
      this.chatContainer = this.slide.querySelector(".journey_slide-chat");
      this.messages = [];
    }

    message(characterId, text) {
      const message = new Message(characterId, text);
      this.messages.push(message);
    }

    scrollToBottom() {
      setTimeout(() => {
        this.chatContainer.scrollTo({
          top: this.chatContainer.scrollHeight,
          behavior: "smooth",
        });
      }, 50);
    }

    render() {
      this.chatContainer.innerHTML = "";

      this.messages.forEach((message, index) => {
        setTimeout(() => {
          const messageElement = message.render();
          if (messageElement) {
            // Анімація fade-in для всього блоку
            messageElement.style.opacity = "0";
            messageElement.style.transform = "translateY(20px)";
            messageElement.style.transition = "all 0.5s ease";

            this.chatContainer.appendChild(messageElement);

            // Запускаємо анімацію
            setTimeout(() => {
              messageElement.style.opacity = "1";
              messageElement.style.transform = "translateY(0)";
              this.scrollToBottom();
            }, 50);
          }
        }, 1500 + index * 1500);
      });
    }
  }

  class Message {
    constructor(characterId, text) {
      this.characterId = characterId;
      this.text = text;
    }

    getCharacter() {
      return Charakter.get(this.characterId);
    }

    render() {
      const character = this.getCharacter();
      let classList = "journey_slide-msg-arrow";
      if (!character) return null;
      const messageDiv = document.createElement("div");
      if (character.role === "Patient") {
        messageDiv.className = `journey_slide-text-item is--patient`;
      } else {
        messageDiv.className = `journey_slide-text-item is--doctor`;
        classList = "journey_slide-msg-arrow is--doctor";
      }

      messageDiv.innerHTML = `
        <div class="journey_slide-msg" style="background-color: ${character.color}">
          <p class="text-13">${this.text}</p>
          <img
            src="${character.arrow}"
            loading="lazy"
            width="14"
            height="9"
            alt=""
            class="${classList}"
          />
        </div>
        <div class="journey_slide-text-athor">
          <img
            src="${character.photo}"
            loading="lazy"
            width="50"
            height="50"
            alt=""
            class="journey_slide-text-avatar"
          />
          <div class="journey_slide-athor-text">
            <span class="is--black">${character.name}</span>
            <span class="text-14">${character.role}</span>
          </div>
        </div>
      `;

      return messageDiv;
    }
  }

  // Створення персонажів
  Charakter.create(
    "aleksandra",
    "Aleksandra",
    "Patient",
    "left",
    "https://cdn.prod.website-files.com/68b70312e022b8d32af2cf34/68c3297e57003d1eb8c5cc60_Avatar-Aleksandra.avif",
    "https://cdn.prod.website-files.com/68b70312e022b8d32af2cf34/68c415c9add6a68f722df3bd_Vector%2024%20(2).svg",
    "#0288D1"
  );

  Charakter.create(
    "marek",
    "Dr. Marek Nowak",
    "Psychiatrist",
    "right",
    "https://cdn.prod.website-files.com/68b70312e022b8d32af2cf34/68c4156fdc90bce712fce6fd_Avatar-Marek.avif",
    "https://cdn.prod.website-files.com/68b70312e022b8d32af2cf34/68c415c9539cce511eb79f45_Vector%2024%20(1).svg",
    "#02B286"
  );
  Charakter.create(
    "magda",
    "Dr. Magda Kvasneski",
    "Psychotherapist",
    "right",
    "https://cdn.prod.website-files.com/68b70312e022b8d32af2cf34/68c4156f131503c8fa39d66f_Avatar-Marek%20(1).avif",
    "https://cdn.prod.website-files.com/68b70312e022b8d32af2cf34/68c415c920184e022fc14a9c_Vector%2026.svg",
    "#DEB54F"
  );
  Charakter.create(
    "paulina",
    "Paulina Romazski",
    "Psychologist",
    "right",
    "https://cdn.prod.website-files.com/68b70312e022b8d32af2cf34/68c4156f850ef071a5ec4940_Avatar-Marek%20(2).avif",
    "https://cdn.prod.website-files.com/68b70312e022b8d32af2cf34/68c415c986a55a34642101e1_Vector%2028.svg",
    "#CD8DF7"
  );

  // Створюємо всі чати
  const chat1 = new Chat("#slide-1");
  const chat2 = new Chat("#slide-2");

  // Додаємо повідомлення до чатів
  chat1.message(
    "aleksandra",
    "I had my first session later that day. Magda helped me see patterns I never noticed. She also suggested I talk to a psychiatrist to help the process."
  );
  chat1.message(
    "marek",
    "In intense anxiety cases, short-term medication can make therapy more effective."
  );
  chat1.message(
    "aleksandra",
    "By week three, the panic attacks stopped. It felt like I was getting pieces of myself back"
  );
  chat1.message(
    "magda",
    "Once the storms calmed, we focused on tools—how to recognize early signals, how to respond instead of react."
  );
  chat1.message(
    "aleksandra",
    `After two months, I didn't need meds anymore. That's when I started sessions with Paulina to build habits that would last.`
  );
  chat1.message(
    "paulina",
    "My role was helping Aleksandra strengthen the foundation—so stress wouldn't undo her progress."
  );

  chat2.message(
    "aleksandra",
    "I had my first session later that day. Magda helped me see patterns I never noticed. She also suggested I talk to a psychiatrist to help the process."
  );
  chat2.message(
    "marek",
    "In intense anxiety cases, short-term medication can make therapy more effective."
  );
  chat2.message(
    "aleksandra",
    "By week three, the panic attacks stopped. It felt like I was getting pieces of myself back"
  );
  chat2.message(
    "magda",
    "Once the storms calmed, we focused on tools—how to recognize early signals, how to respond instead of react."
  );
  chat2.message(
    "aleksandra",
    `After two months, I didn't need meds anymore. That's when I started sessions with Paulina to build habits that would last.`
  );
  chat2.message(
    "paulina",
    "My role was helping Aleksandra strengthen the foundation—so stress wouldn't undo her progress."
  );

  // Створюємо об'єкт для зручного доступу до чатів за ID слайда
  const chats = {
    "slide-1": chat1,
    "slide-2": chat2,
  };

  // Запускаємо Observer для всіх слайдів після невеликої затримки
  setTimeout(() => {
    const slides = document.querySelectorAll(".swiper-slide");
    slides.forEach((slide) => {
      observer.observe(slide, {
        attributes: true,
        attributeFilter: ["class"],
      });
    });

    // Перевіряємо, чи вже є активний слайд при ініціалізації
    const activeSlide = document.querySelector(".swiper-slide-active");
    if (activeSlide && activeSlide.id && !renderedChats.has(activeSlide.id)) {
      const chat = chats[activeSlide.id];
      if (chat) {
        chat.render();
        renderedChats.add(activeSlide.id);
      }
    }
  }, 100);
});

// loading-tl з clearProps для кнопок
document.addEventListener("DOMContentLoaded", () => {
  const loadContainer = document.querySelector(".hero_container");
  const typeTitle = loadContainer.querySelector(".title-50");
  const buttons = loadContainer.querySelectorAll(".btn-main, .btn-secondary");
  const avatarsContainer = loadContainer.querySelector(
    ".hero_container-avatars"
  );
  const avatars = avatarsContainer.querySelectorAll(
    ".hero_container-avatar, .hero_small-text"
  );
  const tooltips = loadContainer.querySelectorAll(".hero_container-tooltip");
  const cursor = loadContainer.querySelector("#cursor");
  const mainTitle = document.querySelector("#main-title");
  const text = "We've Got You.";
  const charsArr = text.split("");

  typeTitle.textContent = "";

  // Main timeline
  const masterTl = gsap.timeline();

  // Cursor animation
  gsap.to(cursor, {
    opacity: 0,
    repeat: -1,
    yoyo: true,
    duration: 0.5,
  });

  // Typing animation
  charsArr.forEach((char, i) => {
    masterTl.call(
      () => {
        typeTitle.textContent += char;
      },
      null,
      i * 0.1
    );
  });

  // Hide cursor and fade out typed text
  masterTl.set(cursor, { display: "none" }).to(
    typeTitle,
    {
      opacity: 0,
      yPercent: -80,
    },
    "+=0.5"
  );

  // 2nd part of anim
  gsap.set(buttons, { opacity: 0, y: 20 });
  gsap.set(avatars, { opacity: 0, y: 20 });
  gsap.set(tooltips, { opacity: 0, y: 20 });

  // Show main title and split text animation
  masterTl.set(mainTitle, { opacity: 1 }).call(() => {
    // SplitText тільки після завершення typewriter
    const splitText = SplitText.create(mainTitle, {
      type: "lines",
      mask: "lines",
      linesClass: "split-line",
      autoSplit: true,
    });
    gsap.set(splitText.lines, { opacity: 0, yPercent: 100 });
    gsap.to(splitText.lines, {
      yPercent: 0,
      opacity: 1,
      duration: 1,
      ease: "power4.out",
      stagger: 0.15,
    });
  });

  // Other elements - ОЧИЩУЄМО TRANSFORM ДЛЯ КНОПОК
  masterTl.call(
    () => {
      // Анімація кнопок з clearProps
      gsap.to(buttons, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
        onComplete: () => {
          // Очищуємо всі GSAP inline стилі для кнопок
          gsap.set(buttons, {
            clearProps: "transform,opacity,y",
            opacity: 1,
          });

          // Додаємо клас для позначення завершення анімації (опціонально)
          buttons.forEach((btn) => {
            btn.classList.add("gsap-animation-complete");
          });
        },
      });

      // Анімація аватарів (без clearProps, якщо hover не потрібен)
      gsap.to(avatars, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power4.out",
        stagger: 0.05,
      });

      // Анімація тултипів (без clearProps, якщо hover не потрібен)
      gsap.to(tooltips, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power4.out",
        stagger: 0.05,
      });
    },
    null,
    "+=0.5"
  );
});

// loading-tl з clearProps для кнопок та раннім створенням SplitText
document.addEventListener("DOMContentLoaded", () => {
  const loadContainer = document.querySelector(".hero_container");
  const typeTitle = loadContainer.querySelector(".title-50");
  const buttons = loadContainer.querySelectorAll(".btn-main, .btn-secondary");
  const avatarsContainer = loadContainer.querySelector(
    ".hero_container-avatars"
  );
  const avatars = avatarsContainer.querySelectorAll(
    ".hero_container-avatar, .hero_small-text"
  );
  const tooltips = loadContainer.querySelectorAll(".hero_container-tooltip");
  const cursor = loadContainer.querySelector("#cursor");
  const mainTitle = document.querySelector("#main-title");
  const text = "We've Got You.";
  const charsArr = text.split("");

  typeTitle.textContent = "";

  // ВАЖЛИВО: Створюємо SplitText одразу, щоб браузер розрахував висоту правильно
  const splitText = SplitText.create(mainTitle, {
    type: "lines",
    mask: "lines",
    linesClass: "split-line",
    autoSplit: true,
  });

  // Встановлюємо початкові стани для SplitText
  gsap.set(splitText.lines, { opacity: 0, yPercent: 100 });
  gsap.set(mainTitle, { opacity: 0 }); // Спочатку ховаємо весь заголовок

  // Main timeline
  const masterTl = gsap.timeline();

  // Cursor animation
  gsap.to(cursor, {
    opacity: 0,
    repeat: -1,
    yoyo: true,
    duration: 0.5,
  });

  // Typing animation
  charsArr.forEach((char, i) => {
    masterTl.call(
      () => {
        typeTitle.textContent += char;
      },
      null,
      i * 0.1
    );
  });

  // Hide cursor and fade out typed text
  masterTl.set(cursor, { display: "none" }).to(
    typeTitle,
    {
      opacity: 0,
      yPercent: -80,
    },
    "+=0.5"
  );

  // 2nd part of anim
  gsap.set(buttons, { opacity: 0, y: 20 });
  gsap.set(avatars, { opacity: 0, y: 20 });
  gsap.set(tooltips, { opacity: 0, y: 20 });

  // Show main title - тепер SplitText вже створений, тому немає перерахунку висоти
  masterTl.set(mainTitle, { opacity: 1 }).to(splitText.lines, {
    yPercent: 0,
    opacity: 1,
    duration: 1,
    ease: "power4.out",
    stagger: 0.15,
  });

  // Other elements - ОЧИЩУЄМО TRANSFORM ДЛЯ КНОПОК
  masterTl.call(
    () => {
      // Анімація кнопок з clearProps
      gsap.to(buttons, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
        onComplete: () => {
          // Очищуємо всі GSAP inline стилі для кнопок
          gsap.set(buttons, {
            clearProps: "transform,opacity,y",
            opacity: 1,
          });

          // Додаємо клас для позначення завершення анімації (опціонально)
          buttons.forEach((btn) => {
            btn.classList.add("gsap-animation-complete");
          });
        },
      });

      // Анімація аватарів (без clearProps, якщо hover не потрібен)
      gsap.to(avatars, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power4.out",
        stagger: 0.05,
      });

      // Анімація тултипів (без clearProps, якщо hover не потрібен)
      gsap.to(tooltips, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power4.out",
        stagger: 0.05,
      });
    },
    null,
    "+=0.5"
  );
});

//norm pc

document.addEventListener("DOMContentLoaded", () => {
  class Kaif {
    constructor(containerSelector) {
      this.container = document.querySelector(containerSelector);
      if (!this.container) return;

      this.faces = this.container.querySelectorAll(".faces_item");
      this.modals = [];
      this.buttons = [];
      this.balls = [];
      this.ballData = [];

      // Збираємо всі кульки та тултіпи з faces_item
      this.faces.forEach((face) => {
        const button = face.querySelector(".faces_item-contain");
        const modal = face.querySelector(".faces_item-tooltip_wrp");
        if (button && modal) {
          this.buttons.push(button);
          this.modals.push(modal);
          this.balls.push(button);
          // Встановлюємо зв'язок між кнопкою і модалкою через data атрибут
          const modalId =
            modal.id || `modal_${Math.random().toString(36).substr(2, 9)}`;
          modal.id = modalId;
          button.dataset.openModal = modalId;
        }
      });

      this.friction = 0.998;
      this.wallBounce = 0.85;
      this.minSpeed = 0.167; // зменшено в 3 рази (0.5 / 3)
      this.maxSpeed = 1.0; // зменшено в 3 рази (3.0 / 3)

      // Перевірка підтримки hover і розміру екрана
      this.hasHover = window.matchMedia("(hover: hover)").matches;
      this.isDesktop = window.matchMedia("(min-width: 992px)").matches;

      this.init();
    }

    init() {
      // Слухаємо зміни розміру екрана
      const mediaQuery = window.matchMedia("(min-width: 992px)");
      mediaQuery.addListener((e) => {
        this.isDesktop = e.matches;
        if (!this.isDesktop) {
          // Якщо екран менше 992px, закриваємо всі модалки
          this.closeAllModals();
        }
      });

      this.updateContainerSize();
      window.addEventListener("resize", this.updateContainerSize.bind(this));
      this.balls.forEach((ball) => this.setupBall(ball));
      this.buttons.forEach((btn) => {
        // Завжди додаємо обробник кліку
        btn.addEventListener("click", () => this.handleClick(btn));
        // Додаємо обробники hover тільки якщо пристрій підтримує hover і екран > 991px
        if (this.hasHover) {
          btn.addEventListener("mouseenter", () => this.handleHover(btn));
          btn.addEventListener("mouseleave", () => this.handleHoverLeave(btn));
        }
      });
      document.addEventListener("click", (e) => this.closeOnOutsideClick(e));
      document.addEventListener("keydown", (e) => this.closeOnEscape(e));
      this.update();
    }

    updateContainerSize() {
      this.containerRect = this.container.getBoundingClientRect();
      this.vw = this.containerRect.width;
      this.vh = this.containerRect.height;
    }

    setupBall(ball) {
      const radius = ball.offsetWidth / 2;
      const x = Math.random() * (this.vw - radius * 2) + radius;
      const y = Math.random() * (this.vh - radius * 2) + radius;
      gsap.set(ball, { xPercent: -50, yPercent: -50, x, y });

      const data = {
        el: ball,
        radius,
        get x() {
          return gsap.getProperty(ball, "x");
        },
        get y() {
          return gsap.getProperty(ball, "y");
        },
        vx: (Math.random() - 0.5) * 0.667, // зменшено в 3 рази (2 / 3)
        vy: (Math.random() - 0.5) * 0.667, // зменшено в 3 рази (2 / 3)
        isHovered: false,
        savedVx: 0,
        savedVy: 0,
      };

      ball._ballData = data;
      this.ballData.push(data);
    }

    maintainMovement(ball) {
      const currentSpeed = Math.sqrt(ball.vx ** 2 + ball.vy ** 2);
      if (currentSpeed < this.minSpeed) {
        const angle =
          Math.atan2(ball.vy, ball.vx) + (Math.random() - 0.5) * 0.5;
        ball.vx = Math.cos(angle) * this.minSpeed;
        ball.vy = Math.sin(angle) * this.minSpeed;
      }
      if (currentSpeed > this.maxSpeed) {
        ball.vx = (ball.vx / currentSpeed) * this.maxSpeed;
        ball.vy = (ball.vy / currentSpeed) * this.maxSpeed;
      }
    }

    handleCollisions() {
      for (let i = 0; i < this.ballData.length; i++) {
        const ball1 = this.ballData[i];
        for (let j = i + 1; j < this.ballData.length; j++) {
          const ball2 = this.ballData[j];
          const dx = ball2.x - ball1.x;
          const dy = ball2.y - ball1.y;
          const dist = Math.sqrt(dx ** 2 + dy ** 2);
          const minDist = ball1.radius + ball2.radius;

          if (dist < minDist && dist > 0) {
            const angle = Math.atan2(dy, dx);
            const overlap = minDist - dist;
            const sepX = Math.cos(angle) * overlap * 0.5;
            const sepY = Math.sin(angle) * overlap * 0.5;

            if (!ball1.isHovered)
              gsap.set(ball1.el, { x: ball1.x - sepX, y: ball1.y - sepY });
            if (!ball2.isHovered)
              gsap.set(ball2.el, { x: ball2.x + sepX, y: ball2.y + sepY });

            const normalX = dx / dist;
            const normalY = dy / dist;
            const relVX = ball2.vx - ball1.vx;
            const relVY = ball2.vy - ball1.vy;
            const velAlongNormal = relVX * normalX + relVY * normalY;

            if (velAlongNormal > 0) continue;

            const restitution = 0.9;
            const impulse = (2 * velAlongNormal * restitution) / 2;
            const impulseX = impulse * normalX;
            const impulseY = impulse * normalY;

            if (!ball1.isHovered) {
              ball1.vx += impulseX;
              ball1.vy += impulseY;
            }
            if (!ball2.isHovered) {
              ball2.vx -= impulseX;
              ball2.vy -= impulseY;
            }
          }
        }
      }
    }

    update() {
      this.ballData.forEach((ball) => {
        if (!ball.isHovered) {
          ball.vx *= this.friction;
          ball.vy *= this.friction;
          this.maintainMovement(ball);

          let newX = ball.x + ball.vx;
          let newY = ball.y + ball.vy;

          if (newX - ball.radius <= 0) {
            newX = ball.radius;
            ball.vx = Math.abs(ball.vx) * this.wallBounce;
          } else if (newX + ball.radius >= this.vw) {
            newX = this.vw - ball.radius;
            ball.vx = -Math.abs(ball.vx) * this.wallBounce;
          }

          if (newY - ball.radius <= 0) {
            newY = ball.radius;
            ball.vy = Math.abs(ball.vy) * this.wallBounce;
          } else if (newY + ball.radius >= this.vh) {
            newY = this.vh - ball.radius;
            ball.vy = -Math.abs(ball.vy) * this.wallBounce;
          }

          gsap.set(ball.el, { x: newX, y: newY });
        }
      });

      this.handleCollisions();
      requestAnimationFrame(this.update.bind(this));
    }

    restartBallMovement(ballEl) {
      const data = ballEl._ballData;
      if (data) {
        const angle = Math.random() * Math.PI * 2;
        data.vx = Math.cos(angle) * (this.minSpeed + Math.random() * 0.333); // зменшено в 3 рази (1 / 3)
        data.vy = Math.sin(angle) * (this.minSpeed + Math.random() * 0.333); // зменшено в 3 рази (1 / 3)
      }
    }

    positionModal(modal, refEl) {
      modal.style.position = "absolute";
      modal.style.margin = "0";
      modal.style.display = "block";

      FloatingUIDOM.computePosition(refEl, modal, {
        placement: "bottom-end", // права-знизу за замовчуванням
        middleware: [
          FloatingUIDOM.offset(10),
          FloatingUIDOM.shift({ padding: 8, rootBoundary: "document" }),
        ],
      })
        .then(({ x, y }) => {
          modal.style.left = `${x}px`;
          modal.style.top = `${y}px`;
        })
        .catch(console.error);
    }

    // Анімація іконки
    animateIcon(btn, rotate = true) {
      const icon = btn.querySelector(".btn-face-item_icon");
      if (icon) {
        gsap.to(icon, {
          rotation: rotate ? 45 : 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }

    handleHover(btn) {
      // Перевіряємо чи працюємо на великому екрані
      if (!this.isDesktop) return;

      // Анімуємо іконку
      this.animateIcon(btn, true);

      // Зупиняємо рух кульки
      const data = btn._ballData;
      if (data) {
        data.isHovered = true;
        // Зберігаємо поточну швидкість
        data.savedVx = data.vx;
        data.savedVy = data.vy;
        // Зупиняємо рух
        data.vx = 0;
        data.vy = 0;
      }

      // Затримка для hover
      clearTimeout(btn._hoverTimeout);
      btn._hoverTimeout = setTimeout(() => {
        this.openModal(btn);
      }, 150);
    }

    handleHoverLeave(btn) {
      // Перевіряємо чи працюємо на великому екрані
      if (!this.isDesktop) return;

      // Анімуємо іконку назад
      this.animateIcon(btn, false);

      // Відновлюємо рух кульки
      const data = btn._ballData;
      if (data && data.isHovered) {
        data.isHovered = false;
        // Відновлюємо збережену швидкість або генеруємо нову
        if (data.savedVx !== undefined && data.savedVy !== undefined) {
          data.vx = data.savedVx;
          data.vy = data.savedVy;
        } else {
          const angle = Math.random() * Math.PI * 2;
          data.vx = Math.cos(angle) * this.minSpeed;
          data.vy = Math.sin(angle) * this.minSpeed;
        }
      }

      // Скасовуємо відкриття якщо миша покинула елемент
      clearTimeout(btn._hoverTimeout);

      // Додаємо затримку перед закриттям
      const buttonTarget = btn.dataset.openModal;
      const modal = document.getElementById(buttonTarget);
      if (modal && modal.style.display === "block") {
        clearTimeout(btn._closeTimeout);
        btn._closeTimeout = setTimeout(() => {
          if (!modal.matches(":hover") && !btn.matches(":hover")) {
            this.closeModal(modal, btn);
          }
        }, 300);
      }
    }

    handleClick(btn) {
      // Перевіряємо чи працюємо на великому екрані
      if (!this.isDesktop) return;

      this.openModal(btn);
    }

    openModal(btn) {
      // Перевіряємо чи працюємо на великому екрані
      if (!this.isDesktop) return;

      const buttonTarget = btn.dataset.openModal;
      const targetModal = document.getElementById(buttonTarget);

      if (!targetModal) return;

      // Перевіряємо чи вже відкрита ця модалка
      if (targetModal.style.display === "block") return;

      this.buttons.forEach((b) => b.classList.remove("is--active-cirlce"));
      btn.classList.add("is--active-cirlce");
      btn.style.zIndex = 30;

      // Закриваємо всі інші модалки
      this.modals.forEach((modal) => {
        if (modal !== targetModal) {
          modal.style.display = "none";
        }
      });

      // Відкриваємо цільову модалку
      const updatePosition = () => {
        if (targetModal.style.display === "block") {
          this.positionModal(targetModal, btn);
        }
      };

      targetModal.style.opacity = "0";
      targetModal.style.display = "block";
      targetModal.style.zIndex = 70; // Встановлюємо z-index для активного тултіпа

      // Додаємо обробники hover для модалки (якщо підтримується hover)
      if (this.hasHover) {
        targetModal.addEventListener("mouseenter", () => {
          clearTimeout(btn._closeTimeout);
        });
        targetModal.addEventListener("mouseleave", () => {
          clearTimeout(btn._closeTimeout);
          btn._closeTimeout = setTimeout(() => {
            if (!targetModal.matches(":hover") && !btn.matches(":hover")) {
              this.closeModal(targetModal, btn);
            }
          }, 300);
        });
      }

      this.positionModal(targetModal, btn);

      setTimeout(() => {
        targetModal.style.opacity = "1";
        targetModal.style.transition = "opacity 0.2s";
      }, 150);

      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);

      // Зберігаємо посилання на обробники для видалення
      targetModal._updatePosition = updatePosition;
    }

    closeModal(modal, btn) {
      modal.style.display = "none";
      modal.style.zIndex = ""; // Скидаємо z-index при закритті
      btn.classList.remove("is--active-cirlce");

      // Анімуємо іконку назад при закритті
      this.animateIcon(btn, false);

      // Видаляємо обробники
      if (modal._updatePosition) {
        window.removeEventListener("resize", modal._updatePosition);
        window.removeEventListener("scroll", modal._updatePosition, true);
      }

      setTimeout(() => this.restartBallMovement(btn), 100);
    }

    closeAllModals() {
      this.modals.forEach((modal, index) => {
        if (modal.style.display === "block") {
          this.closeModal(modal, this.buttons[index]);
        }
      });
    }

    closeOnOutsideClick(e) {
      if (!this.isDesktop) return;

      this.modals.forEach((modal, index) => {
        if (
          modal.style.display === "block" &&
          !modal.contains(e.target) &&
          !this.buttons[index].contains(e.target)
        ) {
          this.closeModal(modal, this.buttons[index]);
        }
      });
    }

    closeOnEscape(e) {
      if (!this.isDesktop) return;

      if (e.key === "Escape") {
        this.modals.forEach((modal, index) => {
          if (modal.style.display === "block") {
            this.closeModal(modal, this.buttons[index]);
          }
        });
      }
    }
  }

  new Kaif(".faces_block-space");
});
