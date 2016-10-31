var glob = require('./orthoGlobals')
var lib = require('./orthoLib')
var page = glob.page;
var log=console.log

var ctx
var bgImg
var bigImg
var cursorImg
var lineCursorImg
var nolineCursorImg

var screen_offsetx=0;
var screen_offsety=0;
var screen_w=0;
var screen_h=0;
var screen_scale=1;

var cellsize = 21

var BG = "#000000"
var DARK = "#2d2d2d"
var MED = "#6c6c6c"
var LIGHT = "c6c1c1"

var gridX=1;
var gridY=1;
var gridWidth=15;
var gridHeight=7;

var cursorX=Math.floor(gridWidth/2);
var cursorY=Math.floor(gridHeight/2);

var rowPixelOffsets = [
[1,157],
[1,172],
[34,194],
[40,216],
[29,238]
]

var keyCodes = [
[27,112,113,114,115,116,117,118,119,120,121,122,123],
[192,49,50,51,52,53,54,55,56,57,48,189,187],
[81,87,69,82,84,89,85,73,79,80,219,221],
[65,83,68,70,71,72,74,75,76,186,222,220],
[192,90,88,67,86,66,78,77,188,190,191],
]

var symbols = [
[27,112,113,114,115,116,117,118,119,120,121,122,123],
[192,49,50,51,52,53,54,55,56,57,48,189,187],
[81,87,69,82,84,89,85,73,79,80,219,221],
[65,83,68,70,71,72,74,75,76,186,222,220],
[192,90,88,67,86,66,78,77,188,190,191],
];

var otherLocations = [
    [32,95,260,109,21],
    [16,1,238,27,21],
    [16,271,238,59,21],
    [8,287,172,43,21],
    [13,298,194,32,21],
    [13,304,215,26,22],
    [38,279,260,25,10],
    [40,279,271,25,10],
    [37,253,271,25,10],
    [39,305,271,25,10]
]

var otherCodes = {
    space:32,
    shift:16,
    backspace:8,
    enter:13,
    up:38,
    down:40,
    left:37,
    right:39,
    ctrl:17,
    alt:18,
    cmdl:91,
    cmdr:93,

}


var keycode_to_symbolNumber = {
    "48":19,
    "52":34,
    "53":33,
    "54":15,
    "55":16,
    "56":17,
	"57":18,
	"66":22,
	"70":24,
	"71":28,
	"72":0,
	"73":7,
	"74":1,
	"75":2,
	"76":3,
	"77":11,
	"78":10,
	"79":8,
	"80":9,
	"82":25,
	"51":4,
	"84":20,
	"85":6,
	"86":23,
	"89":5,
	"186":30,
	"187":29,
	"188":12,
	"189":21,
	"190":13,
	"191":14,
	"219":27,
	"220":26,
	"221":32,
	"222":31}

var keyMask = {}

var lineMode=0;
function lineModePress(n){
    if (lineMode===n){
        lineMode=0;
    } else {
        lineMode=n;
    }
}

clamp = function(t,min, max) {
  return Math.min(Math.max(t, min), max);
};

function moveCursor(dx,dy){
    var [x1,y1,x2,y2]=[cursorX,cursorY,cursorX+dx,cursorY+dy]
    var escaping =  Math.min(x1,y1,x2,y2)<0||Math.max(x1,x2)>=gridWidth||Math.max(y1,y2)>=gridHeight;
    if (escaping){
        return;
    }
    if (lineMode>0){    
       if (!escaping){
            lib.tryAddLine(x1,y1,x2,y2,lineMode-1);
        } 
    } 

    cursorX=clamp(cursorX+dx,0,gridWidth-1);
    cursorY=clamp(cursorY+dy,0,gridHeight-1);
    if (keyMask[8]===true){
        removeSymbol();
    }
}

function handleKeyUp(evt){
    keyMask[evt.keyCode]=false
    renderApp();
}

function removeSymbol(){
    var success = lib.tryRemoveCellAt(cursorX,cursorY,false)
    if (!success){
        var e = [cursorX,cursorY];
        for (var i=page.lines.length-1;i>=0;i--){
            var l=page.lines[i]
            if (lib.PointOnLine(e,l)){
                page.lines.splice(i,1);
            }
        }
    }
    lineMode=0;
}
function pressSymbol(cs){
    lineMode=0;
    var cx = cursorX;
    var cy = cursorY;
    log("cs",[cx,cy,cs],"el",page.elements)
    for (var e of page.elements){
        var [ex,ey,es]=e;
        log(ex,cx,ey,cy)
        if (ex===cx&&ey===cy){
            e[2]=cs;
            log("modified")
            return;
        }
    }
    log("pushed")
    page.elements.push([cx,cy,cs])
}

function handleKeyDown(evt){
    var kc = evt.keyCode;
    switch(kc){
        case 87://w  UP
        {
            moveCursor(0,-1);
            evt.preventDefault();
            break;
        }
        case 88://x  DOWN
        {
            moveCursor(0,1);
            evt.preventDefault();
            break;
        }
        case 65://a  LEFT
        {
            moveCursor(-1,0);
            evt.preventDefault();
            break;
        }
        case 68://d  RIGHT
        {
            moveCursor(1,0);
            evt.preventDefault();
            break;
        }
        case 81://q  UPLEFT
        {
            moveCursor(-1,-1);
            evt.preventDefault();
            break;
        }
        case 69://e  UPRIGHT
        {
            moveCursor(1,-1);
            evt.preventDefault();
            break;
        }
        case 90://z  DOWNLEFT
        {
            moveCursor(-1,1);
            evt.preventDefault();
            break;
        }
        case 67://c  DOWNRIGHT
        {
            moveCursor(1,1);
            evt.preventDefault();
            break;
        }
        case 8://backspace DELETE
        {
            removeSymbol();   
            evt.preventDefault();
            break;
        }
        case 83://s LINE BUTTON PRESS
        {
            lineModePress(1);
            break;
        }
        case 192://` NOLINE BUTTON PRESS
        {
            lineModePress(2);
            break;
        }
    }
    if (kc in keycode_to_symbolNumber){
        if (!keyMask[16]){
            pressSymbol(keycode_to_symbolNumber[kc]);
            evt.preventDefault();
        }
    }
    keyMask[evt.keyCode]=true
    renderApp();
}

function doStart(){

    bgImg = document.getElementById("bg");
    bigImg = document.getElementById("big");
    bigWhiteImg = document.getElementById("bigwhite");
    cursorImg = document.getElementById("cursor");
    lineCursorImg = document.getElementById("linecursor");
    nolineCursorImg = document.getElementById("nolinecursor");

    lineBufferImg.width  = bgImg.width;
    lineBufferImg.height = bgImg.height;

    canvas = document.getElementById("mainCanvas");
    ctx=canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    document.addEventListener('keydown', handleKeyDown, false);
    document.addEventListener('keyup', handleKeyUp, false);

    window.onresize = renderApp

    renderApp();
}

function calcScale(){

    var canvas_w = window.innerWidth
    var canvas_h = window.innerHeight

    var bg_w = bgImg.width;
    var bg_h = bgImg.height;

    var bg_r=bg_w/bg_h;
    var canvas_r=canvas_w/canvas_h;

    screen_offsetx=0;
    screen_offsety=0;

    if (bg_r>canvas_r){
        //background wider than screen. letterbox
        screen_w=canvas_w
        screen_h=screen_w/bg_r
        screen_offsety = (canvas_h-screen_h)/2
    } else {
        //background taller than screen. windowbox
        screen_h=canvas_h
        screen_w=screen_h*bg_r
        screen_offsetx = (canvas_w-screen_w)/2
    }
    screen_scale = screen_w/bg_w
}

function tx(x){
    return screen_offsetx+screen_scale*x
}
function ty(y){
    return screen_offsety+screen_scale*y
}

var iconBufferImg = document.createElement('canvas');
iconBufferImg.width  = cellsize;
iconBufferImg.height = cellsize;
var iconBufferCtx = iconBufferImg.getContext('2d');


var lineBufferImg = document.createElement('canvas');
var lineBufferCtx = lineBufferImg.getContext('2d');

//pass bg coordinates
function drawIcon(x, y, icon) {
    var iconx=(icon%5)*cellsize;
    var icony=Math.floor(icon/5)*cellsize;
    //first, draw icon to icon buffer

    iconBufferCtx.clearRect(0, 0, cellsize,cellsize);  
    iconBufferCtx.drawImage(bigImg,iconx,icony,cellsize,cellsize,0,0,cellsize,cellsize)
    //then draw icon buffer to screen
    ctx.drawImage(iconBufferImg,tx(x),ty(y),cellsize*screen_scale,cellsize*screen_scale);
}


function drawThickLine(x1,y1,x2,y2){
    var dx=Math.sign(x2-x1);
    var dy=Math.sign(y2-y1);
    var x=x1;
    var y=y1;
    lineBufferCtx.fillStyle = MED;
    while (x!==x2||y!==y2){
        lineBufferCtx.fillRect(x-0.5,y-0.5,3,3);
        x+=dx;
        y+=dy;
    }
    lineBufferCtx.fillRect(x-0.5,y-0.5,3,3);
}
function renderApp(){
    if (!canvas.getContext) {
        return;
    }

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;  

    calcScale();  


    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);  

    ctx.fillStyle = DARK;
    //draw key highlights
    for (var j=0;j<keyCodes.length;j++){
        var [rx,ry] = rowPixelOffsets[j];
        var row = keyCodes[j]
        for (var i=0;i<row.length;i++){
            var kc = row[i];
            if (keyMask[kc]===true){
                var kx = tx(rx+i*(cellsize+1));
                var ky = ty(ry);
                ctx.fillRect(kx,ky,cellsize*screen_scale,(j===0?14:cellsize)*screen_scale);
            }
        }
    }
    for (var [kc,x,y,width,height] of otherLocations) {
        if (keyMask[kc]===true){
            var kx = tx(x);
            var ky = ty(y);
            ctx.fillRect(kx,ky,width*screen_scale,height*screen_scale);
        }
    }

    //DRAW LINES
    lineBufferCtx.clearRect(0,0,lineBufferImg.width,lineBufferImg.height)
    lineBufferCtx.strokeStyle = "#ffffff"; 
    lineBufferCtx.lineWidth = 3;                   
    lineBufferCtx.antialias = 'none';
    lineBufferCtx.patternQuality = 'nearest';
    lineBufferCtx.imageSmoothingEnabled = false;

    for (var i=0;i<glob.page.lines.length;i++){
        var [x1,y1,x2,y2,t] = glob.page.lines[i];
        x1 = gridX + x1*(cellsize+1)+cellsize/2;
        y1 = gridY + y1*(cellsize+1)+cellsize/2;
        x2 = gridX + x2*(cellsize+1)+cellsize/2;
        y2 = gridY + y2*(cellsize+1)+cellsize/2;
        drawThickLine(x1,y1,x2,y2)

         if (t===1){
            var mx = (x1+x2)/2;
            var my = (y1+y2)/2;
            var diagonal = (x2-x1)*(y2-y1)!==0;
            if (diagonal){
                lineBufferCtx.fillRect(Math.floor(mx)-5,Math.floor(my)+5,3,3)
                lineBufferCtx.fillRect(Math.floor(mx)+5,Math.floor(my)+5,3,3)
                lineBufferCtx.fillRect(Math.floor(mx)+5,Math.floor(my)-5,3,3)
                lineBufferCtx.fillRect(Math.floor(mx)-5,Math.floor(my)-5,3,3)
            } else {
                lineBufferCtx.fillRect(Math.floor(mx)-5,Math.floor(my),3,3)
                lineBufferCtx.fillRect(Math.floor(mx)+5,Math.floor(my),3,3)
                lineBufferCtx.fillRect(Math.floor(mx),Math.floor(my)-5,3,3)
                lineBufferCtx.fillRect(Math.floor(mx),Math.floor(my)+5,3,3)                
            }
         }
    }

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(lineBufferImg,screen_offsetx,screen_offsety,screen_w,screen_h)

    //DRAW ELEMENTS
    for(var [x,y,s] of page.elements){
        var px = gridX+x*(cellsize+1);
        var py = gridY+y*(cellsize+1);
        drawIcon(px,py,s)
    }
    ctx.imageSmoothingEnabled = false;

    var [cx,cy]=[gridX+cursorX*(cellsize+1)-1,gridY+cursorY*(cellsize+1)-1]
    var cImg = [cursorImg,lineCursorImg,nolineCursorImg][lineMode]
    var [cw,ch]=[cImg.width,cImg.height]
    ctx.drawImage(cImg,0,0,cw,ch,tx(cx),ty(cy),cw*screen_scale,ch*screen_scale)

    ctx.drawImage(bgImg,0,0,bgImg.width,bgImg.height,screen_offsetx,screen_offsety,screen_w,screen_h)


}

window.onload = doStart