const { Sequelize } = require('sequelize');

require('./config.js');

const db = new Sequelize(process.env.BD, process.env.USUARIO, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: 'mysql'/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});


/*const db = new Sequelize('bmv9bfa9jjztxzlsbpdt', 'ujghevgwwr1jpkre', 'iE4Jq2PHISyaOjIz2UTe', {
  host: 'bmv9bfa9jjztxzlsbpdt-mysql.services.clever-cloud.com',
  dialect: 'mysql' //one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' 
});*/

/*const db = new Sequelize('uptasknode', 'root', 'Daniel@310815', {
  host: 'localhost',
  dialect: 'mysql'//one of 'mysql' | 'mariadb' | 'postgres' | 'mssql'
});*/

module.exports = db;