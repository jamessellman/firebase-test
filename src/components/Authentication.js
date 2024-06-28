import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, googleProvider } from "../config/firebase";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";

export function Authentication() {
  // setting the states for email and password. As these are being changed for by the user we need to monitor its current state.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const moviesCollectionRef = collection(db, "Movies");

  // checking to see if a user is signed in using the console on the browser
  console.log(auth?.currentUser?.email);

  // function to sign in the user. Just need to await the createUserWithEmailAndPassword (need the inputs of auth, email, password to work)
  async function signIn() {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log(err);
    }
  }

  // function to sign in using google. need to import google provider from firebase. used signinwithpopup which also was imported from fire/auth. it takes auth and google provider has parameters.
  async function signInWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.log(err);
    }
  }

  // function to log out. very sign just need to import signout from firebase/auth
  async function logOut() {
    try {
      await signOut(auth);
    } catch (err) {
      console.log(err);
    }
  }

  // function to grab all data from backend. needed to be an async function to create a promise and continue running the code. needed to import get docs from firebase/firestore.
  useEffect(() => {
    const getMovies = async () => {
      try {
        const movieData = await getDocs(moviesCollectionRef);
        console.log(movieData);
      } catch (err) {
        console.log(err);
      }
    };
    getMovies();
  }, []);

  return (
    <div>
      <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signIn}>Sign In</button>
      <button onClick={signInWithGoogle}>Sign In with Google</button>
      <button onClick={logOut}>Log Out</button>
    </div>
  );
}
