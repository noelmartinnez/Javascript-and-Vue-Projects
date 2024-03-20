export class CocheAPI {
  constructor(url) {
    this.API_URL = url;
  }

  // Método para obtener todos los coches de la base de datos con paginación.
  async obtenerCoches({ page = 1, pageSize = 2 } = {}) {
    try {
      const resp = await fetch(`${this.API_URL}?page=${page}&pageSize=${pageSize}`);
      if (resp.ok) {
        return resp.json();
      } else {
        throw new Error(resp.status);
      }
    } catch (error) {
      throw new Error(`Error al obtener los coches: ${error.message}`);
    }
  }

  // Método para eliminar un coche de la base de datos.
  async eliminarCoche(id) {
    var resp = await fetch(this.API_URL + "/" + id, {
      method: "DELETE",
    });
    if (resp.ok) {
      return true;
    } else {
      throw new Error(`Error al eliminar el coche: ${error.message}`);
    }
  }

  // Método para crear un nuevo coches en la base de datos.
  async crearCoche(nuevoCoche) {
    var datos = JSON.stringify(nuevoCoche);
    var resp = await fetch(this.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: datos,
    });

    if (resp.ok) {
      return resp.json();
    } else {
      throw new Error(`Error al crear el nuevo coche: ${error.message}`);
    }
  }

  // Método para actualizar un coche en la base de datos.
  async actualizarCoche(id, datosActualizados) {
    try {
      var datos = JSON.stringify(datosActualizados);
      var resp = await fetch(this.API_URL + "/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: datos,
      });
  
      if (resp.ok) {
        // Verificar si la respuesta tiene un cuerpo antes de intentar analizarlo como JSON.
        const jsonResponse = resp.headers.get("content-type")?.includes("application/json");
        const data = jsonResponse ? await resp.json() : null;  
        return data;
      } else {
        throw new Error(resp.status);
      }
    } catch (error) {
      throw new Error(`Error al actualizar el coche: ${error.message}`);
    }
  }
}
