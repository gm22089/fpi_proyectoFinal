<template>
  <div class="container-fluid mt-4">
    <div>
      <!-- Nombre de la empresa -->
      <h2 class="mb-4 text-center text-uppercase fw-bold">Tienda Cellphone</h2>

      <!-- Barra de búsqueda -->
      <!-- Click para pagina de Inicio -->
      <!-- Click para pagina de Estadisticas-->
      <!-- Click para pagina de anadir mas productos -->
      <!-- Click para mostrar lo que tengo en el carrito -->
    </div>

    <div class="row">
      <div
        class="col-6 col-sm-4 col-xl-3 mb-3 sinPadding"
        v-for="telefono in telefonos"
        :key="telefono.id"
      >
        <div class="card itemTienda" style="width: 11rem; height: 19rem">
          <a class="sinDecoracion" href="#">
            <img
              :src="telefono.imagenes?.[0] || defaultImage"
              class="card-img-top"
              alt="imagen del teléfono"
              width="128"
              height="128"
            />
            <div class="card-body">
              <span class="ms-4 lead fw-bold fst-italic text-decoration-underline fs-4">
                ${{ telefono.Precio }}
              </span>
              <p class="card-text mt-2">
                {{ telefono.Marca }} {{ telefono.Modelo }}<br />
                {{ telefono.Ram }} / {{ telefono.Rom }}<br />
                {{ telefono.Pantalla }}
              </p>
            </div>
          </a>
        </div>
      </div>

      <!-- ======================== -->
      <!-- LISTADO DE PRODUCTOS -->
      <!-- ======================== -->
      <main class="col-12 col-lg-9">
        <!-- FILTRO PRECIO -->
        <div class="d-flex align-items-end flex-wrap gap-2 mb-3">
          <p class="fw-semibold mt-3">Precio</p>
          <div class="input-group input-group-sm mb-2" style="width: 150px">
            <span class="input-group-text">$</span>
            <input
              v-model.number="precioMin"
              type="number"
              class="form-control"
              placeholder="Mínimo"
            />
          </div>
          <div class="input-group input-group-sm mb-2" style="width: 150px">
            <span class="input-group-text">$</span>
            <input
              v-model.number="precioMax"
              type="number"
              class="form-control"
              placeholder="Máximo"
            />
          </div>
          Ordenar por:
          <div>
            <button @click="aplicarFiltros">Precio</button>
            <button @click="limpiarFiltrosP">Fecha</button>
          </div>
        </div>

        <!-- LISTADO -->
        <br />
        <div class="row">
          <div
            v-for="telefono in telefonosPaginados"
            :key="telefono.id"
            class="col-6 col-sm-4 col-xl-3 mb-3 sinPadding"
          >
            <div class="card itemTienda" style="width: 11rem; height: 19rem">
              <a class="sinDecoracion" href="#">
                <img
                  :src="telefono.imagenes?.[0] || defaultImage"
                  class="card-img-top"
                  alt="imagen del teléfono"
                  width="128"
                  height="128"
                />
                <div class="card-body">
                  <span class="ms-4 lead fw-bold fst-italic text-decoration-underline fs-4">
                    ${{ telefono.Precio }}
                  </span>
                  <p class="card-text mt-2">
                    {{ telefono.Marca }} {{ telefono.Modelo }}<br />
                    {{ telefono.Ram }} / {{ telefono.Rom }}<br />
                    {{ telefono.Pantalla }}
                  </p>
                </div>
              </a>
            </div>
          </div>

          <div v-if="telefonosFiltrados && telefonosFiltrados.length > 0">
            <p class="text-muted">No se encontraron resultados!!!</p>
          </div>
        </div>

        <!-- PAGINACIÓN -->
        <div
          v-if="telefonosFiltrados && telefonosFiltrados.length > 0"
          class="d-flex flex-column align-items-center mt-4"
        >
          <!-- Selector de cantidad por página -->
          <div class="d-flex align-items-center gap-2 mb-3">
            <label for="itemsPerPage" class="form-label mb-0">Artículos por página:</label>
            <select
              id="itemsPerPage"
              v-model.number="itemsPorPagina"
              class="form-select form-select-sm"
              style="width: 100px"
            >
              <option v-for="n in [8, 12, 16, 20, 25]" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>

          <!-- Controles de paginación -->
          <div class="d-flex align-items-center justify-content-center flex-wrap gap-2">
            <!-- Botón Anterior -->
            <button
              class="btn btn-outline-primary btn-sm"
              :disabled="paginaActual === 1"
              @click="paginaActual--"
            >
              ← Anterior
            </button>

            <!-- Números de página -->
            <div class="btn-group">
              <button
                v-for="n in totalPaginas"
                :key="n"
                class="btn btn-sm"
                :class="n === paginaActual ? 'btn-primary' : 'btn-outline-primary'"
                @click="paginaActual = n"
              >
                {{ n }}
              </button>
            </div>

            <!-- Botón Siguiente -->
            <button
              class="btn btn-outline-primary btn-sm"
              :disabled="paginaActual === totalPaginas"
              @click="paginaActual++"
            >
              Siguiente →
            </button>
          </div>

          <!-- Info extra -->
          <small class="text-muted mt-2"> Página {{ paginaActual }} de {{ totalPaginas }} </small>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useCollection } from 'vuefire'
import { collection } from 'firebase/firestore'
import { db } from 'src/boot/confi_firebase'

const telefonos = useCollection(collection(db, 'telefonos'))
const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
</script>

<style scoped>
.sinPadding {
  padding: 0;
}
.itemTienda {
  transition: transform 0.2s;
}
.itemTienda:hover {
  transform: scale(1.05);
}
.sinDecoracion {
  text-decoration: none;
  color: inherit;
}
.btn-group .btn {
  margin: 0 2px;
  transition: all 0.2s ease;
}
.btn-group .btn:hover {
  transform: scale(1.05);
}
</style>
