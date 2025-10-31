import { defineBoot } from '#q-app/wrappers'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { VueFire } from 'vuefire'; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnKXuIiEjmjEQ1HrFhxCXxprMzc9hsVgA",
  authDomain: "fpi-proyectoend.firebaseapp.com",
  projectId: "fpi-proyectoend",
  storageBucket: "fpi-proyectoend.firebasestorage.app",
  messagingSenderId: "255900535195",
  appId: "1:255900535195:web:11e5d6b776dd60e717393e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize cloud firestore
const db = getFirestore(app);


// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot( ( { app } ) => {
  app.use(VueFire, {
    app,
    modules: [
      // we will see what to put here later
    ], 
  })  // something to do
});


export { db };