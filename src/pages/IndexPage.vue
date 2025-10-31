<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-center text-uppercase fw-bold">📱 Tienda Cellphone</h2>

    <div class="row">
      <div
        class="col-6 col-sm-4 col-xl-3 mb-3 sinPadding"
        v-for="telefono in telefonos"
        :key="telefono.id"
      >
        <div class="card itemTienda" style="width: 11rem; height: 19rem;">
          <a class="sinDecoracion" href="#">
            <img
              :src="telefono.imagenes?.[0] || defaultImage"
              class="card-img-top"
              alt="imagen del teléfono"
              width="128"
              height="128"
            />
            <div class="card-body">
              <span
                class="ms-4 lead fw-bold fst-italic text-decoration-underline fs-4"
              >
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
    </div>
  </div>
</template>

<script setup>
import { useCollection } from 'vuefire'
import { collection } from 'firebase/firestore'
import { db } from 'src/boot/confi_firebase'

const telefonos = useCollection(collection(db, 'telefonos'))
const defaultImage =
  'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
</script>

<style scoped src="src/assets/estilo.css"></style>
