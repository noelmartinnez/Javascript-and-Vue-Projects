const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");

const app = express();

// Permite la conexión con el Cliente.
var corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DataBase.
const db = require("./app/models");
const Role = db.role;
const Coche = db.coche;
const Sucursal = db.sucursal;

db.sequelize.sync().then(() => {
  Role.findOne().then((found) => {
    if (!found) initial();
  });
});

db.sequelize.sync().then(() => {
  Coche.findOne().then((found) => {
    if (!found) initialCoches();
  });
});

db.sequelize.sync().then(() => {
  Sucursal.findOne().then((found) => {
    if (!found) initialSucursales();
  });
});

// Ruta de inicio.
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Noel's application." });
});

// Rutas de la aplicación.
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/listaCoches.routes")(app);
require("./app/routes/listaSucursales.routes")(app);

// Puertos y listeners.
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Inicialización de la base de datos.
function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}

function initialCoches() {
  Coche.create({
    id: 1,
    modelo: "Q1",
    marca: "Audi",
    anyo: 1998,
    matricula: "3447ABC",
    capacidad: 5,
  });

  Coche.create({
    id: 2,
    modelo: "Q2",
    marca: "Audi",
    anyo: 1998,
    matricula: "3448ABC",
    capacidad: 5,
  });
}

function initialSucursales() {
  Sucursal.create({
    id: 1,
    nombre: "Sucursal 1",
    direccion: "Calle los manolos",
    ciudad: "Sevilla",
    pais: "España",
    telefono: 123456789,
    vehiculos: 98,
  });

  Sucursal.create({
    id: 2,
    nombre: "Sucursal 2",
    direccion: "Calle las manalas",
    ciudad: "Cordoba",
    pais: "España",
    telefono: 987654321,
    vehiculos: 89,
  });
}
