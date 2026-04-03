/* ═══════════════════════════════════════════════════════════
   WEBLIFT Studio — js/services/contacto-service.js
   
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
   * Guarda una nueva consulta en Firestore
   * @param {Object} datos - Campos del formulario
   * @returns {Promise<string>} ID del documento creado
   */
  async guardar(datos) {
    const consulta = {
      // Datos del visitante
      nombre:    datos.nombre.trim(),
      email:     datos.email.trim().toLowerCase(),
      telefono:  datos.telefono?.trim() || "",
      empresa:   datos.empresa?.trim()  || "",
      mensaje:   datos.mensaje.trim(),

      // Aceptación de términos
      terminosAceptados: true,

      // Metadatos automáticos
      estado:    "nuevo",        // nuevo | leído | respondido
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