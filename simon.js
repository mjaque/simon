"use strict"

window.onload = init

//Constantes
const WIDTH = 800
const HEIGHT = 600
const PLAY_RADIO = 75
const PLAY_LADO = 75
const MARGIN = 10
const BOTON_LADO = 200
const TIEMPO = 500		//milisegundos

//Variables - Objetos
var canvas
var game = {
	state: 'wait',
	actual: 0,
	seq: []
}
var audios = []
audios[0] = new Audio('error.mp3');
audios[1] = new Audio('do.mp3');
audios[2] = new Audio('mi.mp3');
audios[3] = new Audio('sol.mp3');
audios[4] = new Audio('si.mp3');

function init(){	
	canvas = document.getElementById('canvas')
	canvas.width = WIDTH
	canvas.height = HEIGHT
	canvas.ctx = canvas.getContext('2d')
	
	//Control de Eventos
	window.onclick = clickHandler

	//Inicio del Juego
	draw(null)
}

function draw(activeButton){
	canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);	//Borramos
	
	//Botón central
	if (game.state == 'wait')
		canvas.ctx.fillStyle = 'white'
	else if (activeButton == 0)
		canvas.ctx.fillStyle = 'red'
	else
		canvas.ctx.fillStyle = 'grey'
	canvas.ctx.beginPath()
	canvas.ctx.arc(WIDTH/2, HEIGHT/2 , PLAY_RADIO , 0, 2*Math.PI)	//cx, cy, radio, start_angle, end_angle
	canvas.ctx.fill()
	
	if (activeButton != null){
		audios[activeButton].play()
	}

	
	//Play del botón
	if (game.state == 'wait'){
		canvas.ctx.fillStyle = 'lime'
		canvas.ctx.beginPath()
		var playHeight = PLAY_LADO * Math.sin(Math.PI/3)
		canvas.ctx.moveTo(WIDTH/2 + playHeight * 2/3, HEIGHT/2)
		canvas.ctx.lineTo(WIDTH/2 - playHeight / 3, HEIGHT/2 - PLAY_LADO / 2)
		canvas.ctx.lineTo(WIDTH/2 - playHeight / 3, HEIGHT/2 + PLAY_LADO / 2)
		canvas.ctx.fill();
	}
	
	//Botones de juego
	if (activeButton == 1)
		canvas.ctx.fillStyle = 'lime'
	else
		canvas.ctx.fillStyle = '#aaffaa'
	canvas.ctx.beginPath()
	canvas.ctx.arc(WIDTH/2, HEIGHT/2,  PLAY_RADIO + MARGIN, -Math.PI / 2, 0 )	//cx, cy, radio, start_angle, end_angle
	canvas.ctx.lineTo(WIDTH/2 + BOTON_LADO + MARGIN, HEIGHT/2)
	canvas.ctx.arc(WIDTH/2, HEIGHT/2,  PLAY_RADIO + MARGIN + BOTON_LADO, 0, -Math.PI / 2, true)	//cx, cy, radio, start_angle, end_angle
	canvas.ctx.fill();
		
	if (activeButton == 2)
		canvas.ctx.fillStyle = 'yellow'
	else
		canvas.ctx.fillStyle = '#ffffaa'
	canvas.ctx.beginPath()
	canvas.ctx.arc(WIDTH/2, HEIGHT/2,  PLAY_RADIO + MARGIN, 0, Math.PI / 2)	//cx, cy, radio, start_angle, end_angle
	canvas.ctx.lineTo(WIDTH/2, HEIGHT/2 + BOTON_LADO + MARGIN)
	canvas.ctx.arc(WIDTH/2, HEIGHT/2,  PLAY_RADIO + MARGIN + BOTON_LADO,Math.PI / 2, 0, true)	//cx, cy, radio, start_angle, end_angle
	canvas.ctx.fill();
		
	if (activeButton == 3)
		canvas.ctx.fillStyle = 'blue'
	else
		canvas.ctx.fillStyle = '#aaaaff'
	canvas.ctx.beginPath()
	canvas.ctx.arc(WIDTH/2, HEIGHT/2,  PLAY_RADIO + MARGIN, Math.PI / 2, Math.PI)	//cx, cy, radio, start_angle, end_angle
	canvas.ctx.lineTo(WIDTH/2 - BOTON_LADO - MARGIN, HEIGHT/2)
	canvas.ctx.arc(WIDTH/2, HEIGHT/2,  PLAY_RADIO + MARGIN + BOTON_LADO, Math.PI, Math.PI / 2,true)	//cx, cy, radio, start_angle, end_angle
	canvas.ctx.fill();

	if (activeButton == 4)
		canvas.ctx.fillStyle = 'red'
	else
		canvas.ctx.fillStyle = '#ffaaaa'
	canvas.ctx.beginPath()
	canvas.ctx.arc(WIDTH/2, HEIGHT/2,  PLAY_RADIO + MARGIN, Math.PI, -Math.PI / 2)	//cx, cy, radio, start_angle, end_angle
	canvas.ctx.lineTo(WIDTH/2, HEIGHT/2 - BOTON_LADO - MARGIN)
	canvas.ctx.arc(WIDTH/2, HEIGHT/2,  PLAY_RADIO + MARGIN + BOTON_LADO, -Math.PI/2, Math.PI,true)	//cx, cy, radio, start_angle, end_angle
	canvas.ctx.fill();
}

function play(){
	//Incrementamos la secuencia
	game.seq.push(parseInt(Math.random()*4) + 1)
	
	//Tocamos la secuencia
	game.actual = 0
	borrar()
	setTimeout(play1, TIEMPO)		//Esperamos para empezar
}

function play1(){
	draw(game.seq[game.actual])
	game.actual++;
	setTimeout(play2, TIEMPO)		
}

function play2(){
	borrar()
	if (game.actual < game.seq.length){
		setTimeout(play1, TIEMPO)
	}
	else{
		game.actual = 0
		game.state = 'response'
	}
}

function borrar(){
	if (game.seq[game.actual - 1])
		audios[game.seq[game.actual - 1]].pause()
	draw(null)
}

function clickHandler(event){
	
	//Si la distancia al centro es menor que PLAY_RADIO -> se pulsa el botón de inicio
	var rect = canvas.getBoundingClientRect();
	var punto = {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	}
	var centro = {
		x: WIDTH/2,
		y: HEIGHT/2
	}
	var d = distance(punto, centro)
	if (d < PLAY_RADIO){
		if (game.state == 'wait'){
			game.state = 'playing' 
			play()
		}
	}
	else{
		if (game.state == 'response'){
			var selected = null;
			if (d > PLAY_RADIO + MARGIN && d < PLAY_RADIO + MARGIN + BOTON_LADO){
				//Identificamos el botón pulsado
				if (punto.x > WIDTH/2)
					if (punto.y > HEIGHT/2){
						selected = 2
					}
					else
						selected = 1
				else
					if (punto.y > HEIGHT/2){
						selected = 3
					}
					else
						selected = 4
			}
			if (selected)
				if (selected == game.seq[game.actual]){
					draw(selected)
					game.actual++
					if (game.actual == game.seq.length){
						game.state = 'playing'
						setTimeout(play, 1000)
					}
				}
				else{
					draw(0)
					game.seq = []
					game.actual = 0
					game.state = 'wait'
					setTimeout(init, 1000)
				}
		}

	}
}

function distance(a, b){
	return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}
