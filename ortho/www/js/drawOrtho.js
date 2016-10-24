var fs = require('fs');
eval(fs.readFileSync('orthoGlobals.js')+'');
eval(fs.readFileSync('orthoRender.js')+'');
eval(fs.readFileSync('orthoLob.js')+'');

loadFile("dat/test1.json");

var canvasDimensions = canvasSize();

var Canvas = require('canvas')
  , Image = Canvas.Image
canvas = new Canvas(200, 200)
ctx = canvas.getContext('2d');


ctx.font = '30px Impact';
ctx.fillText("Awesome!", 50, 100);

var te = ctx.measureText('Awesome!');
ctx.strokeStyle = 'rgba(0,0,0,0.5)';
ctx.beginPath();
ctx.lineTo(50, 102);
ctx.lineTo(50 + te.width, 102);
ctx.stroke();


drawIcon(cellSize,cellSize,10);

console.log('<img src="' + canvas.toDataURL() + '" />');