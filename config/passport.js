const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

//Refrencia la módelo al que vamos a autenticas
const Usuarios = require('../models/Usuarios.js');

//local strategy - Login con credenciales propias (emil y password)
passport.use(
	new localStrategy(
		{
			//por default passport espera un ususario y password. (nosotros usaremos email y password)
			usernameField: 'email',
			passwordField: 'password'
		},
		//done es como un next o un callback
		async (email, password, done) => {
			try {
				//Buscamos el usuarios Activos en la BD
				const usuario = await Usuarios.findOne({
					where: { 
						email,
						activo:1 
					}
				})

				//si el password es incorrecto
				if (!usuario.verificarPassword(password)) {
					//done(error, usuario, message(textualmente se escirbe así))
					return done(null, false, {
						message : 'Credenciales Invalidas'
					})
				}

				//Credenciales válidas
				//done(error, usuario, message(textualmente se escirbe así))
				return done(null, usuario);
				
			} catch (error) {
				//Si el usuario no existe o no esta activo
				//done(error, usuario, message(textualmente se escirbe así))
				return done(null, false, {
					message : 'Cuenta Invalida o No Verificada'
				})
			}
		} 
	)

);

//Serializar el usuario
passport.serializeUser((usuario, callback) => {
	//callback(error,usuario);
	callback(null,usuario);
});

//Deserializar el usuario
passport.deserializeUser((usuario, callback) => {
	//callback(error,usuario);
	callback(null,usuario);
});

//exportar
module.exports = passport;

