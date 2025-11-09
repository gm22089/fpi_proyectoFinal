<template>
  <q-layout view="hHh lpR fFf">
    <!-- Barra superior -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>

        <!-- Logo / nombre -->
        <q-toolbar-title class="text-h6">
          📱 Tienda Cellphone
        </q-toolbar-title>

        <!-- Barra de búsqueda -->
        <q-input
          dense
          standout
          v-model="busqueda"
          placeholder="Buscar teléfono..."
          class="q-mr-md"
          style="max-width: 250px;"
          @keyup.enter="buscarProducto"
        >
          <template #append>
            <q-icon name="search" @click="buscarProducto" class="cursor-pointer" />
          </template>
        </q-input>

        <!-- Botones de navegación -->
        <q-btn flat label="Inicio" to="/" icon="home" />
        <q-btn flat label="Estadísticas" to="/estadisticas" icon="bar_chart" />
        <q-btn flat label="Añadir" to="/agregar" icon="add_circle" />
        <q-btn flat label="Carrito" to="/carrito" icon="shopping_cart" />
      </q-toolbar>
    </q-header>

    <!-- Contenido de cada página -->
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
  // Aquí puedes emitir un evento global o usar un store para filtrar en la página de inicio
  console.log('Buscando:', busqueda.value)
}
</script>

<style scoped>
.q-toolbar-title {
  font-weight: bold;
}
</style>
