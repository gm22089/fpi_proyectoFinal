import MainLayout from 'layouts/MainLayout.vue'

// Archivo de configuración de rutas
const routes = [
  {
    path: '/',
    component: MainLayout, // Todas estas rutas usarán el MainLayout
    children: [
      // 1. Ruta de Inicio ( / )
      {
        path: '', // path vacío significa ruta raíz. por lo que es "/"
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
      },
      // 2. Ruta para Añadir un Producto ( /agregar )
      {
        path: 'agregar',
        name: 'agregar',
        // CORRECCIÓN: Usamos solo 'pages/' para consistencia.
        component: () => import('pages/AgregarTelefono.vue'),
      },
      // 3. Ruta para Estadisticas ( /estadisticas )
      {
        path: 'estadisticas',
        name: 'stats',
        component: () => import('pages/StatsPage.vue'),
      },
      // 4. Ruta para Carrito ( /carrito ) - Descomentar si tienes el archivo CartPage.vue
      // {
      //   path: 'carrito',
      //   name: 'carrito',
      //   component: () => import('pages/CartPage.vue')
      // },
    ],
  },

  // Siempre deja esta como la última: la ruta 404 (Not Found)
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
