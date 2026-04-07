/* ═══════════════════════════════════════════════════════════
   WEBLIFT Agency — js/controllers/contacto-controller.js
   
   Maneja el formulario de contacto público.
   SIN autenticación — cualquier visitante puede enviar.
   Guarda en Firestore via ContactoService.
═══════════════════════════════════════════════════════════ */

const ContactoController = {

  MIN_SECONDS_BEFORE_SUBMIT: 8,
  SUBMIT_COOLDOWN_MS: 30000,
  FORM_OPEN_KEY: "weblift_contact_form_opened_at",
  LAST_SUBMIT_KEY: "weblift_contact_last_submit_at",

  init() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    if (!sessionStorage.getItem(this.FORM_OPEN_KEY)) {
      sessionStorage.setItem(this.FORM_OPEN_KEY, String(Date.now()));
    }

    // El formulario siempre está visible — sin login required
    form.style.display = "block";

    // Submit
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const honeypot = document.getElementById("hp-company");
      if (honeypot && honeypot.value.trim() !== "") return;
      if (!this.validarTiempo()) return;
      if (!this.validar()) return;
      await this.enviar();
    });

    // Limpiar errores al escribir en cada campo
    ["cf-nombre", "cf-email", "cf-telefono", "cf-empresa", "cf-mensaje"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", () => this.limpiarError(id));
      }
    });

    // Limpiar error del checkbox al hacer click
    const terms = document.getElementById("cf-terminos");
    if (terms) terms.addEventListener("change", () => this.limpiarError("cf-terminos"));
  },

  /* ══════════════════
     VALIDACIÓN
  ══════════════════ */
  validar() {
    let ok = true;

    const nombre = document.getElementById("cf-nombre");
    if (!nombre?.value.trim()) {
      this.mostrarError("cf-nombre", "Ingresa tu nombre completo.");
      ok = false;
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]{2,80}$/.test(nombre.value.trim())) {
      this.mostrarError("cf-nombre", "El nombre solo puede contener letras y espacios.");
      ok = false;
    }

    const email = document.getElementById("cf-email");
    if (!email?.value.trim()) {
      this.mostrarError("cf-email", "Ingresa tu correo electrónico.");
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      this.mostrarError("cf-email", "El correo no tiene un formato válido.");
      ok = false;
    }

    const telefono = document.getElementById("cf-telefono");
    if (!telefono?.value.trim()) {
      this.mostrarError("cf-telefono", "Ingresa tu número de teléfono.");
      ok = false;
    } else if (!/^[0-9+()\s-]{7,20}$/.test(telefono.value.trim())) {
      this.mostrarError("cf-telefono", "El teléfono solo puede contener números, +, espacios, paréntesis y guiones.");
      ok = false;
    } else {
      const soloDigitos = telefono.value.replace(/\D/g, "");
      if (soloDigitos.length < 7 || soloDigitos.length > 15) {
        this.mostrarError("cf-telefono", "Ingresa un número de teléfono válido.");
        ok = false;
      }
    }

    const mensaje = document.getElementById("cf-mensaje");
    if (!mensaje?.value.trim()) {
      this.mostrarError("cf-mensaje", "Escribe tu consulta o mensaje.");
      ok = false;
    } else if (mensaje.value.trim().length < 10) {
      this.mostrarError("cf-mensaje", "El mensaje debe tener al menos 10 caracteres.");
      ok = false;
    } else if (mensaje.value.trim().length > 1000) {
      this.mostrarError("cf-mensaje", "El mensaje no puede superar los 1000 caracteres.");
      ok = false;
    }

    const terminos = document.getElementById("cf-terminos");
    if (!terminos?.checked) {
      this.mostrarError("cf-terminos", "Debes aceptar los términos y condiciones.");
      ok = false;
    }

    return ok;
  },

  validarTiempo() {
    const errorGlobal = document.getElementById("cf-error-global");
    const openedAtRaw = sessionStorage.getItem(this.FORM_OPEN_KEY);
    const lastSubmitRaw = localStorage.getItem(this.LAST_SUBMIT_KEY);
    const now = Date.now();

    if (openedAtRaw) {
      const openedAt = Number(openedAtRaw);
      const elapsedSeconds = Math.floor((now - openedAt) / 1000);
      if (elapsedSeconds < this.MIN_SECONDS_BEFORE_SUBMIT) {
        const remaining = this.MIN_SECONDS_BEFORE_SUBMIT - elapsedSeconds;
        if (errorGlobal) {
          errorGlobal.textContent = `Espera ${remaining} segundo${remaining === 1 ? "" : "s"} antes de enviar el formulario.`;
          errorGlobal.style.display = "block";
        }
        return false;
      }
    }

    if (lastSubmitRaw) {
      const lastSubmitAt = Number(lastSubmitRaw);
      const elapsedSinceLastSubmit = now - lastSubmitAt;
      if (elapsedSinceLastSubmit < this.SUBMIT_COOLDOWN_MS) {
        const remainingSeconds = Math.ceil((this.SUBMIT_COOLDOWN_MS - elapsedSinceLastSubmit) / 1000);
        if (errorGlobal) {
          errorGlobal.textContent = `Espera ${remainingSeconds} segundo${remainingSeconds === 1 ? "" : "s"} antes de enviar otro mensaje.`;
          errorGlobal.style.display = "block";
        }
        return false;
      }
    }

    return true;
  },

  /* ══════════════════
     ENVÍO A FIREBASE
  ══════════════════ */
  async enviar() {
    const btn     = document.getElementById("cf-btn-enviar");
    const success = document.getElementById("cf-success");
    const errorGlobal = document.getElementById("cf-error-global");

    // Ocultar mensajes previos
    if (errorGlobal) errorGlobal.style.display = "none";

    // Estado de carga
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="spin-icon">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        Enviando...
      `;
    }

    const datos = {
      nombre:   document.getElementById("cf-nombre")?.value   || "",
      email:    document.getElementById("cf-email")?.value    || "",
      telefono: document.getElementById("cf-telefono")?.value || "",
      empresa:  document.getElementById("cf-empresa")?.value  || "",
      mensaje:  document.getElementById("cf-mensaje")?.value  || ""
    };

    try {
      await ContactoService.guardar(datos);
      localStorage.setItem(this.LAST_SUBMIT_KEY, String(Date.now()));
      sessionStorage.setItem(this.FORM_OPEN_KEY, String(Date.now()));

      // Éxito — mostrar mensaje y limpiar form
      const form = document.getElementById("contactForm");
      if (form) form.reset();

      if (success) {
        success.style.display = "flex";
        success.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      if (btn) {
        btn.innerHTML = "✓ ¡Mensaje enviado!";
        btn.style.background = "#16a34a";
      }

      // Restaurar botón después de 6 segundos
      setTimeout(() => {
        if (btn) {
          btn.disabled = false;
          btn.style.background = "";
          btn.innerHTML = `
            Enviar consulta
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          `;
        }
        if (success) success.style.display = "none";
      }, 6000);

    } catch (err) {
      console.error("Error al guardar contacto:", err);

      if (errorGlobal) {
        errorGlobal.textContent = "Hubo un error al enviar tu mensaje. Por favor intenta nuevamente.";
        errorGlobal.style.display = "block";
      }

      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `
          Enviar consulta
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        `;
      }
    }
  },

  /* ══════════════════
     HELPERS UI
  ══════════════════ */
  mostrarError(campoId, mensaje) {
    const campo = document.getElementById(campoId);
    const errorEl = document.getElementById(`error-${campoId}`);
    if (campo) campo.classList.add("campo-error");
    if (errorEl) errorEl.textContent = mensaje;
  },

  limpiarError(campoId) {
    const campo = document.getElementById(campoId);
    const errorEl = document.getElementById(`error-${campoId}`);
    if (campo) campo.classList.remove("campo-error");
    if (errorEl) errorEl.textContent = "";
  }
};