<template>
    <div>
      <!-- Título -->
      <h1 class="main-title">Lista de coches</h1>

      <!-- Botón para mostrar y ocultar el form de añadir un nuevo coche -->
      <v-btn @click="toggleForm" class="toggle-button custom-toggle-button">
        {{ mostrarFormulario ? 'Ocultar Formulario' : 'Mostrar Formulario' }}
      </v-btn>

      <!-- Formulario para añadir un nuevo coche -->
      <v-expand-transition>
        <v-form v-show="mostrarFormulario" @submit.prevent="agregarNuevoCoche" class="form-container">
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="nuevoCoche.modelo" label="Modelo" :rules="[rules.required, rules.maxlength]"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="nuevoCoche.marca" label="Marca" :rules="[rules.required, rules.maxlength]"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="nuevoCoche.anyo" label="Año" type="number" :rules="[rules.required, rules.min, rules.max]"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="nuevoCoche.matricula" label="Matricula" :rules="[rules.required, rules.matricula]"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="nuevoCoche.capacidad" label="Capacidad" type="number" :rules="[rules.required, rules.capacity]"></v-text-field>
              </v-col>
              <v-col>
                <v-btn class="add-button" type="submit">Agregar</v-btn>
                <div v-if="tieneErrores" class="error-message">Corrige los errores.</div>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-expand-transition>

      <!-- Listado de coches -->
      <ul>
        <Coche
          v-for="i in items"
          :key="i.id"
          :id="i.id"
          :modelo="i.modelo"
          :marca="i.marca"
          :anyo="i.anyo"
          :matricula="i.matricula"
          :capacidad="i.capacidad"
        />
      </ul>

      <!-- Botones para la paginación -->
      <v-btn @click="paginaAnterior" class="pagination-button" :disabled="currentPage === 1">
        Página Anterior
      </v-btn>
      <v-btn @click="paginaSiguiente" class="pagination-button" :disabled="currentPage === totalPages">
        Página Siguiente
      </v-btn>
    </div>
</template>

<script>
  import Coche from './Coche.vue'
  import { ref, computed, reactive } from 'vue';
  import { useCocheStore } from '../../stores/cocheStore';
  
  export default {
    name: 'Lista',
    components: { Coche },
    setup() {
      const listaStore = useCocheStore()
      const mostrarFormulario = ref(false);

      // Nuevo coche vacío para crearlo.
      const nuevoCoche = reactive({
        modelo: '',
        marca: '',
        anyo: null,
        matricula: '',
        capacidad: null,
      });

      // Reglas de validación del formulario.
      const rules = {
        required: value => !!value || 'Campo requerido',
        min: value => value >= 1900 || 'El año debe ser mayor o igual a 1900',
        max: value => value <= 2023 || 'El año debe ser menor o igual a 2023',
        capacity: value => (value >= 1 && value <= 9) || 'La capacidad debe estar entre 1 y 9',
        matricula: value => {
          const regex = /^[0-9]{4}[A-Za-z]{3}$/;
          return regex.test(value) || 'Formato de matrícula inválido. Debe ser: 1234ABC';
        },
        maxlength: value => (value && value.length <= 30) || 'Longitud máxima de 30 caracteres',
      };

      // Errores de validación.
      const errores = ref({
        modelo: '',
        marca: '',
        anyo: '',
        matricula: '',
        capacidad: '',
      });

      const tieneErrores = computed(() => {
        return Object.values(errores.value).some(error => error !== '');
      });

      // Función para validar cada campo del formulario para ver si tiene errores.
      const validarCampo = (campo, valor, reglas) => {
        errores.value[campo] = '';

        // Verificar si reglas es un array antes de iterar.
        if (!Array.isArray(reglas)) {
          reglas = [reglas];
        }

        for (const regla of reglas) {
          const resultado = regla(valor);
          if (resultado !== true) {
            errores.value[campo] = resultado;
            break;
          }
        }
      };

      // Cambiar el estado del formulario (aparece y desaparece).
      const toggleForm = () => {
        mostrarFormulario.value = !mostrarFormulario.value;
      };

      // Función para crear un nuevo coche en la base de datos.
      const agregarNuevoCoche = async () => {
        // Validar campos antes de agregar.
        validarCampo('modelo', nuevoCoche.modelo, [rules.required, rules.maxlength]);
        validarCampo('marca', nuevoCoche.marca, [rules.required, rules.maxlength]);
        validarCampo('anyo', nuevoCoche.anyo, [rules.required, rules.min, rules.max]);
        validarCampo('matricula', nuevoCoche.matricula, [rules.required, rules.matricula]);
        validarCampo('capacidad', nuevoCoche.capacidad, [rules.required, rules.capacity]);

        // Verificar si hay errores.
        if (tieneErrores.value) {
          return;
        }

        // Convertir año y capacidad a números.
        nuevoCoche.anyo = parseInt(nuevoCoche.anyo); 
        nuevoCoche.capacidad = parseInt(nuevoCoche.capacidad);

        await listaStore.crearCoche(nuevoCoche);
        Object.keys(nuevoCoche).forEach((key) => (nuevoCoche[key] = null));
        await listaStore.obtenerCoches(); // Se actualiza solo la lista.
        toggleForm();
      };

      // Función para cambiar a la página anterior.
      const paginaAnterior = async () => {
        if (listaStore.currentPage > 1) {
          await listaStore.cambiarPagina(listaStore.currentPage - 1);
        }
      };

      // Función para cambiar a la página siguiente.
      const paginaSiguiente = async () => {
        if (listaStore.currentPage < listaStore.totalPages) {
          await listaStore.cambiarPagina(listaStore.currentPage + 1);
        }
      };

      return { listaStore, nuevoCoche, agregarNuevoCoche,
        mostrarFormulario, toggleForm,
        paginaAnterior, paginaSiguiente,
        rules, errores, tieneErrores, validarCampo
      }
    },
    async created() {
      this.listaStore.obtenerCoches()
    },
    computed: {
      items() {
        return this.listaStore.lista;
      },
      currentPage() {
        return this.listaStore.currentPage;
      },
      totalPages() {
        return this.listaStore.totalPages;
      },
    },
  }
</script>
  
<style scoped>
  /* Estilos para el título principal */
  .main-title {
    text-align: center;
    margin-bottom: 20px;
    margin-top: 30px;
    font-family: 'Arial', sans-serif; /* Cambia la fuente a Arial o la que prefieras */
    font-size: 28px; /* Tamaño de la fuente */
    color: #333; /* Color del texto */
    text-transform: uppercase; /* Convierte el texto a mayúsculas */
  }

  .form-container {
    max-width: 400px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 3px;
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  button {
    width: 100%;
    background-color: limegreen;
    color: #fff;
    border: none;
    padding: 8px 12px;
    border-radius: 3px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: green;
  }

  /* Estilos para el botón personalizado */
  .custom-toggle-button {
    width: 20%;
    margin-left: 30px;
    background-color: #ddd; /* Color de fondo más discreto */
    color: #333; /* Color del texto más oscuro */
    border: 1px solid #ccc; /* Borde más suave */
    padding: 8px 12px;
    border-radius: 3px;
    cursor: pointer;
    margin-bottom: 10px;
  }

  .custom-toggle-button:hover {
    background-color: #eee; /* Efecto de resaltado más suave al pasar el mouse */
  }

  /* Estilos para los botones de paginación */
  .pagination-button {
    width: 150px; /* Ancho deseado */
    margin: 10px;
    background-color: #3498db;
    border: 1px solid #3498db;
    color: #fff;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .pagination-button:hover {
    background-color: #2980b9;
  }

  .pagination-button:disabled {
    background-color: #bdc3c7;
    border: 1px solid #bdc3c7;
    color: #ecf0f1;
    cursor: not-allowed;
  }

  .error-message {
    color: red;
    font-size: 15px;
  }
</style>
