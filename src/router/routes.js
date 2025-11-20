const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'agregar',
        name: 'agregar',
        component: () => import('pages/AgregarTelefono.vue'),
      },
      {
        path: 'estadisticas',
        name: 'stats',
        component: () => import('pages/StatsPage.vue'),
      },

      // --- NUEVA RUTA PARA EL DETALLE DEL PRODUCTO ---
      // :id indica que es un parámetro dinámico
      {
        path: 'producto/:id',
        name: 'product-details',
        component: () => import('pages/ProductDetailsPage.vue'),
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
