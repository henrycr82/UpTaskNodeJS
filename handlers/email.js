const nodemailer  = require("nodemailer");
const pug 		  = require("pug");
const juice 	  = require("juice");
const htmlToText  = require("html-to-text");
//const util		  = require("util");//Viene por defecto en node en versiones superios a la 8
const emailConfig = require("../config/email.js");

//generar Html
const generarHtml = (archivo, opciones = {}) => {
	const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
	return juice(html);
}

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass
    },
});

exports.enviar = async (opciones) => {

  const html = generarHtml(opciones.archivo, opciones)
  const text = htmlToText.fromString(html);
  
  
  await transport.sendMail({
    from: 'UpTask <no-replay@uptask.com>', 
	to: opciones.usuario.email, 
	subject: opciones.subject, 
	text, 
	html
  });

}

/*exports.enviar = async (opciones) => {

	const html = generarHtml(opciones.archivo, opciones)
  	const text = htmlToText.fromString(html);
  	
	let mailOptions = {
		from: 'UpTask <no-replay@uptask.com>', 
		to: opciones.usuario.emil, 
		subject: opciones.subject, 
		text, 
		html
	};

	const enviarEmail = util.promisify(transport.sendMail, transport);
	return enviarEmail.call(transport, mailOptions)

	//return transport.sendMail(mailOptions);
}*/



/*exports.enviar = async (opciones) => {
  
  let testAccount = await nodemailer.createTestAccount();
  const html = generarHtml(opciones.archivo, opciones)
  const text = htmlToText.fromString(html);
  
  let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass
    },
  });

  
  let info = await transporter.sendMail({
    from: 'UpTask <no-replay@uptask.com>', 
	to: opciones.usuario.emil, 
	subject: opciones.subject, 
	text, 
	html
  });

  console.log("Message sent: %s", info.messageId);
  
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

}*/

/*let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass
    },
});

//generar Html
const generarHtml = () => {
	const html = pug.renderFile(`${__dirname}/../views/emails/restablecer-password.pug`);
	return juice(html);
}

let mailOptions = {
	from: 'UpTask <no-replay@uptask.com>', 
	to: "1@1.com", 
	subject: "Password Reset", 
	text: "Cambio de Password", 
	html: generarHtml()
};

transport.sendMail(mailOptions);*/

