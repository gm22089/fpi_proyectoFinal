import { createPinia } from 'pinia'
// CORRECCIÓN: Usamos la ruta de importación que funciona en tu proyecto
import { defineBoot } from '#q-app/wrappers'

// Usamos defineBoot para asegurar que tenemos acceso a la instancia de la app.
export default defineBoot(({ app }) => {
  // 1. Creamos la instancia de Pinia
  const pinia = createPinia()

  // 2. ¡CRUCIAL! La instalamos en la instancia de Vue.
  // Esto hace que Pinia esté disponible para todos los componentes y stores.
  app.use(pinia)
})
