import { defineStore } from "pinia";
import { CocheAPI } from "../services/CocheAPI";

export const useCocheStore = defineStore("lista", {
  state: () => ({
    lista: [],
    totalPages: 1,
    currentPage: 1,
    pageSize: 2,
    cliente: new CocheAPI("http://localhost:8080/api/coches"),
  }),
  actions: {
    // Método para obtener todos los coches de la base de datos, con paginación.
    async obtenerCoches(page = 1) {
      try {
        const datos = await this.cliente.obtenerCoches({ page, pageSize: this.pageSize });
        this.lista = datos.coches;
        this.totalPages = datos.totalPages;
        this.currentPage = datos.currentPage;
      } catch (error) {
        console.error("Error al obtener los coches:", error);
      }
    },

    // Método para cambiar de página.
    async cambiarPagina(page) {
      if (page >= 1 && page <= this.totalPages) {
        await this.obtenerCoches(page);
      }
    },
    
    // Método para eliminar un coche de la base de datos.
    async eliminarCoche(id) {
      try {
        await this.cliente.eliminarCoche(id);
        // Filtrar la lista para quitar el coche eliminado.
        this.lista = this.lista.filter((coche) => coche.id !== id);
      } catch (error) {
        console.error("Error al eliminar el coche:", error);
      }
    },
    
    // Método para crear un nuevo coche.
    async crearCoche(nuevoCoche) {
      try {
        var nuevo = await this.cliente.crearCoche(nuevoCoche);
        // Agregar el nuevo coche a la lista.
        this.lista.push(nuevo);
      } catch (error) {
        console.error("Error al crear el coche:", error);
      }
    },

    // Método para actualizar un coche en la base de datos.
    async actualizarCoche(id, datosActualizados) {
      try {
        await this.cliente.actualizarCoche(id, datosActualizados);
        // Actualizar la lista después de la operación de actualización.
        this.lista = this.lista.map((coche) =>
          coche.id === id ? { ...coche, ...datosActualizados } : coche
        );
      } catch (error) {
        console.error("Error al actualizar el coche:", error);
      }
    },
  },
});
