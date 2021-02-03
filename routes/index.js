const express =  require('express');
const router = express.Router() //Para el manejo de rutas

//Importamos via Destructuring express-validator
//Validaremos el campo 'nombre' que esta ubicado en el objeto 'body'
const { body } = require('express-validator');

//importamos los controladorores
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController.js');
const authController = require('../controllers/authController.js');

module.exports = function() {
	/////////Midelware para verificar que el usuario este autenticado (usuarioAutenticado)/////////
	
	//ruta para el home
	router.get('/', authController.usuarioAutenticado, proyectosController.proyectosHome);

	router.get('/nuevo-proyecto', authController.usuarioAutenticado, proyectosController.formularioProyecto);

	//Creamos una cadena de validación para el campo body('nombre'), que no es mas que un middleware
	//que se ejecuta antes de llamar al controlador
	router.post('/nuevo-proyecto', authController.usuarioAutenticado, body('nombre').not().isEmpty().trim().escape(), proyectosController.nuevoProyecto);

	//Listar proyectos
	router.get('/proyectos/:url', authController.usuarioAutenticado, proyectosController.proyectosPorUrl);

	//Actualizar el proyecto
	router.get('/proyecto/editar/:id', authController.usuarioAutenticado, proyectosController.formularioEditar);
	router.post('/nuevo-proyecto/:id', authController.usuarioAutenticado, body('nombre').not().isEmpty().trim().escape(), proyectosController.actualizarProyecto);

	//Eliminar Proyecto
	router.delete('/proyectos/:url', authController.usuarioAutenticado, proyectosController.eliminarProyecto);

	//Guardar Tareas
	router.post('/proyecto/:url', authController.usuarioAutenticado, tareasController.agregarTarea);

	//Actualizar Tareas
	router.patch('/tareas/:id', authController.usuarioAutenticado, tareasController.cambiarEstadoTarea);

	//Eliminar Tareas
	router.delete('/tareas/:id', authController.usuarioAutenticado, tareasController.eliminarTarea);

	//Crear nueva cuenta
	router.get('/crear-cuenta', usuariosController.formCrearCuenta);
	router.post('/crear-cuenta', usuariosController.crearCuenta);
	router.get('/confirmar/:email',usuariosController.confirmarCuenta);

	//Iniciair Sesión
	router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
	router.post('/iniciar-sesion', authController.autenticarUsuario);

	//Cerra Sesión
	router.get('/cerra-sesion', authController.cerrarSesion);

	//Resstablecer Password
	router.get('/restablecer', usuariosController.formRestablecerPassword);
	router.post('/restablecer', authController.enviarToken);
	router.get('/restablecer/:token', authController.valiadrTokenForm);
	router.post('/restablecer/:token', authController.actualizarPassword);

	//TEST
	router.get('/test', usuariosController.test);

	//retornamos el router
	return router;
}
