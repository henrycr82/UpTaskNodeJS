import proyectos from './modulos/proyectos';
import tareas from './modulos/tareas';
import {actualizarAvance} from './funciones/avance';

document.addEventListener('DOMContentLoaded', ()  => {
    //Actualizamos el avance de las tareas. /public/js/funciones/avance.js
    actualizarAvance();
});