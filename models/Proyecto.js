const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db');
const slug = require('slug'); //Para hacer cadenas que sean seguras para URL
const shortid = require('shortid'); //generar ID's cortos

const Proyecto = db.define('proyecto', {
  id: {
    type: DataTypes.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100)
  },
  url: {
    type: DataTypes.STRING(100)
  }
}, {
    /*
      Los hooks (también conocidos como eventos del ciclo de vida), 
      son funciones que se llaman antes y después de que se ejecuten las llamadas en sequelize.
    */
    hooks : {
      /*
        al hooks beforeCreate() recibe como parametro 'proyecto'
        el cual contiene los datos que voy a insertar antes de ser insertados
      */
      beforeCreate(proyecto) {
        const url = slug(proyecto.nombre).toLowerCase();//Creamos una url amigable a partir nombre del proyecto
      
        //le agregamos al objeto proyecto.url la url que acabamos de crear
        //shortid.generate() para generar un ID que me permita hacer única una URL
        proyecto.url = `${url}-${shortid.generate()}`;
      }
    }
});

module.exports = Proyecto;