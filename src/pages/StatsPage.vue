<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">📊 Estadísticas de la Tienda</div>

    <div v-if="!telefonos || telefonos.length === 0" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
      <div class="q-mt-md">Cargando datos de la tienda...</div>
    </div>

    <div v-else>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <q-card flat bordered class="q-pa-md text-center bg-blue-1">
            <div class="text-h6 text-blue-9">Total de Productos</div>
            <div class="text-h3 text-weight-bold">{{ totalProductos }}</div>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card flat bordered class="q-pa-md text-center bg-green-1">
            <div class="text-h6 text-green-9">Precio Promedio</div>
            <div class="text-h3 text-weight-bold text-green-7">
              ${{ precioPromedio.toLocaleString('es-SV') }}
            </div>
          </q-card>
        </div>
      </div>

      <h5 class="q-mt-xl q-mb-md">Distribución por Marca</h5>
      <q-list bordered separator>
        <q-item v-for="(count, marca) in distribucionMarcas" :key="marca">
          <q-item-section avatar>
            <q-icon name="smartphone" color="grey-7" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">{{ marca }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge color="primary">{{ count }} Unidades</q-badge>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useCollection } from 'vuefire'
import { collection } from 'firebase/firestore'
// Asume que la ruta al archivo de configuración es correcta
import { db } from 'src/boot/confi_firebase'

// 1. Obtención de datos de Firebase
const telefonos = useCollection(collection(db, 'telefonos'))

// --- A. Total de Productos ---
const totalProductos = computed(() => {
  // Retorna la cantidad de elementos o 0 si aún no se han cargado
  return telefonos.value?.length || 0
})

// --- B. Precio Promedio ---
const precioPromedio = computed(() => {
  const total = totalProductos.value
  if (total === 0) return 0

  // Suma los precios de todos los teléfonos
  const sumaPrecios = telefonos.value.reduce((acc, telefono) => {
    // Asegura que el Precio es numérico o 0 para evitar fallos
    return acc + (Number(telefono.Precio) || 0)
  }, 0)

  // Devuelve el promedio redondeado a dos decimales
  return (sumaPrecios / total).toFixed(2)
})

// --- C. Distribución por Marca ---
const distribucionMarcas = computed(() => {
  const marcas = {}
  if (!telefonos.value) return marcas // Retorna vacío si no hay datos

  // Recorre la lista para contar cuántos teléfonos hay de cada marca
  telefonos.value.forEach((telefono) => {
    const marca = telefono.Marca || 'Desconocida'
    marcas[marca] = (marcas[marca] || 0) + 1
  })
  return marcas
})
</script>

<style scoped>
/* Puedes añadir estilos específicos aquí si lo deseas */
</style>
