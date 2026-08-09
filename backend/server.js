// Otetaan Express käyttöön
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
// Otetaan Workout-malli käyttöön
const Workout = require("./models/Workout");

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
// Haetaan kaikki treenit MongoDB-tietokannasta
app.get("/api/workouts", async (req, res) => {
  const workouts = await Workout.find();

  res.json(workouts);
});
// Vastaanotetaan uusi treeni ja tallennetaan se tietokantaan
app.post("/api/workouts", async (req, res) => {

 // Luodaan uusi treeni Workout-mallin avulla
const newWorkout = new Workout(req.body);

// Tallennetaan treeni MongoDB-tietokantaan
await newWorkout.save();

  // Näytetään lisätty treeni terminaalissa
  console.log(newWorkout);

  // Palautetaan lisätty treeni vastauksena
  res.json(newWorkout);
});

// Poistetaan treeni MongoDB:stä ID:n perusteella
app.delete("/api/workouts/:id", async (req, res) => {

 // Etsitään ja poistetaan treeni MongoDB:stä ID:n perusteella
const deletedWorkout = await Workout.findByIdAndDelete(req.params.id);

  // Lähetetään vastaus onnistuneesta poistosta
  res.json({ message: "Treeni poistettu" });
});
// Muokataan treeniä MongoDB:n ID:n perusteella
app.put("/api/workouts/:id", async (req, res) => {
 // Etsitään treeni ID:n perusteella ja päivitetään sen tiedot
const updatedWorkout = await Workout.findByIdAndUpdate(
  req.params.id,
  req.body,
  { new: true }
);
// Palautetaan päivitetty treeni
res.json(updatedWorkout);

  // Päivitetään treenin tiedot
  workouts[workoutIndex] = {
    ...workouts[workoutIndex],
    ...req.body
  };

  // Palautetaan muokattu treeni
  res.json(workouts[workoutIndex]);
});