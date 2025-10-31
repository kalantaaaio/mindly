document.addEventListener("DOMContentLoaded", () => {
  var swiper = new Swiper(".swiper.is--journey", {
    slidesPerView: "auto",
    centeredSlides: true,
    slideToClickedSlide: true,
    mousewheel: {
      forceToAxis: true,
      sensitivity: 0.5,
      thresholdDelta: 75, // поріг для спрацювання (у пікселях)
      thresholdTime: 500,
    },
    navigation: {
      nextEl: ".s-button-next.is--journey",
      prevEl: ".s-button-prev.is--journey",
    },
    breakpoints: {
      320: {
        spaceBetween: 8,
      },
      768: {
        spaceBetween: 20,
      },
    },
  });
  const slideToggles = document.querySelectorAll(".journey-slide-nav_item");

  if (slideToggles && slideToggles.length > 0) {
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
  }

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
      }, 1);
    }

    render() {
      this.chatContainer.innerHTML = "";

      this.messages.forEach((message, index) => {
        // Перше повідомлення без затримки (index === 0)
        const delay = index === 0 ? 0 : 1000 + (index - 1) * 1000;

        // Перевіряємо, чи наступне повідомлення від того ж автора
        const nextMessage = this.messages[index + 1];
        const isLastInSequence =
          !nextMessage || nextMessage.characterId !== message.characterId;

        setTimeout(() => {
          const messageElement = message.render(isLastInSequence);
          if (messageElement) {
            // Додаємо новий елемент
            this.chatContainer.appendChild(messageElement);

            // Анімуємо через GSAP
            gsap.fromTo(
              messageElement,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => this.scrollToBottom(),
              }
            );
          }
        }, delay);
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

    render(isLastInSequence = true) {
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

      // Формуємо HTML для автора тільки якщо це останнє повідомлення в послідовності
      const authorHTML = isLastInSequence
        ? `
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
      `
        : "";

      messageDiv.innerHTML = `
        <div class="journey_slide-msg" style="background-color: ${character.color}">
          <p class="text-14">${this.text}</p>
          <img
            src="${character.arrow}"
            loading="lazy"
            width="14"
            height="9"
            alt=""
            class="${classList}"
          />
        </div>
        ${authorHTML}
      `;

      return messageDiv;
    }
  }

  // Створення персонажів
  Charakter.create(
    "emily",
    "Emily",
    "Patient",
    "left",
    "https://cdn.prod.website-files.com/68b70312e022b8d32af2cf34/68f7aa5aeea968ed26cd676d_Avatar-Aleksandra.webp",
    "https://cdn.prod.website-files.com/68b70312e022b8d32af2cf34/68c415c9add6a68f722df3bd_Vector%2024%20(2).svg",
    "#0288D1"
  );

  Charakter.create(
    "sarah",
    "Dr. Sarah Mitchell",
    "Therapist",
    "right",
    "https://cdn.prod.website-files.com/68b70312e022b8d32af2cf34/68f7aa6fdb2b0a7f1ae673fc_Avatar-Marek.webp",
    "https://cdn.prod.website-files.com/68b70312e022b8d32af2cf34/68c415c9539cce511eb79f45_Vector%2024%20(1).svg",
    "#02B286"
  );
  Charakter.create(
    "james",
    "Dr. James Carter",
    "Psychotherapist",
    "right",
    "https://cdn.prod.website-files.com/68b70312e022b8d32af2cf34/68f7aa6f3df539b3fbeb8f3a_Avatar-Marek-1.webp",
    "https://cdn.prod.website-files.com/68b70312e022b8d32af2cf34/68c415c920184e022fc14a9c_Vector%2026.svg",
    "#DEB54F"
  );
  Charakter.create(
    "rachel",
    "Rachel Nguyen",
    "Psychologist",
    "right",
    "https://cdn.prod.website-files.com/68b70312e022b8d32af2cf34/68f7aa6f4df3bf9050169455_Avatar-Marek-2.webp",
    "https://cdn.prod.website-files.com/68b70312e022b8d32af2cf34/68c415c986a55a34642101e1_Vector%2028.svg",
    "#CD8DF7"
  );

  // Створюємо всі чати
  const chat1 = new Chat("#slide-1");
  const chat2 = new Chat("#slide-2");
  const chat3 = new Chat("#slide-3");

  // Додаємо повідомлення до чатів
  chat1.message(
    "emily",
    "I wasn’t just anxious—I was scared of being scared. Every day felt like survival, and I didn’t know how much longer I could do it."
  );
  chat1.message(
    "emily",
    'I tried mindfulness apps. Read self-help blogs. Nothing stuck. What I needed was real help—not another suggestion to "just breathe".'
  );
  chat1.message(
    "sarah",
    "When Emily came to Mindly, she was in survival mode. Our first step was simply creating a space where she felt safe enough to begin our journey."
  );

  chat2.message(
    "emily",
    "I had my first session later that day. Sarah helped me see patterns I never noticed. She also suggested I talk to a psychiatrist to help the process"
  );
  chat2.message(
    "james",
    "In intense anxiety cases, short-term medication can make therapy more effective"
  );
  chat2.message(
    "emily",
    "By week three, the panic attacks stopped. It felt like I was getting pieces of myself back"
  );
  chat2.message(
    "sarah",
    "Once the storms calmed, we focused on tools—how to recognize early signals, how to respond instead of react"
  );
  chat2.message(
    "emily",
    "After two months, I didn’t need medication anymore. That’s when I started sessions with Rachel to build lasting habits"
  );
  chat2.message(
    "rachel",
    "My role was to help Emily strengthen the foundation—so that stress wouldn’t undo her progress"
  );

  chat3.message(
    "emily",
    "A few months ago, panic attacks ruled my life. Now, I feel steady, strong, and calm. I have tools that actually work—and I know Mindly is there the moment I need support."
  );
  chat3.message(
    "sarah",
    "When Emily first came to Mindly, she was overwhelmed and terrified. Now, she’s grounded, confident, and in control—this is what real progress looks like"
  );
  chat3.message(
    "james",
    "Medication gave her the initial relief she needed to break the panic cycle. But she no longer needs it—her stability today comes from her own strength and structured care."
  );
  chat3.message(
    "rachel",
    "Together, we focused on building lasting strategies. She doesn’t rely on sessions to stay balanced—she carries the tools with her, and uses them with real clarity."
  );

  // Створюємо об'єкт для зручного доступу до чатів за ID слайда
  const chats = {
    "slide-1": chat1,
    "slide-2": chat2,
    "slide-3": chat3,
  };

  // Функція для рендерингу чату для слайду
  function renderChatForSlide(slideId) {
    if (slideId && !renderedChats.has(slideId)) {
      const chat = chats[slideId];
      if (chat) {
        chat.render();
        renderedChats.add(slideId);
      }
    }
  }

  // Запускаємо Observer для всіх слайдів після невеликої затримки
  setTimeout(() => {
    const slides = document.querySelectorAll(".swiper-slide.is--journey");

    // Додаємо observers
    slides.forEach((slide, index) => {
      // Всі слайди спостерігаємо за допомогою Mutation Observer
      observer.observe(slide, {
        attributes: true,
        attributeFilter: ["class"],
      });

      if (index === 0) {
        // Для першого слайду додатково використовуємо ScrollTrigger
        const swiperContainer = slide.closest(".swiper.is--journey");

        ScrollTrigger.create({
          trigger: swiperContainer,
          start: "top 50%",
          onEnter: () => {
            if (slide.classList.contains("swiper-slide-active")) {
              renderChatForSlide(slide.id);
            }
          },
          onEnterBack: () => {
            if (slide.classList.contains("swiper-slide-active")) {
              renderChatForSlide(slide.id);
            }
          },
          onRefresh: () => {
            if (slide.classList.contains("swiper-slide-active")) {
              const rect = swiperContainer.getBoundingClientRect();
              const isInViewport =
                rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
              if (isInViewport) {
                renderChatForSlide(slide.id);
              }
            }
          },
        });

        // Перевіряємо одразу при завантаженні
        if (slide.classList.contains("swiper-slide-active")) {
          const rect = swiperContainer.getBoundingClientRect();
          const isInViewport =
            rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
          if (isInViewport) {
            renderChatForSlide(slide.id);
          }
        }
      }
    });

    // Оновлюємо ScrollTrigger після ініціалізації
    ScrollTrigger.refresh();
  }, 10);
});
