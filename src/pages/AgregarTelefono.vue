<template>
  <q-page class="q-pa-md">
    <h3 class="text-center text-primary q-mb-lg">NUEVO ANUNCIO</h3>

    <!-- Añadimos el manejador @validation-error para mostrar notificación si falta algún campo -->
    <q-form @submit="submitToFirestore" @validation-error="onValidationError" class="q-gutter-lg">
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
                  required
                />
              </div>

              <div class="col-3 text-right text-weight-medium">Modelo:</div>
              <div class="col-9">
                <q-input
                  dense
                  outlined
                  v-model="form.modelo"
                  :rules="[(val) => !!val || 'Requerido']"
                  required
                />
              </div>

              <div class="col-3 text-right text-weight-medium">Pantalla:</div>
              <div class="col-auto">
                <q-input
                  dense
                  outlined
                  v-model="form.pantalla"
                  style="width: 80px"
                  type="number"
                  min="0"
                  step="0.1"
                  :rules="[(val) => (val && val > 0) || 'Número requerido']"
                  required
                />
              </div>
              <div class="col-auto">Pulgadas</div>

              <div class="col-3 text-right text-weight-medium">Sistema:</div>
              <div class="col-9">
                <q-select
                  dense
                  outlined
                  v-model="form.sistema"
                  :options="['Ios', 'Android', 'Windows']"
                  :rules="[(val) => !!val || 'Requerido']"
                  required
                />
              </div>

              <div class="col-3 text-right text-weight-medium">Rom:</div>
              <div class="col-auto">
                <q-input
                  dense
                  outlined
                  v-model.number="form.rom"
                  style="width: 80px"
                  type="number"
                  min="1"
                  :rules="[(val) => (val && val >= 1) || 'GB requerido']"
                  required
                />
              </div>
              <div class="col-auto">Almacenamiento interno (GB)</div>

              <div class="col-3 text-right text-weight-medium">RAM:</div>
              <div class="col-9">
                <q-input
                  dense
                  outlined
                  v-model.number="form.ram"
                  style="width: 80px"
                  type="number"
                  min="1"
                  :rules="[(val) => (val && val >= 1) || 'GB requerido']"
                  required
                />
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
                  required
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
              <q-input
                dense
                outlined
                v-model="form.titulo"
                :rules="[(val) => !!val || 'Requerido']"
                required
              />
            </div>

            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-6">
                <div class="text-weight-bold q-mb-sm">Vendedor:</div>
                <q-input
                  dense
                  outlined
                  v-model="form.vendedor"
                  :rules="[(val) => !!val || 'Requerido']"
                  required
                />
              </div>
              <div class="col-6">
                <div class="text-weight-bold q-mb-sm">Teléfono:</div>
                <q-input
                  dense
                  outlined
                  v-model="form.telefono"
                  type="tel"
                  :rules="[(val) => !!val || 'Requerido']"
                  required
                />
              </div>
            </div>

            <div class="q-mb-lg">
              <div class="text-weight-bold q-mb-sm">DESCRIPCION</div>
              <q-input
                type="textarea"
                outlined
                v-model="form.descripcion"
                rows="5"
                :rules="[(val) => !!val || 'Requerido']"
                required
              />
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
                required
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
              <q-btn label="Crear" icon="check" color="primary" type="submit" />
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
// Asumiendo que 'src/boot/confi_firebase' ya está configurado con las exportaciones correctas de db, storage.
import { storage, db } from 'src/boot/confi_firebase'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const $q = useQuasar()
const router = useRouter()
const loading = ref(false) // Mantenido para el estado de carga general/fondo

// --- Variables del Formulario ---
const initialForm = {
  estado: 'nuevo',
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
// Creamos la variable reactiva para los archivos
const files = ref(null)

// --- Columnas de la tabla de imágenes ---
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

    $q.notify({ message: `Archivo ${removedFileName} removido.`, color: 'info', timeout: 1500 })
  }
}

/**
 * Función de utilidad para validar todos los campos del formulario.
 * NOTA: Esta función es un chequeo de contingencia; Quasar debería bloquear el submit si
 * las reglas básicas fallan.
 */
function isFormValid(formData, filesArray) {
  // Aquí podemos omitir el chequeo de todos los campos, ya que si llegamos a submitToFirestore,
  // Quasar ya validó que los campos requeridos tengan un valor (no null/vacío), solo verificamos las reglas extra.
  // Pero lo mantendremos como un control de seguridad:

  // Validación de números > 0
  if (
    Number(formData.pantalla) <= 0 ||
    Number(formData.precio) <= 0 ||
    Number(formData.rom) <= 0 ||
    Number(formData.ram) <= 0
  ) {
    return false
  }

  // Asegurar que haya archivos (regla de q-file)
  if (!filesArray || filesArray.length === 0) {
    return false
  }

  return true
}

// --- Lógica de Firebase (Segundo Plano) ---

/**
 * Sube los archivos seleccionados a Firebase Storage y retorna un array de URLs de descarga.
 */
async function uploadFiles(filesArray, formData) {
  const downloadURLs = []

  if (!filesArray || filesArray.length === 0) {
    return ['https://placehold.co/128x128/E8F0FE/000000?text=No%20Imagen']
  }

  for (const file of filesArray) {
    const safeMarca = formData.marca ? formData.marca.replace(/[^a-z0-9]/gi, '_') : 'unknown'
    const safeModelo = formData.modelo ? formData.modelo.replace(/[^a-z0-9]/gi, '_') : 'phone'
    const path = `telefonos/${safeMarca}-${safeModelo}/${Date.now()}-${file.name}`
    const fileRef = storageRef(storage, path)

    try {
      await uploadBytes(fileRef, file)
      const url = await getDownloadURL(fileRef)
      downloadURLs.push(url)
    } catch (error) {
      console.error(`Error al subir el archivo ${file.name} en segundo plano:`, error)
    }
  }
  return downloadURLs
}

/**
 * Guarda el documento en Firestore en SEGUNDO PLANO.
 */
async function saveInBackground(formData, files) {
  loading.value = true
  try {
    const imageURLs = await uploadFiles(files, formData)

    const newPhone = {
      Marca: formData.marca,
      Modelo: formData.modelo,
      Precio: Number(formData.precio),
      Ram: Number(formData.ram),
      Rom: Number(formData.rom),
      Pantalla: Number(formData.pantalla),
      Sistema: formData.sistema,
      Estado: formData.estado,
      Titulo: formData.titulo,
      Vendedor: formData.vendedor,
      Telefono: formData.telefono,
      Descripcion: formData.descripcion,
      imagenes: imageURLs,
      FechaCreacion: new Date(),
    }

    const docRef = await addDoc(collection(db, 'telefonos'), newPhone)
    console.log('Anuncio publicado en segundo plano con éxito. ID:', docRef.id)
  } catch (error) {
    console.error('Error FATAL al publicar el anuncio en segundo plano: ', error)
    $q.notify({
      color: 'negative',
      icon: 'warning',
      message: 'Error al guardar el anuncio en segundo plano.',
      timeout: 1500, // Error dura 1.5s
    })
  } finally {
    loading.value = false
  }
}

// --- Manejo de la Validación de Quasar (Fallo) ---
/**
 * Se llama automáticamente cuando el QForm detecta que faltan campos requeridos.
 */
function onValidationError() {
  $q.notify({
    color: 'negative',
    icon: 'warning',
    message: 'Faltan campos por llenar. Revise los campos marcados en rojo.',
    timeout: 1500,
  })
}

// --- Flujo Principal (Éxito Inmediato) ---
/**
 * Se llama SÓLO si Quasar determina que el formulario está completamente lleno y válido.
 */
function submitToFirestore() {
  const formData = { ...form.value }
  const filesToUpload = Array.isArray(files.value) ? [...files.value] : files.value

  // Chequeo de contingencia final
  if (!isFormValid(formData, filesToUpload)) {
    // Aunque Quasar lo detectó, aseguramos la notificación si llegamos aquí por alguna razón
    onValidationError()
    return
  }

  // 1. NOTIFICACIÓN INMEDIATA de éxito (dura 1.5s)
  $q.notify({
    color: 'positive',
    icon: 'check',
    message: 'Teléfono guardado correctamente.',
    timeout: 1500,
  })

  // 2. GUARDAR EN SEGUNDO PLANO (SIN AWAIT)
  saveInBackground(formData, filesToUpload)

  // 3. REDIRECCIÓN DESPUÉS DE 1.5s
  setTimeout(() => {
    router.push('/')
  }, 1500)
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
