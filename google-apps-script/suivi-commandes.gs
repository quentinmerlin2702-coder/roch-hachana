// Script à coller dans l'éditeur Apps Script du Google Doc de suivi des
// commandes. Voir le README du projet, section "Suivi des commandes dans un
// Google Doc", pour la procédure d'installation complète.
//
// Reçoit chaque commande envoyée par le site (au format JSON) et l'écrit en
// haut du document, la plus récente en premier.

var DOC_ID = "1STsAFv97s31uj6uzNnGd04MLyiIea99sk-wo2uV-jsE";

function doPost(e) {
  var doc = DocumentApp.openById(DOC_ID);
  var body = doc.getBody();
  var data = JSON.parse(e.postData.contents);

  var lines = [];
  lines.push("═══════════════════════════════════");
  lines.push("Commande " + data.orderId + "  —  " + data.createdAt);
  lines.push("");
  lines.push("Client : " + data.customerName);
  lines.push("Téléphone : " + data.customerPhone);
  if (data.customerEmail) lines.push("Email : " + data.customerEmail);
  lines.push("");
  lines.push("Réception : " + data.reception);
  if (data.address) lines.push("Adresse : " + data.address);
  lines.push("");
  lines.push("Produits :");
  data.items.forEach(function (item) {
    lines.push("  • " + item);
  });
  lines.push("Total : " + data.total);
  lines.push("");
  lines.push("Paiement : " + data.paymentMethod + " (" + data.paymentStatus + ")");
  if (data.giftMessage) lines.push("Message cadeau : " + data.giftMessage);
  if (data.notes) lines.push("Remarques : " + data.notes);
  lines.push("");

  // Insère le bloc tout en haut du document (le plus récent en premier),
  // en insérant les lignes dans l'ordre inverse à l'index 0.
  for (var i = lines.length - 1; i >= 0; i--) {
    var paragraph = body.insertParagraph(0, lines[i]);
    if (i === 1) paragraph.setBold(true).setFontSize(13);
  }

  return ContentService.createTextOutput("OK");
}

// Utile pour tester manuellement depuis l'éditeur Apps Script (bouton
// "Exécuter") sans avoir besoin d'une vraie commande du site.
function testerManuel() {
  doPost({
    postData: {
      contents: JSON.stringify({
        orderId: "TEST-0000",
        createdAt: new Date().toLocaleString("fr-FR"),
        customerName: "Client Test",
        customerPhone: "06 00 00 00 00",
        customerEmail: "test@example.com",
        reception: "Retrait dans le 16ᵉ arrondissement",
        items: ["La Classique × 1 — 99 €"],
        total: "99 €",
        paymentMethod: "Espèces au retrait",
        paymentStatus: "En attente de règlement",
        giftMessage: "Chana Tova !",
      }),
    },
  });
}
