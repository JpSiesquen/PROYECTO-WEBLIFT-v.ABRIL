/* ═══════════════════════════════════════════════════════════
   WEBLIFT Studio — js/ui/main.js (CORREGIDO)
   
   Punto central de inicialización. UN SOLO DOMContentLoaded.
   Todos los módulos se inicializan aquí con checks seguros.
═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {

  if (typeof IntroUI !== "undefined" && document.getElementById("intro-screen")) {
    IntroUI.init();
  }

  if (typeof NavbarUI !== "undefined") {
    NavbarUI.init();
  }

  if (typeof AnimationsUI !== "undefined") {
    AnimationsUI.init();
  }

  if (document.getElementById("contactForm") && typeof ContactoController !== "undefined") {
    try { ContactoController.init(); } catch(e) { console.warn("ContactoController.init:", e.message); }
  }

  if (typeof auth !== "undefined") {
    if (document.getElementById("loginForm") && typeof AuthController !== "undefined") {
      try { AuthController.initLogin(); } catch(e) { console.warn("AuthController.initLogin:", e.message); }
    }

    if (document.getElementById("registerForm") && typeof AuthController !== "undefined") {
      try { AuthController.initRegister(); } catch(e) { console.warn("AuthController.initRegister:", e.message); }
    }
  } else {
    console.info("Firebase no disponible en esta página.");
  }

});