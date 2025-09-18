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
        // Перше повідомлення без затримки (index === 0)
        const delay = index === 0 ? 0 : 1500 + (index - 1) * 1500;

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

  // Intersection Observer для першого слайду
  const firstSlideObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          const slideId = entry.target.id;

          if (slideId && !renderedChats.has(slideId)) {
            const chat = chats[slideId];
            if (chat) {
              chat.render();
              renderedChats.add(slideId);
            }
          }
        }
      });
    },
    {
      threshold: [0.4], // Запускається коли слайд видимий на 40%
    }
  );

  // Запускаємо Observer для всіх слайдів після невеликої затримки
  setTimeout(() => {
    const slides = document.querySelectorAll(".swiper-slide");
    slides.forEach((slide, index) => {
      if (index === 0) {
        // Перший слайд спостерігаємо за допомогою Intersection Observer
        firstSlideObserver.observe(slide);
      } else {
        // Інші слайди спостерігаємо за допомогою Mutation Observer
        observer.observe(slide, {
          attributes: true,
          attributeFilter: ["class"],
        });
      }
    });
  }, 100);
});
