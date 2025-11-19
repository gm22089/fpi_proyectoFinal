<template>
  <q-page padding class="q-gutter-md">
    <!-- Nombre de la empresa -->
    <div class="text-center q-mb-lg">
      <h2 class="text-h4 text-uppercase text-weight-bold">Tienda Cellphone</h2>
    </div>

    <!-- Contenido Principal (Filtros y Productos) -->
    <div class="row q-col-gutter-lg">
      <!-- ========================================= -->
      <!-- FILTROS LATERALES (ESCRITORIO: visible, MÓVIL: oculto/modal) -->
      <!-- ========================================= -->
      <div class="col-12 col-lg-3 gt-md">
        <q-card flat bordered class="q-pa-md bg-grey-1">
          <div class="q-gutter-y-lg">
            <!-- Título de la sección de filtros -->
            <div class="text-h6 text-primary text-weight-bold">Filtros</div>

            <!-- BOTÓN NUEVO -->
            <q-toggle
              v-model="soloNuevos"
              label="Mostrar solo nuevos"
              checked-icon="check"
              unchecked-icon="clear"
              color="primary"
            />

            <!-- MARCAS -->
            <q-list separator>
              <q-item-label header class="text-weight-bold">MARCAS</q-item-label>
              <q-item v-for="marca in marcasDisponibles" :key="marca" tag="label" dense>
                <q-item-section avatar>
                  <q-checkbox v-model="filtroMarcas" :val="marca" color="primary" dense />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ marca }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <!-- SISTEMAS -->
            <q-list separator>
              <q-item-label header class="text-weight-bold">SISTEMA OPERATIVO</q-item-label>
              <q-item v-for="sistema in sistemasDisponibles" :key="sistema" tag="label" dense>
                <q-item-section avatar>
                  <q-checkbox v-model="filtroSistemas" :val="sistema" color="primary" dense />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ sistema }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <!-- PANTALLAS -->
            <q-list separator>
              <q-item-label header class="text-weight-bold">PANTALLA</q-item-label>
              <q-item v-for="pantalla in pantallasDisponibles" :key="pantalla" tag="label" dense>
                <q-item-section avatar>
                  <q-checkbox v-model="filtroPantallas" :val="pantalla" color="primary" dense />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ pantalla }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <!-- BOTONES DE ACCIÓN (Ahora solo para Checkboxes) -->
            <div class="row q-gutter-sm q-pt-md">
              <q-btn
                label="Aplicar Filtros"
                color="deep-orange-9"
                class="col"
                @click="aplicarFiltros"
              />
              <q-btn label="Limpiar" color="grey" outline class="col" @click="limpiarFiltros" />
            </div>
          </div>
        </q-card>
      </div>

      <!-- ========================================= -->
      <!-- LISTADO DE PRODUCTOS -->
      <!-- ========================================= -->
      <div class="col-12 col-lg-9">
        <!-- FILTRO SUPERIOR (PRECIO Y ORDENACIÓN) -->
        <q-card flat bordered class="q-pa-md q-mb-md">
          <!-- CAMBIO: Añadimos 'justify-center' aquí para centrar el bloque de filtros superiores -->
          <div class="row items-center q-gutter-md justify-center">
            <!-- BLOQUE MÓVIL: Botón de Filtros + Ordenación (lt-lg) -->
            <div class="row q-gutter-sm lt-lg full-width">
              <!-- MÓVIL: Botón para abrir filtros laterales -->
              <q-btn
                icon="filter_alt"
                label="Filtros"
                color="primary"
                class="col"
                @click="mostrarFiltrosMovil = true"
              />

              <!-- BLOQUE DE ORDENACIÓN - MÓVIL (Dropdown) -->
              <q-btn-dropdown
                :label="'Ordenar por: ' + getOrderTextDisplay(ordenActual)"
                color="grey-6"
                outline
                class="col"
              >
                <q-list>
                  <q-item clickable v-close-popup @click="cambiarOrden('Precio')">
                    <q-item-section>Precio</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="cambiarOrden('Fecha')">
                    <q-item-section>Fecha</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>

            <!-- ESCRITORIO: Inputs de Precio (gt-md) - APLICACIÓN INSTANTÁNEA -->
            <div class="row items-center q-gutter-sm gt-md">
              <span class="text-weight-semibold q-mr-sm">Precio</span>
              <q-input
                v-model.number="precioMin"
                type="number"
                label="Mínimo"
                dense
                outlined
                prefix="$"
                style="width: 120px"
              />
              <q-input
                v-model.number="precioMax"
                type="number"
                label="Máximo"
                dense
                outlined
                prefix="$"
                style="width: 120px"
              />
            </div>

            <!-- BLOQUE DE ORDENACIÓN - ESCRITORIO (gt-md) -->
            <div class="row items-center q-gutter-sm gt-md">
              <span class="text-weight-semibold">Ordenar por:</span>
              <q-btn-group unelevated>
                <q-btn
                  label="Precio"
                  :color="ordenActual === 'Precio' ? 'primary' : 'grey-5'"
                  :text-color="ordenActual === 'Precio' ? 'white' : 'black'"
                  @click="cambiarOrden('Precio')"
                />
                <q-btn
                  label="Fecha"
                  :color="ordenActual === 'Fecha' ? 'primary' : 'grey-5'"
                  :text-color="ordenActual === 'Fecha' ? 'white' : 'black'"
                  @click="cambiarOrden('Fecha')"
                />
              </q-btn-group>
            </div>
          </div>
        </q-card>

        <!-- LISTADO DE PRODUCTOS -->
        <div class="row q-col-gutter-md justify-center">
          <div
            v-for="telefono in telefonosPaginados"
            :key="telefono.id"
            class="col-6 col-sm-4 col-md-3 col-lg-4 col-xl-3"
          >
            <q-card class="full-height">
              <router-link :to="{ path: '#' }" class="text-decoration-none text-black">
                <!-- IMAGEN DEL PRODUCTO (USANDO EL PRIMER ELEMENTO DEL ARRAY 'imagenes') -->
                <q-img
                  :src="telefono.imagenes?.[0] || defaultImage"
                  :alt="`Imagen de ${telefono.Marca} ${telefono.Modelo}`"
                  height="120px"
                  fit="contain"
                  loading="lazy"
                  class="q-mt-sm"
                />
                <q-card-section class="q-pt-sm">
                  <div class="text-h6 text-deep-orange-10 text-weight-bold">
                    ${{ telefono.Precio }}
                  </div>
                  <div class="text-body2 text-grey-8 q-mt-xs">
                    {{ telefono.Marca }} {{ telefono.Modelo }}
                  </div>
                  <div class="text-caption text-grey-6">
                    {{ telefono.Ram }} / {{ telefono.Rom }} | {{ telefono.Pantalla }}
                  </div>
                  <!-- Se usa 'Estado' (mayúscula) y se verifica el valor 'nuevo' (minúscula) -->
                  <q-badge
                    :color="
                      telefono.Estado && telefono.Estado.toLowerCase() === 'nuevo'
                        ? 'green-6'
                        : 'blue-grey-6'
                    "
                    class="q-mt-xs"
                    >{{ telefono.Estado }}</q-badge
                  >
                </q-card-section>
              </router-link>
            </q-card>
          </div>

          <!-- Mensaje de no resultados -->
          <div v-if="telefonosFiltrados.length === 0" class="col-12 text-center q-mt-xl">
            <div class="text-h6 text-grey-6">No se encontraron resultados!!!</div>
            <q-icon name="sentiment_dissatisfied" size="xl" color="grey-5" />
          </div>
        </div>

        <!-- PAGINACIÓN -->
        <div
          class="q-mt-xl row justify-center items-center q-gutter-md"
          v-if="telefonosFiltrados.length > 0"
        >
          <!-- Componente de Paginación -->
          <q-pagination
            v-model="paginaActual"
            :max="totalPaginas"
            :max-pages="$q.screen.lt.md ? 5 : 6"
            direction-links
            flat
            color="grey-8"
            active-color="deep-orange-9"
          />

          <!-- Selector de cantidad por página (Solo visible en escritorio: gt-sm) -->
          <q-select
            v-model="itemsPorPaginaDesktop"
            :options="[8, 12, 16, 20, 25]"
            label="Artículos por página"
            dense
            outlined
            style="width: 150px"
            emit-value
            map-options
            class="q-ml-lg gt-sm"
          />

          <!-- Texto Página X de X (Solo visible en escritorio: gt-sm) -->
          <span class="text-caption text-grey-6 q-ml-sm gt-sm">
            Página {{ paginaActual }} de {{ totalPaginas }}
          </span>
        </div>
      </div>
    </div>

    <!-- ========================================= -->
    <!-- MÓVIL: DIÁLOGO DE FILTROS (lt-lg) -->
    <!-- ========================================= -->
    <q-dialog v-model="mostrarFiltrosMovil" position="left" seamless>
      <q-card style="width: 300px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-primary text-weight-bold">Filtros</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-sm q-pb-lg">
          <div class="q-gutter-y-lg">
            <!-- Filtro Rango de Precio en Móvil - APLICACIÓN INSTANTÁNEA -->
            <div class="q-mt-md">
              <div class="text-weight-bold text-caption text-grey-7 q-mb-sm">
                Rango de Precio ($)
              </div>
              <q-input
                v-model.number="precioMin"
                type="number"
                label="Mínimo"
                dense
                outlined
                prefix="$"
                class="q-mb-sm"
              />
              <q-input
                v-model.number="precioMax"
                type="number"
                label="Máximo"
                dense
                outlined
                prefix="$"
              />
            </div>

            <!-- Toggle Nuevo - APLICACIÓN INSTANTÁNEA -->
            <q-toggle
              v-model="soloNuevos"
              label="Mostrar solo nuevos"
              checked-icon="check"
              unchecked-icon="clear"
              color="primary"
            />

            <!-- Marcas, Sistemas, Pantallas (usando QList como en desktop) -->
            <q-list separator>
              <q-item-label header class="text-weight-bold">MARCAS</q-item-label>
              <q-item v-for="marca in marcasDisponibles" :key="marca" tag="label" dense>
                <q-item-section avatar>
                  <q-checkbox v-model="filtroMarcas" :val="marca" color="primary" dense />
                </q-item-section>
                <q-item-section
                  ><q-item-label>{{ marca }}</q-item-label></q-item-section
                >
              </q-item>
            </q-list>

            <q-list separator>
              <q-item-label header class="text-weight-bold">SISTEMA OPERATIVO</q-item-label>
              <q-item v-for="sistema in sistemasDisponibles" :key="sistema" tag="label" dense>
                <q-item-section avatar>
                  <q-checkbox v-model="filtroSistemas" :val="sistema" color="primary" dense />
                </q-item-section>
                <q-item-section
                  ><q-item-label>{{ sistema }}</q-item-label></q-item-section
                >
              </q-item>
            </q-list>

            <q-list separator>
              <q-item-label header class="text-weight-bold">PANTALLA</q-item-label>
              <q-item v-for="pantalla in pantallasDisponibles" :key="pantalla" tag="label" dense>
                <q-item-section avatar>
                  <q-checkbox v-model="filtroPantallas" :val="pantalla" color="primary" dense />
                </q-item-section>
                <q-item-section
                  ><q-item-label>{{ pantalla }}</q-item-label></q-item-section
                >
              </q-item>
            </q-list>

            <!-- BOTONES DE ACCIÓN MÓVIL (Solo para Checkboxes) -->
            <div class="row q-gutter-sm q-pt-md">
              <q-btn
                label="Aplicar Filtros"
                color="deep-orange-9"
                class="col"
                @click="aplicarFiltros"
                v-close-popup
              />
              <q-btn
                label="Limpiar"
                color="grey"
                outline
                class="col"
                @click="limpiarFiltros"
                v-close-popup
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useCollection } from 'vuefire'
import { collection } from 'firebase/firestore'
import { db } from 'src/boot/confi_firebase'

const $q = useQuasar()

// Carga en tiempo real la colección 'telefonos' de Firestore
const telefonos = useCollection(collection(db, 'telefonos'))
// Imagen por defecto si no se encuentra ninguna URL de imagen
const defaultImage = 'https://placehold.co/120x120/E8F0FE/000000?text=No%20Imagen'

// ==========================
// Variables de filtros
// ==========================
const precioMin = ref(null)
const precioMax = ref(null)
const filtroMarcas = ref([])
const filtroSistemas = ref([])
const filtroPantallas = ref([])
const filtrosActivos = ref(false)
const soloNuevos = ref(false)

const mostrarFiltrosMovil = ref(false)
const ordenActual = ref('Precio')

// ==========================
// Variables de paginación
// ==========================
const paginaActual = ref(1)
const itemsPorPaginaDesktop = ref(12)

const itemsPorPagina = computed(() => {
  if ($q.screen.lt.md) {
    return 4
  }
  return itemsPorPaginaDesktop.value
})

// ==========================
// Datos de selección
// ==========================
// NOTA: Es importante que estos valores coincidan exactamente con los valores guardados en Firestore.
const marcasDisponibles = ['Iphone', 'Samsung', 'Huawei', 'Nokia', 'Xiaomi']
const sistemasDisponibles = ['iOS', 'Android', 'Windows']
const pantallasDisponibles = ['5 pulgadas', '6 pulgadas', '7 pulgadas']

// ==========================
// Filtrado y Ordenamiento UNIFICADO
// ==========================
const telefonosFiltrados = computed(() => {
  let lista = telefonos.value || []
  const isButtonFiltersActive = filtrosActivos.value

  // --- 1. FILTRADO ---
  lista = lista.filter((t) => {
    // Es buena práctica convertir a Number y usar 0 o Infinity como fallback
    const precio = Number(t.Precio) || 0
    const min = precioMin.value || 0
    const max = precioMax.value || Infinity

    // Filtro por precio
    if (!(precio >= min && precio <= max)) return false

    // Filtro por estado (IMPORTANTE: Usar 't.Estado' para coincidir con Firestore y 'nuevo' en minúscula)
    if (soloNuevos.value && !(t.Estado && t.Estado.toLowerCase() === 'nuevo')) return false

    // Filtros de Checkbox (solo se aplican si se presiona "Aplicar Filtros")
    if (isButtonFiltersActive) {
      // Nota: Asegúrate de que las propiedades coincidan con la capitalización de Firestore: Marca, Sistema, Pantalla
      const cumpleMarca = filtroMarcas.value.length === 0 || filtroMarcas.value.includes(t.Marca)
      const cumpleSistema =
        filtroSistemas.value.length === 0 || filtroSistemas.value.includes(t.Sistema)
      const cumplePantalla =
        filtroPantallas.value.length === 0 || filtroPantallas.value.includes(t.Pantalla)

      if (!cumpleMarca || !cumpleSistema || !cumplePantalla) return false
    }

    return true
  })

  // --- 2. ORDENACIÓN ---
  if (ordenActual.value === 'Precio') {
    lista.sort((a, b) => (Number(a.Precio) || 0) - (Number(b.Precio) || 0))
  } else if (ordenActual.value === 'Fecha') {
    // Usamos el ID del documento como proxy para la fecha de creación (siempre creciente)
    lista.sort((a, b) => {
      if (a.id > b.id) return -1
      if (a.id < b.id) return 1
      return 0
    })
  }

  return lista
})

// ==========================
// Paginación Computada
// ==========================
const totalPaginas = computed(() =>
  Math.ceil(telefonosFiltrados.value.length / itemsPorPagina.value),
)

const telefonosPaginados = computed(() => {
  const start = (paginaActual.value - 1) * itemsPorPagina.value
  const end = start + itemsPorPagina.value
  return telefonosFiltrados.value.slice(start, end)
})

// Corrige la paginación al cambiar los filtros y los itemsPorPagina
watch(
  [paginaActual, totalPaginas, itemsPorPagina],
  ([newPage, newTotal]) => {
    if (newTotal === 0) {
      return
    }
    if (newPage > newTotal) {
      paginaActual.value = newTotal
    }
    if (newPage < 1) {
      paginaActual.value = 1
    }
  },
  { immediate: true },
)

// Reinicia paginación al cambiar filtros de precio
watch([precioMin, precioMax], () => {
  paginaActual.value = 1
})

// ==========================
// Funciones
// ==========================

function cambiarOrden(criterio) {
  ordenActual.value = criterio
  paginaActual.value = 1
}

function getOrderTextDisplay(currentOrder) {
  if (currentOrder === 'Precio') return 'Precio'
  if (currentOrder === 'Fecha') return 'Fecha'
  return 'Selecciona una opción...'
}

function aplicarFiltros() {
  filtrosActivos.value = true
  paginaActual.value = 1
  mostrarFiltrosMovil.value = false

  if (!ordenActual.value) {
    ordenActual.value = 'Precio'
  }
}

function limpiarFiltros() {
  precioMin.value = null
  precioMax.value = null
  filtroMarcas.value = []
  filtroSistemas.value = []
  filtroPantallas.value = []
  filtrosActivos.value = false
  soloNuevos.value = false
  paginaActual.value = 1
  mostrarFiltrosMovil.value = false
  ordenActual.value = 'Precio'
}
</script>

<style scoped>
/* Estilos basados en Quasar (minimalistas, usando las clases de utilería de Quasar) */
.q-page {
  background-color: #f8f9fa; /* Fondo suave */
}

/* Ajuste para el texto en las tarjetas */
.q-card a {
  text-decoration: none;
  color: inherit;
  display: block;
}

.q-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  border-radius: 8px;
}

.q-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Estilo para los filtros del lado izquierdo */
.q-card.bg-grey-1 {
  height: 100%;
  position: sticky;
  top: 20px;
}
</style>
