import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// Definimos la tienda de Pinia. 'cart' es el ID único.
export const useCartStore = defineStore('cart', () => {
  // Estado: Array para guardar los productos
  const items = ref([])

  // Getters: Calculamos el conteo total de productos
  const cartCount = computed(() => items.value.length)

  // Acciones: Función para agregar un producto al carrito
  // En una app real, recibiría el objeto del producto (product).
  const addItem = (product = { id: Date.now(), title: 'Producto Genérico' }) => {
    // Aquí podrías añadir lógica compleja como verificar stock o duplicados
    items.value.push(product)
    console.log(`🛒 Producto "${product.title}" añadido. Total: ${cartCount.value}`)
  }

  // Retornamos el estado y las acciones para que sean accesibles
  return {
    items,
    cartCount,
    addItem,
  }
})
