/* ═══════════════════════════════════════════════════════════
   WEBLIFT Studio — js/ui/intro.js (CORREGIDO)
   
   CORRECCIÓN: temporizador sincronizado con el redirect del index.
   - La animación dura ~2.8s
   - El exit se dispara a los 2600ms (deja 600ms de animación de salida)
   - El redirect del index.html debe estar en 3200ms
   - Así la transición es suave sin pantallas en blanco
═══════════════════════════════════════════════════════════ */

const IntroUI = {
  init() {
    const screen = document.getElementById("intro-screen");
    if (!screen) return;

    // Bloquear scroll durante intro
    document.body.style.overflow = "hidden";

    // Disparar salida a los 2600ms para que el exit animation
    // termine justo antes del redirect a 3200ms
    setTimeout(() => {
      this.exit(screen);
    }, 2600);
  },

  exit(screen) {
    screen.classList.add("exit");

    // Cuando termina la animación de salida, ocultar completamente
    screen.addEventListener("animationend", () => {
      screen.style.display   = "none";
      screen.style.visibility = "hidden";
      document.body.style.overflow = "";
    }, { once: true });

    // Fallback: si animationend no dispara por alguna razón, ocultar igual
    setTimeout(() => {
      if (screen.style.display !== "none") {
        screen.style.display   = "none";
        screen.style.visibility = "hidden";
        document.body.style.overflow = "";
      }
    }, 800);
  }
};