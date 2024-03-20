module.exports = (sequelize, Sequelize) => {
  const Sucursal = sequelize.define("sucursales", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    nombre: {
      type: Sequelize.STRING,
    },
    direccion: {
      type: Sequelize.STRING,
    },
    ciudad: {
      type: Sequelize.STRING,
    },
    pais: {
      type: Sequelize.STRING,
    },
    telefono: {
      type: Sequelize.INTEGER,
    },
    vehiculos: {
      type: Sequelize.INTEGER,
    },
  });

  return Sucursal;
};
