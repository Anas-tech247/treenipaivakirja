// Otetaan Express käyttöön
const express = require("express");

// Luodaan Express-sovellus
const app = express();
// Määritetään portti
const PORT = 3000;
// Testireitti palvelimen tarkistamiseen
app.get("/", (req, res) => {
  res.send("Backend toimii!");
});
// Käynnistetään palvelin
app.listen(PORT, () => {
  console.log(`Palvelin käynnissä portissa ${PORT}`);
});