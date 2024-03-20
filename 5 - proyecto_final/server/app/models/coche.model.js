module.exports = (sequelize, Sequelize) => {
  const Coche = sequelize.define("coches", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    modelo: {
      type: Sequelize.STRING,
    },
    marca: {
      type: Sequelize.STRING,
    },
    anyo: {
      type: Sequelize.INTEGER,
    },
    matricula: {
      type: Sequelize.STRING,
    },
    capacidad: {
      type: Sequelize.INTEGER,
    },
  });

  return Coche;
};
