<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="q-ml-md">
          <q-icon name="storefront" size="md" class="q-mr-sm" />
          Tienda CellPhone
        </q-toolbar-title>

        <q-input
          dark
          dense
          standout
          v-model="searchText"
          placeholder="Q search"
          input-class="text-right"
          class="q-mr-sm"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn flat dense icon="home" label="Inicio" to="/" />
        <q-btn flat dense icon="bar_chart" label="Estadísticas" to="/stats" class="q-mr-xs" />
        <q-btn
          round
          dense
          color="white"
          text-color="primary"
          icon="add"
          to="/new-ad"
          class="q-mr-sm"
        />
        <q-btn round dense icon="shopping_cart" to="/cart" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list separator>
        <q-item-label header> Navegación Principal </q-item-label>

        <q-item clickable v-ripple to="/">
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>Inicio</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/new-ad">
          <q-item-section avatar><q-icon name="post_add" /></q-item-section>
          <q-item-section>Nuevo Anuncio</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/cart">
          <q-item-section avatar><q-icon name="shopping_cart" /></q-item-section>
          <q-item-section>Carrito</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/stats">
          <q-item-section avatar><q-icon name="bar_chart" /></q-item-section>
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

// --- Variables necesarias ---

// 1. Variable para el campo de búsqueda (que faltaba)
const searchText = ref('')

// 2. Variable que controla el menú lateral
const leftDrawerOpen = ref(false)

// --- Función para alternar el menú ---
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
