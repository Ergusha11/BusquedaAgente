export class Agente {
    url = 'images/Agente.jpg'; // URL de la imagen del agente
	muestra = false;
	
	constructor(x,y) {
		this.x = x;
		this.y = y;
		this.caminoRecorrido = new Set();
	}

	mover(nuevaX, nuevaY) {
        this.x = nuevaX;
        this.y = nuevaY;
		this.caminoRecorrido.add(`${nuevaX},${nuevaY}`);
    }

	getPosition(){
		return {x:this.x,y:this.y};
	}

	haVisitado(x, y) {
        return this.caminoRecorrido.has(`${x},${y}`);
    }

	resetCamino() {
        this.caminoRecorrido = new Set(); // Asignar un nuevo Set vacío
        this.caminoRecorrido.add(`${this.x},${this.y}`); // Agregar la posición actual
    }
}
