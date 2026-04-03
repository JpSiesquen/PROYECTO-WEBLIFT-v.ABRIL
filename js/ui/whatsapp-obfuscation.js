(function () {
  // Obfuscacion basica: el numero se construye por partes para evitar texto plano en HTML.
  var p1 = "51";
  var p2 = "912";
  var p3 = "791";
  var p4 = "400";
  var waNumber = [p1, p2, p3, p4].join("");

  var msgCta = ["Hola", "WEBLIFT"].join(" ");
  var msgFloat = [
    "Me gustaría", "cotizar", "el", "precio", "de", "una", "landing", "page", "con", "hosting", "incluido."
  ].join(" ");

  function buildWaUrl(message) {
    var base = "https://wa.me/" + waNumber;
    return message ? base + "?text=" + encodeURIComponent(message) : base;
  }

  var waCta = document.getElementById("wa-cta-link");
  var waFloat = document.getElementById("wa-float-link");
  var waFooter = document.getElementById("wa-footer-link");
  var waContactNumber = document.getElementById("wa-contact-number");

  if (waCta) waCta.href = buildWaUrl(msgCta);
  if (waFloat) waFloat.href = buildWaUrl(msgFloat);
  if (waFooter) waFooter.href = buildWaUrl("");

  if (waContactNumber) {
    waContactNumber.textContent = "+" + p1 + " " + p2 + " " + p3 + " " + p4;
  }
})();
