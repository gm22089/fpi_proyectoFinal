<template>
  <q-page class="q-pa-md">
    <h3 class="text-center text-primary q-mb-lg">NUEVO ANUNCIO</h3>

    <q-form @submit="submitToFirestore" class="q-gutter-lg">
      <div class="row q-col-gutter-xl">
        <div class="col-xs-12 col-md-6">
          <q-card flat bordered class="q-pa-md">
            <div class="q-mb-md">
              <span class="text-weight-bold q-mr-md">Estado:</span>
              <q-radio
                v-model="form.estado"
                val="nuevo"
                label="nuevo"
                class="q-mr-lg"
                color="primary"
              />
              <q-radio v-model="form.estado" val="Usado" label="Usado" color="primary" />
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
              <div class="col-auto">Almacenamiento interno (GB)</div>

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
                <q-file
                  label="Agregar Foto(s)"
                  borderless
                  v-model="files"
                  multiple
                  accept=".jpg, .jpeg, .png, image/*"
                  :rules="[(val) => (val && val.length > 0) || 'Se requiere al menos una imagen']"
                >
                  <!-- Slot para mostrar y remover archivos -->
                  <template v-slot:file="{ file, index }">
                    <q-chip dense removable @remove="removeFile(index)">
                      {{ file.name }}
                    </q-chip>
                  </template>

                  <!-- Icono de Añadir -->
                  <template v-slot:after>
                    <q-btn round dense flat icon="add_circle" color="primary" />
                  </template>

                  <!-- Placeholder si no hay archivos -->
                  <template v-slot:prepend>
                    <q-icon name="collections" color="grey-6" />
                  </template>
                </q-file>
              </div>

              <div class="col-8">
                <q-table
                  :rows="computedImageRows"
                  :columns="imageColumns"
                  row-key="n"
                  dense
                  hide-bottom
                  title="Archivos Seleccionados"
                  :rows-per-page-options="[0]"
                />
              </div>
            </div>
          </q-card>
        </div>

        <div class="col-xs-12 col-md-6">
          <q-card flat bordered class="q-pa-md">
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
                <q-input dense outlined v-model="form.telefono" type="tel" />
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
          </q-card>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { collection, addDoc } from 'firebase/firestore'
// Importaciones clave de Firebase
import { storage, db } from 'src/boot/confi_firebase'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const $q = useQuasar()
const router = useRouter()
const loading = ref(false)

// --- Variables del Formulario ---
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
  precio: null,
}

// Creamos la variable reactiva del formulario
const form = ref({ ...initialForm })
// Creamos la variable reactiva para los archivos (debe ser compatible con q-file multiple)
const files = ref(null)

// --- Funciones de Utilidad ---
const imageColumns = [
  { name: 'n', required: true, label: 'N', align: 'left', field: 'n', sortable: false },
  { name: 'nombre', label: 'Nombre', align: 'left', field: 'nombre', sortable: false },
  { name: 'tamano', label: 'Tamaño (KB)', align: 'left', field: 'tamano', sortable: false },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left', sortable: false },
]

// Propiedad computada para mostrar los archivos en la tabla
const computedImageRows = computed(() => {
  if (!files.value) return []
  return files.value.map((file, index) => ({
    n: index + 1,
    nombre: file.name,
    tamano: (file.size / 1024).toFixed(1),
    tipo: file.type.split('/').pop() || 'desconocido',
  }))
})

// Función para remover un archivo de la lista
function removeFile(index) {
  if (files.value && Array.isArray(files.value) && index >= 0 && index < files.value.length) {
    const removedFileName = files.value[index].name
    files.value.splice(index, 1)

    // Si la lista se vacía, establecer a null para el manejo de la regla de q-file
    if (files.value.length === 0) {
      files.value = null
    }

    $q.notify({ message: `Archivo ${removedFileName} removido.`, color: 'info' })
  }
}

// Función para restablecer el formulario a su estado inicial
function resetForm() {
  form.value = { ...initialForm }
  files.value = null // Limpiar los archivos seleccionados
  // Se puede forzar el focus al primer campo si es necesario, pero generalmente no se hace
}

// --- LÓGICA CLAVE DE FIREBASE STORAGE Y FIRESTORE ---

/**
 * Sube los archivos seleccionados a Firebase Storage y retorna un array de URLs de descarga.
 * @returns {Promise<string[]>} Array de URLs de las imágenes subidas.
 */
async function uploadFiles() {
  const downloadURLs = []

  if (!files.value || files.value.length === 0) {
    // Si no hay archivos, retorna una URL de placeholder.
    return ['https://placehold.co/128x128/E8F0FE/000000?text=No%20Imagen']
  }

  for (const file of files.value) {
    // Generar una ruta única y segura en Storage
    const safeMarca = form.value.marca ? form.value.marca.replace(/[^a-z0-9]/gi, '_') : 'unknown'
    const safeModelo = form.value.modelo ? form.value.modelo.replace(/[^a-z0-9]/gi, '_') : 'phone'
    const path = `telefonos/${safeMarca}-${safeModelo}/${Date.now()}-${file.name}`

    const fileRef = storageRef(storage, path)

    try {
      // 1. Subir el archivo
      await uploadBytes(fileRef, file)

      // 2. Obtener la URL pública
      const url = await getDownloadURL(fileRef)
      downloadURLs.push(url)
    } catch (error) {
      console.error(`Error al subir el archivo ${file.name}:`, error)
      // Continuamos con el siguiente archivo o con la lógica de Firestore, pero se notifica el error
    }
  }
  return downloadURLs
}

/**
 * Procesa el formulario, sube las imágenes y guarda el documento en Firestore.
 */
async function submitToFirestore() {
  // Verificación básica de campos requeridos antes de la subida
  if (!form.value.marca || !form.value.modelo || !form.value.precio) {
    $q.notify({
      color: 'negative',
      message: 'Marca, Modelo y Precio son campos obligatorios.',
    })
    return
  }

  // Verificación de archivos (aunque la regla de Quasar también lo hace)
  if (!files.value || files.value.length === 0) {
    $q.notify({
      color: 'negative',
      message: 'Debes subir al menos una imagen del teléfono.',
    })
    return
  }

  loading.value = true
  try {
    // 1. SUBIR ARCHIVOS y obtener las URLs
    const imageURLs = await uploadFiles()

    // 2. Crear el objeto de datos con las URLs
    const newPhone = {
      // Mapeo de campos
      Marca: form.value.marca,
      Modelo: form.value.modelo,
      Precio: Number(form.value.precio),
      Ram: form.value.ram,
      Rom: form.value.rom,
      Pantalla: form.value.pantalla,
      Sistema: form.value.sistema,
      Estado: form.value.estado,
      Titulo: form.value.titulo,
      Vendedor: form.value.vendedor,
      Telefono: form.value.telefono,
      Descripcion: form.value.descripcion,
      imagenes: imageURLs, // Array de URLs de Storage
      FechaCreacion: new Date(),
    }

    // 3. Subir el documento a Firestore en la colección 'telefonos'
    const docRef = await addDoc(collection(db, 'telefonos'), newPhone)

    // 4. Notificación de éxito
    $q.notify({
      color: 'positive',
      icon: 'done',
      message: `Anuncio publicado con éxito! ID: ${docRef.id}. Redirigiendo...`,
    })

    // 5. LIMPIEZA DEL FORMULARIO INMEDIATA
    resetForm()

    // 6. Redirección después de un breve tiempo
    setTimeout(() => {
      // Redirige a la página principal donde se listan los teléfonos
      router.push('/')
    }, 1500)
  } catch (error) {
    console.error('Error al publicar el anuncio: ', error)
    $q.notify({
      color: 'negative',
      icon: 'warning',
      message: `Error al intentar subir el anuncio. Por favor, revisa la consola. Detalle: ${error.message}`,
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
/* Estilo para los cards de información, manteniendo el look original */
.q-card {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
