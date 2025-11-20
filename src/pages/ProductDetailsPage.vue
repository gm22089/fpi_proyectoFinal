<template>
  <q-page :padding="$q.screen.gt.sm" class="bg-grey-2" :class="{ 'q-pb-xl': $q.screen.lt.md }">
    <div class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <q-btn
          flat
          icon="arrow_back"
          label="Volver al listado"
          color="primary"
          class="q-mb-md"
          @click="$router.go(-1)"
        />

        <div v-if="loading" class="flex flex-center q-py-xl">
          <q-spinner-dots color="primary" size="3em" />
        </div>

        <div v-else-if="!product" class="text-center q-py-xl">
          <q-icon name="error_outline" size="4em" color="negative" />
          <div class="text-h6 text-grey-7 q-mt-sm">Producto no encontrado o eliminado.</div>
          <q-btn outline color="primary" label="Ir al inicio" to="/" class="q-mt-md" />
        </div>

        <div v-else class="column q-gutter-lg">
          <div class="col-12" :class="{ 'row q-col-gutter-lg': $q.screen.gt.sm }">
            <div class="col-12" :class="{ 'col-md-6': $q.screen.gt.sm }">
              <q-card flat bordered class="bg-white">
                <q-carousel
                  v-model="slide"
                  transition-prev="slide-right"
                  transition-next="slide-left"
                  swipeable
                  animated
                  control-color="primary"
                  navigation
                  padding
                  arrows
                  height="400px"
                  class="rounded-borders"
                  :style="{ maxHeight: $q.screen.lt.md ? '350px' : '400px' }"
                >
                  <q-carousel-slide
                    v-for="(img, index) in product.imagenes"
                    :key="index"
                    :name="index"
                    class="column no-wrap flex-center"
                  >
                    <q-img :src="img" :ratio="1" fit="contain" class="full-height full-width" />
                  </q-carousel-slide>

                  <q-carousel-slide
                    :name="product.imagenes?.length || 0"
                    class="column no-wrap flex-center"
                    v-if="!product.imagenes || product.imagenes.length === 0"
                  >
                    <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                      <q-icon name="image_not_supported" size="lg" class="q-mb-sm" />
                      No hay imágenes disponibles
                    </div>
                  </q-carousel-slide>
                </q-carousel>
              </q-card>
            </div>

            <div class="col-12" :class="{ 'col-md-6': $q.screen.gt.sm }">
              <q-card flat class="bg-white q-pa-lg rounded-borders">
                <q-badge
                  :color="
                    product.Estado && product.Estado.toLowerCase() === 'nuevo' ? 'green' : 'orange'
                  "
                  class="q-mb-sm"
                >
                  {{ product.Estado || 'Usado' }}
                </q-badge>

                <div class="text-h4 text-weight-bold q-mb-none">
                  {{ product.Titulo || `${product.Marca} ${product.Modelo}` }}
                </div>
                <div class="text-caption text-grey-7 q-mb-md">
                  Publicado el: {{ formatDate(product.FechaCreacion) }}
                </div>

                <q-separator class="q-mb-md" />

                <div class="text-h3 text-primary text-weight-bolder q-mb-lg">
                  ${{ product.Precio || 'N/A' }}
                </div>

                <div class="row q-gutter-md q-mb-lg gt-sm">
                  <q-btn
                    icon="shopping_bag"
                    label="Comprar Ahora"
                    color="primary"
                    size="lg"
                    class="col-grow text-weight-bold"
                    unelevated
                    @click="simulatePurchase"
                  />
                  <q-btn
                    icon="shopping_cart"
                    label="Añadir al Carrito"
                    color="orange"
                    size="lg"
                    outline
                    class="col-grow text-weight-bold"
                    @click="addToCart"
                  />
                </div>

                <q-separator class="q-mb-md" />

                <div class="bg-grey-1 q-pa-md rounded-borders">
                  <div class="text-subtitle2 text-weight-medium q-mb-sm">
                    Información del Vendedor
                  </div>
                  <div class="row justify-between items-center">
                    <div class="row items-center q-mr-md">
                      <q-avatar
                        size="sm"
                        color="primary"
                        text-color="white"
                        icon="person"
                        class="q-mr-sm"
                      />
                      <div class="text-weight-medium text-body2">
                        {{ product.Vendedor || 'Vendedor Anónimo' }}
                      </div>
                    </div>
                    <div class="row items-center" v-if="product.Telefono">
                      <q-icon name="phone" color="green" class="q-mr-sm" />
                      <span class="text-body2 text-weight-bold">{{ product.Telefono }}</span>
                    </div>
                  </div>
                </div>
              </q-card>
            </div>
          </div>

          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-6">
              <q-card flat bordered class="bg-white q-pa-lg">
                <div class="text-h6 text-weight-bold text-primary q-mb-md">
                  Información General (Ficha Técnica)
                </div>

                <q-list separator>
                  <q-item>
                    <q-item-section avatar
                      ><q-icon name="toggle_on" color="grey-6"
                    /></q-item-section>
                    <q-item-section
                      ><q-item-label caption>Estado</q-item-label
                      ><q-item-label class="text-weight-medium">{{
                        product.Estado || 'N/A'
                      }}</q-item-label></q-item-section
                    >
                  </q-item>

                  <q-item>
                    <q-item-section avatar><q-icon name="label" color="grey-6" /></q-item-section>
                    <q-item-section
                      ><q-item-label caption>Marca / Modelo</q-item-label
                      ><q-item-label class="text-weight-medium"
                        >{{ product.Marca || 'N/A' }} / {{ product.Modelo || 'N/A' }}</q-item-label
                      ></q-item-section
                    >
                  </q-item>

                  <q-item>
                    <q-item-section avatar
                      ><q-icon name="aspect_ratio" color="grey-6"
                    /></q-item-section>
                    <q-item-section
                      ><q-item-label caption>Pantalla</q-item-label
                      ><q-item-label class="text-weight-medium">{{
                        product.Pantalla || 'N/A'
                      }}</q-item-label></q-item-section
                    >
                  </q-item>

                  <q-item>
                    <q-item-section avatar><q-icon name="android" color="grey-6" /></q-item-section>
                    <q-item-section
                      ><q-item-label caption>Sistema Operativo</q-item-label
                      ><q-item-label class="text-weight-medium">{{
                        product.Sistema || 'N/A'
                      }}</q-item-label></q-item-section
                    >
                  </q-item>

                  <q-item>
                    <q-item-section avatar><q-icon name="sd_card" color="grey-6" /></q-item-section>
                    <q-item-section
                      ><q-item-label caption>ROM (Almacenamiento)</q-item-label
                      ><q-item-label class="text-weight-medium">{{
                        product.Rom || 'N/A'
                      }}</q-item-label></q-item-section
                    >
                  </q-item>

                  <q-item>
                    <q-item-section avatar><q-icon name="memory" color="grey-6" /></q-item-section>
                    <q-item-section
                      ><q-item-label caption>RAM (Memoria)</q-item-label
                      ><q-item-label class="text-weight-medium">{{
                        product.Ram || 'N/A'
                      }}</q-item-label></q-item-section
                    >
                  </q-item>
                </q-list>
              </q-card>
            </div>

            <div class="col-12 col-md-6">
              <q-card flat bordered class="bg-white q-pa-lg">
                <div class="text-h6 text-weight-bold text-primary q-mb-md">
                  Descripción Detallada
                </div>
                <p class="text-body1 text-grey-8" style="white-space: pre-line">
                  {{
                    product.Descripcion ||
                    'El vendedor no ha proporcionado una descripción detallada para este producto. Por favor, consulte la ficha técnica.'
                  }}
                </p>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$q.screen.lt.md" class="fixed-bottom bg-white shadow-up q-pa-sm z-top">
      <div class="row q-gutter-sm">
        <q-btn
          icon="home"
          label="Inicio"
          color="primary"
          size="md"
          class="col text-weight-bold"
          outline
          to="/"
        />

        <q-btn
          icon="shopping_bag"
          label="Comprar"
          color="primary"
          size="md"
          class="col text-weight-bold"
          unelevated
          @click="simulatePurchase"
        />

        <q-btn
          icon="shopping_cart"
          label="Añadir"
          color="orange"
          size="md"
          outline
          class="col text-weight-bold"
          @click="addToCart"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
// Importaciones de Firebase (asumiendo que están configuradas)
import { doc, getDoc } from 'firebase/firestore'
import { db } from 'src/boot/confi_firebase'
import { date, useQuasar } from 'quasar'
// NUEVO: Importación de la tienda Pinia
import { useCartStore } from 'src/stores/cartStore'

const route = useRoute()
const loading = ref(true)
const product = ref(null)
const $q = useQuasar()
const slide = ref(0)

// 1. Inicializar la tienda Pinia
const cartStore = useCartStore()

// --- Funciones de Interacción ---

const simulatePurchase = () => {
  $q.notify({
    message: '¡Simulación de Compra Exitosa!',
    caption: `Has iniciado la compra de ${product.value.Titulo}.`,
    color: 'positive',
    icon: 'check_circle',
  })
}

// 2. MODIFICADA: Llama a la acción de Pinia y usa el getter de Pinia para la notificación
const addToCart = () => {
  if (product.value) {
    // Llama a la acción de la tienda y pasa el producto actual
    cartStore.addItem(product.value)

    // Muestra la notificación usando el getter actualizado (cartStore.cartCount)
    $q.notify({
      message: '¡Producto Añadido!',
      caption: `${product.value.Titulo} se ha añadido a tu carrito. Ahora tienes ${cartStore.cartCount} productos.`,
      color: 'orange-9',
      icon: 'shopping_cart',
    })
  }
}

// --- Lógica de Datos ---

const fetchProduct = async () => {
  loading.value = true
  try {
    const docRef = doc(db, 'telefonos', route.params.id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      product.value = { id: docSnap.id, ...docSnap.data() }
      // Añadimos un título si falta para la función addItem
      if (!product.value.Titulo) {
        product.value.Titulo = `${product.value.Marca} ${product.value.Modelo}`
      }
      if (product.value.imagenes?.length > 0) {
        slide.value = 0
      }
    } else {
      console.log('No such document!')
    }
  } catch (error) {
    console.error('Error getting document:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.formatDate(d, 'DD/MM/YYYY')
}

onMounted(() => {
  fetchProduct()
})
</script>
<style scoped>
/* No se necesitan estilos complejos ya que Quasar maneja el layout responsivo. */
</style>
