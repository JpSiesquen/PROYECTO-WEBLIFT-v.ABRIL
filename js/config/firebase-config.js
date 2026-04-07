/* ═══════════════════════════════════════════════
   WEBLIFT Agency — js/config/firebase-config.js
   
   SIN autenticación — solo Firestore para el
   formulario de contacto público.
═══════════════════════════════════════════════ */

const firebaseConfig = {
  apiKey:            "AIzaSyDJ7gkLJ3e1NE8awtg9YayCF0KIW41_Grw",
  authDomain:        "weblift-studio.firebaseapp.com",
  projectId:         "weblift-studio",
  storageBucket:     "weblift-studio.firebasestorage.app",
  messagingSenderId: "240422259886",
  appId:             "1:240422259886:web:38a2ad1d16c3242097b13f",
  measurementId:     "G-X9T971TZ6P"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Solo Firestore — sin auth
const db = firebase.firestore();

console.log("✅ Firebase Firestore conectado — weblift-studio");