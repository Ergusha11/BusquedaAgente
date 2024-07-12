// script.js
import {Agente} from './agente.js';

const movimientos = [
	{ x: -1, y: 0 }, // Movimiento hacia la izquierda
	{ x: 1, y: 0 },  // Movimiento hacia la derecha
	{ x: 0, y: -1 }, // Movimiento hacia arriba
	{ x: 0, y: 1 }   // Movimiento hacia abajo
];

const obstaculo = 'images/obstaculo.jpg';
const muestra = 'images/Muestra.webp';
const destino = 'images/Nave.webp';

let matrizAsociada = [];
let agenteArray = [];
let destinoArray = [];

let agente = {
    url: 'images/Agente.jpg' // URL de la imagen del agente
};

document.addEventListener('DOMContentLoaded', function() {
    generarTablero();
});

document.addEventListener('DOMContentLoaded',function(){
    document.getElementById('btnInicio').addEventListener('click', function() {
        //alert("El botón fue presionado!");
        let intervalId = setInterval(moverImagen, 200);
        //setTimeout(() => clearInterval(intervalId), 3000); 
        //moverImagen()
    });    
});

function colocarImagen(celda) {
    const fila = celda.dataset.fila;
    const columna = celda.dataset.columna;
    //const opcionSeleccionada = document.querySelector('input[name="imagen"]:checked').value;

    if (!matrizAsociada[fila][columna]) {
        const opcionSeleccionada = document.querySelector('input[name="imagen"]:checked').value;

		console.log(opcionSeleccionada);
        
        if (opcionSeleccionada === agente.url) {
			var x = parseInt(fila, 10);
			var y = parseInt(columna,10);
			const agente = new Agente(x,y);

			agenteArray.push(agente);
        }

		if(opcionSeleccionada === destino){
			var x = parseInt(fila, 10);
			var y = parseInt(columna,10);
			destinoArray.push({x,y});
		}

        celda.style.backgroundImage = `url('${opcionSeleccionada}')`;
        celda.style.backgroundSize = 'cover';
        celda.style.backgroundRepeat = 'no-repeat';

        matrizAsociada[fila][columna] = opcionSeleccionada;
    }
}

function generarTablero() {
    const tablero = document.getElementById('tablero');
    tablero.innerHTML = '';
    const fila = 10; // Tamaño fijo del tablero
    const columna = 18;
    matrizAsociada = new Array(fila).fill(0).map(() => new Array(columna).fill(null));

    tablero.style.gridTemplateColumns = `repeat(${columna}, 1fr)`;
    tablero.style.gridTemplateRows = `repeat(${fila}, 1fr)`;

    for(let i = 0; i < fila; i++) {
        for(let j = 0; j < columna; j++) {
            const celda = document.createElement('div');
            celda.classList.add('celda');
            celda.dataset.fila = i;
            celda.dataset.columna = j;
            celda.addEventListener('click', function() { colocarImagen(this); });
            tablero.appendChild(celda);
        }
    }
}

function posicionValida({ posicionX, posicionY }) {
    return posicionX >= 0 && posicionX < matrizAsociada.length &&
           posicionY >= 0 && posicionY < matrizAsociada[posicionX].length &&
		   matrizAsociada[posicionX][posicionY] !== obstaculo;
}

function distanceManhattan(agente,origen){
	return Math.abs(agente.x - origen.x) + Math.abs(agente.y - origen.y);
}

function caminoDestino(agente){
	let min = Infinity; // Inicializar max con un valor muy pequeño
    let posicionX, posicionY;
    let mejorMovimiento = null; // Para almacenar el mejor movimiento válido
	destinoArray.forEach(destino => {
		movimientos.forEach(movimiento => {
			posicionX = agente.x + movimiento.x;
			posicionY = agente.y + movimiento.y;
			if(posicionValida({ posicionX, posicionY }) && !agente.haVisitado(posicionX, posicionY)){
				let distancia = distanceManhattan({ x: posicionX, y: posicionY }, destino);
				if(distancia <= 2){
					agente.resetCamino();
				}

				if(distancia < min){
					min = distancia;
                    mejorMovimiento = { x: posicionX, y: posicionY };
				}
			}
		});
	})

	return mejorMovimiento;
}

function obtenerNuevaPosicionAleatoria(agente) {
    let posicionX, posicionY;
	do {
		const movimientoAleatorio = movimientos[Math.floor(Math.random() * movimientos.length)];
		posicionX = agente.x + movimientoAleatorio.x;
		posicionY = agente.y + movimientoAleatorio.y;
	} while (!posicionValida({ posicionX, posicionY }));

	return {posicionX,posicionY};
}

function moverImagen() {
	agenteArray.forEach(agente =>{
		let nuevaPosicion;
		if(!agente.muestra){
			nuevaPosicion = obtenerNuevaPosicionAleatoria(agente);

			if (matrizAsociada[agente.x][agente.y] !== destino) {
				actualizarCelda(agente.x, agente.y, null);
			}
			// Actualiza la matriz con la nueva posición del agente
			agente.x = nuevaPosicion.posicionX;
			agente.y = nuevaPosicion.posicionY;

			if(matrizAsociada[agente.x][agente.y] === muestra){
				agente.muestra = true;
			}

			if(matrizAsociada[agente.x][agente.y] !== destino){
				matrizAsociada[agente.x][agente.y] = agente.url;
				actualizarCelda(agente.x, agente.y, agente.url);
			}

		} else {
			if (matrizAsociada[agente.x][agente.y] !== destino && matrizAsociada[agente.x][agente.y] !== muestra) {
				actualizarCelda(agente.x, agente.y, null);
			}

			nuevaPosicion = caminoDestino(agente);
			if (nuevaPosicion) {
                agente.mover(nuevaPosicion.x, nuevaPosicion.y);

                if (matrizAsociada[agente.x][agente.y] === muestra) {
                    matrizAsociada[agente.x][agente.y] = muestra;
                    actualizarCelda(agente.x, agente.y, muestra);
                } else {
                    if (matrizAsociada[agente.x][agente.y] !== destino) {
                        matrizAsociada[agente.x][agente.y] = agente.url;
                        actualizarCelda(agente.x, agente.y, agente.url);
                    }
                }

                if (matrizAsociada[agente.x][agente.y] === destino) {
                    agente.resetCamino();
                    agente.muestra = false;
                }

            } else {
                agente.resetCamino();
                console.log("No hay movimientos válidos disponibles.");
            }
		}
	});
}


function actualizarCelda(x, y, imagenUrl) {
    const celda = document.querySelector(`.celda[data-fila="${x}"][data-columna="${y}"]`);
    if (celda) {
        celda.style.backgroundImage = imagenUrl ? `url('${imagenUrl}')` : 'none';
    }
}
