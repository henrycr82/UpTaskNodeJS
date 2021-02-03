const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db');
const Proyecto = require('./Proyecto');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios', {
  id: {
    type: DataTypes.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(60),
    allowNull : false, //Para que el campo no se pueda almacenar vacio
    validate : {
        isEmail: {
          msg : 'Agrega un correo válido'
        },
        notEmpty : {
          msg : 'El email no puede estar vacio'
        }
    },
    unique : {
        args: true,
        msg : 'Correo ya registrado'
    }
  },
  password: {
    type: DataTypes.STRING(60),
    allowNull : false, //Para que el campo no se pueda almacenar vacio
    validate : {
      notEmpty : {
        msg : 'El password no puede estar vacio'
      }
    }
  },
  activo: {
    type: DataTypes.INTEGER(),
    defaulValue: 0
  },
  token: DataTypes.STRING(),
  expiracion: DataTypes.DATE
},{

    /*
      Los hooks (también conocidos como eventos del ciclo de vida), 
      son funciones que se llaman antes y después de que se ejecuten las llamadas en sequelize.
    */
    hooks : {
      /*
        al hooks beforeCreate() recibe como parametro 'usuario'
        el cual contiene los datos que voy a insertar
      */
      beforeCreate(usuario) {
        
        /*console.log('Insertando en la base de datos');
        console.log(usuario);*/
        //hash de contraseña
        usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));

      }
    }

});

//Métodos perzonalizados
//prototype hace queel método perzonalizado verificarPassword sea parte del objeto Usuarios
Usuarios.prototype.verificarPassword = function(password) {
  //compara el parametro 'password' con el 'this.password' alamcenado en la BD para un usuario
  return bcrypt.compareSync(password, this.password);//Retorna 'true' o 'false'
}

//Un Usuarios puede crear uno o varios proyectos
Usuarios.hasMany(Proyecto);

module.exports = Usuarios;