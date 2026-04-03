/* ═══════════════════════════════════════════════════════════
   WEBLIFT Studio — js/ui/main.js (CORREGIDO)
   
   Punto central de inicialización. UN SOLO DOMContentLoaded.
   Todos los módulos se inicializan aquí con checks seguros.
═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {

  /* 1. Intro — solo si existe la pantalla de intro */
  if (typeof IntroUI !== "undefined" && document.getElementById("intro-screen")) {
    IntroUI.init();
  }

  /* 2. Navbar — scroll, hamburguesa, estado del usuario */
  if (typeof NavbarUI !== "undefined") {
    NavbarUI.init();
  }

  /* 3. Cursor personalizado + scroll reveal */
  if (typeof AnimationsUI !== "undefined") {
    AnimationsUI.init();
  }

  /* 4. Controladores de formularios Firebase
     CORRECCIÓN: checks individuales con try/catch para cada controller,
     así una página sin Firebase no rompe el resto de la UI */
  if (typeof auth !== "undefined") {

    // Página de login
    if (document.getElementById("loginForm") && typeof AuthController !== "undefined") {
      try { AuthController.initLogin(); } catch(e) { console.warn("AuthController.initLogin:", e.message); }
    }

    // Página de registro
    if (document.getElementById("registerForm") && typeof AuthController !== "undefined") {
      try { AuthController.initRegister(); } catch(e) { console.warn("AuthController.initRegister:", e.message); }
    }

    // Formulario de contacto / cotización
    if (document.getElementById("contactForm") && typeof ContactController !== "undefined") {
      try { ContactController.init(); } catch(e) { console.warn("ContactController.init:", e.message); }
    }

  } else {
    // Firebase no disponible — inicializar igualmente los controladores
    // que no dependen estrictamente de auth (solo los que los necesitan)
    console.info("Firebase no disponible en esta página.");
  }

});