import { defineStore } from "pinia";
import { SucursalAPI } from "../services/SucursalAPI";

export const useSucursalStore = defineStore("listado", {
  state: () => ({
    listado: [],
    error: '',
    cliente: new SucursalAPI("http://localhost:8080/api/sucursales"),
  }),
  actions: {
    // Método para obtener todas las sucursales de la base de datos, sin paginación.
    async obtenerSucursales() {
      var datos = await this.cliente.obtenerSucursales();
      this.listado = datos;
    },
    
    // Método para eliminar una sucursal de la base de datos.
    async eliminarSucursal(id) {
      try {
        await this.cliente.eliminarSucursal(id);
        // Filtrar la lista para quitar la sucursal eliminada.
        this.listado = this.listado.filter((item) => item.id !== id);
      } catch (error) {
        console.error("Error al eliminar la sucursal:", error);
      }
    },
    
    // Método para crear una nueva sucursal.
    async crearSucursal(nuevaSucursal) {
      try {
        var nuevo = await this.cliente.crearSucursal(nuevaSucursal);
        // Agregar el la nueva sucursal a la lista.
        this.listado.push(nuevo);
      } catch (error) {
        console.error("Error al crear el item:", error);
      }
    },

    // Método para actualizar una sucursal en la base de datos.
    async actualizarSucursal(id, datosActualizados) {
      try {
        await this.cliente.actualizarSucursal(id, datosActualizados);
        // Actualizar la lista después de la operación de actualización.
        this.listado = this.listado.map((item) =>
          item.id === id ? { ...item, ...datosActualizados } : item
        );
      } catch (error) {
        console.error("Error al actualizar el item:", error);
      }
    },

    // Método para buscar en la base de datos las sucursales que coincidan con el nombre.
    async buscarSucursalesPorNombre(nombre) {
      try {
        var resultado = await this.cliente.buscarSucursalesPorNombre(nombre);
        this.listado = resultado;
        this.error = '';
      } catch (error) {
        console.error('Error al buscar por nombre:', error);
        this.error = "Introduzca otro nombre";
      }
    },

    // EXTRA
    async obtenerSucursalesPorIds(ids) {
      try {
        var datos = await this.cliente.obtenerSucursalesPorIds(ids);
        this.listado = datos;
      } catch (error) {
        console.error("Error al obtener sucursales por ids:", error);
      }
    },
  },
});