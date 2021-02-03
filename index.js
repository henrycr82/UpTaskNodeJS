const express = require('express');

require('./config/config.js');

//importamos nuestro archivo de rutas
const routes = require('./routes')

//Para trabajar con rutas de archivos y directorios 
const path = require('path');

//Para tener acceso al objeto req.body cuando hago una petición post.
const bodyParser = require('body-parser');

//Para mostrar mensajes en la pantalla bajo ciertas condiciones.
const flash = require('connect-flash');

const session = require('express-session');

const cookieParser = require('cookie-parser');

const passport =  require('./config/passport.js');

//helpers con algunas funciones
const helpers= require('./helpers')

//Conexión a la BD
const db = require('./config/db');

//Importar los modelos
require('./models/Usuarios.js');
require('./models/Proyecto');
require('./models/Tarea');

// db.authenticate() para probar la conexión a la BD
// db.sync() para ejecutar la estructura de nuestro módelo (crea la tabla si no existe) 

db.sync()
	.then(() => console.log('Conexión exitosa con la BD.'))
	.catch(error => console.error('Error al tratar de conectar con la BD:', error))

//creamos la app
const app = express();

//Donde cargar los archivos estaticos
app.use(express.static('public'));

//Habilitar el template engine Pug
app.set('view engine', 'pug');

//Habilitamos body-parser para leer datos desde las vistas
app.use(bodyParser.urlencoded({extended: true}));

//Añadir la carpeta de las vistas
//__dirname directorio principal o raíz de mi proyecto
app.set('views', path.join(__dirname, './views'));

//agregar flash messages
app.use(flash());

app.use(cookieParser());

//para navegar en distintas páginas sin volvernos a autenticar
app.use(session({
	secret: 'supersecreto',//me ayuda a firmar la cookie
	//Para mantener la sessión activa así el usuario no este haciendo nada en app
	resave: false,
	saveUninitialized: false
}));

//Arrancamos una instancia de passport
app.use(passport.initialize());
app.use(passport.session());

// Función de middleware para Pasar var dump  a la aplicación
app.use((request, response, next) => {

	response.locals.vardump = helpers.vardump;//Hacemos que la función 'vardump' del archivo 'helpers' este disponible en toda la aplicación
	response.locals.mensajes = request.flash();//Hacemos que la función 'mensajes' este disponible en toda la aplicación
	//console.log(request.user);//para ver los datos de la variable de sesion
	//si la variable de sesion existe hacemos una copia exacta de la misma {...} caso contrario almacenamos un null
	response.locals.usuario = {...request.user} || null;
	//console.log(response.locals.usuario);
	next();//para pasar el control a la siguiente línea app.use(bodyParser...)
});



//hacemos uso de nuestro archivo de rutas
app.use('/', routes());

//escuchamos por el puerto 3000
//app.listen(3000);

//de la variable global process.env.PORT leemos el puerto
//ella se encuentra en config/config.js
app.listen(process.env.PORT, () => {
    console.log('Escuchando por el puertooooo:', process.env.PORT);
});

require('./handlers/email');