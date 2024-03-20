<template>
  <!-- Sucursal y sus atributos -->
  <li class="item">
    <div class="item-content">
      <div class="item-property">
        <span class="item-name">ID:</span> {{ id }}
      </div>
      <div class="item-property">
        <span class="item-name">Nombre:</span> {{ nombre }}
      </div>
      <div v-if="mostrarDetalles" class="item-details">
        <div class="item-property">
          <span class="item-name">Direccion:</span> {{ direccion }}
        </div>
      </div>
      <div v-if="mostrarDetalles" class="item-details">
        <div class="item-property">
          <span class="item-name">Ciudad:</span> {{ ciudad }}
        </div>
      </div>
      <div v-if="mostrarDetalles" class="item-details">
        <div class="item-property">
          <span class="item-name">Pais:</span> {{ pais }}
        </div>
      </div>
      <div v-if="mostrarDetalles" class="item-details">
        <div class="item-property">
          <span class="item-name">Telefono:</span> {{ telefono }}
        </div>
      </div>
      <div v-if="mostrarDetalles" class="item-details">
        <div class="item-property">
          <span class="item-name">Vehiculos:</span> {{ vehiculos }}
        </div>
      </div>
      <v-btn @click="toggleDetalles" class="detalles-button">
        {{ mostrarDetalles ? 'Detalles :)' : 'Detalles :(' }}
      </v-btn>
      <v-btn @click="eliminarSucursal" class="delete-button">X</v-btn>
      <v-btn @click="toggleFormularioEdicion" class="edit-button">
        Editar
      </v-btn>
    </div>

    <!-- Formulario de edición -->
    <v-expand-x-transition>
      <v-form v-show="mostrarFormularioEdicion" @submit.prevent="guardarEdicion" class="form-container">
        <v-container>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="nombreEdicion" label="Nombre" :rules="[rules.required, rules.maxlength]"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="direccionEdicion" label="Direccion" :rules="[rules.required, rules.maxlength]"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="ciudadEdicion" label="Ciudad" :rules="[rules.required, rules.maxlength]"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="paisEdicion" label="Pais" :rules="[rules.required, rules.maxlength]"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="telefonoEdicion" label="Telefono" type="number" :rules="[rules.required, rules.telefono]"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="vehiculosEdicion" label="Vehiculos" type="number" :rules="[rules.required, rules.min]"></v-text-field>
            </v-col>
            <v-col>
              <v-btn class="update-button" type="submit">Actualizar</v-btn>
              <div v-if="tieneErrores" class="error-message">Corrige los errores.</div>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-expand-x-transition>
  </li>
</template>
  
<script>
  import { useSucursalStore } from '../../stores/sucursalStore';
  import { ref, watch, computed } from 'vue';
  
  export default {
    name: 'Sucursal',
    props: {
      id: Number,
      nombre: String,
      direccion: String,
      ciudad: String,
      pais: String,
      telefono: Number,
      vehiculos: Number,
    },
    setup(props) {
      const store = useSucursalStore();
      const mostrarDetalles = ref(false);

      // Reglas de validación.
      const rules = {
        required: value => !!value || 'Campo requerido',
        min: value => value >= 1 || 'El año debe ser mayor o igual a 1',
        maxlength: value => (value && value.length <= 30) || 'Longitud máxima de 30 caracteres',
        telefono: value => /^[0-9]{9}$/.test(value) || 'Debe contener 9 números',
      };
  
      // Cambiar el estado del formulario (aparece y desaparece).
      const toggleDetalles = () => {
        mostrarDetalles.value = !mostrarDetalles.value;
      };
  
      // Propiedades para la edición.
      const mostrarFormularioEdicion = ref(false);
      const nombreEdicion = ref('');
      const direccionEdicion = ref('');
      const ciudadEdicion = ref('');
      const paisEdicion = ref('');
      const telefonoEdicion = ref(null);
      const vehiculosEdicion = ref(null);

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
  
      // Vigilar los cambios en el formulario.
      watch(
        () => props,
        () => {
          nombreEdicion.value = props.nombre;
          direccionEdicion.value = props.direccion;
          ciudadEdicion.value = props.ciudad;
          paisEdicion.value = props.pais;
          telefonoEdicion.value = props.telefono;
          vehiculosEdicion.value = props.vehiculos;
        },
        { immediate: true }
      );

      // Función para limpiar los campos de edición.
      const limpiarCamposEdicion = () => {
        nombreEdicion.value = '';
        direccionEdicion.value = '';
        ciudadEdicion.value = '';
        paisEdicion.value = '';
        telefonoEdicion.value = null;
        vehiculosEdicion.value = null
      };

      // Función para validar cada campo del formulario para ver si tiene errores.
      const validarCampo = (campo, valor, reglas) => {
        errores.value[campo] = '';

        // Verificar si reglas es un array antes de iterar
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
  
      // Función para guardar la edición
      const guardarEdicion = async () => {
        // Validar campos antes de la actualización.
        validarCampo('nombre', nombreEdicion.value, [rules.required, rules.maxlength]);
        validarCampo('direccion', direccionEdicion.value, [rules.required, rules.maxlength]);
        validarCampo('ciudad', ciudadEdicion.value, [rules.required, rules.maxlength]);
        validarCampo('pais', paisEdicion.value, [rules.required, rules.maxlength]);
        validarCampo('telefono', telefonoEdicion.value, [rules.required, rules.telefono]);
        validarCampo('vehiculos', vehiculosEdicion.value, [rules.required, rules.min]);

        // Verificar si hay errores antes de la actualización.
        if (tieneErrores.value) {
          return;
        }

        const datosActualizados = {
          nombre: nombreEdicion.value,
          direccion: direccionEdicion.value,
          ciudad: ciudadEdicion.value,
          pais: paisEdicion.value,
          telefono: telefonoEdicion.value,
          vehiculos: vehiculosEdicion.value,
        };
  
        await store.actualizarSucursal(props.id, datosActualizados);
        mostrarFormularioEdicion.value = false;
        // Limpia los campos de edición después de actualizar.
        limpiarCamposEdicion();
        // Actualiza la lista después de la operación de actualización.
        await store.obtenerSucursales();
        // Actualiza el estado local del formulario con los nuevos valores.
        nombreEdicion.value = datosActualizados.nombre;
        direccionEdicion.value = datosActualizados.direccion;
        ciudadEdicion.value = datosActualizados.ciudad;
        paisEdicion.value = datosActualizados.pais;
        telefonoEdicion.value = datosActualizados.telefono;
        vehiculosEdicion.value = datosActualizados.vehiculos;
      };
  
      // Función para alternar la visibilidad del formulario de edición.
      const toggleFormularioEdicion = () => {
        setTimeout(() => {
          mostrarFormularioEdicion.value = !mostrarFormularioEdicion.value;
        }, 50);
      };

      // Función para eliminar una sucursal en la base de datos.
      const eliminarSucursal = () => {
        store.eliminarSucursal(props.id);
      };
  
      return {
        eliminarSucursal,
        mostrarDetalles,
        toggleDetalles,
        mostrarFormularioEdicion,
        nombreEdicion,
        direccionEdicion,
        ciudadEdicion,
        paisEdicion,
        telefonoEdicion,
        vehiculosEdicion,
        guardarEdicion,
        toggleFormularioEdicion,
        rules,
        errores,
        tieneErrores,
        validarCampo,
      };
    },
  };
</script>
  
<style scoped>
  .item {
    list-style: none;
    margin-bottom: 8px;
  }
  
  .item-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
    transition: background-color 0.3s ease;
  }
  
  .item-content:hover {
    background-color: #e0e0e0;
  }
  
  .item-name {
    font-weight: bold;
    color: #333;
  }
  
  .delete-button {
    background-color: #ff3333;
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
  }
  
  .delete-button:hover {
    background-color: #cc0000;
  }
  
  .detalles-button {
    background-color: limegreen;
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
  }
  
  .detalles-button:hover {
    background-color: green;
  }
  
  /* Estilos para el formulario */
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
    
  .update-button {
      width: 100%;
      background-color: limegreen;
      color: #fff;
      border: none;
      padding: 8px 12px;
      border-radius: 3px;
      cursor: pointer;
  }
    
  .update-button:hover {
      background-color: green;
  }

  .error-message {
    color: red;
    margin-top: 5px;
  }
</style>
  