export class SucursalAPI {
  constructor(url) {
    this.API_URL = url;
  }
  
  // Método para obtener todas las sucursales de la base de datos, sin paginación.
  async obtenerSucursales() {
    var resp = await fetch(this.API_URL);
    if (resp.ok) {
      return resp.json();
    } else {
      console.error("Error en la llamada a obtenerSucursales:", error.message);
      throw new Error(resp.status);
    }
  }

  // Método para eliminar una sucursal de la base de datos.
  async eliminarSucursal(id) {
    var resp = await fetch(this.API_URL + "/" + id, {
      method: "DELETE",
    });
    if (resp.ok) {
      return true;
    } else {
      console.error("Error en la llamada a eliminarSucursal:", error.message);
      throw new Error(resp.status);
    }
  }

  // Método para crear una nueva sucursal.
  async crearSucursal(nuevaSucursal) {
    var datos = JSON.stringify(nuevaSucursal);
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
      console.error("Error en la llamada a crearSucursal:", error.message);
      throw new Error(resp.status);
    }
  }

  // Método para actualizar una sucursal en la base de datos.
  async actualizarSucursal(id, datosActualizados) {
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
        // Verificar si la respuesta tiene un cuerpo antes de intentar analizarlo como JSON
        const jsonResponse = resp.headers.get("content-type")?.includes("application/json");
        const data = jsonResponse ? await resp.json() : null;  
        return data;
      } else {
        throw new Error(resp.status);
      }
    } catch (error) {
      console.error("Error en la llamada a actualizarSucursal:", error.message);
      throw error;
    }
  }

  // Método para buscar en la base de datos las sucursales que coincidan con el nombre.
  async buscarSucursalesPorNombre(nombre) {
    try {
      var resp = await fetch(this.API_URL + "/" + nombre);
      if (resp.ok) {
        return resp.json();
      } else {
        throw new Error(resp.status);
      }
    } catch (error) {
      console.error("Error en la llamada a buscarSucursalesPorNombre:", error.message);
      throw error;
    }
  }

  // EXTRA
  async obtenerSucursalesPorIds(ids) {
    try {
      var datos = JSON.stringify({ ids: ids });
      var resp = await fetch(this.API_URL + "/por-ids", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: datos,
      });

      if (resp.ok) {
        return resp.json();
      } else {
        console.error("Error en la llamada a obtenerSucursalesPorIds:", error.message);
        throw new Error(resp.status);
      }
    } catch (error) {
      console.error("Error en la llamada a obtenerSucursalesPorIds:", error.message);
      throw error;
    }
  }
}
  