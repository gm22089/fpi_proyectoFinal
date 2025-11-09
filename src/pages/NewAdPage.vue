<template>
  <q-page class="q-pa-md">
    <h3 class="text-center text-primary q-mb-lg">NUEVO ANUNCIO</h3>

    <q-form @submit="createAd" class="q-gutter-lg">
      <div class="row q-col-gutter-xl">
        <div class="col-xs-12 col-md-6">
          <q-card flat bordered class="q-pa-md">
            <div class="q-mb-md">
              <span class="text-weight-bold q-mr-md">Estado:</span>
              <q-radio v-model="form.estado" val="Nuevo" label="Nuevo" class="q-mr-lg" />
              <q-radio v-model="form.estado" val="Usado" label="Usado" />
            </div>

            <div class="row q-col-gutter-md q-mb-md items-center">
              <div class="col-3 text-right text-weight-medium">Marca:</div>
              <div class="col-9">
                <q-input dense outlined v-model="form.marca" default="Iphone" />
              </div>

              <div class="col-3 text-right text-weight-medium">Modelo:</div>
              <div class="col-9">
                <q-input dense outlined v-model="form.modelo" default="6 plus" />
              </div>

              <div class="col-3 text-right text-weight-medium">Pantalla:</div>
              <div class="col-auto">
                <q-input dense outlined v-model="form.pantalla" default="5.5" style="width: 80px" />
              </div>
              <div class="col-auto">Pulgadas</div>

              <div class="col-3 text-right text-weight-medium">Sistema:</div>
              <div class="col-9">
                <q-select
                  dense
                  outlined
                  v-model="form.sistema"
                  :options="['Ios', 'Android', 'Windows']"
                  default="Ios"
                />
              </div>

              <div class="col-3 text-right text-weight-medium">Rom:</div>
              <div class="col-auto">
                <q-input dense outlined v-model="form.rom" default="64 GB" style="width: 80px" />
              </div>
              <div class="col-auto">Almacenamiento interno</div>

              <div class="col-3 text-right text-weight-medium">RAM:</div>
              <div class="col-9">
                <q-input dense outlined v-model="form.ram" default="2 GB" style="width: 80px" />
              </div>
            </div>
          </q-card>

          <q-card flat bordered class="q-pa-md q-mt-lg">
            <div class="text-weight-bold q-mb-sm">Imágenes</div>
            <div class="row q-col-gutter-md">
              <div class="col-4 flex flex-center">
                <q-file label="Agregar Foto" borderless v-model="files" multiple>
                  <template v-slot:file="{ file, index }">
                    <q-chip dense removable @remove="removeFile(index)">
                      {{ file.name }}
                    </q-chip>
                  </template>
                  <template v-slot:after>
                    <q-btn round dense flat icon="add_circle" color="primary" />
                  </template>
                </q-file>
              </div>

              <div class="col-8">
                <q-table :rows="imageRows" :columns="imageColumns" row-key="n" dense hide-bottom />
              </div>
            </div>
          </q-card>
        </div>

        <div class="col-xs-12 col-md-6">
          <div class="q-mb-md">
            <div class="text-weight-bold q-mb-sm">Título breve del anuncio</div>
            <q-input
              dense
              outlined
              v-model="form.titulo"
              default="Iphone 6 pantalla de 8 pulgadas, 64Gb internos,"
            />
          </div>

          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6">
              <div class="text-weight-bold q-mb-sm">Vendedor:</div>
              <q-input dense outlined v-model="form.vendedor" default="Juan Perez" />
            </div>
            <div class="col-6">
              <div class="text-weight-bold q-mb-sm">Teléfono:</div>
              <q-input dense outlined v-model="form.telefono" default="21213-1212" />
            </div>
          </div>

          <div class="q-mb-lg">
            <div class="text-weight-bold q-mb-sm">DESCRIPCION</div>
            <q-input
              type="textarea"
              outlined
              v-model="form.descripcion"
              rows="5"
              default="Telefono en muy buenas condiciones..."
            />
          </div>

          <div class="q-mb-lg text-center">
            <div class="text-weight-bold q-mb-sm">PRECIO</div>
            <q-input
              dense
              outlined
              v-model="form.precio"
              prefix="$"
              style="width: 150px; margin: 0 auto"
              default="235.00"
            />
          </div>

          <div class="flex justify-center q-gutter-xl q-mt-xl">
            <q-btn
              label="Cancelar"
              icon="close"
              color="negative"
              outline
              @click="$router.push('/')"
            />
            <q-btn label="Crear" icon="check" color="primary" type="submit" />
          </div>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

// Estado inicial del formulario (basado en los datos de ejemplo)
const form = ref({
  estado: 'Nuevo',
  marca: 'Iphone',
  modelo: '6 plus',
  pantalla: '5.5',
  sistema: 'Ios',
  rom: '64 GB',
  ram: '2 GB',
  titulo: 'Iphone 6 pantalla de 8 pulgadas, 64Gb internos,',
  vendedor: 'Juan Perez',
  telefono: '21213-1212',
  descripcion: 'Telefono en muy buenas condiciones...',
  precio: '235.00',
})

const files = ref(null) // Para el componente QFile

// Datos para simular la tabla de imágenes (Página 4)
const imageColumns = [
  { name: 'n', required: true, label: 'N', align: 'left', field: 'n', sortable: true },
  { name: 'tamano', label: 'Tamaño', align: 'left', field: 'tamano', sortable: true },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
]
const imageRows = [
  { n: 1, tamano: '145 kb', tipo: 'jpg' },
  { n: 2, tamano: '145 kb', tipo: 'png' },
  { n: 3, tamano: '145 kb', tipo: 'png' },
  { n: 4, tamano: '145 kb', tipo: 'jpg' },
]

// Función al enviar el formulario
function createAd() {
  // Aquí iría la lógica para enviar la data a un backend (API)
  console.log('Anuncio Creado:', form.value)

  // 1. Mostrar mensaje de guardado (QNotify)
  $q.notify({
    message: 'Anuncio guardado satisfactoriamente',
    color: 'positive',
    icon: 'check_circle',
    timeout: 3000, // Se muestra solo por unos segundos
  })

  // 2. Regresar al inicio
  setTimeout(() => {
    router.push('/')
  }, 3200) // Espera un poco más que el timeout de la notificación
}

function removeFile(index) {
  // Lógica para remover un archivo
  console.log(`Remover archivo en índice: ${index}`)
}
</script>
