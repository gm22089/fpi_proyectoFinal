<template>
  <q-page class="q-pa-md">
    <h3 class="text-center text-primary q-mb-lg">NUEVO ANUNCIO</h3>

    <q-form @submit="submitToFirestore" class="q-gutter-lg">
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
                <q-input
                  dense
                  outlined
                  v-model="form.marca"
                  :rules="[(val) => !!val || 'Requerido']"
                />
              </div>

              <div class="col-3 text-right text-weight-medium">Modelo:</div>
              <div class="col-9">
                <q-input
                  dense
                  outlined
                  v-model="form.modelo"
                  :rules="[(val) => !!val || 'Requerido']"
                />
              </div>

              <div class="col-3 text-right text-weight-medium">Pantalla:</div>
              <div class="col-auto">
                <q-input dense outlined v-model="form.pantalla" style="width: 80px" />
              </div>
              <div class="col-auto">Pulgadas</div>

              <div class="col-3 text-right text-weight-medium">Sistema:</div>
              <div class="col-9">
                <q-select
                  dense
                  outlined
                  v-model="form.sistema"
                  :options="['Ios', 'Android', 'Windows']"
                />
              </div>

              <div class="col-3 text-right text-weight-medium">Rom:</div>
              <div class="col-auto">
                <q-input dense outlined v-model="form.rom" style="width: 80px" />
              </div>
              <div class="col-auto">Almacenamiento interno</div>

              <div class="col-3 text-right text-weight-medium">RAM:</div>
              <div class="col-9">
                <q-input dense outlined v-model="form.ram" style="width: 80px" />
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
            <q-input dense outlined v-model="form.titulo" />
          </div>

          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6">
              <div class="text-weight-bold q-mb-sm">Vendedor:</div>
              <q-input dense outlined v-model="form.vendedor" />
            </div>
            <div class="col-6">
              <div class="text-weight-bold q-mb-sm">Teléfono:</div>
              <q-input dense outlined v-model="form.telefono" />
            </div>
          </div>

          <div class="q-mb-lg">
            <div class="text-weight-bold q-mb-sm">DESCRIPCION</div>
            <q-input type="textarea" outlined v-model="form.descripcion" rows="5" />
          </div>

          <div class="q-mb-lg text-center">
            <div class="text-weight-bold q-mb-sm">PRECIO</div>
            <q-input
              dense
              outlined
              v-model.number="form.precio"
              type="number"
              :rules="[(val) => val > 0 || 'Mayor a $0']"
              prefix="$"
              style="width: 150px; margin: 0 auto"
            />
          </div>

          <div class="flex justify-center q-gutter-xl q-mt-xl">
            <q-btn
              label="Cancelar"
              icon="close"
              color="negative"
              outline
              @click="router.push('/')"
            />
            <q-btn label="Crear" icon="check" color="primary" type="submit" :loading="loading" />
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
import { collection, addDoc } from 'firebase/firestore' // Importaciones de Firebase
import { db } from 'src/boot/confi_firebase' // Asegura que esta ruta sea correcta

const $q = useQuasar()
const router = useRouter()
const loading = ref(false) // Estado para deshabilitar el botón

// --- Variables para el Formulario ---

// Estado inicial del formulario (Asegúrate de que las claves coincidan con tu HTML)
const initialForm = {
  estado: 'Nuevo',
  marca: null,
  modelo: null,
  pantalla: null,
  sistema: 'Ios',
  rom: null,
  ram: null,
  titulo: null,
  vendedor: null,
  telefono: null,
  descripcion: null,
  precio: null, // Debe ser null para usar v-model.number
}

const form = ref({ ...initialForm })
const files = ref(null)

// --- Funciones para manejo de Imágenes (Simulación) ---

const imageColumns = [
  { name: 'n', required: true, label: 'N', align: 'left', field: 'n', sortable: true },
  { name: 'tamano', label: 'Tamaño', align: 'left', field: 'tamano', sortable: true },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
]
const imageRows = [
  { n: 1, tamano: '145 kb', tipo: 'jpg' },
  { n: 2, tamano: '145 kb', tipo: 'png' },
] // Dejamos solo dos filas de ejemplo

function removeFile(index) {
  // Lógica para remover un archivo
  console.log(`Remover archivo en índice: ${index}`)
  $q.notify({ message: `Archivo en índice ${index} removido (Simulación).`, color: 'info' })
}

// Función para reiniciar el formulario a su estado inicial
function resetForm() {
  form.value = { ...initialForm }
}

// --- LÓGICA CLAVE DE FIREBASE ---

async function submitToFirestore() {
  loading.value = true
  try {
    // Mapear los nombres de campo de tu formulario a los nombres de campo de Firestore
    const newPhone = {
      Marca: form.value.marca,
      Modelo: form.value.modelo,
      Precio: Number(form.value.precio), // Aseguramos que sea un número
      Ram: form.value.ram,
      Rom: form.value.rom,
      Pantalla: `${form.value.pantalla} pulgadas`, // Formateamos si es necesario
      Sistema: form.value.sistema,
      Estado: form.value.estado,
      Titulo: form.value.titulo,
      Vendedor: form.value.vendedor,
      Telefono: form.value.telefono,
      Descripcion: form.value.descripcion,
      // Por ahora, usamos un placeholder para la imagen
      imagenes: ['https://via.placeholder.com/128'],
      FechaCreacion: new Date(),
    }

    // 2. Subir el documento a Firestore
    const docRef = await addDoc(collection(db, 'telefonos'), newPhone)

    // 3. Notificación de éxito
    $q.notify({
      color: 'positive',
      icon: 'done',
      message: `Anuncio publicado con éxito! ID: ${docRef.id}. Redirigiendo...`,
    })

    // 4. Limpiar el formulario y redirigir
    resetForm()
    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (error) {
    console.error('Error al añadir el documento: ', error)
    $q.notify({
      color: 'negative',
      icon: 'warning',
      message: 'Error al publicar. Revisa la consola y la conexión a Firebase.',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.q-form {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
