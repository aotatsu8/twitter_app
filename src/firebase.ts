import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA5yJx9x8xxhiJnN8Ez-kGFZcEM2cOnDW8",
  authDomain: "twitter-app-bb8e4.firebaseapp.com",
  databaseURL: "https://twitter-app-bb8e4.firebaseio.com",
  projectId: "twitter-app-bb8e4",
  storageBucket: "twitter-app-bb8e4.appspot.com",
  messagingSenderId: "969729802488",
  appId: "1:969729802488:web:795543c19725e9f7b4bb0d",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export const db = firebaseApp.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const provider = new firebase.auth.GoogleAuthProvider();
