var lib = require('./orthoLib')
var glob = require('./orthoGlobals')

var pentagon = [
    0, -1000, 
    -951, -309, 
    -588, 809,
    588, 809,
    951, -309
];

var triangle = [
    0, -1000, 
    -866, 500,
    866, 500
];

var DOC_CELLSIZE = 20.0;
var DOC_PADDING = 0.75;
const STROKE_WIDTH = 1;

var fillCol="#ffffff"
var strokeCol="#000000"
var gridCol="#dcdcdc"

function toFixed(value, precision) {
    var power = Math.pow(10, precision || 0);
    return String(Math.round(value * power) / power);
}

//unnecessary, inliner does this already
function tof(value){
    return value;
    return toFixed(value,3)
}

Array.prototype.compileList = function(){
    var s = ""
    for (var i=0;i<this.length;i++){
        var e = this[i];
        if (isNaN(e)){
            s+=e
        } else {
            s+=tof(e)
        }
        s+=" "
    }
    return s;
}

function setPadding(p){
    DOC_PADDING=p;
}

function setColours(fill,stroke,grid){
    fillCol=fill
    strokeCol=stroke
    gridCol=grid
}

function tr(x) {
    return (x + DOC_PADDING) * DOC_CELLSIZE;
}

function polarToCartesian(centerX, centerY, radius, angleInRadians) {

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, radius, startAngle, endAngle) {

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

    var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].compileList();

    return d;
}

function shouldDrawGridLine(x1, y1, x2, y2) {
    if (glob.drawSelectiveGridLines === false) {
        return true;
    }
    for (var i = 0; i < glob.page.elements.length; i++) {
        var e = glob.page.elements[i];
        var ex = tr(e[0]);
        var ey = tr(e[1]);
        if (lib.PointOnLine([ex, ey], [x1, y1, x2, y2])) {
            return true;
        }
    }
    return false;
}

function drawIcon(x, y, icon) {
    var oldDCS = DOC_CELLSIZE;
    DOC_CELLSIZE *= 0.8;
    var result = "";
    switch (icon) {

        case -2://right button
        {
            var s = -DOC_CELLSIZE/3;
            result += `\t\t<path stroke-linejoin="round" stroke-linecap="round" stroke-width='${STROKE_WIDTH}' fill='transparent' stroke='${strokeCol}' d='`;
            result += [
              "M", x+s, y,
              "L", x-s, y,
              "L", x-s/2, y-s,
              "M", x-s, y,
              "L", x-s/2, y+s,
              "'/>\n"].compileList();
            break;     
        }
        case 0: //square - solid
            {
                var s = DOC_CELLSIZE * 0.3 / 1.41;
                result += `\t\t<rect stroke-width='${STROKE_WIDTH}' x='${tof(x-s)}' y='${tof(y-s)}' width='${tof(2*s)}' height='${tof(2*s)}' fill='${strokeCol}' stroke='${strokeCol}' />\n`;
                break;
            }
        case 1: //place marker - solid
            {
                var r = DOC_CELLSIZE * 0.4 * 0.9;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${strokeCol}' stroke='${strokeCol}' d='`;
                result += [
                  "M", x, y+r,
                  "L", x-r/2, y,
                  "C", x-r, y-r, x+r, y-r, x+r/2, y,
                  "Z",
                  "'/>\n"].compileList();
                break;
            }
        case 2: //liquid - drop
            {

                var r = DOC_CELLSIZE * 0.4 * 0.9;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                  "M", x, y-r,
                  "L", x-r/2, y,
                  "C", x-r, y+r, x+r, y+r, x+r/2, y,
                  "Z",
                  "'/>\n"].compileList();
                break;
            }
        case 3: //circle - outline
            {
                var r = DOC_CELLSIZE * 0.3;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${tof(x)}' cy='${tof(y)}' r='${tof(r)}' fill='${fillCol}' stroke='${strokeCol}' />\n`
                break;
            }
        case 4: //dot
            {
                if (glob.drawDots){
                    var r = DOC_CELLSIZE * 0.1;
                    result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${tof(x)}' cy='${tof(y)}' r='${tof(r)}' fill='${strokeCol}' stroke='${strokeCol}' />\n`
                }
                break;
            }
        case 5: //concentric circles
            {
                var r = DOC_CELLSIZE * 0.4;
                var oldR = r;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${tof(x)}' cy='${tof(y)}' r='${tof(r)}' fill='${fillCol}' stroke='${strokeCol}' />\n`
                r -= 0.333 * oldR;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${tof(x)}' cy='${tof(y)}' r='${tof(r)}' fill='${fillCol}' stroke='${strokeCol}' />\n`
                r -= 0.333 * oldR;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${tof(x)}' cy='${tof(y)}' r='${tof(r)}' fill='${fillCol}' stroke='${strokeCol}' />\n`
                break;
            }
        case 6: //diamond
            {
                var s = DOC_CELLSIZE * 0.4;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                  "M", x-s, y,
                  "L", x, y+s,
                  "L", x+s, y,
                  "L", x, y-s,
                  "Z",
                  "'/>\n"].compileList();
                break;
            }
        case 7: //triangle outline
            {
                var s = DOC_CELLSIZE * 0.4 / 1000;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                  "M", x+triangle[2*0+0]*s, y+triangle[2*0+1]*s,
                  "L", x+triangle[2*2+0]*s, y+triangle[2*2+1]*s,
                  "L", x+triangle[2*1+0]*s, y+triangle[2*1+1]*s,
                  "Z",
                  "'/>\n"].compileList();
                break;
            }
        case 8: //square - outline
            {
                var s = DOC_CELLSIZE * 0.4 / 1.41;
                result += `\t\t<rect stroke-width='${STROKE_WIDTH}' x='${tof(x-s)}' y='${tof(y-s)}' width='${tof(2*s)}' height='${tof(2*s)}' fill='${fillCol}' stroke='${strokeCol}' />\n`
                break;
            }
        case 9: //star
            {
                var s = DOC_CELLSIZE * 0.4 / 1000;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                  "M", x+pentagon[2*0+0]*s, y+pentagon[2*0+1]*s,
                  "L", x+pentagon[2*2+0]*s, y+pentagon[2*2+1]*s,
                  "L", x+pentagon[2*4+0]*s, y+pentagon[2*4+1]*s,
                  "L", x+pentagon[2*1+0]*s, y+pentagon[2*1+1]*s,
                  "L", x+pentagon[2*3+0]*s, y+pentagon[2*3+1]*s,
                  "Z",
                  "'/>\n"].compileList();
                break;
            }
        case 10: //clover
            {
                var s = DOC_CELLSIZE * 0.2 / 1.41;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [ 
                  "M", x-s, y-s,
                  "C", x-2*s, y-3*s, x+2*s, y-3*s, x+s, y-s,
                  "C", x+3*s, y-2*s, x+3*s, y+2*s, x+s, y+s,
                  "C", x+2*s, y+3*s, x-2*s, y+3*s, x-s, y+s,
                  "C", x-3*s, y+2*s, x-3*s, y-2*s, x-s, y-s,
                  "Z",
                  "'/>\n"].compileList();
                break;
            }
        case 11: //interlocking circles
            {
                var r = DOC_CELLSIZE * 0.3;
                var r2 = 0.4 * DOC_CELLSIZE
                x -= r / 2;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${tof(x)}' cy='${tof(y)}' r='${r2}' fill='${fillCol}' stroke='transparent' />\n`
                x += r;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${tof(x)}' cy='${tof(y)}' r='${r2}' fill='${fillCol}' stroke='transparent' />\n`

                x -= r;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${tof(x)}' cy='${tof(y)}' r='${r2}' fill='white' stroke='${strokeCol}' />\n`
                x += r;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${tof(x)}' cy='${tof(y)}' r='${r2}' fill='white' stroke='${strokeCol}' />\n`
                break;
            }
        case 12: //keyhole
            {
                var r = DOC_CELLSIZE * 0.2;
                var s = DOC_CELLSIZE * 0.3;
                var t = DOC_CELLSIZE * 0.2;
                var a = 0.8 * Math.PI / 4;
                var dy = DOC_CELLSIZE * 0.05;

                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                  describeArc(x, y - r + dy, r, Math.PI / 2 + a, Math.PI * 5 / 2 - a),
                  "L", x-t, y+s+dy,
                  "L", x+t, y+s+dy,
                  "Z",
                  "'/>\n"].compileList();

                break;
            }
        case 13: //half-circle, outline
            {
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                var r = DOC_CELLSIZE * 0.3
                result += [
                  describeArc(x + r / 3, y, r, Math.PI / 2, 3 * Math.PI / 2),
                  "Z",
                  "'/>\n"].compileList();
                break;
            }
        case 14: //crown - outline
            {
                var s = DOC_CELLSIZE * 0.2 / 1.41;
                var t = DOC_CELLSIZE * 0.5 / 1.41;
                var pointHeight = DOC_CELLSIZE * 0.3 / 1.41;
                var l = x - t;
                var r = x + t;
                var apex = y - s - pointHeight;
                var pointBottom = y - s;
                var dy = DOC_CELLSIZE * 0.1 / 1.41;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", l, dy + apex,
                    "L", l, dy + y + s,
                    "L", r, dy + y + s,
                    "L", r, dy + apex,
                    "L", l * 0.25 + r * 0.75, dy + pointBottom,
                    "L", (l + r) / 2, dy + apex,
                    "L", l * 0.75 + r * 0.25, dy + pointBottom,
                    "Z",
                    "'/>\n"
                ].compileList();

                break;
            }
        case 15: //eye
            {
                var r = DOC_CELLSIZE * 0.4;
                var top = r * 0.8;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x - r, y,
                    "C", x - r / 2, y - top, x + r / 2, y - top, x + r, y,
                    "C", x + r / 2, y + top, x - r / 2, y + top, x - r, y,
                    "Z ",
                    "'/>\n"
                ].compileList();

                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${tof(x)}' cy='${tof(y)}' r='${r/4}' fill='transparent' stroke='${strokeCol}' />\n`

                break;
            }
        case 16: //nose
            {
                var r = DOC_CELLSIZE * 0.4 * 0.9;
                var dy = DOC_CELLSIZE * 0.4 * 0.1;
                y += dy;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x - r / 4, y - r,
                    "L", x - r / 2, y,
                    "C", x - r, y + r, x + r, y + r, x + r / 2, y,
                    "L", x + r / 4, y - r,
                    "'/>\n"
                ].compileList();
                break;
            }
        case 17: //hand
            {
                var s = DOC_CELLSIZE * 0.4 / 1.41;
                result += `\t\t<path stroke-linejoin="round" stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x - s * 0.8, y - 2 * s + s / 2,
                    "L", x - s * 0.8, y + s,
                    "L", x + s * 0.8, y + s,
                    "L", x + s * 0.8, y - s / 2,
                    "L", x - s / 4, y - s + s / 2,
                    "L", x - s / 4, y - 2 * s + s / 2,
                    "C", x - s / 4, y - 2 * s + s / 2 - s / 2, x - s * 0.8, y - 2 * s + s / 2 - s / 2, x - s * 0.8, y - 2 * s + s / 2,
                    "Z ",
                    "'/>\n"
                ].compileList();
                break
            }
        case 18: //ear
            {

                var dx = -DOC_CELLSIZE * 0.1 / 1.41;
                var e = DOC_CELLSIZE * 0.05 / 1.41;
                var s = DOC_CELLSIZE * 0.3 / 1.41;
                var t = DOC_CELLSIZE * 0.3 / 1.41;
                var u = DOC_CELLSIZE * 0.2 / 1.41;
                x += dx;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x, y - u,
                    "C", x - s, y - u, x - s, y - u - t, x, y - u - t,
                    "C", x + 2 * s, y - u - t, x + 2 * s, y + u + t, x, y + u + t,
                    "C", x - s, y + u + t, x - s, y + u, x, y + u,
                    "C", x + s / 2, y + u, x + s / 2, y - u, x, y - u,
                    "Z ",
                    "'/>\n"
                ].compileList();
                break
            }
        case 19: //teeth
            {
                var r = DOC_CELLSIZE * 0.4;
                var top = r * 0.8;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x - r, y,
                    "C", x - r / 2, y - top, x + r / 2, y - top, x + r, y,
                    "C", x + r / 2, y + top, x - r / 2, y + top, x - r, y,
                    "Z ",
                    "L", x + r, y,
                    "M", x, y - r / 2,
                    "L", x, y + r / 2,
                    "M", x - r / 2, y - r / 3,
                    "L", x - r / 2, y + r / 3,
                    "M", x + r / 2, y - r / 3,
                    "L", x + r / 2, y + r / 3,

                    "'/>\n"
                ].compileList();
                break;
            }
        case 20: //vertical eye                 
            {
                var r = DOC_CELLSIZE * 0.4;

                var top = r * 0.8;

                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x, y - r,
                    "C", x - top, y - r / 2, x - top, y + r / 2, x, y + r,
                    "C", x + top, y + r / 2, x + top, y - r / 2, x, y - r,
                    "Z ",
                    "'/>\n"
                ].compileList();

                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${tof(x)}' cy='${tof(y)}' r='${r/4}' fill='${strokeCol}' stroke='${strokeCol}' />\n`
                break;
            }

        case 21://scared
        {
            var r = DOC_CELLSIZE*0.1;
            var R = DOC_CELLSIZE*0.4;
            var s = DOC_CELLSIZE*0.1;
            var S = DOC_CELLSIZE*0.2;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M",x-R,y-S,
                    "C",x-R,y-S-s, x-R+2*R/3,y-S-s, x-R+2*R/3,y-S,
                    "C",x-R+2*R/3,y-S+s, x-R+4*R/3,y-S+s, x-R+4*R/3,y-S,
                    "C",x-R+4*R/3,y-S-s, x+R,y-S-s, x+R,y-S,
                    "L",x+R,y+S,
                    "C",x+R,y+S+s, x+R-2*R/3,y+S+s, x+R-2*R/3,y+S,
                    "C",x+R-2*R/3,y+S-s, x+R-4*R/3,y+S-s, x+R-4*R/3,y+S,
                    "C",x+R-4*R/3,y+S+s, x-R,y+S+s, x-R,y+S,
                    "Z ",
                    "'/>\n"
                ].compileList();
            break;   
        }

        case 22: //box with bent sides
            {
                var r = DOC_CELLSIZE * 0.3;
                var s = DOC_CELLSIZE * 0.3;
                var t = DOC_CELLSIZE * 0.05;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x - s, y - r,
                    "L", x + s, y - r,
                    //"C",x,y-t,x,y-t,x+s,y-r,    
                    "C", x + t, y, x + t, y, x + s, y + r,
                    "L", x - s, y + r,
                    //"C",x,y+t,x,y+t,x-s,y+r, 
                    "C", x - t, y, x - t, y, x - s, y - r,
                    "Z ",
                    "'/>\n"
                ].compileList();
                break;
            }

        case 23: //right-angled triangle
            {
                var s = DOC_CELLSIZE * 0.4 / 1.41;
                x -= DOC_CELLSIZE * 0.15 / 1.41;
                y -= DOC_CELLSIZE * 0.15 / 1.41;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x + s, y - s,
                    "L", x + s, y + s,
                    "L", x - s, y + s,
                    "Z ",
                    "'/>\n"
                ].compileList();
                break;
            }

        case 24: //banana peel
            {
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`

                var e = DOC_CELLSIZE * 0.1;
                var r = DOC_CELLSIZE * 0.4;
                var t = DOC_CELLSIZE * 0.4;
                var dy = -DOC_CELLSIZE * 0.1;
                var yc = y - dy;
                y += dy;
                result += [
                    "M", x - e, y - r / 2,
                    "C", x - 2 * e, y + r / 5, x - e / 5, y + r / 5, x - t, y + r,
                    "C", x, y + r, x - e / 5, y + r / 5, x, yc,

                    "C", x + e / 5, y + r / 5, x, y + r, x + t, y + r,
                    "C", x + e / 5, y + r / 5, x + 2 * e, y + r / 5, x + e, y - r / 2,
                    "Z ",
                    "'/>\n"
                ].compileList();
                break;
            }
        case 25: //hexagon
            {
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`

                var a = Math.PI / 3;
                var r = DOC_CELLSIZE * 0.4 / 1.41;
                ar = []
                for (var i = 0; i <= 6; i++) {
                    var px = r * Math.sin(i * a)
                    var py = r * Math.cos(i * a)
                    if (i === 0) {
                        ar.push("M", x + px, y + py)
                    } else {
                        ar.push("L", x + px, y + py)
                    }
                }
                ar.push("Z")
                for (var i = 0; i < 6; i += 2) {
                    var px = r * Math.sin(i * a);
                    var py = r * Math.cos(i * a);
                    ar.push("M", x, y);
                    ar.push("L", x + px, y + py);
                }
                result += ar.compileList() + "  '/>\n";
                break;
            }
        case 26: //arrow
            {
                var s = DOC_CELLSIZE * 0.4 / 1.41;
                var t = DOC_CELLSIZE * 0.4 / 1.41;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x - s, y - t,
                    "L", x, y - t / 3,
                    "L", x + s, y - t,
                    "L", x, y + t,
                    "Z ",
                    "'/>\n"
                ].compileList();
                break;
            }
        case 27: //diagonal flare            
            {
                var r = DOC_CELLSIZE * 0.4;
                var s = DOC_CELLSIZE * 0.4;
                var t = DOC_CELLSIZE * 0.05;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x - s, y - r,
                    "C", x, y - t, x, y - t, x + s, y - r,
                    "C", x + t, y, x + t, y, x + s, y + r,
                    "C", x, y + t, x, y + t, x - s, y + r,
                    "C", x - t, y, x - t, y, x - s, y - r,
                    "'/>\n"
                ].compileList();
                break;
            }
        case 28: //lambda            
            {
                var r = DOC_CELLSIZE * 0.4;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${tof(x)}' cy='${tof(y)}' r='${tof(r)}' fill='${fillCol}' stroke='${strokeCol}' />\n`
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='transparent' stroke='${strokeCol}' d='`
                result += [
                    "M", x - r / 1.414, y - r / 1.414,
                    "L", x + r / 1.414, y + r / 1.414,
                    "M", x, y + r,
                    "L", x, y,
                    "'/>\n"
                ].compileList();
                break;
            }

         case 29: //cross - outline
             {
                 var s = DOC_CELLSIZE * 0.15 / 1.41;
                 var t = 3 * s;
                 result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                 result += [
                     "M", x - s, y - s,
                     "L", x - s, y - t,
                     "L", x + s, y - t,
                     "L", x + s, y - s,
                     "L", x + t, y - s,
                     "L", x + t, y + s,
                     "L", x + s, y + s,
                     "L", x + s, y + t,
                     "L", x - s, y + t,
                     "L", x - s, y + s,
                     "L", x - t, y + s,
                     "L", x - t, y - s,
                     "Z ",
                     "'/>\n"
                 ].compileList();
 
                 break;
             }
        case 30: //yin yang
            {

                var r = DOC_CELLSIZE * 0.3
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${tof(x)}' cy='${tof(y)}' r='${tof(r)}' fill='${fillCol}' stroke='${strokeCol}' />\n`

                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${strokeCol}' stroke='transparent' d='`
                result += [
                  describeArc(x, y, r, 0, Math.PI),
                  "'/>\n"].compileList();
                var r2 = r - STROKE_WIDTH / 2;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x-r2/2}' cy='${tof(y)}' r='${r2/2}' fill='${strokeCol}' stroke='transparent' />\n`
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x+r2/2}' cy='${tof(y)}' r='${r2/2}' fill='${fillCol}' stroke='transparent' />\n`

                break;
            }

        case 31: //inside/outside box in box
            {
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                var s = DOC_CELLSIZE * 0.3;
                var ar = [
                    "M", x - s, y - s,
                    "L", x + s, y - s,
                    "L", x + s, y + s,
                    "L", x - s, y + s,
                    "Z "
                ]
                s *= 0.66;
                ar.push(
                    "M", x - s, y - s,
                    "L", x + s, y - s,
                    "L", x + s, y + s,
                    "L", x - s, y + s,
                    "Z ",
                    "'/>\n")
                result += ar.compileList();

                break;
            }
        case 32: // part/many division
            {
                var r = DOC_CELLSIZE * 0.4;

                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${tof(x)}' cy='${tof(y)}' r='${tof(r)}' fill='${fillCol}' stroke='${strokeCol}' />\n`


                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x - r, y,
                    "L", x + r, y,
                    "'/>\n"
                ].compileList();

                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${tof(x)}' cy='${y-r/2}' r='${r/5}' fill='${strokeCol}' stroke='transparent' />\n`
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${tof(x)}' cy='${y+r/2}' r='${r/5}' fill='${strokeCol}' stroke='transparent' />\n`


                break;
            }
        case 33: //desire spiral
            {
                var r = DOC_CELLSIZE * 0.4;
                result += `\t\t<path  stroke-linecap="round" stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    describeArc(x, y, r, 0, 2 * Math.PI),
                    "'/>\n"
                ].compileList();
                var r2 = r * 2 / 3;
                var r3 = r2 / 2;
                result += `\t\t<path  stroke-linecap="round" stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    describeArc(x, y + r - r2 - r3, r3, Math.PI / 2, Math.PI * 3 / 2),
                    describeArc(x, y + r - r2, r2, 3 * Math.PI / 2, Math.PI / 2),
                    describeArc(x, y, r, Math.PI / 2, 2 * Math.PI),
                    "'/>\n"
                ].compileList();


                break;
            }
        case 34: //pill
            {
                var s = DOC_CELLSIZE * 0.3 / 1.41;
                var t = DOC_CELLSIZE * 0.3 / 1.41;
                var u = DOC_CELLSIZE * 0.3 / 1.41;
                result += `\t\t<path stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M",x-s,y-u,
                    "L",x+s,y-u,
                    "L",x+s,y+u,

                    "M",x+s,y-u,
                    "C",x+s+t,y-u,x+s+t,y+u,x+s,y+u,

                    "L",x-s,y+u,
                    "L",x-s,y-u,

                    "M",x-s,y+u,
                    "C",x-s-t,y+u,x-s-t,y-u,x-s,y-u,
                    "'/>\n"
                ].compileList();
                

                break;
            }
        case 35://documentation circle /w letter A inside
            {
                result += `\t\t<circle stroke-width='0.4' cx='${tof(x)}' cy='${tof(y)}' r='7' fill='${fillCol}' stroke='${strokeCol}' />\n`
                result += `<text fill='${strokeCol}' font-size="12px" x="${x}" y="${y+4}"  font-family="Helvetica" text-anchor="middle">A</text>\n`
                break
            }
        case 36://documentation circle /w letter B inside
            {
                result += `\t\t<circle stroke-width='0.4' cx='${tof(x)}' cy='${tof(y)}' r='7' fill='${fillCol}' stroke='${strokeCol}' />\n`
                result += `<text fill='${strokeCol}' font-size="12px" x="${x}" y="${y+4}"  font-family="Helvetica" text-anchor="middle">B</text>\n`
                break
            }
        case 37://documentation circle /w letter C inside
            {
                result += `\t\t<circle stroke-width='0.4' cx='${tof(x)}' cy='${tof(y)}' r='7' fill='${fillCol}' stroke='${strokeCol}' />\n`
                result += `<text fill='${strokeCol}' font-size="12px" x="${x}" y="${y+4}"  font-family="Helvetica" text-anchor="middle">C</text>\n`
                break
            }
        case 38://documentation circle /w letter D inside
            {
                result += `\t\t<circle stroke-width='0.4' cx='${tof(x)}' cy='${tof(y)}' r='7' fill='${fillCol}' stroke='${strokeCol}' />\n`
                result += `<text fill='${strokeCol}' font-size="12px" x="${x}" y="${y+4}"  font-family="Helvetica" text-anchor="middle">D</text>\n`
                break
            }
        case 39://documentation circle /w letter E inside
            {
                result += `\t\t<circle stroke-width='0.4' cx='${tof(x)}' cy='${tof(y)}' r='7' fill='${fillCol}' stroke='${strokeCol}' />\n`
                result += `<text fill='${strokeCol}' font-size="12px" x="${x}" y="${y+4}"  font-family="Helvetica" text-anchor="middle">E</text>\n`
                break
            }
        case 40://documentation circle /w letter F inside
            {
                result += `\t\t<circle stroke-width='0.4' cx='${tof(x)}' cy='${tof(y)}' r='7' fill='${fillCol}' stroke='${strokeCol}' />\n`
                result += `<text fill='${strokeCol}' font-size="12px" x="${x}" y="${y+4}"  font-family="Helvetica" text-anchor="middle">F</text>\n`
                break
            }
        case 41://documentation circle /w letter G inside
            {
                result += `\t\t<circle stroke-width='0.4' cx='${tof(x)}' cy='${tof(y)}' r='7' fill='${fillCol}' stroke='${strokeCol}' />\n`
                result += `<text fill='${strokeCol}' font-size="12px" x="${x}" y="${y+4}"  font-family="Helvetica" text-anchor="middle">G</text>\n`
                break
            }
        case 42://documentation circle /w letter H inside
            {
                result += `\t\t<circle stroke-width='0.4' cx='${tof(x)}' cy='${tof(y)}' r='7' fill='${fillCol}' stroke='${strokeCol}' />\n`
                result += `<text fill='${strokeCol}' font-size="12px" x="${x}" y="${y+4}"  font-family="Helvetica" text-anchor="middle">H</text>\n`
                break
            }
        default:
            { //circle
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${tof(x)}' cy='${tof(y)}' r='${0.4*DOC_CELLSIZE}' fill='transparent' stroke='${strokeCol}' />\n`
                break;
            }
    }

    DOC_CELLSIZE = oldDCS;
    return result;
}


function renderSquare(s){

    var canvasDimensions = [10*glob.cellSize,10*glob.cellSize];

    var Canvas = require('canvas')
    var Image = Canvas.Image

    canvas = new Canvas(canvasDimensions[0], canvasDimensions[1])
    ctx = canvas.getContext('2d');
    lib.CenterPortrait(s);
    return renderMain();
}

function svgRender() {
    var canvasDimensions = lib.canvasSize();

    var Canvas = require('canvas')
    var Image = Canvas.Image

    canvas = new Canvas(canvasDimensions[0], canvasDimensions[1])
    ctx = canvas.getContext('2d');

    lib.MoveOriginToTopLeft()
    return renderMain();
}

function renderMain(){

    var [top, bottom, left, right] = lib.getBounds();
    var w = right - left ;
    var h = bottom - top ;
    const docWidth = (w + 2 * DOC_PADDING) * DOC_CELLSIZE;
    const docHeight = (h + 2 * DOC_PADDING) * DOC_CELLSIZE;

    var svg = "";
    svg += `<svg preserveAspectRatio="xMidYMid" xmlns="http://www.w3.org/2000/svg" 
     xmlns:xlink="http://www.w3.org/1999/xlink" width='${docWidth}mm' height='${docHeight}mm' viewBox='0 0 ${docWidth} ${docHeight}' version='1.1'>\n`
    

    if (glob.drawGridLines) {
        //draw gui
        var ar = []
        var startX = -(DOC_PADDING + 0.5) * DOC_CELLSIZE;
        var startY = -(DOC_PADDING + 0.5) * DOC_CELLSIZE;

        for (var i = startX; i < docWidth; i += DOC_CELLSIZE) {
            var [x1, y1] = [i, 0]
            var [x2, y2] = [i, ctx.canvas.height]
            if (shouldDrawGridLine(x1, y1, x2, y2)) {
                ar.push(
                    "M", x1, y1,
                    "L", x2, y2
                )
            }
        }
        for (var j = startY; j < docHeight; j += DOC_CELLSIZE) {
            var [x1, y1] = [0, j];
            var [x2, y2] = [ctx.canvas.width, j];
            if (shouldDrawGridLine(x1, y1, x2, y2)) {
                ar.push(
                    "M", x1, y1,
                    "L", x2, y2
                )
            }
        }
        //log(adjustX+","+adjustY)
        if (glob.drawGridLines_Diagonal) {
            for (var i = startX; i < canvas.width; i += DOC_CELLSIZE) {
                var [x1, y1] = [i, startY];
                var [x2, y2] = [i + 2 * docHeight, startY + 2 * docHeight];
                if (shouldDrawGridLine(x1, y1, x2, y2)) {
                    ar.push(
                        "M", x1, y1,
                        "L", x2, y2
                    )
                }
            }
            for (var i = startX - DOC_CELLSIZE; i > -canvas.height; i -= DOC_CELLSIZE) {
                var [x1, y1] = [i, startY];
                var [x2, y2] = [i + 2 * docHeight, startY + 2 * docHeight];
                if (shouldDrawGridLine(x1, y1, x2, y2)) {
                    ar.push(
                        "M", x1, y1,
                        "L", x2, y2
                    )
                }
            }
            for (var i = startX - DOC_CELLSIZE; i > -canvas.height; i -= DOC_CELLSIZE) {
                var [x1, y1] = [i, startY + 2 * docHeight];
                var [x2, y2] = [i + 2 * docHeight, startY];
                if (shouldDrawGridLine(x1, y1, x2, y2)) {
                    ar.push(
                        "M", x1, y1,
                        "L", x2, y2
                    )
                }
            }
        }
        var pc = 1 - (glob.page.scale - glob.scaleMin) / (glob.scaleMax - glob.scaleMin);
        if (pc > 1) {
            pc = 1;
        }
        if (pc < 0) {
            pc = 0;
        }

        ar.push("'/>\n");

//#dcdcdc
//        var a = Math.round(220 + 35 * pc).toString(16);
//        var col = "#" + a + a + a;
//        log ("oldcol="+col)
        col=gridCol;
        svg += `\t\t<path stroke-linecap="round" stroke-width='${STROKE_WIDTH}' fill='transparent' stroke='${col}' d='`;
        svg += ar.compileList();
    }

    //draw lines
    if (glob.drawLines) {
        svg += `\t\t<path stroke-linecap="round" stroke-width='${STROKE_WIDTH}' fill='transparent' stroke='${strokeCol}' d='`;
        for (var i = 0; i < glob.page.lines.length; i++) {
            var l = glob.page.lines[i];
            var x1 = Math.floor(tr(l[0]));
            var y1 = Math.floor(tr(l[1]));
            var x2 = Math.floor(tr(l[2]));
            var y2 = Math.floor(tr(l[3]));
            svg += "M " + x1 + " " + y1 + " ";
            svg += "L " + x2 + " " + y2 + " ";

            if (l[4] === 1) {
                var mx = (x1 + x2) / 2;
                var my = (y1 + y2) / 2;
                var t = Math.atan2(x2 - x1, y2 - y1);
                var dx = Math.sin(t + Math.PI / 2);
                var dy = Math.cos(t + Math.PI / 2);

                var x1 = mx - dx * DOC_CELLSIZE / 5
                var y1 = my - dy * DOC_CELLSIZE / 5
                var x2 = mx + dx * DOC_CELLSIZE / 5
                var y2 = my + dy * DOC_CELLSIZE / 5
                svg += "M " + x1 + " " + y1 + " ";
                svg += "L " + x2 + " " + y2 + " ";
            }
        }
        svg += "'/>\n";
    }

    //draw elements

    if (glob.drawElements) {
        for (var i = 0; i < glob.page.elements.length; i++) {
            var e = glob.page.elements[i];
            var ocs = DOC_CELLSIZE;
            svg += drawIcon(tr(e[0]), tr(e[1]), e[2]);
        }
    }

    svg += "\t</svg>";
    return svg;
}
module.exports.render = svgRender;
module.exports.renderSquare = renderSquare;
module.exports.setPadding = setPadding
module.exports.setColours = setColours