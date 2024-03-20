const controller = require("../controllers/listaCoches.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Rutas para la gestión de los Coches
  app.get("/api/coches", controller.listarCoches);
  app.post("/api/coches", controller.crearCoche);
  app.put("/api/coches/:id", controller.actualizarCoche);
  app.delete("/api/coches/:id", controller.eliminarCoche);
};
