import Swal from 'sweetalert2';
import axios from 'axios';
import {actualizarAvance} from '../funciones/avance';

//listado-pendientes de la vista views/tareas.pug
const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
	//event delegation
	tareas.addEventListener('click', evento => {
		//console.log(evento.target.classList);
		//far.fa-check-circle.completo
		//far.fa-check-circle
		//fas.fa-trash
		//
		const icono 	= evento.target;
		const idTarea 	= icono.parentElement.parentElement.dataset.tarea;
		
		//Si hago clic en el icono de Actualizar
		if (icono.classList.contains('fa-check-circle')) {
			//console.log('Actualizar',idTarea);

			//request hacia /tareas/:id (tareasController.cambiarEstadoTarea)
			const url = `${location.origin}/tareas/${idTarea}`;

			axios.patch(url, { idTarea })
	  				.then(function(respuesta){
	  					//Si recicibimos el status 200
	  					//Actualizamos la clase el icono de Actualizar
	  					//de fa-check-circle a fa-check-circle.completo
	  					if (respuesta.status===200) {
	  						icono.classList.toggle('completo');

	  						//Actualizamos el avance de las tareas. /public/js/funciones/avance.js
    						actualizarAvance();
	  					}

	  				})
	  				.catch(()=> {
	  					console.log('Hubo un erro');
	  				});
		}

		//Si hago clic en el icono de Eliminar
		if (icono.classList.contains('fa-trash')) {
			
			const tareaHTML = icono.parentElement.parentElement;
			/*console.log(`ID a Eliminar ${idTarea}`);
			console.log(tareaHTML);*/

			//código de sweetaelert
			Swal.fire({
		  		title: '¿Deseas borrar esta tarea?',
		  		text: "!Un tarea eliminada no se puede recuperar!",
		  		icon: 'warning',
		  		showCancelButton: true,
		  		confirmButtonColor: '#3085d6',
		  		cancelButtonColor: '#d33',
		  		confirmButtonText: '!Si, Borrar!',
		  		cancelButtonText: '!No, Cancelar!'
			}).then((result) => {
		  		if (result.isConfirmed) {

		  			//console.log('Eliminación Confirmada');

		  			//enviar petición por Axios
		  			
		  			//construimos la url
		  			//location.origin me retorna 'http://localhost:3000' o la url base del proyecto
		  			
		  			const url = `${location.origin}/tareas/${idTarea}`;

		  			
		  			//enviando la petición
		  			axios.delete(url, { params: {idTarea}})
		  				.then(function(respuesta){
		  					
		  					//console.log(respuesta);
		  					//console.log(respuesta.status);

		  					if (respuesta.status === 200) {

		  						//Eliminar el nodo
		  						//console.log(tareaHTML);
		  						//console.log(tareaHTML.parentElement);
		  						tareaHTML.parentElement.removeChild(tareaHTML);

		  						Swal.fire(
			      					'!Tarea Eliminada!',
			      					respuesta.data,
			      					'success'
			    				)

			    				//Actualizamos el avance de las tareas. /public/js/funciones/avance.js
    							actualizarAvance();
		  					}

		  				})
		  				.catch(()=> {
		  					Swal.fire({
		      					type:'error',
		      					title:'Hubo un error',
		      					text:'!No se pudo eliminar la Tarea'
		    				})
		  				});
		    		
		  	}
			})


		}

	});
}

export default tareas