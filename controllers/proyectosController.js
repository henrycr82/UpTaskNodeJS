//Importamos el módelo
const Proyecto = require('../models/Proyecto'); 
const Tareas = require('../models/Tarea'); 

exports.proyectosHome = async (request, response) => {
	
	//Obtenemos todos los proyectos de un usuario
	//console.log(response.locals.usuario.id);
	//
	const usuarioId = response.locals.usuario.id;
	const proyectos = await Proyecto.findAll({ where : {usuarioId} });
	//respuesta del servidor. render('index') muestra el html que tiene index.pug
	// nombrePagina : 'Proyectos' parametro que le paso a la vista index.pug
	// proyectos : todos los proyectos que tengo en la bd, se los paso a la vista layout.pug
	response.render('index' , {
		nombrePagina : 'Proyectos',
		proyectos
	});
}

exports.formularioProyecto = async (request, response) => {

	//Obtenemos todos los proyectos de un usuario
	//console.log(response.locals.usuario.id);
	//
	const usuarioId = response.locals.usuario.id;
	const proyectos = await Proyecto.findAll({ where : {usuarioId} });

	response.render('nuevoProyecto' , {
		nombrePagina : 'Nuevo Proyecto',
		proyectos
	});
}

exports.nuevoProyecto = async (request, response) => {
	//request.body para leer los parametros que pasamos via post
	
	//Obtenemos todos los proyectos de un usuario
	//console.log(response.locals.usuario.id);
	//
	const usuarioId = response.locals.usuario.id;
	const proyectos = await Proyecto.findAll({ where : {usuarioId} });
	
	//asignamos por destructuring
	const { nombre } = request.body;

	let errores = [];

	if (!nombre) {
		errores.push({'texto':'El Nombre del Proyecto no puede estra vacio'});
	}

	if(errores.length > 0) {

		response.render('nuevoProyecto', {
			nombrePagina : 'Nuevo Proyecto',
			errores,
			proyectos
		});
	} else {
		
		//Insertando en la BD con Promise
		/*
		Proyecto.create({ nombre })
			.then(() => console.log('Se inserto correctamente'))
			.catch( error => console.log('Error: ', error))
		*/
		//Insertando en la BD con Async Await 
		//Los nombres de los campos que voy a insertar deben ser los mismos que tengo en la BD
		const usuarioId = response.locals.usuario.id;
		await Proyecto.create({ nombre, usuarioId });
		response.redirect('/');//Redireccionamos al home
	}
	
}

exports.proyectosPorUrl = async (request, response, next) => {
	//para obtener el valor que nos llega por la url
	//request.params.url
	
	//Obtenemos todos los proyectos de un usuario
	//console.log(response.locals.usuario.id);
	//
	const usuarioId = response.locals.usuario.id;
	const proyectosPromise = Proyecto.findAll({ where : {usuarioId} });
	
	//response.send(request.params.url);
	//Buscamos por la url del proyecto
	const proyectoPromise = Proyecto.findOne({
		where : {
			url : request.params.url,
			usuarioId
		}
	});

	//Asignación por Destruccturing
	const [proyectos,proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);

	//Consultamos las tareas asignadas al proyecto (por el id del proyecto)
	const tareas = await Tareas.findAll({
		where : {
			proyectoId : proyecto.id
		}//,
		//Incluimos el módelo Proyecto en la consulta
		//include : [ { model : Proyecto }]
	});

	//Si no se encuentra el proyecto se va al siguiente Middleware
	if(!proyecto) return next();

	//render a la vista
	response.render('tareas', {
		nombrePagina : 'Tareas del Proyecto',
		proyecto,
		proyectos,
		tareas
	});
}

exports.formularioEditar = async (request, response) => {

	//Obtenemos todos los proyectos de un usuario
	//console.log(response.locals.usuario.id);
	//
	const usuarioId = response.locals.usuario.id;
	const proyectosPromise = await Proyecto.findAll({ where : {usuarioId} });

	//Obtenemos un proyecto por ID
	const proyectoPromise = Proyecto.findOne({
		where : {
			id : request.params.id,
			usuarioId
		}
	});

	//Asignación por Destruccturing
	const [proyectos,proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);

	//render a la vista
	response.render('nuevoProyecto' , {
		nombrePagina : 'Editar Proyecto',
		proyectos,
		proyecto
	});
}

exports.actualizarProyecto = async (request, response) => {
	//request.body para leer los parametros que pasamos via post
	
	//Obtenemos todos los proyectos de un usuario
	//console.log(response.locals.usuario.id);
	//
	const usuarioId = response.locals.usuario.id;
	const proyectos = await Proyecto.findAll({ where : {usuarioId} });
	
	//asignamos por destructuring
	const { nombre } = request.body;

	let errores = [];

	if (!nombre) {
		errores.push({'texto':'El Nombre del Proyecto no puede estra vacio'});
	}

	if(errores.length > 0) {

		response.render('nuevoProyecto', {
			nombrePagina : 'Nuevo Proyecto',
			errores,
			proyectos
		});
	} else {
		
		//Insertando en la BD con Promise
		/*
		Proyecto.create({ nombre })
			.then(() => console.log('Se inserto correctamente'))
			.catch( error => console.log('Error: ', error))
		*/
		//Actualizabdo en la BD con Async Await 
		await Proyecto.update(
			{ nombre },
			{ where : { id: request.params.id } }
		);
		response.redirect('/');//Redireccionamos al home
	}
	
}

exports.eliminarProyecto = async (request, response, next) => {

	//console.log(request.params);//Veo la variable que paso por la url, en este caso { url: 'tienda-virtual' }
	//console.log(request.query);//Veo la variable que construyo en (public/js/modulos/proyectos.js), en esta caso { urlProyecto: 'tienda-virtual' }

	//Obtenemos los datos por Destructuring
	const { urlProyecto } = request.query;

	//Eliminamos el proyecto
	const resultado = await Proyecto.destroy({where: { url : urlProyecto }});

	//Si ocurre algún error mandamos a ejecutar el siguiente middleware del lado del cliente (public/js/modulos/proyectos.js)
	if (!resultado) { return next(); }

	response.status(200).send('El proyecto se ha eliminado satisfactoriamente.')

}
