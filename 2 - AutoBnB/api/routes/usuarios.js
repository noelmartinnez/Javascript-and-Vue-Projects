const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const { authenticate } = require('../../index');  // No hace falta utilizarlo todavía

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('database.sqlite');

// Middleware para verificar si el usuario existe
function validarUsuario(req, res, next) {
  const usuarioId = parseInt(req.params.id);

  // Buscamos al usuario en la base de datos, buscando por el id
  db.get('SELECT * FROM Usuarios WHERE id = ?', [usuarioId], (error, usuario) => {
    if (error) {
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    req.usuario = usuario;
    next();
  });
}

// Obtener la colección de usuarios CON PAGINACIÓN
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
  const limit = parseInt(req.query.limit) || 5; // Cantidad de resultados por página, por defecto 5
  const offset = (page - 1) * limit; // Valor de offset

  // Consulta SQL para obtener usuarios con paginación
  const query = 'SELECT * FROM Usuarios LIMIT ? OFFSET ?';

  // Consulta SQL para obtener el total de usuarios
  const countQuery = 'SELECT COUNT(*) as total FROM Usuarios';

  db.get(countQuery, [], (error, countResult) => {
    if (error) {
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }

    const total = countResult.total; // Total de usuarios
    const totalPages = Math.ceil(total / limit); // Total de páginas

    // Una vez que se ha obtenido el total de usuarios y página, se muestran los usuarios con paginación
    db.all(query, [limit, offset], (error, usuarios) => {
      if (error) {
        return res.status(500).json({ message: 'Error interno del servidor.' });
      }

      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;

      // Metadatos para la paginación
      const pagination = {
        total,
        currentPage: page,
        totalPages,
        nextPage,
        prevPage,
      };

      res.status(200).json({ pagination, usuarios });
    });
  });
});


// Obtener detalles de un usuario por ID
router.get('/:id', validarUsuario, (req, res) => {
  res.status(200).json(req.usuario);
});

// Ruta para registrar un usuario
router.post('/', (req, res) => {
  const { nombre, apellido, contraseña, email, direccion, telefono } = req.body;

  if (!nombre || !apellido || !contraseña || !email || !direccion || !telefono) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  db.run(
    'INSERT INTO Usuarios (nombre, apellido, contraseña, email, direccion, telefono) VALUES (?, ?, ?, ?, ?, ?)',
    [nombre, apellido, contraseña, email, direccion, telefono],
    function (error) {
      if (error) {
        return res.status(500).json({ message: 'Error interno del servidor.' });
      }

      const nuevoUsuario = {
        id: this.lastID,
        nombre,
        apellido,
        contraseña,
        email,
        direccion,
        telefono,
      };
      res.status(201).json(nuevoUsuario);
    }
  );
});

// Actualizar datos de un usuario
router.put('/:id', validarUsuario, (req, res) => {
  const { nombre, apellido, contraseña, direccion, telefono } = req.body;

  if (!nombre || !apellido || !contraseña || !direccion || !telefono) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  db.run(
    'UPDATE Usuarios SET nombre = ?, apellido = ?, contraseña = ?, direccion = ?, telefono = ? WHERE id = ?',
    [nombre, apellido, contraseña, direccion, telefono, req.usuario.id],
    function (error) {
      if (error) {
        return res.status(500).json({ message: 'Error interno del servidor.' });
      }

      res.status(200).json({
        id: req.usuario.id,
        nombre,
        apellido,
        contraseña,
        direccion,
        telefono,
      });
    }
  );
});

// Eliminar un usuario
router.delete('/:id', validarUsuario, (req, res) => {
  db.run('DELETE FROM Usuarios WHERE id = ?', [req.usuario.id], (error) => {
    if (error) {
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }

    res.status(204).send();
  });
});

module.exports = router;
