var glob = require('./app/orthoGlobals')
var lib = require('./orthoLib')
var Canvas = require('canvas')
var Image = Canvas.Image

function initOrthoRender(){
    var canvasDimensions = lib.canvasSize();

    lib.setOffsetToTopLeft();


    glob.canvas = new Canvas(canvasDimensions[0], canvasDimensions[1])
    glob.ctx = glob.canvas.getContext('2d');
}


module.exports.initOrthoRender=initOrthoRender