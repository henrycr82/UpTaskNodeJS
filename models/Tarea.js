const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db');
const Proyecto = require('./Proyecto');


const Tareas = db.define('tareas', {
  id: {
    type: DataTypes.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  tarea: {
    type: DataTypes.STRING(100)
  },
  estado: {
    type: DataTypes.INTEGER(1)
  }
});

//Una tarea pertenece a un proyecto
Tareas.belongsTo(Proyecto);

module.exports = Tareas;