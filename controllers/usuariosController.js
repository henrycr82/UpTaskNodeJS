//Importamos el módelo
const Usuarios = require('../models/Usuarios.js'); 
const enviarEmail = require('../handlers/email');


exports.formCrearCuenta = (request, response) => {

	response.render('crearCuenta', {
		nombrePagina : 'Crear Cuenta en UpTask'
	});
}

exports.formIniciarSesion = (request, response) => {

	//Para ver los errores
	//console.log(response.locals.mensajes);
	const { error } = response.locals.mensajes;

	response.render('iniciarSesion', {

		nombrePagina : 'Iniciar Sesión en UpTask',
		error
	});
}

exports.crearCuenta = async (request, response) => {

	//asignamos por destructuring los campos que recibimos via post
	const { email, password} = request.body;

	try {
		
		//Creamos el usuario
		await Usuarios.create({
			email, 
			password
		});

		//crear una URL de confirmación
		const confirmarUrl = `http://${request.headers.host}/confirmar/${email}`;

		//crear el objeto de usuario
		const usuario = {
			email
		}
		//enviar email
		await enviarEmail.enviar({
			usuario,
			subject: 'Confirmar Email para Crear tu Cuenta UpTask',
			confirmarUrl,
			archivo: 'confirmar-cuenta'
		});	
		
		//redirigir 
		request.flash('correcto', 'Se envió un mensaje a tu correo para confirmar tu cuenta');
		response.redirect('/iniciar-sesion')

	} catch (error) {
		//errors tambień viene del modelo Usuario
		//genero un objeto de errores y los almaceno en error
		request.flash('error', error.errors.map(error => error.message));
		response.render('crearCuenta', {
			nombrePagina : 'Crear Cuenta en UpTask',
			//errores : error.errors
			mensajes : request.flash(),//paso los errores a la vista
			email, 
			password
			// email y password los enviamos a la vista para que
			// cuando exista algún error en alguno de esos campos 
			// (email y password) el contenido del campo que no tenga 
			// errores no se borre
		});
	}

	
	
}

exports.formRestablecerPassword  = (request, response) => {
	response.render('restablecer' , {
		nombrePagina : 'Restablecer Password'
	});
}

exports.confirmarCuenta = async (request, response) => {
	//response.json(request.params.email);
	
	//verificar que el usuario exita
	const usuario = await Usuarios.findOne({ 
		where : {
			email : request.params.email
		}
	});

	//si no existe el usuario
	if (!usuario)
	{
		request.flash('error', 'Acción no permitida');
		response.redirect('/crear-cuenta');

	}

	//seteamos el estado del usuario
	usuario.activo=1;

	//guardamos
	await usuario.save();

	//redireccionamos al inicio de sesión
	request.flash('correcto', 'Cuenta Activa');
	response.redirect('/iniciar-sesion');

}

exports.test = (request, response) => {

	const palabra = 'javascriptloops';
	response.send(`Palabra: ${palabra}`);

	/*
	

	const s = 'javascriptloops';

	s.forEach( ( letra ) => {
	   console.log(letra);
	});

	var array = s.split(new RegExp("[ \n]+"));

	 console.log(array);

	for (var i=0; i < arrayS .length; i++) {
	      
		document.write(arrayDeCadenas[i] + " / ");
	 }

	const s = 'javascriptloops';

	var array = s.split(new RegExp("[ \n]+"));

	// Print array
	console.log(array);

	// Print each of its elements on a new line
	for (let value of array) {
		console.log(value);
	 }

	const ss = 'javascriptloops';
	const array11 = ss.trim().toLowerCase().split('');

	const array22 = array11.sort();

	array.forEach( ( letra ) => {
	   console.log(letra);
	});

	array22.forEach(element => console.log(element));

	const cadena = 'javascriptloops';
	const arr1 = cadena.trim().toLowerCase().split('');
	const arrVocales = arr1.search(/[aeiou]/g);
	arrVocales.forEach(element => console.log(element));



	
	 */
}