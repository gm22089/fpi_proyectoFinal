// src/router/routes.js

const routes = [
  {
    path: '/',
    // Todas las páginas usarán este Layout (Header, Drawer, Footer, etc.)
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // 1. Ruta de Inicio (la raíz del Layout: /#/ )
      { path: '', component: () => import('pages/IndexPage.vue') },

      // 2. Ruta de Nuevo Anuncio ( /#/new-ad )
      { path: 'new-ad', component: () => import('pages/NewAdPage.vue') },

      // 3. Agrega las demás rutas aquí, como Carrito o Estadísticas
      // { path: 'stats', component: () => import('pages/StatsPage.vue') },
      // { path: 'cart', component: () => import('pages/CartPage.vue') },
    ],
  },

  // La ruta de error 404 debe ser siempre la última y no tener hijos
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
