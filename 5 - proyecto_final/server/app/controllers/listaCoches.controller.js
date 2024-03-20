const db = require("../models");
const Coche = db.coche;

// Método que devuelve la lista completa de Coches alamcenados en la base de datos.
// Permite la paginación de los resultados devueltos.
exports.listarCoches = async (req, res) => {
  try {
    // pageSize = cantidad de elementos a mostrar por página.
    const { page = 1, pageSize = 2 } = req.query;

    const pageNumber = parseInt(page);
    const pageSizeNumber = parseInt(pageSize);

    // Validación de los parámetros de paginación.
    if (
      isNaN(pageNumber) ||
      isNaN(pageSizeNumber) ||
      pageNumber < 1 ||
      pageSizeNumber < 1
    ) {
      return res
        .status(400)
        .send({ mensaje: "Parámetros de paginación inválidos." });
    }

    // Se aplica la paginación y búsqueda utilizando Sequelize.
    const offset = (pageNumber - 1) * pageSizeNumber;

    const coches = await Coche.findAndCountAll({
      offset,
      limit: pageSizeNumber,
    });

    const totalPages = Math.ceil(coches.count / pageSizeNumber);

    res.status(200).json({
      coches: coches.rows,
      totalPages: totalPages,
      currentPage: pageNumber,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Método que crea un nuevo Coche en la base de datos.
exports.crearCoche = async (req, res) => {
  try {
    const { modelo, marca, anyo, matricula, capacidad } = req.body;

    if (!modelo || !marca || !anyo || !matricula || !capacidad) {
      return res.status(400).send({ mensaje: "Faltan campos obligatorios." });
    }

    const nuevoCoche = await Coche.create({
      modelo: modelo,
      marca: marca,
      anyo: anyo,
      matricula: matricula,
      capacidad: capacidad,
    });

    res.status(201).send(nuevoCoche);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Método que actualiza un Coche en la base de datos con nuevos atributos.
exports.actualizarCoche = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { modelo, marca, anyo, matricula, capacidad } = req.body;

    if (isNaN(id) || !modelo || !marca || !anyo || !matricula || !capacidad) {
      return res
        .status(400)
        .send({ mensaje: "Datos incorrectos o incompletos." });
    }

    const [rowsUpdated] = await Coche.update(
      {
        modelo: modelo,
        marca: marca,
        anyo: anyo,
        matricula: matricula,
        capacidad: capacidad,
      },
      {
        where: { id: id },
      }
    );

    if (rowsUpdated === 1) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Método que dado el id de un Coche, lo elimina de la base de datos.
exports.eliminarCoche = (req, res) => {
  var id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).send({ mensaje: "El id debe ser numérico." });
  } else {
    Coche.destroy({
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
