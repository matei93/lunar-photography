import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "lunar-website-aaeba.firebaseapp.com",
  projectId: "lunar-website-aaeba",
  storageBucket: "lunar-website-aaeba.appspot.com",
  messagingSenderId: "565144491398",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const storage = firebaseApp.storage();
const database = getFirestore();

export { database, storage, firebaseApp };
