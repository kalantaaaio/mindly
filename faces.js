//faces-tooltips appereance
document.addEventListener("DOMContentLoaded", () => {
  const faces = document.querySelectorAll(".faces_item");
  const sticker = document.querySelector(".faces_sticker");
  const block = document.querySelector(".faces_block");
  faces.forEach((face) => {
    const tooltipsText = face.querySelector(".text-invisible").textContent;
    const tooltipsWrp = face.querySelector(".faces_item-texts");
    let splittedText = tooltipsText.split(",").map((item) => item.trim());
    splittedText.forEach((item) => {
      const div = document.createElement("div");
      div.className = "faces_item-text";
      div.innerHTML = `<span class="text-14">${item}</span>`;
      tooltipsWrp.appendChild(div);
    });
  });

  gsap.set(block, { opacity: 0, y: 50 });
  let facesAppearTl = gsap.timeline({ paused: true });
  facesAppearTl.to(block, { opacity: 1, y: 0, duration: 0.5 });
  facesAppearTl.from(
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
    trigger: block,
    start: "top 70%",
    onEnter: () => {
      facesAppearTl.play();
    },
  });
});

//moving-faces
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
      this.animationRunning = false;
      this.animationFrame = null;

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

      // Покращені параметри для плавнішого руху
      this.friction = 0.995; // менше тертя для плавнішого руху
      this.wallBounce = 0.7; // менший відскок від стін
      this.minSpeed = 0.16; // збільшено в 2 рази (0.08 * 2)
      this.maxSpeed = 0.8; // збільшено в 2 рази (0.4 * 2)
      this.speedVariation = 0.2; // збільшено варіацію швидкості
      this.avoidanceRadius = 80; // радіус уникнення інших кульок
      this.avoidanceForce = 0.015; // сила уникнення

      // GSAP MatchMedia для responsive логіки
      this.mm = gsap.matchMedia();

      this.init();
    }

    init() {
      this.updateContainerSize();
      window.addEventListener("resize", this.updateContainerSize.bind(this));
      this.balls.forEach((ball) => this.setupBall(ball));

      // Налаштовуємо responsive поведінку через GSAP MatchMedia
      this.setupResponsive();
    }

    setupResponsive() {
      // Для екранів 992px і більше - повна функціональність з тултіпами
      this.mm.add("(min-width: 992px)", () => {
        console.log("Desktop mode activated");

        // Запускаємо анімацію руху куль тільки для desktop
        this.animationRunning = true;
        this.update();

        // Додаємо обробники подій для desktop
        this.buttons.forEach((btn) => {
          // Завжди додаємо обробник кліку
          const clickHandler = () => this.handleClick(btn);
          btn.addEventListener("click", clickHandler);

          // Додаємо обробники hover для desktop
          const hoverEnterHandler = () => this.handleHover(btn);
          const hoverLeaveHandler = () => this.handleHoverLeave(btn);

          btn.addEventListener("mouseenter", hoverEnterHandler);
          btn.addEventListener("mouseleave", hoverLeaveHandler);

          // Зберігаємо посилання на обробники для очищення
          btn._clickHandler = clickHandler;
          btn._hoverEnterHandler = hoverEnterHandler;
          btn._hoverLeaveHandler = hoverLeaveHandler;
        });

        // Додаємо глобальні обробники
        const outsideClickHandler = (e) => this.closeOnOutsideClick(e);
        const escapeHandler = (e) => this.closeOnEscape(e);

        document.addEventListener("click", outsideClickHandler);
        document.addEventListener("keydown", escapeHandler);

        // Зберігаємо посилання для очищення
        this._outsideClickHandler = outsideClickHandler;
        this._escapeHandler = escapeHandler;

        // Cleanup function для desktop режиму
        return () => {
          console.log("Desktop mode deactivated");

          // Зупиняємо анімацію
          this.stopAnimation();

          // Закриваємо всі модалки при переході на мобільний
          this.closeAllModals();

          // Видаляємо обробники подій
          this.buttons.forEach((btn) => {
            if (btn._clickHandler)
              btn.removeEventListener("click", btn._clickHandler);
            if (btn._hoverEnterHandler)
              btn.removeEventListener("mouseenter", btn._hoverEnterHandler);
            if (btn._hoverLeaveHandler)
              btn.removeEventListener("mouseleave", btn._hoverLeaveHandler);

            // Очищуємо посилання
            btn._clickHandler = null;
            btn._hoverEnterHandler = null;
            btn._hoverLeaveHandler = null;
          });

          // Видаляємо глобальні обробники
          if (this._outsideClickHandler) {
            document.removeEventListener("click", this._outsideClickHandler);
            this._outsideClickHandler = null;
          }
          if (this._escapeHandler) {
            document.removeEventListener("keydown", this._escapeHandler);
            this._escapeHandler = null;
          }
        };
      });

      // Для мобільних екранів - FLIP анімації з переміщенням тултіпів
      this.mm.add("(max-width: 991.98px)", () => {
        console.log("Mobile mode activated");

        // Закриваємо всі desktop модалки
        this.closeAllModals();

        // Додаємо мобільні обробники кліку
        this.buttons.forEach((btn) => {
          const clickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleMobileClick(btn);
          };
          btn.addEventListener("click", clickHandler);
          btn._mobileClickHandler = clickHandler;
        });

        // Глобальний обробник для закриття мобільних модалок
        const outsideClickHandler = (e) =>
          this.closeMobileModalsOnOutsideClick(e);
        document.addEventListener("click", outsideClickHandler);
        this._mobileOutsideClickHandler = outsideClickHandler;

        // Cleanup function для мобільного режиму
        return () => {
          console.log("Mobile mode deactivated");

          // Закриваємо всі мобільні модалки
          this.closeAllMobileModals();

          // Видаляємо мобільні обробники
          this.buttons.forEach((btn) => {
            if (btn._mobileClickHandler) {
              btn.removeEventListener("click", btn._mobileClickHandler);
              btn._mobileClickHandler = null;
            }
          });

          if (this._mobileOutsideClickHandler) {
            document.removeEventListener(
              "click",
              this._mobileOutsideClickHandler
            );
            this._mobileOutsideClickHandler = null;
          }
        };
      });
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
        // Початкова швидкість стала більшою для швидшого руху
        vx: (Math.random() - 0.5) * 0.6, // збільшено в 2 рази
        vy: (Math.random() - 0.5) * 0.6, // збільшено в 2 рази
        isHovered: false,
        savedVx: 0,
        savedVy: 0,
        // Додаємо плавний розгін
        targetVx: 0,
        targetVy: 0,
        accelerationFactor: 0.02, // швидкість зміни напрямку
      };

      // Встановлюємо початкові цільові швидкості
      data.targetVx = data.vx;
      data.targetVy = data.vy;

      ball._ballData = data;
      this.ballData.push(data);
    }

    // Метод для уникнення інших кульок
    calculateAvoidanceForce(ball) {
      let avoidX = 0;
      let avoidY = 0;

      for (const other of this.ballData) {
        if (other === ball || other.isHovered) continue;

        const dx = ball.x - other.x;
        const dy = ball.y - other.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);

        // Якщо інша кулька в радіусі уникнення
        if (distance < this.avoidanceRadius && distance > 0) {
          // Розраховуємо силу уникнення (сильніше при меншій відстані)
          const strength =
            (this.avoidanceRadius - distance) / this.avoidanceRadius;
          const normalizedX = dx / distance;
          const normalizedY = dy / distance;

          avoidX += normalizedX * strength * this.avoidanceForce;
          avoidY += normalizedY * strength * this.avoidanceForce;
        }
      }

      return { x: avoidX, y: avoidY };
    }

    // Покращений метод підтримки руху з плавними змінами та уникненням
    maintainMovement(ball) {
      const currentSpeed = Math.sqrt(ball.vx ** 2 + ball.vy ** 2);

      // Додаємо силу уникнення інших кульок
      const avoidance = this.calculateAvoidanceForce(ball);
      ball.targetVx += avoidance.x;
      ball.targetVy += avoidance.y;

      // Якщо швидкість занадто мала, плавно розганяємо
      if (currentSpeed < this.minSpeed) {
        // Випадкова зміна напрямку з плавним переходом
        const angle =
          Math.atan2(ball.vy, ball.vx) + (Math.random() - 0.5) * 0.3;
        ball.targetVx =
          Math.cos(angle) *
          (this.minSpeed + Math.random() * this.speedVariation);
        ball.targetVy =
          Math.sin(angle) *
          (this.minSpeed + Math.random() * this.speedVariation);
      }

      // Якщо швидкість занадто велика, плавно сповільнюємо
      if (currentSpeed > this.maxSpeed) {
        const scale = this.maxSpeed / currentSpeed;
        ball.targetVx = ball.vx * scale;
        ball.targetVy = ball.vy * scale;
      }

      // Плавно наближаємо поточну швидкість до цільової
      ball.vx += (ball.targetVx - ball.vx) * ball.accelerationFactor;
      ball.vy += (ball.targetVy - ball.vy) * ball.accelerationFactor;

      // Іноді змінюємо напрямок для більш природного руху
      if (Math.random() < 0.003) {
        // 0.3% шанс кожен кадр
        const currentAngle = Math.atan2(ball.vy, ball.vx);
        const newAngle = currentAngle + (Math.random() - 0.5) * 0.4; // невелика зміна напрямку
        const speed = Math.sqrt(ball.vx ** 2 + ball.vy ** 2);
        ball.targetVx = Math.cos(newAngle) * speed;
        ball.targetVy = Math.sin(newAngle) * speed;
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

            // М'якше зіткнення
            const restitution = 0.6; // зменшили з 0.9
            const impulse = (2 * velAlongNormal * restitution) / 2;
            const impulseX = impulse * normalX;
            const impulseY = impulse * normalY;

            if (!ball1.isHovered) {
              ball1.vx += impulseX;
              ball1.vy += impulseY;
              // Оновлюємо цільові швидкості після зіткнення
              ball1.targetVx = ball1.vx;
              ball1.targetVy = ball1.vy;
            }
            if (!ball2.isHovered) {
              ball2.vx -= impulseX;
              ball2.vy -= impulseY;
              // Оновлюємо цільові швидкості після зіткнення
              ball2.targetVx = ball2.vx;
              ball2.targetVy = ball2.vy;
            }
          }
        }
      }
    }

    update() {
      if (!this.animationRunning) return;

      this.ballData.forEach((ball) => {
        if (!ball.isHovered) {
          // Застосовуємо тертя
          ball.vx *= this.friction;
          ball.vy *= this.friction;

          // Підтримуємо рух з плавними змінами
          this.maintainMovement(ball);

          let newX = ball.x + ball.vx;
          let newY = ball.y + ball.vy;

          // М'якший відскок від стін
          if (newX - ball.radius <= 0) {
            newX = ball.radius;
            ball.vx = Math.abs(ball.vx) * this.wallBounce;
            ball.targetVx = ball.vx;
          } else if (newX + ball.radius >= this.vw) {
            newX = this.vw - ball.radius;
            ball.vx = -Math.abs(ball.vx) * this.wallBounce;
            ball.targetVx = ball.vx;
          }

          if (newY - ball.radius <= 0) {
            newY = ball.radius;
            ball.vy = Math.abs(ball.vy) * this.wallBounce;
            ball.targetVy = ball.vy;
          } else if (newY + ball.radius >= this.vh) {
            newY = this.vh - ball.radius;
            ball.vy = -Math.abs(ball.vy) * this.wallBounce;
            ball.targetVy = ball.vy;
          }

          gsap.set(ball.el, { x: newX, y: newY });
        }
      });

      this.handleCollisions();
      this.animationFrame = requestAnimationFrame(this.update.bind(this));
    }

    stopAnimation() {
      this.animationRunning = false;
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
    }

    restartBallMovement(ballEl) {
      const data = ballEl._ballData;
      if (data) {
        const angle = Math.random() * Math.PI * 2;
        const speed = this.minSpeed + Math.random() * this.speedVariation;
        data.vx = Math.cos(angle) * speed;
        data.vy = Math.sin(angle) * speed;
        data.targetVx = data.vx;
        data.targetVy = data.vy;
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
      // Анімуємо іконку
      this.animateIcon(btn, true);

      // Плавно зупиняємо рух кульки
      const data = btn._ballData;
      if (data) {
        data.isHovered = true;
        // Зберігаємо поточну швидкість
        data.savedVx = data.vx;
        data.savedVy = data.vy;
        // Плавно зупиняємо рух
        data.targetVx = 0;
        data.targetVy = 0;
      }

      // Затримка для hover
      clearTimeout(btn._hoverTimeout);
      btn._hoverTimeout = setTimeout(() => {
        this.openModal(btn);
      }, 150);
    }

    handleHoverLeave(btn) {
      // Анімуємо іконку назад
      this.animateIcon(btn, false);

      // Плавно відновлюємо рух кульки
      const data = btn._ballData;
      if (data && data.isHovered) {
        data.isHovered = false;
        // Відновлюємо збережену швидкість або генеруємо нову
        if (data.savedVx !== undefined && data.savedVy !== undefined) {
          data.targetVx = data.savedVx;
          data.targetVy = data.savedVy;
          data.vx = data.savedVx * 0.3; // починаємо з меншої швидкості
          data.vy = data.savedVy * 0.3;
        } else {
          const angle = Math.random() * Math.PI * 2;
          const speed = this.minSpeed;
          data.targetVx = Math.cos(angle) * speed;
          data.targetVy = Math.sin(angle) * speed;
          data.vx = data.targetVx * 0.3;
          data.vy = data.targetVy * 0.3;
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
      this.openModal(btn);
    }

    openModal(btn) {
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

      // Додаємо обробники hover для модалки
      const modalEnterHandler = () => {
        clearTimeout(btn._closeTimeout);
      };
      const modalLeaveHandler = () => {
        clearTimeout(btn._closeTimeout);
        btn._closeTimeout = setTimeout(() => {
          if (!targetModal.matches(":hover") && !btn.matches(":hover")) {
            this.closeModal(targetModal, btn);
          }
        }, 300);
      };

      targetModal.addEventListener("mouseenter", modalEnterHandler);
      targetModal.addEventListener("mouseleave", modalLeaveHandler);

      // Зберігаємо обробники для очищення
      targetModal._modalEnterHandler = modalEnterHandler;
      targetModal._modalLeaveHandler = modalLeaveHandler;

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
        modal._updatePosition = null;
      }

      // Видаляємо modal hover обробники
      if (modal._modalEnterHandler) {
        modal.removeEventListener("mouseenter", modal._modalEnterHandler);
        modal._modalEnterHandler = null;
      }
      if (modal._modalLeaveHandler) {
        modal.removeEventListener("mouseleave", modal._modalLeaveHandler);
        modal._modalLeaveHandler = null;
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

    // Мобільні методи для FLIP анімацій
    handleMobileClick(btn) {
      const buttonTarget = btn.dataset.openModal;
      const targetModal = document.getElementById(buttonTarget);

      if (!targetModal) return;

      // Перевіряємо чи вже відкрита ця модалка
      if (targetModal.classList.contains("mobile-active")) {
        this.closeMobileModal(targetModal, btn);
        return;
      }

      // Закриваємо всі інші мобільні модалки
      this.closeAllMobileModals();

      this.openMobileModal(targetModal, btn);
    }

    openMobileModal(modal, btn) {
      const container = btn; // faces_item-contain

      // Зберігаємо початковий стан modal для FLIP
      const state = Flip.getState(modal);

      // Додаємо клас для ідентифікації активного стану
      modal.classList.add("mobile-active");
      btn.classList.add("mobile-modal-open");

      // Тимчасово робимо modal видимим для правильного розрахунку розмірів
      modal.style.visibility = "hidden";
      modal.style.display = "block";
      modal.style.position = "absolute";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.right = "0";
      modal.style.bottom = "0";
      modal.style.margin = "0";
      modal.style.zIndex = "100";

      // Переміщуємо modal всередину container
      container.appendChild(modal);

      // Показуємо modal
      modal.style.visibility = "visible";

      // Анімуємо FLIP
      Flip.from(state, {
        duration: 0.6,
        ease: "power2.inOut",
        absolute: true,
        onComplete: () => {
          // Анімуємо появу контенту
          const content = modal.querySelector(".faces_item-tooltip");
          if (content) {
            gsap.fromTo(
              content,
              {
                opacity: 0,
                scale: 0.8,
                y: 20,
              },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.4,
                ease: "back.out(1.7)",
              }
            );
          }
        },
      });

      // Анімуємо іконку
      this.animateIcon(btn, true);

      // Плавно зупиняємо рух кульки
      const data = btn._ballData;
      if (data) {
        data.isHovered = true;
        data.savedVx = data.vx;
        data.savedVy = data.vy;
        data.targetVx = 0;
        data.targetVy = 0;
      }
    }

    closeMobileModal(modal, btn) {
      const originalParent = btn.closest(".faces_item"); // повертаємо в faces_item

      // Анімуємо зникнення контенту
      const content = modal.querySelector(".faces_item-tooltip");
      if (content) {
        gsap.to(content, {
          opacity: 0,
          scale: 0.8,
          y: -20,
          duration: 0.3,
          ease: "power2.in",
        });
      }

      // Затримка перед FLIP анімацією
      setTimeout(() => {
        // Зберігаємо поточний стан modal
        const state = Flip.getState(modal);

        // Повертаємо modal в оригінальне місце
        originalParent.appendChild(modal);

        // Скидаємо стилі до початкових
        modal.style.position = "";
        modal.style.top = "";
        modal.style.left = "";
        modal.style.right = "";
        modal.style.bottom = "";
        modal.style.margin = "";
        modal.style.zIndex = "";

        // FLIP анімація назад
        Flip.from(state, {
          duration: 0.5,
          ease: "power2.inOut",
          absolute: true,
          onComplete: () => {
            // Приховуємо modal після анімації
            modal.style.display = "none";
            modal.classList.remove("mobile-active");
            btn.classList.remove("mobile-modal-open");

            // Скидаємо opacity контенту для наступного відкриття
            if (content) {
              gsap.set(content, { opacity: 1, scale: 1, y: 0 });
            }
          },
        });
      }, 300);

      // Анімуємо іконку назад
      this.animateIcon(btn, false);

      // Плавно відновлюємо рух кульки
      const data = btn._ballData;
      if (data && data.isHovered) {
        data.isHovered = false;
        if (data.savedVx !== undefined && data.savedVy !== undefined) {
          data.targetVx = data.savedVx;
          data.targetVy = data.savedVy;
          data.vx = data.savedVx * 0.3;
          data.vy = data.savedVy * 0.3;
        } else {
          const angle = Math.random() * Math.PI * 2;
          const speed = this.minSpeed;
          data.targetVx = Math.cos(angle) * speed;
          data.targetVy = Math.sin(angle) * speed;
          data.vx = data.targetVx * 0.3;
          data.vy = data.targetVy * 0.3;
        }
      }
    }

    closeAllMobileModals() {
      this.modals.forEach((modal, index) => {
        if (modal.classList.contains("mobile-active")) {
          this.closeMobileModal(modal, this.buttons[index]);
        }
      });
    }

    closeMobileModalsOnOutsideClick(e) {
      // Перевіряємо чи клік був поза активною мобільною модалкою
      const activeModal = this.modals.find((modal) =>
        modal.classList.contains("mobile-active")
      );
      if (activeModal && !activeModal.contains(e.target)) {
        const index = this.modals.indexOf(activeModal);
        this.closeMobileModal(activeModal, this.buttons[index]);
      }
    }

    closeOnOutsideClick(e) {
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
      if (e.key === "Escape") {
        this.modals.forEach((modal, index) => {
          if (modal.style.display === "block") {
            this.closeModal(modal, this.buttons[index]);
          }
        });
      }
    }

    // Метод для очищення при знищенні екземпляра
    destroy() {
      // Очищуємо GSAP MatchMedia
      this.mm.kill();

      // Очищуємо інші обробники
      window.removeEventListener("resize", this.updateContainerSize.bind(this));

      // Закриваємо всі модалки (desktop та mobile)
      this.closeAllModals();
      this.closeAllMobileModals();
    }
  }

  // Створюємо екземпляр класу
  window.kaifInstance = new Kaif(".faces_block-space");
});

document.addEventListener("DOMContentLoaded", () => {
  let facesSwiper = null;

  function initFacesSwiper() {
    if (window.innerWidth < 992 && !facesSwiper) {
      facesSwiper = new Swiper(".swiper.is--faces", {
        slidesPerView: "auto",
        spaceBetween: "5%",
        centeredSlides: true,
        breakpoints: {
          320: {
            spaceBetween: "8%",
          },
          768: {
            spaceBetween: "5%",
          },
        },
      });
      console.log("Faces Swiper initialized");
    }
  }

  function destroyFacesSwiper() {
    if (facesSwiper) {
      facesSwiper.destroy(true, true);
      facesSwiper = null;
      console.log("Faces Swiper destroyed");
    }
  }

  function handleResize() {
    if (window.innerWidth < 992) {
      initFacesSwiper();
    } else {
      destroyFacesSwiper();
    }
  }

  // Ініціалізуємо при завантаженні
  handleResize();

  // Слідкуємо за зміною розміру екрану
  window.addEventListener("resize", handleResize);
});

//slider faces_item tooltips animation (без FLIP)
document.addEventListener("DOMContentLoaded", () => {
  const sliderFaceButtons = document.querySelectorAll(
    ".swiper.is--faces .btn-face-item"
  );

  sliderFaceButtons.forEach((btn) => {
    const tooltip = btn
      .closest(".faces_item")
      .querySelector(".faces_item-tooltip_wrp");

    if (tooltip) {
      // Ініціалізуємо tooltip як прихований
      gsap.set(tooltip, {
        opacity: 0,
        scale: 0.8,
        y: 20,
        display: "none",
      });

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Перевіряємо чи tooltip вже відкритий
        const isOpen = tooltip.style.display === "block";

        if (isOpen) {
          // Анімуємо іконку назад
          const icon = btn.querySelector(".btn-face-item_icon");
          if (icon) {
            gsap.to(icon, {
              rotation: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          }

          // Закриваємо tooltip
          gsap.to(tooltip, {
            opacity: 0,
            scale: 0.8,
            y: 20,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              tooltip.style.display = "none";
              btn.classList.remove("is--active");
            },
          });
        } else {
          // Закриваємо всі інші tooltips в слайдері
          sliderFaceButtons.forEach((otherBtn) => {
            const otherTooltip = otherBtn
              .closest(".faces_item")
              .querySelector(".faces_item-tooltip_wrp");
            if (
              otherTooltip &&
              otherTooltip !== tooltip &&
              otherTooltip.style.display === "block"
            ) {
              // Анімуємо іконку інших кнопок назад
              const otherIcon = otherBtn.querySelector(".btn-face-item_icon");
              if (otherIcon) {
                gsap.to(otherIcon, {
                  rotation: 0,
                  duration: 0.2,
                  ease: "power2.out",
                });
              }

              gsap.to(otherTooltip, {
                opacity: 0,
                scale: 0.8,
                y: 20,
                duration: 0.2,
                ease: "power2.in",
                onComplete: () => {
                  otherTooltip.style.display = "none";
                  otherBtn.classList.remove("is--active");
                },
              });
            }
          });

          // Анімуємо іконку поточної кнопки
          const icon = btn.querySelector(".btn-face-item_icon");
          if (icon) {
            gsap.to(icon, {
              rotation: 45,
              duration: 0.3,
              ease: "power2.out",
            });
          }

          // Відкриваємо поточний tooltip
          tooltip.style.display = "block";
          btn.classList.add("is--active");

          gsap.fromTo(
            tooltip,
            {
              opacity: 0,
              scale: 0.8,
              y: 20,
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.4,
              ease: "back.out(1.7)",
            }
          );
        }
      });
    }
  });

  // Закриття tooltip при кліку поза слайдером
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".swiper.is--faces")) {
      sliderFaceButtons.forEach((btn) => {
        const tooltip = btn
          .closest(".faces_item")
          .querySelector(".faces_item-tooltip_wrp");
        if (tooltip && tooltip.style.display === "block") {
          // Анімуємо іконку назад при закритті
          const icon = btn.querySelector(".btn-face-item_icon");
          if (icon) {
            gsap.to(icon, {
              rotation: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          }

          gsap.to(tooltip, {
            opacity: 0,
            scale: 0.8,
            y: 20,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              tooltip.style.display = "none";
              btn.classList.remove("is--active");
            },
          });
        }
      });
    }
  });
});
