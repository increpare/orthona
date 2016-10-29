var lib = require('./orthoLib')
var glob = require('./app/orthoGlobals')

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
    ].join(" ");

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
        case 0: //square - solid
            {
                var s = DOC_CELLSIZE * 0.3 / 1.41;
                result += `\t\t<rect stroke-width='${STROKE_WIDTH}' x='${x-s}' y='${y-s}' width='${2*s}' height='${2*s}' fill='${strokeCol}' stroke='${strokeCol}' />\n`;
                break;
            }
        case 1: //place marker - solid
            {
                var r = DOC_CELLSIZE * 0.4 * 0.9;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${strokeCol}' stroke='${strokeCol}' d='`;
                result += `M ${x} ${y+r} `
                result += `L ${x-r/2} ${y} `
                result += `C ${x-r} ${y-r}, ${x+r} ${y-r}, ${x+r/2} ${y} `
                result += "Z ";
                result += "'/>\n";
                break;
            }
        case 2: //liquid - drop
            {

                var r = DOC_CELLSIZE * 0.4 * 0.9;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += `M ${x} ${y-r} `
                result += `L ${x-r/2} ${y} `
                result += `C ${x-r} ${y+r}, ${x+r} ${y+r}, ${x+r/2} ${y} `
                result += "Z ";
                result += "'/>\n";
                break;
            }
        case 3: //circle - outline
            {
                var r = DOC_CELLSIZE * 0.3;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x}' cy='${y}' r='${r}' fill='${fillCol}' stroke='${strokeCol}' />\n`
                break;
            }
        case 4: //dot
            {
                var r = DOC_CELLSIZE * 0.1;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x}' cy='${y}' r='${r}' fill='${strokeCol}' stroke='${strokeCol}' />\n`
                break;
            }
        case 5: //concentric circles
            {
                var r = DOC_CELLSIZE * 0.4;
                var oldR = r;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x}' cy='${y}' r='${r}' fill='${fillCol}' stroke='${strokeCol}' />\n`
                r -= 0.333 * oldR;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x}' cy='${y}' r='${r}' fill='${fillCol}' stroke='${strokeCol}' />\n`
                r -= 0.333 * oldR;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x}' cy='${y}' r='${r}' fill='${fillCol}' stroke='${strokeCol}' />\n`
                break;
            }
        case 6: //diamond
            {
                var s = DOC_CELLSIZE * 0.4;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += `M ${x-s} ${y} `
                result += `L ${x} ${y+s} `
                result += `L ${x+s} ${y} `
                result += `L ${x} ${y-s} `
                result += "Z ";
                result += "'/>\n";
                break;
            }
        case 7: //triangle outline
            {
                var s = DOC_CELLSIZE * 0.4 / 1000;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += `M ${x+triangle[2*0+0]*s} ${y+triangle[2*0+1]*s} `
                result += `L ${x+triangle[2*2+0]*s} ${y+triangle[2*2+1]*s} `
                result += `L ${x+triangle[2*1+0]*s} ${y+triangle[2*1+1]*s} `
                result += "Z ";
                result += "'/>\n";
                break;
            }
        case 8: //square - outline
            {
                var s = DOC_CELLSIZE * 0.4 / 1.41;
                result += `\t\t<rect stroke-width='${STROKE_WIDTH}' x='${x-s}' y='${y-s}' width='${2*s}' height='${2*s}' fill='${fillCol}' stroke='${strokeCol}' />\n`
                break;
            }
        case 9: //star
            {
                var s = DOC_CELLSIZE * 0.4 / 1000;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += `M ${x+pentagon[2*0+0]*s} ${y+pentagon[2*0+1]*s} `
                result += `L ${x+pentagon[2*2+0]*s} ${y+pentagon[2*2+1]*s} `
                result += `L ${x+pentagon[2*4+0]*s} ${y+pentagon[2*4+1]*s} `
                result += `L ${x+pentagon[2*1+0]*s} ${y+pentagon[2*1+1]*s} `
                result += `L ${x+pentagon[2*3+0]*s} ${y+pentagon[2*3+1]*s} `
                result += "Z ";
                result += "'/>\n";
                break;
            }
        case 10: //clover
            {
                var s = DOC_CELLSIZE * 0.2 / 1.41;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += `M ${x-s} ${y-s} `
                result += `C ${x-2*s} ${y-3*s}, ${x+2*s} ${y-3*s}, ${x+s} ${y-s} `
                result += `C ${x+3*s} ${y-2*s}, ${x+3*s} ${y+2*s}, ${x+s} ${y+s} `
                result += `C ${x+2*s} ${y+3*s}, ${x-2*s} ${y+3*s}, ${x-s} ${y+s} `
                result += `C ${x-3*s} ${y+2*s}, ${x-3*s} ${y-2*s}, ${x-s} ${y-s} `
                result += "Z ";
                result += "'/>\n";
                break;
            }
        case 11: //interlocking circles
            {
                var r = DOC_CELLSIZE * 0.3;
                var r2 = 0.4 * DOC_CELLSIZE
                x -= r / 2;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x}' cy='${y}' r='${r2}' fill='${fillCol}' stroke='transparent' />\n`
                x += r;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x}' cy='${y}' r='${r2}' fill='${fillCol}' stroke='transparent' />\n`

                x -= r;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x}' cy='${y}' r='${r2}' fill='transparent' stroke='${strokeCol}' />\n`
                x += r;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x}' cy='${y}' r='${r2}' fill='transparent' stroke='${strokeCol}' />\n`
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
                result += describeArc(x, y - r + dy, r, Math.PI / 2 + a, Math.PI * 5 / 2 - a) + " "
                result += `L ${x-t} ${y+s+dy} `
                result += `L ${x+t} ${y+s+dy} `
                result += "Z ";
                result += "'/>\n";

                break;
            }
        case 13: //half-circle, outline
            {
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                var r = DOC_CELLSIZE * 0.3
                result += describeArc(x + r / 3, y, r, Math.PI / 2, 3 * Math.PI / 2);
                result += "Z ";
                result += "'/>\n";
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
                ].join(" ");

                break;
            }
        case 15: //eye
            {
                var r = DOC_CELLSIZE * 0.4;
                var top = r * 0.8;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x - r, y,
                    "C", x - r / 2, y - top, ",", x + r / 2, y - top, ",", x + r, y,
                    "C", x + r / 2, y + top, ",", x - r / 2, y + top, ",", x - r, y,
                    "Z ",
                    "'/>\n"
                ].join(" ");

                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x}' cy='${y}' r='${r/4}' fill='transparent' stroke='${strokeCol}' />\n`

                break;
            }
        case 16: //open mouth
            {
                var r = DOC_CELLSIZE * 0.4;
                var top = r * 0.8;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x - r, y,
                    "C", x - r / 2, y - 1.5 * top, ",", x + r / 2, y - 1.5 * top, ",", x + r, y,
                    "C", x + r / 2, y + 1.5 * top, ",", x - r / 2, y + 1.5 * top, ",", x - r, y,
                    "C", x - r / 2, y - top, ",", x + r / 2, y - top, ",", x + r, y,
                    "C", x + r / 2, y + top, ",", x - r / 2, y + top, ",", x - r, y,
                    "Z ",
                    "'/>\n"
                ].join(" ");
                break
            }
        case 17: //hand
            {
                var s = DOC_CELLSIZE * 0.4 / 1.41;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x - s * 0.8, y - 2 * s + s / 2,
                    "L", x - s * 0.8, y + s,
                    "L", x + s * 0.8, y + s,
                    "L", x + s * 0.8, y - s / 2,
                    "L", x - s / 4, y - s + s / 2,
                    "L", x - s / 4, y - 2 * s + s / 2,
                    "C", x - s / 4, y - 2 * s + s / 2 - s / 2, ",", x - s * 0.8, y - 2 * s + s / 2 - s / 2, ",", x - s * 0.8, y - 2 * s + s / 2,
                    "Z ",
                    "'/>\n"
                ].join(" ");
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
                    "C", x - s, y - u, ",", x - s, y - u - t, ",", x, y - u - t,
                    "C", x + 2 * s, y - u - t, ",", x + 2 * s, y + u + t, ",", x, y + u + t,
                    "C", x - s, y + u + t, ",", x - s, y + u, ",", x, y + u,
                    "C", x + s / 2, y + u, ",", x + s / 2, y - u, ",", x, y - u,
                    "Z ",
                    "'/>\n"
                ].join(" ");
                break
            }
        case 19: //teeth
            {
                var r = DOC_CELLSIZE * 0.4;
                var top = r * 0.8;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x - r, y,
                    "C", x - r / 2, y - top, ",", x + r / 2, y - top, ",", x + r, y,
                    "C", x + r / 2, y + top, ",", x - r / 2, y + top, ",", x - r, y,
                    "Z ",
                    "L", x + r, y,
                    "M", x, y - r / 2,
                    "L", x, y + r / 2,
                    "M", x - r / 2, y - r / 3,
                    "L", x - r / 2, y + r / 3,
                    "M", x + r / 2, y - r / 3,
                    "L", x + r / 2, y + r / 3,

                    "'/>\n"
                ].join(" ");
                break;
            }
        case 20: //vertical eye                 
            {
                var r = DOC_CELLSIZE * 0.4;

                var top = r * 0.8;

                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x, y - r,
                    "C", x - top, y - r / 2, ",", x - top, y + r / 2, ",", x, y + r,
                    "C", x + top, y + r / 2, ",", x + top, y - r / 2, ",", x, y - r,
                    "Z ",
                    "'/>\n"
                ].join(" ");

                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x}' cy='${y}' r='${r/4}' fill='${strokeCol}' stroke='${strokeCol}' />\n`
                break;
            }
        case 21: //nose
            {
                var r = DOC_CELLSIZE * 0.4 * 0.9;
                var dy = DOC_CELLSIZE * 0.4 * 0.1;
                y += dy;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x - r / 4, y - r,
                    "L", x - r / 2, y,
                    "C", x - r, y + r, ",", x + r, y + r, ",", x + r / 2, y,
                    "L", x + r / 4, y - r,
                    "'/>\n"
                ].join(" ");
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
                    "C", x + t, y, ",", x + t, y, ",", x + s, y + r,
                    "L", x - s, y + r,
                    //"C",x,y+t,x,y+t,x-s,y+r, 
                    "C", x - t, y, ",", x - t, y, ",", x - s, y - r,
                    "Z ",
                    "'/>\n"
                ].join(" ");
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
                ].join(" ");
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
                ].join(" ");
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
                result += ar.join(" ") + "  '/>\n";
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
                ].join(" ");
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
                    "C", x, y - t, ",", x, y - t, ",", x + s, y - r,
                    "C", x + t, y, ",", x + t, y, ",", x + s, y + r,
                    "C", x, y + t, ",", x, y + t, ",", x - s, y + r,
                    "C", x - t, y, ",", x - t, y, ",", x - s, y - r,
                    "'/>\n"
                ].join(" ");
                break;
            }
        case 28: //lambda            
            {
                var r = DOC_CELLSIZE * 0.4;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x}' cy='${y}' r='${r}' fill='${fillCol}' stroke='${strokeCol}' />\n`
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='transparent' stroke='${strokeCol}' d='`
                result += [
                    "M", x - r / 1.414, y + r / 1.414,
                    "L", x + r / 1.414, y - r / 1.414,
                    "M", x + r / 1.414, y + r / 1.414,
                    "L", x, y,
                    "'/>\n"
                ].join(" ");
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
                ].join(" ");

                break;
            }
        case 30: //yin yang
            {

                var r = DOC_CELLSIZE * 0.3
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x}' cy='${y}' r='${r}' fill='${fillCol}' stroke='${strokeCol}' />\n`

                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${strokeCol}' stroke='transparent' d='`
                result += describeArc(x, y, r, 0, Math.PI);
                result += "Z ";
                result += "'/>\n";
                var r2 = r - STROKE_WIDTH / 2;
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x-r2/2}' cy='${y}' r='${r2/2}' fill='${strokeCol}' stroke='transparent' />\n`
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x+r2/2}' cy='${y}' r='${r2/2}' fill='${fillCol}' stroke='transparent' />\n`

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
                result += ar.join(" ");

                break;
            }
        case 32: // part/many division
            {
                var r = DOC_CELLSIZE * 0.4;

                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x}' cy='${y}' r='${r}' fill='${fillCol}' stroke='${strokeCol}' />\n`


                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x - r, y,
                    "L", x + r, y,
                    "'/>\n"
                ].join(" ");

                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x}' cy='${y-r/2}' r='${r/5}' fill='${strokeCol}' stroke='transparent' />\n`
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x}' cy='${y+r/2}' r='${r/5}' fill='${strokeCol}' stroke='transparent' />\n`


                break;
            }
        case 33: //desire spiral
            {
                var r = DOC_CELLSIZE * 0.4;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    describeArc(x, y, r, 0, 2 * Math.PI),
                    "'/>\n"
                ].join(" ");
                var r2 = r * 2 / 3;
                var r3 = r2 / 2;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    describeArc(x, y + r - r2 - r3, r3, Math.PI / 2, Math.PI * 3 / 2),
                    describeArc(x, y + r - r2, r2, 3 * Math.PI / 2, Math.PI / 2),
                    describeArc(x, y, r, Math.PI / 2, 2 * Math.PI),
                    "'/>\n"
                ].join(" ");


                break;
            }
        case 34: //page
            {
                var s = DOC_CELLSIZE * 0.4 / 1.41;
                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x - s, y - s,
                    "L", x + s, y - s,
                    "L", x + s, y + s,
                    "L", x - s, y + s, ,
                    "Z ",
                    "M", x - s * 2 / 3, y - s / 2,
                    "L", x + s * 2 / 3, y - s / 2,
                    "M", x - s * 2 / 3, y,
                    "L", x + s * 2 / 3, y,
                    "M", x - s * 2 / 3, y + s / 2,
                    "L", x + s * 2 / 3, y + s / 2,
                    "'/>\n"
                ].join(" ");
                

                break;
            }
        case 35://documentation circle /w letter A inside
            {
                result += `\t\t<circle stroke-width='0.4' cx='${x}' cy='${y}' r='7' fill='${fillCol}' stroke='${strokeCol}' />\n`
                result += `<text fill='${strokeCol}' font-size="12px" x="${x}" y="${y+4}"  font-family="Helvetica" text-anchor="middle">A</text>\n`
                break
            }
        case 36://documentation circle /w letter B inside
            {
                result += `\t\t<circle stroke-width='0.4' cx='${x}' cy='${y}' r='7' fill='${fillCol}' stroke='${strokeCol}' />\n`
                result += `<text fill='${strokeCol}' font-size="12px" x="${x}" y="${y+4}"  font-family="Helvetica" text-anchor="middle">B</text>\n`
                break
            }
        case 37://documentation circle /w letter C inside
            {
                result += `\t\t<circle stroke-width='0.4' cx='${x}' cy='${y}' r='7' fill='${fillCol}' stroke='${strokeCol}' />\n`
                result += `<text fill='${strokeCol}' font-size="12px" x="${x}" y="${y+4}"  font-family="Helvetica" text-anchor="middle">C</text>\n`
                break
            }
        case 38://documentation circle /w letter D inside
            {
                result += `\t\t<circle stroke-width='0.4' cx='${x}' cy='${y}' r='7' fill='${fillCol}' stroke='${strokeCol}' />\n`
                result += `<text fill='${strokeCol}' font-size="12px" x="${x}" y="${y+4}"  font-family="Helvetica" text-anchor="middle">D</text>\n`
                break
            }
        case 39://documentation circle /w letter E inside
            {
                result += `\t\t<circle stroke-width='0.4' cx='${x}' cy='${y}' r='7' fill='${fillCol}' stroke='${strokeCol}' />\n`
                result += `<text fill='${strokeCol}' font-size="12px" x="${x}" y="${y+4}"  font-family="Helvetica" text-anchor="middle">E</text>\n`
                break
            }
        case 40://documentation circle /w letter F inside
            {
                result += `\t\t<circle stroke-width='0.4' cx='${x}' cy='${y}' r='7' fill='${fillCol}' stroke='${strokeCol}' />\n`
                result += `<text fill='${strokeCol}' font-size="12px" x="${x}" y="${y+4}"  font-family="Helvetica" text-anchor="middle">F</text>\n`
                break
            }
        case 41://documentation circle /w letter G inside
            {
                result += `\t\t<circle stroke-width='0.4' cx='${x}' cy='${y}' r='7' fill='${fillCol}' stroke='${strokeCol}' />\n`
                result += `<text fill='${strokeCol}' font-size="12px" x="${x}" y="${y+4}"  font-family="Helvetica" text-anchor="middle">G</text>\n`
                break
            }
        case 42://documentation circle /w letter H inside
            {
                result += `\t\t<circle stroke-width='0.4' cx='${x}' cy='${y}' r='7' fill='${fillCol}' stroke='${strokeCol}' />\n`
                result += `<text fill='${strokeCol}' font-size="12px" x="${x}" y="${y+4}"  font-family="Helvetica" text-anchor="middle">H</text>\n`
                break
            }
        default:
            { //circle
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${x}' cy='${y}' r='${0.4*DOC_CELLSIZE}' fill='transparent' stroke='${strokeCol}' />\n`
                break;
            }
    }

    DOC_CELLSIZE = oldDCS;
    return result;
}

function svgRender() {
    var canvasDimensions = lib.canvasSize();

    var Canvas = require('canvas')
    var Image = Canvas.Image

    canvas = new Canvas(canvasDimensions[0], canvasDimensions[1])
    ctx = canvas.getContext('2d');

    lib.MoveOriginToTopLeft()
    var [top, bottom, left, right] = lib.getBounds();
    var w = right - left ;
    var h = bottom - top ;
    const docWidth = (w + 2 * DOC_PADDING) * DOC_CELLSIZE;
    const docHeight = (h + 2 * DOC_PADDING) * DOC_CELLSIZE;

    var svg = "";
    svg += `<svg xmlns="http://www.w3.org/2000/svg" 
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
        log ("oldcol="+col)
        col=gridCol;
        svg += `\t\t<path stroke-linecap="round" stroke-width='${STROKE_WIDTH}' fill='transparent' stroke='${col}' d='`;
        svg += ar.join(" ");
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

    svg += "\t</svg>\n";
    return svg;
}

module.exports.render = svgRender;
module.exports.setPadding = setPadding
module.exports.setColours = setColours