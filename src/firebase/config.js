import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBYLZRnX4CNFbwQgWB1lSYe_taUE0angKU",
  authDomain: "lunar-website-aaeba.firebaseapp.com",
  databaseURL: "https://lunar-website-aaeba-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lunar-website-aaeba",
  storageBucket: "lunar-website-aaeba.appspot.com",
  messagingSenderId: "565144491398",
  appId: "1:565144491398:web:0f21e20b04ff3545b98807",
  measurementId: "G-M0VJXTMNQX"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
const database = getFirestore(firebaseApp);

// Free tier limits
const LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_STORAGE: 1 * 1024 * 1024 * 1024, // 1GB
  DAILY_DOWNLOADS: 1 * 1024 * 1024 * 1024, // 1GB/day
};

export { storage, db, LIMITS };