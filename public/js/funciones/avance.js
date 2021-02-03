import Swal from 'sweetalert2';

export const actualizarAvance = () => {

	//Seleccionar tareas exitentes (las etiquetas 'li' con la clase 'tarea') de la vista views/tareas.pug
	const tareas = document.querySelectorAll('li.tarea');


	//Si hay tareas
	if (tareas.length) {

		//Seleccionar tareas completadas (las etiquetas 'i' con la clase 'completo') de la vista views/tareas.pug
		const tareasCompletas = document.querySelectorAll('i.completo');

		//Calcular avance
		const avance = Math.round((tareasCompletas.length / tareas.length) * 100);
		
		//Mostrar avance. etiqueta 'div' con el id 'porcentaje' de la vista views/tareas.pug
		const porcentaje = document.querySelector('#porcentaje');
		porcentaje.style.width = avance+'%';

		if (avance === 100) {

			Swal.fire(
				'!Tareas Completas!',
				'Felicitaciones, has completado todas tus tareas',
				'success'
			);
		}

	}
	
	
}