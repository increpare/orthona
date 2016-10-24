var glyphNames = [
"PersonA","PersonB","ThingA","ThingB","blank",//0-4
"Identity","","","","",//5-9
"","","","","",//10-14
"","","","","",//15-19
"","","","","",//20-24
"","","","","",//25-29
"","","","","",//30-34
];

var sketchBookIndex=0;
var sketchBook=[
{
    elements:[],
    lines:[],
    offsetX:0,
    offsetY:0,
    scale:1,
    sketchTitle:""
}
];

var page=sketchBook[0];

var canvas;
var ctx;

var scaleMin=0.25;
var scaleMax=1.0;
var iconSelect=false;
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

var cellSize=55;

var symbolCount=35;
var highlightedglyphicon=-1;

var mousex=0;
var mousey=0;
var startPosX=0;
var startPosY=0;