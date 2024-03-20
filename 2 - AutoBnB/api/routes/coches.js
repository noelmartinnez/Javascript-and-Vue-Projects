const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('database.sqlite');

// Middleware para verificar si el coche existe
function validarCoche(req, res, next) {
  const cocheId = parseInt(req.params.id);
  
  db.get('SELECT * FROM Coches WHERE id = ?', [cocheId], (error, coche) => {
    if (error) {
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }

    if (!coche) {
      return res.status(404).json({ message: 'Coche no encontrado.' });
    }

    req.coche = coche;
    next();
  });
}

// Obtener la colección de coches sin paginación
router.get('/', (req, res) => {
  db.all('SELECT * FROM Coches', [], (error, coches) => {
    if (error) {
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
    res.status(200).json(coches);
  });
});

// Obtener detalles de un coche por ID
router.get('/:id', validarCoche, (req, res) => {
  res.status(200).json(req.coche);
});

// Agregar coche
router.post('/', (req, res) => {
  const { modelo, marca, año, matricula, combustible, capacidad, precio_Dia, precio_Medio_Dia } = req.body;

  db.run(
    'INSERT INTO Coches (modelo, marca, año, matricula, combustible, capacidad, precio_Dia, precio_Medio_Dia) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [modelo, marca, año, matricula, combustible, capacidad, precio_Dia, precio_Medio_Dia],
    function (error) {
      if (error) {
        return res.status(500).json({ message: 'Error interno del servidor.' });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

// Eliminar coche
router.delete('/:id', validarCoche, (req, res) => {
  db.run('DELETE FROM Coches WHERE id = ?', [req.params.id], (error) => {
    if (error) {
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
    res.status(204).send();
  });
});

module.exports = router;
