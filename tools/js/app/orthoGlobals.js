module.exports.drawGridLines = true;
module.exports.drawGridLines_Diagonal = false;
module.exports.drawLines = true;
module.exports.drawElements = true;
module.exports.drawSelectiveGridLines=false;

module.exports.scaleMin=0.25;
module.exports.scaleMax=1.0;


var glyphNames = [
"Person A","Person B","Object X","Object Y","blank",//0-4
"Identity","Good","Alter","Collection","Event",//5-9
"Necessary","Friend","Ask","Want","Power",//10-14
"See","Say","Touch","Hear","Eat",//15-19
"Know","Smell","Time","Action","Go",//20-24
"Size","Pain","Ease","Cause","Able",//25-29
"Sex","Internal","Familiar","Living","Read",//30-34
];

for (var i=0;i<glyphNames.length;i++){
    glyphNames[i]=glyphNames[i].toUpperCase();
}

module.exports.glyphNames=glyphNames

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

module.exports.canvas=null;
module.exports.ctx=null;



module.exports.cellSize=55;

module.exports.symbolCount=35;
module.exports.highlightedglyphicon=-1;

