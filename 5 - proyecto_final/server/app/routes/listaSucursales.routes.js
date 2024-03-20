const controller = require("../controllers/listaSucursales.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Rutas para la gestión de las Sucursales
  app.get("/api/sucursales", controller.listarSucursales);
  app.post("/api/sucursales", controller.crearSucursal);
  app.put("/api/sucursales/:id", controller.actualizarSucursal);
  app.get("/api/sucursales/:nombre", controller.buscarSucursalPorNombre);
  app.delete("/api/sucursales/:id", controller.eliminarSucursal);

  // EXTRA
  app.get("/api/sucursales/por-ids", controller.recuperarSucursalesPorIds);
};