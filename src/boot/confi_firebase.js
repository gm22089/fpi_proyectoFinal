import { defineBoot } from '#q-app/wrappers'

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage' // <--- NUEVA IMPORTACIÓN
import { VueFire } from 'vuefire'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDnKXuIiEjmjEQ1HrHhxCXxprMzc9hsVgA', // Mantén tu propia API Key
  authDomain: 'fpi-proyectoend.firebaseapp.com',
  projectId: 'fpi-proyectoend',
  storageBucket: 'fpi-proyectoend.firebasestorage.app',
  messagingSenderId: '255900535195',
  appId: '1:255900535195:web:11e5d6b776dd60e717393e',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize cloud firestore
const db = getFirestore(app)

// INICIALIZACIÓN DE STORAGE
const storage = getStorage(app)

export default defineBoot(({ app }) => {
  app.use(VueFire, {
    app,
    modules: [
      //
    ],
  })
})

// EXPORTAMOS db (Firestore) y storage (Firebase Storage)
export { db, storage }
