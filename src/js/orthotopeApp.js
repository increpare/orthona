log=console.log

const cellSize = glob.cellSize;
var iconSelect=false;

const scaleMin=glob.scaleMin;
const scaleMax=glob.scaleMax;
var toolbarSelect=false;


var hx=0;
var hy=0;
var oldX=0;
var oldY=0;
var oldtouches=null;
var cleared=false;
var moved=false;


var moving=false;
var minDist=5.0;
var minDistHit=false;

var mousex=0;
var mousey=0;
var startPosX=0;
var startPosY=0;

var UndoStack = []

var ctx
function doStart(){
    canvas = document.getElementById("mainCanvas");
    ctx=glob.canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    function handleKeyDown(evt){
        if (evt.keyCode===13){
            //return
            //
        } 
    }

    renderApp();
}

function renderApp(){
    if (!canvas.getContext) {
        return;
    }
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;    

    ctx.fillStyle = "#ffffff";

    ctx.strokeStyle="#000000";

    ctx.fillRect(0, 0, canvas.width, canvas.height);  

    ctx.beginPath();
    ctx.moveTo(0,0);      
    ctx.lineTo(canvas.width,canvas.height)
    ctx.stroke()
}

window.onload = doStart
window.onresize = renderApp