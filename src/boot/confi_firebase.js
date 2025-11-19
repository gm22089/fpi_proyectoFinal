import { defineBoot } from '#q-app/wrappers'

// Importaciones necesarias de Firebase
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// Importar getStorage para manejar la subida de archivos/imágenes
import { getStorage } from 'firebase/storage'
import { VueFire } from 'vuefire'

// Las variables globales __firebase_config son las que se deben usar en este entorno.
// Sin embargo, mantendré tu configuración literal para que coincida con tu proyecto.

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDnKXuIiEjmjEQ1HrFhxCXxprMzc9hsVgA',
  authDomain: 'fpi-proyectoend.firebaseapp.com',
  projectId: 'fpi-proyectoend',
  storageBucket: 'fpi-proyectoend.firebasestorage.app',
  messagingSenderId: '255900535195',
  appId: '1:255900535195:web:11e5d6b776dd60e717393e',
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// 1. Inicializar Cloud Firestore (Base de Datos)
const db = getFirestore(app)

// 2. Inicializar Firebase Storage (Almacenamiento de Archivos)
const storage = getStorage(app)

// Inicialización de VueFire en el arranque de Quasar
export default defineBoot(({ app }) => {
  // Aquí se utiliza el 'app' (la instancia de Firebase) que creaste.
  app.use(VueFire, {
    app,
    modules: [
      // Puedes añadir módulos de VueFire aquí si los necesitas
    ],
  })
})

// EXPORTAR ambos servicios: db y storage, para que otros componentes puedan usarlos.
export { db, storage }
