/* ═══════════════════════════════════════════════════════════
   WEBLIFT Studio — js/ui/animations.js (CORREGIDO)
   
   CORRECCIÓN CRÍTICA: eliminado el DOMContentLoaded duplicado
   que causaba doble inicialización y errores en páginas donde
   AuthController / ContactController no existen.
   
   La inicialización ahora la maneja exclusivamente main.js
═══════════════════════════════════════════════════════════ */

const AnimationsUI = {
  init() {
    this.initScrollReveal();
    this.initCursor();
  },

  initScrollReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.12 }
    );

    els.forEach(el => obs.observe(el));
  },

  initCursor() {
    // No inicializar cursor en dispositivos táctiles
    if (window.matchMedia("(hover: none)").matches) return;

    const cursor = document.getElementById("cursor");
    const ring   = document.getElementById("cursorRing");
    if (!cursor || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener("mousemove", e => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
    });

    const anim = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      requestAnimationFrame(anim);
    };
    anim();

    // Efecto hover en elementos interactivos
    const hoverTargets = "a, button, .service-card, .portfolio-card, .testi-card, .pricing-card, .about-value, .contact-item";
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener("mouseenter", () => {
        ring.style.width   = "52px";
        ring.style.height  = "52px";
        ring.style.opacity = "0.25";
      });
      el.addEventListener("mouseleave", () => {
        ring.style.width   = "34px";
        ring.style.height  = "34px";
        ring.style.opacity = "0.45";
      });
    });
  }
};

/* ══════════════════════════════════════════════════════════
   NOTA: Este archivo NO tiene DOMContentLoaded propio.
   La inicialización la centraliza main.js para evitar
   la doble ejecución que causaba errores.
══════════════════════════════════════════════════════════ */