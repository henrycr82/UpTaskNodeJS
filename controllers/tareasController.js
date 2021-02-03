const Proyecto = require('../models/Proyecto');
const Tareas = require('../models/Tarea'); 

exports.agregarTarea =  async (request, response, next) => {

	//Obtenemos el parametro 'url' que nos llega por la url
	const url = request.params.url;

	//Obtenemos el proyecto actual por el parametro URL
	const proyecto = await Proyecto.findOne({
		where : {
			url
		}
	});
	//Id del poyecto
	const proyectoId = proyecto.id;

	//leer el valor del input de la vista tareas.pug
	const {tarea} = request.body;

	//Inicializamos el valor del estado. estado 0 = Incompleto
	const estado = 0;

	//Insertar en la BD
	const resultado = await Tareas.create({tarea, estado, proyectoId});

	//Si ocurre algún error mandamos a ejecutar el siguiente middleware
	if (!resultado) { return next(); }
		
	//Redireccionamos a la pagina donde cargamos las tareas proyectosPorUrl
	response.redirect(`/proyectos/${url}`);

}

exports.cambiarEstadoTarea =  async (request, response, next) => {

	//obtenemos por Destruccturing el ID que nos llega por la url
	const { id } = request.params;

	//Buscamos la tarea que vamos a actualizar
	const tarea = await Tareas.findOne({ where : {id} });

	//cambiar el estado de la tarea
	let estado = 0;
	if (tarea.estado === estado) { estado = 1 }
	tarea.estado = estado;

	//guardamos los cambios
	const resultado = await tarea.save();

	//Si no hay resultado retornamos un next() para que no se ejecute nuestra respuesta
	if (!resultado) return next();

	response.status(200).send('Tarea actualizada satisfactoriamente.')
}


exports.eliminarTarea = async (request, response, next) => {

	//console.log(request.params);//Veo la variable que paso por la url, en este caso { id: 2 }
	//console.log(request.query);//Veo la variable que construyo en (public/js/modulos/tareas.js), en esta caso { idTarea: 2 }

	//Obtenemos los datos por Destructuring
	const { idTarea } = request.query;

	//Eliminamos la tarea
	const resultado = await Tareas.destroy({where: { id : idTarea }});

	//Si ocurre algún error mandamos a ejecutar el siguiente middleware del lado del cliente (public/js/modulos/tareas.js)
	if (!resultado) { return next(); }

	response.status(200).send('La tarea se ha eliminado satisfactoriamente.')
	//response.send(`ID de la Tarea a Eliminar: ${idTarea} desde el controlador`);

}