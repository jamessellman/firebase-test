import { useEffect, useState } from "react";
import "./App.css";
import { Authentication } from "./components/auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  // need a state to keep track of the movies
  const [movies, setMovies] = useState([]);

  // we need states to keep track of the inputs the user wants to add
  const [movieTitle, setMovieTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState(0);
  const [checkOscar, setCheckOscar] = useState(false);

  // state for updating the title
  const [updateMovieTitle, setUpdateMovieTitle] = useState("");

  // stage for file upload
  const [fileUpload, setFileUpload] = useState(null);

  // create this variable to store location of data we want to grab. needed to import collection from firebase/firestore. pass the variable db (which was defined in firebase.js) which the
  // name of the collection exectly. (ie Movies)
  const moviesCollectionRef = collection(db, "Movies");

  // function to grab all data from backend. needed to be an async function to create a promise and continue running the code. needed to import get docs from firebase/firestore.
  // to find the data we needed to create a variable where the location was sit (moviesCollectionRef)

  const getMovies = async () => {
    try {
      const movieData = await getDocs(moviesCollectionRef);
      // variable to store only the data we want and ignore everything else.
      // basically we take the entire docs, then map through each one and create an object that only contains the data we want.
      const filteredData = movieData.docs.map((doc) => ({
        // ...doc.data is used to get the fields in the right hand column in firestore db
        ...doc.data(),
        // as the id is in the middle column on firebase not fields like the above you have to specify seperatly.
        id: doc.id,
      }));
      setMovies(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  // function to submit user movie, need to import addDoc from firebase/firestore
  async function submitMovie() {
    try {
      await addDoc(moviesCollectionRef, {
        title: movieTitle,
        year: releaseYear,
        wonAnOscar: checkOscar,
        userId: auth?.currentUser?.uid,
      });
      getMovies();
    } catch (err) {
      console.error(err);
    }
  }

  // function to delete movie. needed to import deleteDoc from firebase/firestore. Requires id a parameter to know which movie to delete
  async function deleteMovie(id) {
    try {
      const movieDoc = doc(db, "Movies", id);
      await deleteDoc(movieDoc);
      // Update the state to remove the deleted movie
      setMovies(movies.filter((movie) => movie.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  // function that updates the title of a movie, requires ID as parameter to know which movie title to update
  async function updateTitle(id) {
    try {
      const movieDoc = doc(db, "Movies", id);
      await updateDoc(movieDoc, { title: updateMovieTitle });
      // Update the state with the new movie title
      setMovies(
        movies.map((movie) =>
          movie.id === id ? { ...movie, title: updateMovieTitle } : movie
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  // function for uploading a file
  async function uploadFile() {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `fileFolder/${uploadFile.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello</h1>
        <Authentication />
        {/* add a movie */}
        <div>
          <input
            placeholder="Movie Name"
            type="string"
            onChange={(e) => setMovieTitle(e.target.value)}
          />
          <input
            placeholder="Release Year"
            type="number"
            onChange={(e) => setReleaseYear(Number(e.target.value))}
          />
          <input
            type="checkbox"
            checked={checkOscar}
            onChange={(e) => setCheckOscar(e.target.checked)}
          />
          <label>Has the movie won an Oscar?</label>
          <button onClick={submitMovie}>Submit Movie</button>
        </div>
        {/* div to display list of movies */}
        <div>
          {movies.map((movie) => (
            <div>
              <h1 style={{ color: movie.wonAnOscar ? "green" : "red" }}>
                {movie.title}
              </h1>
              <p>Release date: {movie.year}</p>
              <button onClick={() => deleteMovie(movie.id)}>
                Delete Movie
              </button>
              <input
                placeholder="new title"
                onChange={(e) => setUpdateMovieTitle(e.target.value)}
              />
              <button onClick={() => updateTitle(movie.id)}>
                Update Title
              </button>
            </div>
          ))}
          <div>
            <input
              type="file"
              onChange={(e) => setFileUpload(e.target.files)}
            />
            <button onClick={uploadFile}> Upload file</button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
