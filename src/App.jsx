// Otetaan käyttöön Reactin useState ja useEffect
import { useState, useEffect } from "react";
import "./App.css"; // Tuodaan App-komponentin tyylit

function App() {
  // Tallennetaan treenin nimi Reactin tilaan
  const [name, setName] = useState("");

  // Tallennetaan treenin päivämäärä Reactin tilaan
  const [date, setDate] = useState("");

  // Tallennetaan treenin kesto Reactin tilaan
  const [duration, setDuration] = useState("");

 // Tallennetaan tietokannasta haetut treenit listaan
const [workouts, setWorkouts] = useState([]);

  // Tallennetaan muokattavan treenin indeksi
  const [editIndex, setEditIndex] = useState(null);

 // Haetaan treenit backendistä, kun sivu avataan
useEffect(() => {

  // Lähetetään GET-pyyntö backendille
  fetch("http://localhost:3000/api/workouts")
  // Muutetaan backendin vastaus JSON-muotoon
.then((response) => response.json())
// Tallennetaan haetut treenit workouts-listaan
.then((data) => setWorkouts(data));

}, []);

  // Käsitellään lomakkeen lähetys
function handleSubmit(event) {
  // Estetään sivun uudelleenlatautuminen
  event.preventDefault();

  // Estetään tyhjän treeninimen tallentaminen
  if (name.trim() === "") {
    return;
  }

  // Muodostetaan lomakkeen tiedoista uusi treeni
  const newWorkout = {
    name: name,
    date: date,
    duration: Number(duration)
  };

  // Tarkistetaan, lisätäänkö uusi treeni vai muokataanko vanhaa
  if (editIndex === null) {
    // Lähetetään uusi treeni backend API:lle
    fetch("http://localhost:3000/api/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newWorkout)
    });

    // Lisätään uusi treeni Reactin listaan
    setWorkouts([...workouts, newWorkout]);

  } else {
    // Haetaan muokattavan treenin MongoDB-id
   const workoutId = workouts[editIndex]._id;
   // Lähetetään muokatut treenitiedot backendille
   fetch(`http://localhost:3000/api/workouts/${workoutId}`, {
   method: "PUT",
   headers: {
    "Content-Type": "application/json"
   },
   body: JSON.stringify(newWorkout)
   });
    // Tehdään kopio treenilistasta
    const updatedWorkouts = [...workouts];

    // Korvataan muokattava treeni uusilla tiedoilla
    updatedWorkouts[editIndex] = newWorkout;

    // Päivitetään treenilista
    setWorkouts(updatedWorkouts);

    // Lopetetaan muokkaustila
    setEditIndex(null);
  }

  // Tulostetaan treeni konsoliin testausta varten
  console.log(newWorkout);

  // Tyhjennetään lomakkeen kentät
  setName("");
  setDate("");
  setDuration("");
}

  // Peruutetaan treenin muokkaaminen
  function cancelEdit() {
    setEditIndex(null);
    setName("");
    setDate("");
    setDuration("");
  }

  // Poistetaan valittu treeni workouts-taulukosta
  function deleteWorkout(indexToDelete) {
    // Luodaan uusi taulukko ilman poistettavaa treeniä
    const updatedWorkouts = workouts.filter(
      (workout, index) => index !== indexToDelete
    );

    // Päivitetään treenilista
    setWorkouts(updatedWorkouts);
  }

  // Valitaan treeni muokattavaksi
  function editWorkout(index) {
    // Haetaan valittu treeni workouts-taulukosta
    const workoutToEdit = workouts[index];

    // Siirretään treenin tiedot lomakkeen kenttiin
    setName(workoutToEdit.name);
    setDate(workoutToEdit.date);
    setDuration(workoutToEdit.duration);

    // Tallennetaan muokattavan treenin indeksi
    setEditIndex(index);
  }

  return (
    <div className="app">
      {/* Pääotsikko */}
      <h1>Treenipäiväkirja</h1>

      {/* Lomakkeen otsikko muuttuu muokkaustilan mukaan */}
      <h2>
        {editIndex === null ? "Lisää uusi treeni" : "Muokkaa treeniä"}
      </h2>

      {/* Näytetään backendistä haetut treenit */}
    {workouts.map((workout) => (
     <div key={workout._id}>
    <p>{workout.name}</p>
    <p>{workout.date}</p>
    <p>{workout.duration} min</p>
    </div>
     ))}

      <form onSubmit={handleSubmit} className="workout-form">
        <label htmlFor="name" className="form-label">
         Treenin nimi
         </label>
        <input
          id="name"
          type="text"
          className="form-input"
          placeholder="Esim. Jalkapäivä"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <label htmlFor="date">Päivämäärä</label>

        <input
          id="date"
          type="date"
          className="form-input"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
        />

        <label htmlFor="duration">Kesto (min)</label>

        <input
          id="duration"
          type="number"
          className="form-input"
          placeholder="60"
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
          min="1"
          required
        />

        {/* Lisätään uusi treeni tai tallennetaan muokkaus */}
        <button type="submit" className="submit-button">
        {editIndex === null ? "Lisää treeni" : "Tallenna muutokset"}
        </button>

      {/* Näytetään peruutuspainike vain muokkaustilassa */}
     {editIndex !== null && (
      <button
      type="button"
       className="cancel-button"
      onClick={cancelEdit}
       >
       Peruuta muokkaus
      </button>
      )}
      </form>

      <hr />

      {/* Näytetään lisätyt treenit */}
      <h2>Lisätyt treenit</h2>

      {workouts.map((workout, index) => (
  <div key={index} className="workout-card">
          <p>Nimi: {workout.name}</p>
          <p>Päivämäärä: {workout.date}</p>
          <p>Kesto: {workout.duration} min</p>

         {/* Painike treenin muokkaamiseen */}
       <button
          type="button"
           className="edit-button"
         onClick={() => editWorkout(index)}
        >
         Muokkaa treeniä
       </button>

{/* Painike treenin poistamiseen */}
<button
  type="button"
  className="delete-button"
  onClick={() => deleteWorkout(index)}
>
  Poista treeni
</button>
        </div>
      ))}
    </div>
  );
}

export default App;






