/* ═══════════════════════════════════════════════════════════
   WEBLIFT Studio — js/ui/navbar.js (VERSIÓN FINAL OPTIMIZADA)
═══════════════════════════════════════════════════════════ */

const NavbarUI = {

  init() {
    // 1. Funciones críticas que SIEMPRE deben cargar primero
    this.initHamburger();
    this.initDropdown();
    this.initAuthState();
    this.initScroll();
    
    // 2. Funciones de apoyo (pueden fallar silenciosamente si no hay secciones)
    this.initActiveLinks();
  },

  initScroll() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;
    
    // Si la navbar es para páginas de auth, no necesita la lógica de scrolled
    if (navbar.classList.contains("auth-nav")) return;

    const handle = () => {
      // Usamos un umbral de 50px para el cambio de estado
      navbar.classList.toggle("scrolled", window.scrollY > 50);
    };

    window.addEventListener("scroll", handle, { passive: true });
    handle(); // Ejecutar inmediatamente para el estado inicial
  },

  initHamburger() {
    const btn   = document.getElementById("hamburger");
    const links = document.getElementById("navLinks");
    if (!btn || !links) return;

    // Función que será llamada por el onclick inline del HTML
    window.toggleMenu = () => {
      const isOpening = links.classList.toggle("open");
      const spans = btn.querySelectorAll("span");
      
      if (isOpening) {
        // Animación de la X: ajustada para el diseño v3
        if(spans[0]) spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        if(spans[1]) spans[1].style.opacity = "0";
        if(spans[2]) spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
      } else {
        // Volver al estado hamburguesa
        spans.forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
      }
    };

    // Cerrar menú al hacer clic en cualquier link (esencial para One-Page)
    links.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        links.classList.remove("open");
        btn.querySelectorAll("span").forEach(s => {
          s.style.transform = "";
          s.style.opacity = "";
        });
      });
    });

    // Cerrar al hacer clic FUERA del navbar si está abierto
    document.addEventListener("click", (e) => {
      const nav = document.getElementById("navbar");
      if (nav && !nav.contains(e.target) && links.classList.contains("open")) {
        window.toggleMenu();
      }
    });
  },

  initDropdown() {
    const navUser = document.getElementById("navUser");
    const dd      = document.getElementById("navDropdown");
    if (!navUser || !dd) return;

    // Evitamos propagación para que el click en el documento no lo cierre inmediatamente
    navUser.addEventListener("click", (e) => {
      e.stopPropagation();
      dd.classList.toggle("open");
    });

    document.addEventListener("click", () => {
      dd.classList.remove("open");
    });
  },

  initAuthState() {
    if (typeof auth === "undefined") return;

    const navLogin    = document.getElementById("navLogin");
    const navRegister = document.getElementById("navRegister");
    const navUser     = document.getElementById("navUser");
    const navUserName = document.getElementById("navUserName");
    const navAvatar   = document.getElementById("navAvatar");
    const dropName    = document.getElementById("dropdownName");
    const dropEmail   = document.getElementById("dropdownEmail");

    auth.onAuthStateChanged((user) => {
      if (user) {
        // Estado: Logueado
        if (navLogin)    navLogin.style.display = "none";
        if (navRegister) navRegister.style.display = "none";
        if (navUser)     navUser.style.display = "flex";

        const shortName = user.displayName ? user.displayName.split(" ")[0] : "Usuario";
        if (navUserName) navUserName.textContent = shortName;
        if (dropName)    dropName.textContent = user.displayName || "Mi cuenta";
        if (dropEmail)   dropEmail.textContent = user.email || "";

        if (navAvatar) {
          navAvatar.innerHTML = user.photoURL 
            ? `<img src="${user.photoURL}" alt="User" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`
            : `<div style="width:100%;height:100%;background:var(--cyan);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;color:white;">${shortName.charAt(0).toUpperCase()}</div>`;
        }
      } else {
        // Estado: No logueado
        if (navLogin)    navLogin.style.display = "flex";
        if (navRegister) navRegister.style.display = "flex";
        if (navUser)     navUser.style.display = "none";
      }
    });
  },

  initActiveLinks() {
    const sections = document.querySelectorAll("section[id]");
    const links    = document.querySelectorAll(".nav-links a");
    
    // Si no hay secciones o links, terminamos silenciosamente
    if (sections.length === 0 || links.length === 0) return;

    const scrollHandler = () => {
      let current = "";
      sections.forEach(s => {
        const sectionTop = s.offsetTop;
        if (window.scrollY >= sectionTop - 150) {
          current = s.id;
        }
      });

      links.forEach(a => {
        a.classList.remove("active");
        if (a.getAttribute("href") === `#${current}`) {
          a.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });
    // Ejecutar al cargar para marcar el link inicial
    scrollHandler();
  }
};