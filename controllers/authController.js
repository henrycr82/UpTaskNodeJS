const passport = require('passport'); //Importamos la dependencia passport
const { Op } = require("sequelize");//Para los operadores de validación
const crypto = require('crypto');//para generar el token
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

//Importamos el módelo Usuarios
const Usuarios = require('../models/Usuarios.js'); 

exports.autenticarUsuario = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/iniciar-sesion',
	failureFlash: true,
	badRequestMessage: 'Ambos Campos son Obligatorios'
});

//Función para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (request, response, next) => {

	//Si el usuario esta autenticado, OK
	if (request.isAuthenticated()) {
		return next();
	}

	//Sino esta autenticado, redirigir a /iniciar-sesion
	return response.redirect('/iniciar-sesion');
}

//Función para cerra sesión
exports.cerrarSesion = (request, response) => {
	request.session.destroy(()=> {
		response.redirect('/iniciar-sesion');	
	})	
}

//Genera un Token si el usuario es valido
exports.enviarToken = async (request, response) => {

	//verificar que el usuario exita
	const usuario = await Usuarios.findOne({ 
		where : {
			email : request.body.email
		}
	});
	
	if (!usuario)
	{
		request.flash('error', 'Correo no registrado');
		//puedo cambiar el response.render por response.redirect
		//pero no pasariá el email 
		//si uso el redirect no hace falta el 'else'
		//response.redirect('/restablecer');
		response.render('restablecer' , {
			nombrePagina : 'Restablecer Password',
			mensajes: request.flash(),
			email : request.body.email
		});

	}
	
	//Generamos el token
	usuario.token = crypto.randomBytes(20).toString('hex');

	//Generamos la expiración del token
	usuario.expiracion = Date.now() + 3600000;

	console.log(`Token:  ${usuario.token}`);
	console.log(`Expiracion:  ${usuario.expiracion}`);
	/*await Usuarios.create({
			email, 
			password
		});*/
	//guardamos
	await usuario.save();
	//await usuario.save({ fields: ['token','expiracion'] });

	
	//construimos la url
	const resetUrl = `http://${request.headers.host}/restablecer/${usuario.token}`;
	//response.redirect(resetUrl);
	//response.json(usuario);
	//
	await enviarEmail.enviar({
		usuario,
		subject: 'Resetear Password',
		resetUrl,
		archivo: 'restablecer-password'
	});	

	//redireccionamos al inicio de sesión
	request.flash('correcto', 'Se envió un mensaje a tu correo para restablecer el Password');
	response.redirect('/iniciar-sesion');
}

exports.valiadrTokenForm = async (request, response) => {
	//response.json(request.params.token);

	//verificar que el usuario exista
	const usuario = await Usuarios.findOne({ 
		where : {
			token : request.params.token
		}
	});

	//Si no encuentro al usuario en la BD
	if (!usuario)
	{
		request.flash('error', 'Acción no permitida');
		response.redirect('/restablecer');
	}

	//formulario para restablecer el password
	response.render('resetPassword',{
		nombrePagina : 'Restablecer Password'
	})
	
}

exports.actualizarPassword = async (request, response) => {
	//request.body.password request.params.token
	//response.json(request.body.password);
	
	//verificar que el usuario exista y que el token no haya expirado
	const usuario = await Usuarios.findOne({ 
		where : {
			token : request.params.token,
			expiracion: {
				[Op.gte]: Date.now()
			}
			
		}
	});

	//Si no encuentro al usuario en la BD
	if (!usuario)
	{
		request.flash('error', 'Token Expiró');
		response.redirect('/restablecer');
	}

	//hashear el nuevo password
	usuario.password = bcrypt.hashSync(request.body.password, bcrypt.genSaltSync(10));
	usuario.token=null;//Reseteamos el token
	usuario.expiracion=null;//Reseteamos la fwcha de expiración

	//guardamos
	await usuario.save();

	//redireccionamos al inicio de sesión
	request.flash('correcto', 'Password modificado correctamente');
	response.redirect('/iniciar-sesion');

}
