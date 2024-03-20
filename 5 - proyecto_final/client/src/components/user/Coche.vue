<template>
  <!-- Sucursal y sus atributos -->
  <li class="item">
    <div class="item-content">
      <div class="item-property">
        <span class="item-name">ID:</span> {{ id }}
      </div>
      <div class="item-property">
        <span class="item-name">Modelo:</span> {{ modelo }}
      </div>
      <div class="item-property">
        <span class="item-name">Marca:</span> {{ marca }}
      </div>
      <div v-if="mostrarDetalles" class="item-details">
        <div class="item-property">
          <span class="item-name">Año:</span> {{ anyo }}
        </div>
      </div>
      <div v-if="mostrarDetalles" class="item-details">
        <div class="item-property">
          <span class="item-name">Matricula:</span> {{ matricula }}
        </div>
      </div>
      <div v-if="mostrarDetalles" class="item-details">
        <div class="item-property">
          <span class="item-name">Capacidad:</span> {{ capacidad }}
        </div>
      </div>
      <v-btn @click="toggleDetalles" class="detalles-button">
        {{ mostrarDetalles ? 'Detalles :)' : 'Detalles :(' }}
      </v-btn>
      <v-btn @click="eliminarCoche" class="delete-button">X</v-btn>
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
              <v-text-field  v-model="modeloEdicion" label="Modelo" :rules="[rules.required, rules.maxlength]" ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="marcaEdicion" label="Marca" :rules="[rules.required, rules.maxlength]" ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="añoEdicion"
                label="Año"
                type="number"
                :rules="[rules.required, rules.min, rules.max]">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="matriculaEdicion"
                label="Matricula"
                :rules="[rules.required, rules.matricula]">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="capacidadEdicion"
                label="Capacidad"
                type="number"
                :rules="[rules.required, rules.capacity]">
              </v-text-field>
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
import { useCocheStore } from '../../stores/cocheStore';
import { ref, watch, computed } from 'vue';

export default {
  name: 'Coche',
  props: {
    id: Number,
    modelo: String,
    marca: String,
    anyo: Number,
    matricula: String,
    capacidad: Number,
  },
  setup(props) {
    const store = useCocheStore();
    const mostrarDetalles = ref(false);

    // Reglas de validación.
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

    // Cambiar el estado del formulario (aparece y desaparece).
    const toggleDetalles = () => {
      mostrarDetalles.value = !mostrarDetalles.value;
    };

    // Propiedades para la edición.
    const mostrarFormularioEdicion = ref(false);
    const modeloEdicion = ref('');
    const marcaEdicion = ref('');
    const añoEdicion = ref(null);
    const matriculaEdicion = ref('');
    const capacidadEdicion = ref(null);

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

    // Vigilar los cambios en el formulario.
    watch(
      () => props,
      () => {
        modeloEdicion.value = props.modelo;
        marcaEdicion.value = props.marca;
        añoEdicion.value = props.anyo;
        matriculaEdicion.value = props.matricula;
        capacidadEdicion.value = props.capacidad;
      },
      { immediate: true }
    );

    // Función para limpiar los campos de edición.
    const limpiarCamposEdicion = () => {
      modeloEdicion.value = '';
      marcaEdicion.value = '';
      añoEdicion.value = null;
      matriculaEdicion.value = '';
      capacidadEdicion.value = null;
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
      validarCampo('modelo', modeloEdicion.value, [rules.required, rules.maxlength]);
      validarCampo('marca', marcaEdicion.value, [rules.required, rules.maxlength]);
      validarCampo('anyo', añoEdicion.value, [rules.required, rules.min, rules.max]);
      validarCampo('matricula', matriculaEdicion.value, [rules.required, rules.matricula]);
      validarCampo('capacidad', capacidadEdicion.value, [rules.required, rules.capacity]);

      // Verificar si hay errores antes de la actualización.
      if (tieneErrores.value) {
        return;
      }

      const datosActualizados = {
        modelo: modeloEdicion.value,
        marca: marcaEdicion.value,
        anyo: parseInt(añoEdicion.value, 10),
        matricula: matriculaEdicion.value,
        capacidad: parseInt(capacidadEdicion.value, 10),
      };

      await store.actualizarCoche(props.id, datosActualizados);
      mostrarFormularioEdicion.value = false;
      // Limpia los campos de edición después de actualizar.
      limpiarCamposEdicion();
      // Actualiza la lista después de la operación de actualización.
      await store.obtenerCoches();
      // Actualiza el estado local del formulario con los nuevos valores.
      modeloEdicion.value = datosActualizados.modelo;
      marcaEdicion.value = datosActualizados.marca;
      añoEdicion.value = datosActualizados.anyo;
      matriculaEdicion.value = datosActualizados.matricula;
      capacidadEdicion.value = datosActualizados.capacidad;
    };

    // Función para alternar la visibilidad del formulario de edición.
    const toggleFormularioEdicion = () => {
      setTimeout(() => {
        mostrarFormularioEdicion.value = !mostrarFormularioEdicion.value;
      }, 50);
    };

    // Función para eliminar un coche en la base de datos.
    const eliminarCoche = async () => {
      store.eliminarCoche(props.id);
      await store.obtenerCoches();
    };

    return {
      eliminarCoche,
      mostrarDetalles,
      toggleDetalles,
      mostrarFormularioEdicion,
      modeloEdicion,
      marcaEdicion,
      añoEdicion,
      matriculaEdicion,
      capacidadEdicion,
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
