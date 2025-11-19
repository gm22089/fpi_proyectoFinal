<template>
  <q-layout view="hHh lpR fFf">
    <!-- Barra superior -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <!-- Logo / nombre -->
        <q-toolbar-title class="text-h6"> 📱 Tienda Cellphone </q-toolbar-title>

        <!-- Barra de búsqueda -->
        <q-input
          dense
          standout
          dark
          v-model="busqueda"
          placeholder="Buscar teléfono..."
          class="q-mr-md"
          style="max-width: 250px"
          @keyup.enter="buscarProducto"
        >
          <template #append>
            <q-icon name="search" @click="buscarProducto" class="cursor-pointer" />
          </template>
        </q-input>

        <!-- Botones de navegación -->
        <!-- Se asume que estás usando Vue Router con Quasar -->
        <q-btn flat label="Inicio" to="/" icon="home" />
        <q-btn flat label="Estadísticas" to="/estadisticas" icon="bar_chart" />
        <q-btn flat label="Añadir" to="/agregar" icon="add_circle" />
        <q-btn flat label="Carrito" to="/carrito" icon="shopping_cart" />
      </q-toolbar>
    </q-header>

    <!-- Contenido de cada página (las vistas de router) -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const busqueda = ref('')

function buscarProducto() {
  if (!busqueda.value) return
  // Aquí se implementaría la lógica de búsqueda global o navegación.
  console.log('Buscando:', busqueda.value)
}
</script>

<style scoped>
.q-toolbar-title {
  font-weight: bold;
}
</style>
