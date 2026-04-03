/* ═══════════════════════════════════════════════════════════
   WEBLIFT Studio — js/services/cotizacion-service.js
   
   CAPA DE SERVICIO: guarda y lee cotizaciones en Firestore.
   Colección en Firebase: "cotizaciones"
═══════════════════════════════════════════════════════════ */

const CotizacionService = {

  /**
   * Guardar nueva cotización en Firestore
   * @param {Object} datos - Datos del formulario
   * @param {Object} usuario - Usuario autenticado
   * @returns {Promise<DocumentReference>}
   */
  async guardar(datos, usuario) {
    const cotizacion = {
      // Datos del formulario
      nombre:    datos.nombre,
      empresa:   datos.empresa  || "No especificado",
      email:     datos.email,
      telefono:  datos.telefono || "No especificado",
      servicio:  datos.servicio,
      mensaje:   datos.mensaje,

      // Datos del usuario autenticado
      userId:    usuario.uid,
      userEmail: usuario.email,
      userName:  usuario.displayName || datos.nombre,

      // Metadatos
      estado:    "pendiente",       // pendiente | en_proceso | completado
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),

      // Para filtrar fácilmente
      fechaStr:  new Date().toLocaleDateString("es-PE", {
        year: "numeric", month: "long", day: "numeric"
      })
    };

    return await db.collection("cotizaciones").add(cotizacion);
  },

  /**
   * Obtener cotizaciones de un usuario específico
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async obtenerPorUsuario(userId) {
    const snapshot = await db
      .collection("cotizaciones")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * Obtener TODAS las cotizaciones (solo para admin)
   * @returns {Promise<Array>}
   */
  async obtenerTodas() {
    const snapshot = await db
      .collection("cotizaciones")
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};