// VARIABLES GLOBALES

let pasos = [];
let parado = [];

let imgFondo;
let imgDialogo; 
let imgCartel; 
let imgGlobo; 

// Variables de movimiento y posición
let posX = 0;
let veloz = 1.2; 
let recorrido = 0.5;
let fondoX = 0;
let anchoMuñeco = 140;

// Variables del globo 
let globoX = 850; 
let globoY = 30; 
let globoVelX = 0.9; 
let globoVelY = 0.4; 
let dirGloboY = 1; 
let anchoGlobo = 60; 

// Animación de caminata 
let adelante = 0;
let pasoT = 0;
let Tmira = 120;

let estado = 'CAMINANDO_1'; 
let tiempoEstado = 0; 

// Variables de zoom y transición
let zoomActual = 1.0;
let zoomObjetivo = 1.25; 
let zoomProg = 0;    


function preload() {
  imgFondo = loadImage('fondo.jpg');
  imgDialogo = loadImage('dialogo.png');
  imgCartel = loadImage('cartel.png');
  imgGlobo = loadImage('globo.png');
  
  for (let i = 0; i < 3; i++) {
    pasos[i] = loadImage('img_' + (i + 1) + '.png');
  }
  
  for (let i = 0; i < 2; i++) {
    parado[i] = loadImage('img_' + (i + 4) + '.png');
  }
}

function setup() {
  createCanvas(800, 600);
  frameRate(60); 
  
  tiempoEstado = millis(); 
  pasoT = millis();
}


function draw() {
  background(220);

  let tiempoActual = millis();

  // CONTROL DE ANIMACIÓN DE PIERNAS 
  if (tiempoActual - pasoT > Tmira) {
    adelante = (adelante + 1) % pasos.length; 
    pasoT = tiempoActual;
  }

  // MÁQUINA DE ESTADOS
  let imgADibujar;

  if (estado === 'CAMINANDO_1') {
    imgADibujar = pasos[adelante];
    posX += veloz;
    fondoX -= (veloz * recorrido);

    if (posX >= (width / 2) - (anchoMuñeco / 2)) {
      estado = 'PARADO_CUATRO';
      tiempoEstado = tiempoActual;
    }

  } else if (estado === 'PARADO_CUATRO') {
    imgADibujar = parado[0]; 

    if (tiempoActual - tiempoEstado > 1000) { 
      estado = 'PARADO_CINCO';
      tiempoEstado = tiempoActual;
    }

  } else if (estado === 'PARADO_CINCO') {
    imgADibujar = parado[1]; 

    if (tiempoActual - tiempoEstado > 3000) { 
      estado = 'CAMINANDO_2';
      tiempoEstado = tiempoActual;
    }

  } else if (estado === 'CAMINANDO_2') {
    imgADibujar = pasos[adelante];
    posX += veloz;
    fondoX -= (veloz * recorrido);

    if (posX > width * 0.55) {
      if (zoomProg < 1) {
        zoomProg += 0.01;
      } else {
        estado = 'CARTEL_FINAL';
        tiempoEstado = tiempoActual;
      }
    }

  } else if (estado === 'CARTEL_FINAL') {
    imgADibujar = pasos[adelante];
    posX += veloz;

    if (tiempoActual - tiempoEstado > 3000 && posX > width) {
      posX = -anchoMuñeco;
      fondoX = 0;
      globoX = 850;
      globoY = 30;
      dirGloboY = 1;
      zoomProg = 0;
      zoomActual = 1.0;
      estado = 'CAMINANDO_1';
      tiempoEstado = tiempoActual;
    }
  }

  // MOVIMIENTO DEL GLOBO 
  globoX -= globoVelX;
  globoY += globoVelY * dirGloboY;

  if (globoY > 65 || globoY < 15) {
    dirGloboY *= -1;
  }

  // FONDO Y PARALLA
  let anchoFondo = ancho(imgFondo, height);
  let limiteFondo = anchoFondo - width;
  
  if (fondoX <= -limiteFondo) {
    fondoX = -limiteFondo;
  }

  push();
  let xCentrado = -(anchoFondo - width) / 2;
  let xFondoZoom = lerp(fondoX, xCentrado, zoomProg);
  zoomActual = lerp(1.0, zoomObjetivo, zoomProg);

  translate(width / 2, height / 2);
  scale(zoomActual);
  translate(-width / 2, -height / 2);
  
  image(imgFondo, xFondoZoom, 0, anchoFondo, height);
  pop();

  // DIBUJAR GLOBO FLotante
  if (globoX > -anchoGlobo) {
    dibujar(imgGlobo, globoX, globoY, anchoGlobo);
  }

  // DIBUJAR PERSONAJE Y DIÁLOGO
  if (posX <= width + anchoMuñeco) {
    let muñecoAlto = alto(imgADibujar, anchoMuñeco);
    let muñecoY = height - muñecoAlto - 220;

    if (estado === 'PARADO_CINCO') {
      let dialogoAncho = 750;
      let dialogoX = (width / 2) - (dialogoAncho / 2);
      let dialogoY = muñecoY + muñecoAlto - 10;
      
      dibujar(imgDialogo, dialogoX, dialogoY, dialogoAncho);
    }

    dibujar(imgADibujar, posX, muñecoY, anchoMuñeco);
  }

  // CARTEL FINAL
  if (zoomProg > 0) {
    let cartelAncho = 500;
    let cartelAlto = alto(imgCartel, cartelAncho);

    push();
    translate(width / 2, height / 2);
    scale(zoomProg);
    image(imgCartel, -cartelAncho / 2, -cartelAlto / 2, cartelAncho, cartelAlto);
    pop();
  }
}

// FUNCIONES ESENCIALES

function dibujar(img, x, y, tamaño) {
  let h = alto(img, tamaño);
  image(img, x, y, tamaño, h);
}

function alto(img, tamaño) {
  let factor = tamaño / img.width;
  return img.height * factor;
}

function ancho(img, tamañoAlto) {
  let factor = tamañoAlto / img.height;
  return img.width * factor;
}
