// Import the functions you need from the SDKs you need
const { getStorage } = require('firebase/storage')
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-0Rcb-UGtznMJ2mn4erGnlOn2RlXTsN4",
  authDomain: "alogar-storage-64d38.firebaseapp.com",
  projectId: "alogar-storage-64d38",
  storageBucket: "alogar-storage-64d38.firebasestorage.app",
  messagingSenderId: "184065941428",
  appId: "1:184065941428:web:05b77dbc874f9c67c0dce1",
  measurementId: "G-82CRSE6RJ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const auth = getAuth(app);

module.exports = { storage, auth };