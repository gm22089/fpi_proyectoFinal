<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="lt-md q-mr-sm"
        />

        <q-toolbar-title class="text-h6 text-weight-bold gt-sm">
          📱 Tienda Cellphone
        </q-toolbar-title>

        <q-input
          dense
          standout
          dark
          v-model="busqueda"
          placeholder="Buscar teléfono..."
          class="q-mr-md"
          :class="$q.screen.lt.md ? 'col' : ''"
          :style="$q.screen.gt.sm ? 'max-width: 250px;' : ''"
          @keyup.enter="buscarProducto"
        >
          <template #append>
            <q-icon name="search" @click="buscarProducto" class="cursor-pointer" />
          </template>
        </q-input>

        <div class="gt-sm row q-gutter-sm items-center">
          <q-btn flat label="Inicio" to="/" icon="home" />
          <q-btn flat label="Estadísticas" to="/estadisticas" icon="bar_chart" />
          <q-btn flat label="Nuevo anuncio" to="/agregar" icon="add_circle" />

          <q-btn flat round icon="shopping_cart" class="relative-position q-ml-sm cursor-default">
            <q-badge
              v-if="cartCount > 0"
              color="negative"
              floating
              rounded
              class="text-weight-bold"
              style="top: 8px; right: 8px"
            >
              {{ cartCount }}
            </q-badge>
            <q-tooltip v-if="cartCount > 0"> {{ cartCount }} productos en el carrito </q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      bordered
      overlay
      behavior="mobile"
      class="bg-white"
    >
      <q-list padding>
        <q-item-label header class="text-h6 text-primary text-weight-bold q-pa-md">
          📱 Tienda Cellphone
        </q-item-label>
        <q-separator />

        <q-item clickable v-ripple to="/" exact class="text-grey-7">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>Inicio</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/agregar" class="text-grey-7">
          <q-item-section avatar>
            <q-icon name="add_circle" />
          </q-item-section>
          <q-item-section>Nuevo anuncio</q-item-section>
        </q-item>

        <q-item clickable v-ripple class="text-grey-7" @click="mostrarNotificacionCarrito">
          <q-item-section avatar>
            <q-icon name="shopping_cart">
              <q-badge
                v-if="cartCount > 0"
                color="negative"
                floating
                rounded
                class="text-weight-bold"
              >
                {{ cartCount }}
              </q-badge>
            </q-icon>
          </q-item-section>
          <q-item-section>Carrito</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/estadisticas" class="text-grey-7">
          <q-item-section avatar>
            <q-icon name="bar_chart" />
          </q-item-section>
          <q-item-section>Estadísticas</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
// 1. Importar la tienda de Pinia
import { useCartStore } from 'src/stores/cartStore'
import { storeToRefs } from 'pinia'

const $q = useQuasar() // Necesario para usar $q.notify
const router = useRouter()
const busqueda = ref('')
const leftDrawerOpen = ref(false)

// 2. Usar la tienda y extraer el getter cartCount de forma reactiva
const cartStore = useCartStore()
const { cartCount } = storeToRefs(cartStore)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function buscarProducto() {
  const searchTerm = busqueda.value.trim()

  if (searchTerm === '') {
    router.push({ path: '/' })
  } else {
    router.push({ path: '/', query: { q: searchTerm } })
  }

  if ($q.screen.lt.md && leftDrawerOpen.value) {
    leftDrawerOpen.value = false
  }
}

// 🎯 FUNCIÓN PARA MOSTRAR LA NOTIFICACIÓN DEL CARRITO
function mostrarNotificacionCarrito() {
  // Construye el mensaje correctamente, pluralizando 'producto'
  const message = `Tienes ${cartCount.value} producto${cartCount.value !== 1 ? 's' : ''} en tu carrito.`

  $q.notify({
    message: message,
    icon: 'shopping_cart',
    color: 'primary', // Usa el color de tu marca (Azul)
    timeout: 2000, // 2 segundos
    position: 'top',
  })
}
</script>

<style scoped>
.q-toolbar-title {
  font-weight: bold;
}
</style>
