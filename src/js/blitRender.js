var fs = require('fs')
var lib = require('./orthoLib')
var glob = require('./orthoGlobals')
var Canvas = require('canvas')
var Image = Canvas.Image 

var tileset;
var tilesets = [
    {
        name:"big",
        tw:21,
        th:21,
        overlapx:0,
        overlapy:0,
        linew:3,
        spacing:6,
        fgcol:"#c5c5c5",
        bgcol:"#000000"
    },
    {
        name:"micro",
        tw:9,
        th:9,
        overlapx:0,
        overlapy:0,
        linew:1,
        spacing:3,
        fgcol:"#ffffff",
        bgcol:"#3b3b3b"
    },
    {
        name:"square",
        tw:11,
        th:11,
        overlapx:1,
        overlapy:1,
        linew:1,
        spacing:2,
        fgcol:"#ffffff",
        bgcol:"#000000"
    },
    {
        name:"hex",
        tw:231,
        th:240,
        overlapx:23,
        overlapy:40,
        linew:22,
        spacing:40,
        fgcol:"#ffffff",
        bgcol:"#000000"
    },
    {
        name:"octo",
        tw:64,
        th:64,
        overlapx:0,
        overlapy:0,
        linew:2,
        spacing:5,
        fgcol:"#c05959",
        bgcol:"#ffffff"
    }
]

var tiledat=[];

function drawIcon(ctx,tileset,x, y, icon) {
    ctx.drawImage(tileset, 
                    (icon%5)*(tiledat.tw-tiledat.overlapx), 
                    Math.floor(icon/5)*(tiledat.th-tiledat.overlapy), 
                    tiledat.tw, tiledat.th,
                    x,y,tiledat.tw, tiledat.th);
}

function blitRender(_tileset) {
    tileset=_tileset;
    tiledat=tilesets[tileset]
    lib.MoveOriginToTopLeft(1,1)
    var [top,bottom,left,right] = lib.getBounds();
    var g_w = right-left+3;
    var g_h = bottom-top+3;
    var pixel_w = g_w*tiledat.tw+(g_w-1)*tiledat.spacing;
    var pixel_h = g_h*tiledat.tw+(g_h-1)*tiledat.spacing;

//  ctx.drawImage(img, 0, 0, img.width / 4, img.height / 4);

    var spritesheet_path = "res/tiles/"+tiledat.name+".png";
    var spritesheetdat = fs.readFileSync(spritesheet_path);
    var spritesheet = new Image
    spritesheet.src = spritesheetdat

    var canvas = new Canvas(pixel_w, pixel_h)
    var ctx = canvas.getContext('2d');
    ctx.antialias = 'none';
    ctx.patternQuality = 'nearest';
    ctx.lineCap="round"

    ctx.fillStyle = tiledat.bgcol;
    ctx.strokeStyle = tiledat.fgcol;
    ctx.fillRect(0, 0, canvas.width, canvas.height);  
    ctx.lineWidth = tiledat.linew;                        

    if (glob.drawLines){
        ctx.beginPath();
        for (var i=0;i<glob.page.lines.length;i++){
            var l = glob.page.lines[i];
            var x1 = (tiledat.tw+tiledat.spacing)*l[0]+(tiledat.tw/2);
            var y1 = (tiledat.th+tiledat.spacing)*l[1]+(tiledat.th/2);
            var x2 = (tiledat.tw+tiledat.spacing)*l[2]+(tiledat.tw/2);
            var y2 = (tiledat.th+tiledat.spacing)*l[3]+(tiledat.th/2);
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            if (l[4]===1){
                var mx = (x1+x2)/2;
                var my = (y1+y2)/2;
                var t = Math.atan2(x2-x1,y2-y1);
                var dx = Math.sin(t+Math.PI/2);
                var dy = Math.cos(t+Math.PI/2);
                ctx.moveTo(
                    mx-dx*2*tiledat.linew,
                    my-dy*2*tiledat.linew);
                ctx.lineTo(
                    mx+dx*2*tiledat.linew,
                    my+dy*2*tiledat.linew);
            }
        }
        ctx.stroke();
    }

    if (glob.drawElements){
        for (var i=0;i<glob.page.elements.length;i++){
            var e = glob.page.elements[i];
            drawIcon(
                    ctx,
                    spritesheet,
                    e[0]*(tiledat.tw+tiledat.spacing),
                    e[1]*(tiledat.th+tiledat.spacing),
                    e[2]);   
        }
    }

    var dataURL = canvas.toDataURL();
    var data = dataURL.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    return buf;

}

module.exports = blitRender;