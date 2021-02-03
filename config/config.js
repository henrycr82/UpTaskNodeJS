//puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//variables de Base de datos
if (process.env.NODE_ENV==='dev') {   
    process.env.BD='uptasknode';
	process.env.USUARIO='root';
	process.env.PASSWORD='Daniel@310815';
	process.env.HOST='localhost';
} else {
    //urlDB=process.env.MONGO_URI;//process.env.MONGO_URI variable de entorno personalizadas Heroku para laurl de conexión de producción
	process.env.BD='bmv9bfa9jjztxzlsbpdt';
	process.env.USUARIO='ujghevgwwr1jpkre';
	process.env.PASSWORD='iE4Jq2PHISyaOjIz2UTe';
	process.env.HOST='bmv9bfa9jjztxzlsbpdt-mysql.services.clever-cloud.com';
}