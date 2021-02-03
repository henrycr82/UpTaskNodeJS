import Swal from 'sweetalert2';
import axios from 'axios';

//botón eliminar proyecto de la vista views/tareas.pug
const btnEliminar = document.querySelector('#eliminar-proyecto');

//si exite el botón eliminar en la vista
if (btnEliminar) {
	//Evento click
	btnEliminar.addEventListener('click', evento => {

		//para obtener el atributo perzonalizado 'data-proyecto-url' de la vista 'tareas.pug'
		const urlProyecto = evento.target.dataset.proyectoUrl;

		//console.log(urlProyecto);

		//para que no se siga ejecutando el código
		//return;

		//código de sweetaelert
		Swal.fire({
	  		title: '¿Deseas borrar este proyecto?',
	  		text: "!Un proyecto eliminado no se puede recuperar!",
	  		icon: 'warning',
	  		showCancelButton: true,
	  		confirmButtonColor: '#3085d6',
	  		cancelButtonColor: '#d33',
	  		confirmButtonText: '!Si, Borrar!',
	  		cancelButtonText: '!No, Cancelar!'
		}).then((result) => {
	  		if (result.isConfirmed) {

	  			//enviar petición por Axios
	  			
	  			//construimos la url del proyecto
	  			//location.origin me retorna 'http://localhost:3000' o la url base del proyecto
	  			const url = `${location.origin}/proyectos/${urlProyecto}`;

	  			//enviando la petición
	  			axios.delete(url, { params: {urlProyecto}})
	  				.then(function(respuesta){
	  					
	  					console.log(respuesta);

	  					Swal.fire(
	      					'!Proyecto Eliminado!',
	      					respuesta.data,
	      					'success'
	    				)

	    				//redireccionamos al Home
			    		setTimeout(() => {
			    			window.location.href = "/"
			    		}, 3000)

	  				})
	  				.catch(()=> {
	  					Swal.fire({
	      					type:'error',
	      					title:'Hubo un error',
	      					text:'!No se pudo eliminar el Proyecto¡'
	    				})
	  				});
	    		
	  	}
		})
	});
}

export default btnEliminar;