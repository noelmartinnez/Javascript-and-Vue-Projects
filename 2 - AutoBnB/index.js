const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jwt-simple');

const moment = require('moment'); // librería para añadir una fecha al payload
const sqlite3 = require('sqlite3').verbose(); // librería sqlite3
const multer = require('multer'); // librería para usar archivos binarios

const app = express();
const PORT = process.env.PORT || 3000;
const secretKey = '123456789';

app.use(bodyParser.json());

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('database.sqlite');

// Para crear las tablas en la base de datos
/* db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Usuarios (
    id INTEGER PRIMARY KEY,
    nombre TEXT,
    apellido TEXT,
    contraseña TEXT,
    email TEXT,
    direccion TEXT,
    telefono INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Coches (
    id INTEGER PRIMARY KEY,
    modelo TEXT,
    marca TEXT,
    año INTEGER,
    matricula TEXT,
    combustible TEXT,
    capacidad INTEGER,
    precio_Dia REAL,
    precio_Medio_Dia REAL
  )`);

}); */

// Función para crear un token JWT
function crearToken(usuarioId) {
  const payload = {
    usuarioId: usuarioId,
    exp: moment().add(7, 'days').valueOf(),
  };
  return jwt.encode(payload, secretKey);
}

// Ruta para el inicio de sesión
app.post('/login', (req, res) => {
  const email = req.body.email;
  const contraseña = req.body.contraseña;

  // Se busca al usuario por el email y la contraseña 
  db.get(
    'SELECT * FROM Usuarios WHERE email = ? AND contraseña = ?',
    [email, contraseña],
    (error, usuario) => {
      if (error) {
        return res.status(500).json({ message: 'Error interno del servidor.' });
      }

      // Si el usuario con dichos parámetros no existe en la base de datos
      if (!usuario) {
        return res.status(401).json({ message: 'Credenciales inválidas.' });
      }

      // Si todo es correcto se crea el token
      const token = crearToken(usuario.id);
      res.json({ token });
    }
  );
});

// NO SE USA
// Middleware para verificar token JWT en las rutas
function authenticate(req, res, next) {
  // Recuperamos el cabecera "authorization" para recuperar el token que debe haber en ella
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticación faltante.' });
  }

  try {
    // Ahora si el token tiene el formato correcto, se descodifica
    const decoded = jwt.decode(token, secretKey);
    // Y se comprueba que sea el token correcto
    req.usuarioId = decoded.usuarioId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token de autenticación inválido.' });
  }
}

// Se exporta la función "authenticate" para que se pueda usar en otros ficheros
module.exports = {
  app,
  authenticate,
};

// Configura la ubicación donde se guardarán los archivos y sus nombres
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Directorio donde se van a guardar los archivos cargados
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Se guardarán con la fecha actual + el nombre original del archivo
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Ruta para cargar archivos binarios (aceptará cualquier nombre de campo)
app.post('/upload', upload.any(), (req, res) => {
  const files = req.files; // Información sobre los archivos cargados

  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'Debes cargar al menos un archivo.' });
  }

  // Lógica para el archivo (guardarlo en una base de datos o en un sistema de archivos).

  res.status(200).json({ message: 'Archivo(s) cargado(s) con éxito.' });
});

const usuariosRouter = require('./api/routes/usuarios');
const cochesRouter = require('./api/routes/coches');

app.use('/usuarios', usuariosRouter);
app.use('/coches', cochesRouter);

app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
