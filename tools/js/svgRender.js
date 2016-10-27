var lib = require('./orthoLib')

var pentagon = [
    0,-1000,
    -951,-309,
    -588,809,
    588,809,
    951,-309
];

var triangle = [
    0,-1000,
    -866,500,
    866,500
];

const DOC_CELLSIZE=1.0;
const DOC_PADDING=0.75;
const STROKE_WIDTH=0.05;

function svgRender(){  
    var [top,bottom,left,right] = lib.getBounds();
    var w = right-left+1;
    var h = bottom-top+1;
    const docWidth=w*DOC_CELLSIZE+2*DOC_PADDING;
    const docHeight=h*DOC_CELLSIZE+2*DOC_PADDING;

    var svg="";
    svg+="<?xml version='1.0' standalone='yes'?>\n";
    svg+="<parent xmlns='http://example.org'\n";
    svg+="\txmlns:svg='http://www.w3.org/2000/svg'>\n";
    svg+="\t<!-- parent contents here -->\n";
    svg+="\t<svg:svg width='${docWidth}cm' height='${docHeight}cm' viewBox='0 0 %f %f' version='1.1'>\n"

    svg+="\t</svg:svg>\n";
    svg+="\t<!-- ... -->\n";
    svg+="</parent>";
    return svg;
}

module.exports.render = svgRender;