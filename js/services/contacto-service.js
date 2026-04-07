/* ═══════════════════════════════════════════════════════════
   WEBLIFT Agency — js/services/contacto-service.js
   
   Guarda consultas en Firestore sin requerir autenticación.
   Colección: "contactos"
   
   IMPORTANTE: En Firebase Console → Firestore → Reglas,
   asegúrate de permitir escritura pública:
   
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /contactos/{doc} {
         allow create: if true;  // cualquiera puede enviar
         allow read, update, delete: if false; // solo tú (admin) lee
       }
     }
   }
═══════════════════════════════════════════════════════════ */

const ContactoService = {

  /**
   * Sanitiza texto para prevenir inyección de HTML/JavaScript
   * @param {string} text - Texto a sanitizar
   * @returns {string} Texto sanitizado (caracteres especiales escapados)
   */
  sanitizeHTML(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  },

  /**
   * Guarda una nueva consulta en Firestore
   * @param {Object} datos - Campos del formulario
   * @returns {Promise<string>} ID del documento creado
   */
  async guardar(datos) {
    const consulta = {
      nombre:    this.sanitizeHTML(datos.nombre.trim()),
      email:     this.sanitizeHTML(datos.email.trim().toLowerCase()),
      telefono:  this.sanitizeHTML(datos.telefono?.trim() || ""),
      empresa:   this.sanitizeHTML(datos.empresa?.trim()  || ""),
      mensaje:   this.sanitizeHTML(datos.mensaje.trim()),
      terminosAceptados: true,
      estado:    "nuevo",
      creadoEn:  firebase.firestore.FieldValue.serverTimestamp(),
      fechaStr:  new Date().toLocaleDateString("es-PE", {
        year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit"
      }),
      origen:    window.location.hostname
    };

    const docRef = await db.collection("contactos").add(consulta);
    return docRef.id;
  }
};

console.log("✅ ContactoService con sanitización HTML activa");