(function () {
  // Obfuscacion basica: el numero se construye por partes para evitar texto plano en HTML.
  var p1 = "51";
  var p2 = "991";
  var p3 = "150";
  var p4 = "699";
  var waNumber = [p1, p2, p3, p4].join("");

  var waMessageMobile = [
    "Hola", "equipo", "de", "WEBLIFT", "Agency", "👋", "Quiero", "cotizar", "una", "web", "para", "mi", "negocio.", "¿Me", "comparten", "opciones,", "tiempos", "y", "precio", "aproximado?"
  ].join(" ");

  var waMessageDesktop = [
    "Hola", "WEBLIFT", "Agency,", "¿qué", "tal?", "Vi", "su", "página", "y", "me", "gustaría", "cotizar", "una", "web", "para", "mi", "negocio.", "¿Me", "pueden", "orientar", "con", "opciones,", "tiempos", "y", "precio", "aproximado?"
  ].join(" ");

  var isMobile = window.matchMedia("(max-width: 768px)").matches;
  var waMessage = isMobile ? waMessageMobile : waMessageDesktop;

  function buildWaUrl(message) {
    var base = "https://wa.me/" + waNumber;
    return message ? base + "?text=" + encodeURIComponent(message) : base;
  }

  var waCta = document.getElementById("wa-cta-link");
  var waFloat = document.getElementById("wa-float-link");
  var waFooter = document.getElementById("wa-footer-link");
  var waContactNumber = document.getElementById("wa-contact-number");

  if (waCta) waCta.href = buildWaUrl(waMessage);
  if (waFloat) waFloat.href = buildWaUrl(waMessage);
  if (waFooter) waFooter.href = buildWaUrl(waMessage);

  if (waContactNumber) {
    waContactNumber.textContent = "+" + p1 + " " + p2 + " " + p3 + " " + p4;
  }
})();
