module.exports.drawGridLines = true;
module.exports.drawGridLines_Diagonal = false;
module.exports.drawLines = true;
module.exports.drawElements = true;
module.exports.drawSelectiveGridLines=false;

module.exports.glyphNames = [
"PersonA","PersonB","ThingA","ThingB","blank",//0-4
"Identity","","","","",//5-9
"","","","","",//10-14
"","","","","",//15-19
"","","","","",//20-24
"","","","","",//25-29
"","","","","",//30-34
];

module.exports.sketchBookIndex=0;
module.exports.sketchBook=[
{
    elements:[],
    lines:[],
    offsetX:0,
    offsetY:0,
    scale:1,
    sketchTitle:""
}
];


module.exports.page=module.exports.sketchBook[0];

module.exports.canvas;
module.exports.ctx;

module.exports.scaleMin=0.25;
module.exports.scaleMax=1.0;
module.exports.iconSelect=false;
module.exports.toolbarSelect=false;

module.exports.hx=0;
module.exports.hy=0;
module.exports.oldX=0;
module.exports.oldY=0;
module.exports.oldtouches=null;
module.exports.cleared=false;
module.exports.moved=false;


module.exports.moving=false;
module.exports.minDist=5.0;
module.exports.minDistHit=false;

module.exports.cellSize=55;

module.exports.symbolCount=35;
module.exports.highlightedglyphicon=-1;

module.exports.mousex=0;
module.exports.mousey=0;
module.exports.startPosX=0;
module.exports.startPosY=0;
