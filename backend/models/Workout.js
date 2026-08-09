// Otetaan Mongoose käyttöön
const mongoose = require("mongoose");
// Määritellään treenin rakenne
const workoutSchema = new mongoose.Schema({
  name: String,
  date: String,
  duration: Number,
});
// Luodaan Workout-malli treenien käsittelyä varten
const Workout = mongoose.model("Workout", workoutSchema);

// Viedään malli muiden tiedostojen käyttöön
module.exports = Workout;