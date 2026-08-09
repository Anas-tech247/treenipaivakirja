// Otetaan Express käyttöön
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// Luodaan Express-sovellus
const app = express();
// Tarkistetaan, että käytössä on uusi MongoDB-yhteysosoite
console.log(
  "Käytetäänkö tavallista MongoDB-osoitetta:",
  process.env.MONGO_URI?.startsWith("mongodb://")
);

// Yhdistetään MongoDB-tietokantaan
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB yhdistetty"))
  .catch((error) => console.log("MongoDB yhteysvirhe:", error));
// Sallitaan JSON-muotoisen datan vastaanottaminen
app.use(express.json());
// Väliaikainen lista treeneille
let workouts = [];
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
// Palauttaa kaikki treenit
app.get("/api/workouts", (req, res) => {
  res.json(workouts);
});
// Vastaanotetaan uusi treeni
app.post("/api/workouts", (req, res) => {

  // Luodaan uudelle treenille oma ID ja otetaan mukaan lähetetyt tiedot
  const newWorkout = {
    id: Date.now(),
    ...req.body
  };

  // Lisätään uusi treeni workouts-listaan
  workouts.push(newWorkout);

  // Näytetään lisätty treeni terminaalissa
  console.log(newWorkout);

  // Palautetaan lisätty treeni vastauksena
  res.json(newWorkout);
});
// Poistetaan treeni ID:n perusteella
app.delete("/api/workouts/:id", (req, res) => {

  // Otetaan poistettavan treenin ID osoitteesta
  const id = Number(req.params.id);

  // Poistetaan listasta treeni, jolla on sama ID
  workouts = workouts.filter(workout => workout.id !== id);

  // Lähetetään vastaus onnistuneesta poistosta
  res.json({ message: "Treeni poistettu" });
});
// Muokataan treeniä ID:n perusteella
app.put("/api/workouts/:id", (req, res) => {

  // Otetaan muokattavan treenin ID osoitteesta
  const id = Number(req.params.id);

  // Etsitään muokattavan treenin paikka listasta
  const workoutIndex = workouts.findIndex(
    workout => workout.id === id
  );

  // Päivitetään treenin tiedot
  workouts[workoutIndex] = {
    ...workouts[workoutIndex],
    ...req.body
  };

  // Palautetaan muokattu treeni
  res.json(workouts[workoutIndex]);
});