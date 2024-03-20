<template>
    <div>
      <!-- Título -->
      <h1 class="main-title">Lista de sucursales</h1>

      <!-- Buscador de sucursales por nombre -->
      <v-row class="search-container">
        <v-col cols="12" sm="6">
          <v-text-field v-model="nombreBusqueda" aria-placeholder="Buscar por nombre"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn @click="buscarSucursalesPorNombre" class="search-button">Buscar</v-btn>
          <div v-if="sucursalStore.error" class="error-message">{{ sucursalStore.error }}</div>
        </v-col>
      </v-row>

      <!-- Botón para mostrar de nuevo el listado completo de sucursales -->
      <v-btn @click="obtenerListadoCompleto" class="listado-completo-button custom-toggle-button">
        Listado Completo
      </v-btn>

      <!-- Botón para mostrar y ocultar el form de añadir una nueva sucursal -->
      <v-btn @click="toggleForm" class="toggle-button custom-toggle-button">
        {{ mostrarFormulario ? 'Ocultar Formulario' : 'Mostrar Formulario' }}
      </v-btn>

      <!-- Formulario para añadir una nueva sucursal -->
      <v-expand-transition>
        <v-form v-show="mostrarFormulario" @submit.prevent="agregarNuevaSucursal" class="form-container">
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="nuevaSucursal.nombre" label="Nombre" :rules="[rules.required, rules.maxlength]"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="nuevaSucursal.direccion" label="Direccion" :rules="[rules.required, rules.maxlength]"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="nuevaSucursal.ciudad" label="Ciudad" :rules="[rules.required, rules.maxlength]"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="nuevaSucursal.pais" label="Pais" :rules="[rules.required, rules.maxlength]"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="nuevaSucursal.telefono" label="Telefono" type="number" :rules="[rules.required, rules.telefono]"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="nuevaSucursal.vehiculos" label="Vehiculos" type="number" :rules="[rules.required, rules.min]"></v-text-field>
              </v-col>
              <v-col>
                <v-btn class="add-button" type="submit">Agregar</v-btn>
                <div v-if="tieneErrores" class="error-message">Corrige los errores.</div>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-expand-transition>

      <!-- Listado de sucursales -->
      <ul>
        <Sucursal
          v-for="i in items"
          :key="i.id"
          :id="i.id"
          :nombre="i.nombre"
          :direccion="i.direccion"
          :ciudad="i.ciudad"
          :pais="i.pais"
          :telefono="i.telefono"
          :vehiculos="i.vehiculos"
        />
      </ul>
    </div>
</template>
  
<script>
  import Sucursal from './Sucursal.vue'
  import { ref, computed, reactive } from 'vue';
  import { useSucursalStore } from '../../stores/sucursalStore'
  
  export default {
    name: 'Listado',
    components: { Sucursal },
    setup() {
      const sucursalStore = useSucursalStore()
      const mostrarFormulario = ref(false);
      const nombreBusqueda = ref('');

      // Nueva sucursal vacía para crearla.
      const nuevaSucursal = reactive({
        nombre: '',
        direccion: '',
        ciudad: '',
        pais: '',
        telefono: null,
        vehiculos: null,
      });

      // Reglas de validación del formulario.
      const rules = {
        required: value => !!value || 'Campo requerido',
        min: value => value >= 1 || 'El año debe ser mayor o igual a 1',
        maxlength: value => (value && value.length <= 30) || 'Longitud máxima de 30 caracteres',
        telefono: value => /^[0-9]{9}$/.test(value) || 'Debe contener 9 números',
      };

      // Errores de validación.
      const errores = ref({
        nombre: '',
        direccion: '',
        ciudad: '',
        pais: '',
        telefono: '',
        vehiculos: '',
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

      // Función para crear una nueva sucursal en la base de datos.
      const agregarNuevaSucursal = async () => {
        // Validar campos antes de agregar.
        validarCampo('nombre', nuevaSucursal.nombre, [rules.required, rules.maxlength]);
        validarCampo('direccion', nuevaSucursal.direccion, [rules.required, rules.maxlength]);
        validarCampo('ciudad', nuevaSucursal.ciudad, [rules.required, rules.maxlength]);
        validarCampo('pais', nuevaSucursal.pais, [rules.required, rules.maxlength]);
        validarCampo('telefono', nuevaSucursal.telefono, [rules.required, rules.telefono]);
        validarCampo('vehiculos', nuevaSucursal.vehiculos, [rules.required, rules.min]);

        // Verificar si hay errores.
        if (tieneErrores.value) {
          return;
        }

        // Convertir a números.
        nuevaSucursal.telefono = parseInt(nuevaSucursal.telefono); 
        nuevaSucursal.vehiculos = parseInt(nuevaSucursal.vehiculos);

        await sucursalStore.crearSucursal(nuevaSucursal);
        Object.keys(nuevaSucursal).forEach((key) => (nuevaSucursal[key] = null));
        await sucursalStore.obtenerSucursales(); // Se actualiza solo la lista.
        toggleForm();
      };

      // Función para obtener el listado completo.
      const obtenerListadoCompleto = async () => {
        await sucursalStore.obtenerSucursales();
        nombreBusqueda.value = '';
      };

      // Función para buscar por nombre.
      const buscarSucursalesPorNombre = async () => {
        await sucursalStore.buscarSucursalesPorNombre(nombreBusqueda.value);
        if (sucursalStore.error != '') {
          nombreBusqueda.value = '';
          await sucursalStore.obtenerSucursales();
        }
      };
  
      return { sucursalStore, nuevaSucursal, agregarNuevaSucursal,
        mostrarFormulario, toggleForm,
        rules, errores, tieneErrores, validarCampo,
        nombreBusqueda, buscarSucursalesPorNombre,
        obtenerListadoCompleto, 
      }
    },
    async created() {
      this.sucursalStore.obtenerSucursales()
    },
    computed: {
      items() {
        return this.sucursalStore.listado;
      }
    }
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


  /* Estilos para el/los formulario/s */
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

  .error-message {
    color: red;
    font-size: 15px;
  }

  /* Estilos para el buscador */
  .search-container {
    max-width: 400px;
    margin: 20px auto;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
  }

  .search-button {
    width: 100%;
    background-color: #007BFF; /* Color de fondo azul */
    color: #fff;
    border: none;
    padding: 8px 12px;
    border-radius: 3px;
    cursor: pointer;
  }

  .search-button:hover {
    background-color: #0056b3; /* Efecto de resaltado más oscuro al pasar el mouse */
  }

  /* Estilos para el botón "Listado Completo" */
  .listado-completo-button {
    background-color: #4CAF50; /* Verde diferente al utilizado anteriormente */
    color: #fff;
  }

  .listado-completo-button:hover {
    background-color: #45a049; /* Efecto de resaltado al pasar el mouse */
  }
</style>
