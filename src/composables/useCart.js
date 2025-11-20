import { ref } from 'vue'

/**
 * Hook para manejar la lógica del carrito de compras.
 * @returns {Object} Un objeto con el contador del carrito y funciones.
 */
export function useCart() {
  const cartCount = ref(0)

  /**
   * Incrementa el contador del carrito.
   * La versión actual no requiere el objeto producto.
   */
  const incrementCart = () => {
    cartCount.value++
    // Aquí podrías añadir lógica más compleja como guardar el producto en un array.
    // Si añades esa lógica, deberías reintroducir el parámetro `product`.
  }

  /**
   * Decrementa el contador del carrito (si es mayor que cero).
   */
  const decrementCart = () => {
    if (cartCount.value > 0) {
      cartCount.value--
    }
  }

  return {
    cartCount,
    incrementCart,
    decrementCart,
  }
}
