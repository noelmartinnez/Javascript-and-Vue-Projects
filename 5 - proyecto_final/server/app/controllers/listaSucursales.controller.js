const db = require("../models");
const Sucursal = db.sucursal;

// Método que devuelve la lista completa de Sucursales alamcenadas en la base de datos.
exports.listarSucursales = (req, res) => {
  Sucursal.findAll()
    .then((sucursales) => {
      res.status(200).send(sucursales);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// Método que crea una nueva Sucursal en la base de datos.
exports.crearSucursal = async (req, res) => {
  try {
    const { nombre, direccion, ciudad, pais, telefono, vehiculos } = req.body;

    if (!nombre || !direccion || !ciudad || !pais || !telefono || !vehiculos) {
      return res.status(400).send({ mensaje: "Faltan campos obligatorios." });
    }

    const nuevaSucursal = await Sucursal.create({
      nombre: nombre,
      direccion: direccion,
      ciudad: ciudad,
      pais: pais,
      telefono: telefono,
      vehiculos: vehiculos,
    });

    res.status(201).send(nuevaSucursal);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Método que actualiza una Sucursal en la base de datos con nuevos atributos.
exports.actualizarSucursal = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, direccion, ciudad, pais, telefono, vehiculos } = req.body;

    if (
      isNaN(id) ||
      !nombre ||
      !direccion ||
      !ciudad ||
      !pais ||
      !telefono ||
      !vehiculos
    ) {
      return res
        .status(400)
        .send({ mensaje: "Datos incorrectos o incompletos." });
    }

    const sucursalActualizada = await Sucursal.update(
      {
        nombre: nombre,
        direccion: direccion,
        ciudad: ciudad,
        pais: pais,
        telefono: telefono,
        vehiculos: vehiculos,
      },
      {
        where: { id: id },
      }
    );

    if (sucursalActualizada[0] === 1) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Método que devuelve una lista de Sucursales personalizada.
// Se buscan en la base de datos las Sucursales cuyo nombre coincida con el pedido.
exports.buscarSucursalPorNombre = async (req, res) => {
  try {
    const nombre = req.params.nombre;

    if (!nombre) {
      return res
        .status(400)
        .send({ mensaje: "Se requiere un nombre para buscar la sucursal." });
    }

    const sucursales = await Sucursal.findAll({
      where: { nombre: nombre },
    });

    if (sucursales.length > 0) {
      res.status(200).send(sucursales);
    } else {
      res.status(404).send({ mensaje: "Sucursal no encontrada." });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Método que dado el id de una Sucursal, la elimina de la base de datos.
exports.eliminarSucursal = (req, res) => {
  var id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).send({ mensaje: "El id debe ser numérico." });
  } else {
    Sucursal.destroy({
      where: { id: id },
    })
      .then((resultado) => {
        if (resultado === 1) {
          res.status(200).end();
        } else {
          res.status(404).end();
        }
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  }
};

// EXTRA
// Método que recupera varias Sucursales de la base de datos según un conjunto de ids.
exports.recuperarSucursalesPorIds = async (req, res) => {
  try {
    const ids = req.body.ids;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({ mensaje: "Se requiere un array de ids válido." });
    }

    const sucursales = await Sucursal.findAll({
      where: { id: ids },
    });

    if (sucursales.length > 0) {
      res.status(200).send(sucursales);
    } else {
      res.status(404).send({ mensaje: "Sucursales no encontradas para los ids proporcionados." });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

