(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var glob = require('./orthoGlobals')
var orthoRender = require('./orthoRender')
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

function SaveState(){
    var sketch_save = JSON.stringify({book:glob.sketchBook,page:glob.sketchBookIndex});
    localStorage.setItem("glob.sketchBookDat",sketch_save);
    console.log(JSON.stringify(glob.page))
}
function TryRestoreState(){
    var sketch_save = localStorage.getItem("glob.sketchBookDat");
    if (sketch_save!==null){
        var dat = JSON.parse(sketch_save);
        glob.sketchBook=dat.book;
        glob.sketchBookIndex=dat.page;
        LoadPage();
    }
}
var ctx
function doStart(){
    glob.canvas = document.getElementById("mainCanvas");
    glob.ctx=glob.canvas.getContext('2d');
    ctx = glob.ctx;
    ctx.imageSmoothingEnabled = false;

    glob.canvas.addEventListener("touchstart", handleStart, false);
    glob.canvas.addEventListener("touchend", handleEnd, false);
    glob.canvas.addEventListener("touchcancel", handleEnd, false);
    glob.canvas.addEventListener("touchleave", handleEnd, false);
    glob.canvas.addEventListener("touchmove", handleMove, false);
    TryRestoreState();

    renderApp();
}


function LoadPage(){
    if(glob.sketchBookIndex===glob.sketchBook.length){
        glob.sketchBook.push({
            elements:[],
            lines:[],
            offsetX:0,
            offsetY:0,
            scale:1,
            sketchTitle:""
        });
    }
    log(glob.page);
    glob.page=glob.sketchBook[glob.sketchBookIndex];
    log(glob.page);
    renderApp();
}
function PageLeft(){
    if (glob.sketchBookIndex===0){
        return;
    }
    if (PageEmpty()&&glob.sketchBookIndex==glob.sketchBook.length-1){
        glob.sketchBook.splice(glob.sketchBookIndex,1);
    }
    glob.sketchBookIndex--;  
    LoadPage();      
    SaveState();
}

function PageEmpty(){
    return glob.page.lines.length===0&&glob.page.elements.length===0&&glob.page.sketchTitle==="";
}
function PageRight(){
    if (PageEmpty()===false){
        glob.sketchBookIndex++;
        LoadPage();
        SaveState();
    }
}

function clearEverything(){        
    glob.sketchBook.splice(glob.sketchBookIndex,1);
    if (glob.sketchBookIndex===glob.sketchBook.length &&
        glob.sketchBookIndex>0){
        glob.sketchBookIndex--;
    }
    LoadPage();
}

function iconAt(tx,ty){
    for (var i=0;i<glob.page.elements.length;i++){
        var el = glob.page.elements[i];
        if (el[0]===tx&&el[1]===ty){
            return true;
        }
    }
    return false;
}

function handleStart(evt) {
    if (iconSelect==true){
        iconSelect=false;
    }
    evt.preventDefault();

    if (evt.touches.length===2){
        moved=true;
        oldtouches=[evt.touches[0].clientX,evt.touches[0].clientY,evt.touches[1].clientX,evt.touches[1].clientY];
    } 
   if (evt.touches.length===1){

        var t= evt.changedTouches[0];

        var cx = t.clientX-glob.page.offsetX;
        var cy = t.clientY-glob.page.offsetY;

        if (t.clientY<cellSize+20){

            toolbarSelect=true;
            console.log("toolbarSelect = "+toolbarSelect);

            if (t.clientX<cellSize){
                //delete
                clearEverything();
            } else if (t.clientX<glob.canvas.width-2*cellSize){
                //set title
                newTitle();
            } else if (t.clientX<glob.canvas.width-cellSize){
                //move left
                PageLeft();
            } else {
                //move right
                PageRight();
            }
            renderApp();
            return;
        }
        oldtouches=[evt.touches[0].clientX,evt.touches[0].clientY,evt.touches[0].clientX,evt.touches[0].clientY];

        var gx = Math.round(cx/(cellSize*glob.page.scale));
        var gy = Math.round(cy/(cellSize*glob.page.scale));
        mousex=t.clientX;
        mousey=t.clientY;
        var iconat = iconAt(gx,gy);
        if (!iconat){
            startPosX=mousex;
            startPosY=mousey;
            iconSelect=true;
            minDistHit=false;
        }
        oldX=gx;
        oldY=gy;           
    }

    renderApp();
}


function newTitle(){        
    var onSucess = function(){};
    var s = prompt("enter title",glob.page.sketchTitle).toUpperCase();
    if (s.length>5){
        s=s.substr(0,5);
    }
    glob.page.sketchTitle=s;
    SaveState();
}
function clickCell(x,y,n){
    for (var i=0;i<glob.page.elements.length;i++){
        var e = glob.page.elements[i];
        if (e[0]===x&&e[1]===y){
            glob.page.elements.splice(i,1);
            break;
        }
    }
    glob.page.elements.push([x,y,n]);
    SaveState();
}

function tryRemoveCell(x,y){
    for (var i=0;i<glob.page.elements.length;i++){
        var e = glob.page.elements[i];
        if (e[0]===x&&e[1]===y){
            glob.page.elements.splice(i,1);
            break;
        }
    }   

    for (var i=0;i<glob.page.lines.length;i++){
        var l = glob.page.lines[i];
        var x1=l[0];
        var y1=l[1];
        var x2=l[2];
        var y2=l[3];
        if (x1===x&&y1===y){
            if (!iconAt(x2,y2)){
                glob.page.lines.splice(i,1);
                i--;
            }
        } else if (x2===x&&y2===y){
            if (!iconAt(x1,y1)){
                glob.page.lines.splice(i,1);
                i--;
            }
        }
    }
    SaveState();
}

function makeLine(x1,y1,x2,y2){
    /*if (x2>x1+1){
        x2=x1+1;
    } else if (x2<x1-1){
        x2=x1-1;
    }
    if (y2>y1+1){
        y2=y1+1;
    } else if (y2<y1-1){
        y2=y1-1;
    }*/


    var dx=x2-x1;
    var dy=y2-y1;

    var l = Math.max(Math.abs(dx),Math.abs(dy));
    dx = Math.sign(dx)*l;
    dy = Math.sign(dy)*l;
    x2=x1+dx;
    y2=y1+dy;

    if (x1<x2|| (x1===x2&&y1<y2)){
        var tx=x1;
        x1=x2;
        x2=tx;

        var ty=y1;
        y1=y2;
        y2=ty;
    }

    for (var i=0;i<glob.page.lines.length;i++){
        var l = glob.page.lines[i];
        if (l[0]===x1&&l[1]===y1&&l[2]===x2&&l[3]===y2) {
            if (l[4]===0){
                l[4]=1;
            } else {
                glob.page.lines.splice(i,1);
            }
            SaveState();
            return;
        }
    }

    glob.page.lines.push([x1,y1,x2,y2,0]);
    SaveState();
}


function handleEnd(evt){
    evt.preventDefault();
    if (cleared===true || moved===true || toolbarSelect===true){
        if (evt.touches.length===0){
            cleared=false;
            moved=false;
            toolbarSelect=false;
            console.log("toolbarSelect = "+toolbarSelect);
        }
        renderApp();
        return;

    }

    if (glob.page.scale<=scaleMin){
        renderApp();
        return;
    }

    if (evt.touches.length==0){
        if (iconSelect&&minDistHit){
            var t = evt.changedTouches[0];
            var px = t.clientX;
            var py = t.clientY;
            drawSelectionPanel(true,px,py);
            iconSelect=false;
            renderApp();
            return;
        }
    }

    for (var i=0;i<evt.changedTouches.length;i++){

        var t= evt.changedTouches[i];

        var cx = t.clientX-glob.page.offsetX;
        var cy = t.clientY-glob.page.offsetY;

        var gx = Math.round(cx/(cellSize*glob.page.scale));
        var gy = Math.round(cy/(cellSize*glob.page.scale));

        if (oldX==gx && oldY==gy){
            tryRemoveCell(gx,gy);
        } else {
            makeLine(oldX,oldY,gx,gy);
        }
    }
    renderApp();
}

function handleCancel(evt) {
}

function dist(ar){
    var dx = ar[2]-ar[0];
    var dy = ar[3]-ar[1];
    return Math.sqrt(dx*dx+dy*dy);
}

function handleMove(evt) {

    evt.preventDefault();

    if (cleared==true){
        return;
    }
    if (evt.touches.length===1&&glob.page.scale>scaleMin){  
        var t = evt.touches[0];          
        mousex=t.clientX;
        mousey=t.clientY;
        var d = dist([startPosX,startPosY,mousex,mousey]);
        if (iconSelect&& d>minDist){
            minDistHit=true;
        }
        renderApp();
    }

    if (evt.touches.length===2||(evt.touches.length==1&&glob.page.scale<=scaleMin)){
        var curtouches = evt.touches.length===2 ?
                [evt.touches[0].clientX,evt.touches[0].clientY,evt.touches[1].clientX,evt.touches[1].clientY] :
                [evt.touches[0].clientX,evt.touches[0].clientY,evt.touches[0].clientX,evt.touches[0].clientY];
                
        if (oldtouches===null){
            oldtouches=curtouches;
            return;
        }


        var oldCenterX = (oldtouches[0]+oldtouches[2])/2;
        var oldCenterY = (oldtouches[1]+oldtouches[3])/2;
        var curCenterX = (curtouches[0]+curtouches[2])/2;
        var curCenterY = (curtouches[1]+curtouches[3])/2;
        glob.page.offsetX+=(curCenterX-oldCenterX);
        glob.page.offsetY+=(curCenterY-oldCenterY);


        var oldDist = dist(oldtouches);
        var newDist = dist(curtouches);
        var scaleMultiplier = newDist/oldDist;
        var oldScale=glob.page.scale;
        if ( evt.touches.length===2){
            glob.page.scale = glob.page.scale * scaleMultiplier;
            if (glob.page.scale<scaleMin){
                glob.page.scale=scaleMin;
            } 
            if (glob.page.scale>scaleMax){
                glob.page.scale=scaleMax;
            }
            //scale around center
            var dOffsetX=glob.page.offsetX-curCenterX;
            var dOffsetY=glob.page.offsetY-curCenterY;
            glob.page.offsetX=dOffsetX*glob.page.scale/oldScale+curCenterX;
            glob.page.offsetY=dOffsetY*glob.page.scale/oldScale+curCenterY;
        }

        oldtouches=curtouches;
        renderApp();
        return;
    } else {
        oldtouches=null;
    }
    
    renderApp();
/*
    if (evt.touches.length===1 && iconSelect===false && moved===false)
    {
        for (var i =0; i<evt.changedTouches.length; i++){
            var t= evt.changedTouches[0];

            var cx = t.clientX;
            var cy = t.clientY;

            var gx = Math.round(cx/cellSize);
            var gy = Math.round(cy/cellSize);

            if (cx!=oldX||cy!=oldY){
                var x2=gx;
                var x1=oldX;
                var y2=gy;
                var y1=oldY;

                var dx=x2-x1;
                var dy=y2-y1;

                var l = Math.max(Math.abs(dx),Math.abs(dy));
                dx = Math.sign(dx)*l;
                dy = Math.sign(dy)*l;
                x2=x1+dx;
                y2=y1+dy;

                ctx.beginPath();
                ctx.moveTo(x1*cellSize+0.5,y1*cellSize+0.5);
                ctx.lineTo(x2*cellSize+0.5,y2*cellSize+0.5);
                ctx.strokeStyle="#888888"
                ctx.stroke();
            }
        }
    }*/
}


function drawSelectionPanel(select,x,y){
    ctx=glob.ctx;
    var panelRows=5;
    var panelCols=Math.ceil(glob.symbolCount/panelRows);

    var w = window.innerWidth;
    var h = window.innerHeight;

    var centerX = w/2;
    var centerY = h/2;

    var panelLeft = centerX-panelRows*cellSize/2;
    var panelRight = centerX+panelRows*cellSize/2;
    var panelTop = centerY-panelCols*cellSize/2;
    var panelBottom = centerY+panelCols*cellSize/2;
    log(panelLeft,panelTop,panelRight,panelBottom)
    panelTop+=cellSize/2;
    panelBottom+=cellSize/2;

    var ox = panelLeft;
    var oy = panelTop;

    //draw panel
    ctx.lineWidth = 1.0;   
    ctx.strokeStyle="#000000"
    ctx.fillStyle="#ffffff";

    ctx.beginPath();
    ctx.moveTo(panelLeft,panelTop);
    ctx.lineTo(panelRight,panelTop);
    ctx.lineTo(panelRight,panelBottom);
    ctx.lineTo(panelLeft,panelBottom);
    ctx.closePath();


    ctx.fill()
    ctx.stroke()


    var titleBarHeight=cellSize;
    var titleBarTop=panelTop-titleBarHeight;
    var titleBarBottom=panelTop;
    var titleBarIndent=0;
    var titleBarWidth=(panelRight-panelLeft);
    var titleBarLeft=panelLeft+titleBarIndent;
    var titleBarRight=titleBarLeft+titleBarWidth;


    
    //draw title bar
    ctx.strokeStyle="#000000"
    ctx.fillStyle="#ffffff";

    ctx.beginPath();
    ctx.moveTo(titleBarLeft,titleBarTop);
    ctx.lineTo(titleBarRight,titleBarTop);
    ctx.lineTo(titleBarRight,titleBarBottom);
    ctx.lineTo(titleBarLeft,titleBarBottom);
    ctx.closePath();


    ctx.fill()
    ctx.stroke()

    
    var dx=x-ox;
    var dy=y-oy;
    var w = panelRight-panelLeft;
    var h = panelBottom-panelTop;
    var gridx=-1;
    var gridy=-1;
    var highlightedglyphtext="";
    if (dx<0||dy<0||dx>=w||dy>=h){
        highlightedglyphicon=-1;
        //nothing
    } else {
        var xpos = Math.floor(dx/cellSize);
        var ypos = Math.floor(dy/cellSize);
        gridx=xpos;
        gridy=ypos;
        var i = xpos+ypos*panelRows;
        highlightedglyphicon=i;
        highlightedglyphtext=glob.glyphNames[i];
        if (select===true){
            clickCell(oldX,oldY,i);
        }
    }

    //draw name
    ctx.lineWidth = 0;                        
    ctx.fillStyle="#000000";
    ctx.textAlign ="center";
    ctx.font = "38px helvetica";
    ctx.fillText(highlightedglyphtext,(titleBarLeft+titleBarRight)/2,titleBarBottom-14);
    if (highlightedglyphicon>=0){
        var titleBarMid = (titleBarTop+titleBarBottom)/2;

        orthoRender.drawIcon(
            titleBarLeft+cellSize/2,titleBarMid,highlightedglyphicon);
        orthoRender.drawIcon(
            titleBarRight-cellSize/2,titleBarMid,highlightedglyphicon);
    }

    var oldscale=glob.page.scale;
    glob.page.scale=1;
    for (var i=0;i<35;i++){            
        var ix = i%panelRows;
        var iy = Math.floor(i/panelRows);
        if (ix==gridx&&iy==gridy){
            ctx.globalalpha=1.0;
        }
        var mx = ox+ix*cellSize+cellSize/2;
        var my = oy+iy*cellSize+cellSize/2;
        if (i==highlightedglyphicon){
            ctx.fillStyle="#bbbbbb";
            ctx.beginPath();
            ctx.moveTo(mx-cellSize/2,my-cellSize/2);
            ctx.lineTo(mx+cellSize/2,my-cellSize/2);
            ctx.lineTo(mx+cellSize/2,my+cellSize/2);
            ctx.lineTo(mx-cellSize/2,my+cellSize/2);
            ctx.closePath();
            ctx.fill()
        }
        orthoRender.drawIcon(mx,my,i);

    }
    glob.page.scale=oldscale;

    ctx.globalalpha=1.0;
}

function renderApp(){
    if (glob.canvas.getContext) {
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
    }

    orthoRender.render();


    {
        //window title bar
        ctx.strokeStyle="#000000";
        ctx.fillStyle="#ffffff";

        ctx.beginPath();
        ctx.moveTo(0,0);        
        ctx.lineTo(glob.canvas.width,0);
        ctx.lineTo(glob.canvas.width,20+cellSize);
        ctx.lineTo(0,20+cellSize);
        ctx.closePath();
        ctx.fill()
        ctx.stroke()

        //left button

        if (glob.sketchBook.length===1&&PageEmpty()){
        } else {
            orthoRender.drawIcon(cellSize/2,20+cellSize/2,-3);
        }

        ctx.fillStyle="#000000";
        ctx.textAlign ="center";
        ctx.font = "38px helvetica";
        ctx.fillText(glob.page.sketchTitle,(glob.canvas.width-cellSize)/2,20+cellSize-14);

        if (glob.sketchBookIndex>0){
            orthoRender.drawIcon(glob.canvas.width-3*cellSize/2,20+cellSize/2,-1);
        } 
        if (!PageEmpty()){
            if (glob.sketchBookIndex===glob.sketchBook.length-1){
                orthoRender.drawIcon(glob.canvas.width-cellSize/2,20+cellSize/2,-4);
            } else {
                orthoRender.drawIcon(glob.canvas.width-cellSize/2,20+cellSize/2,-2);
            }
        }
    }

    if (iconSelect&&minDistHit)
    {            
        drawSelectionPanel(false,mousex,mousey);
    }
    //draw top panel
}

window.onload = doStart
window.onresize = renderApp
},{"./orthoGlobals":2,"./orthoRender":3}],2:[function(require,module,exports){
module.exports.drawGridLines = true;
module.exports.drawGridLines_Diagonal = false;
module.exports.drawLines = true;
module.exports.drawElements = true;
module.exports.drawSelectiveGridLines=false;

module.exports.scaleMin=0.25;
module.exports.scaleMax=1.0;

var glyphNames = [
"PersonA","PersonB","ThingA","ThingB","blank",//0-4
"Identity","","","","",//5-9
"","","","","",//10-14
"","","","","",//15-19
"","","","","",//20-24
"","","","","",//25-29
"","","","","",//30-34
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


},{}],3:[function(require,module,exports){
var glob = require('./orthoGlobals')
const cellSize = glob.cellSize;

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

function drawIcon(x,y,n){
    ctx=glob.ctx;
    ctx.fillStyle="#ffffff"
    ctx.strokeStyle="#000000"
    switch(n){

        case -1://left button
        {
            ctx.lineWidth=2;
            ctx.beginPath();
            var s = cellSize/3;
            ctx.moveTo(x+s,y);
            ctx.lineTo(x-s,y);
            ctx.lineTo(x-s/2,y-s);
            ctx.moveTo(x-s,y);
            ctx.lineTo(x-s/2,y+s);
            ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.stroke();
            ctx.lineWidth=1;
            break;   
        }
        case -2://right button
        {
            ctx.lineWidth=2;
            ctx.beginPath();
            var s = -cellSize/3;
            ctx.moveTo(x+s,y);
            ctx.lineTo(x-s,y);
            ctx.lineTo(x-s/2,y-s);
            ctx.moveTo(x-s,y);
            ctx.lineTo(x-s/2,y+s);
            ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.stroke();
            ctx.lineWidth=1;
            break;     
        }
        case -3://delete button
        {
            ctx.lineWidth=2;
            ctx.beginPath();
            var s = cellSize/3;
            ctx.moveTo(x+s,y+s);
            ctx.lineTo(x-s,y-s);
            ctx.moveTo(x+s,y-s);
            ctx.lineTo(x-s,y+s);
            ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.stroke();
            ctx.lineWidth=1;
            break;   
        }
        case -4://new icon
        {
            ctx.lineWidth=2;
            ctx.beginPath();
            var s = cellSize/3;
            var t = 0.2*s;
            ctx.moveTo(x-s,y-s);
            ctx.lineTo(x+t,y-s);
            ctx.lineTo(x+s,y-t);
            ctx.lineTo(x+s,y+s);
            ctx.lineTo(x-s,y+s);
            ctx.closePath();
            ctx.moveTo(x+t,y-s);
            ctx.lineTo(x+t,y-t);
            ctx.lineTo(x+s,y-t);

            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.stroke();


            ctx.lineWidth=1;
            break;     
        }

        case 0://square - solid
        {
            ctx.beginPath();
            var s = cellSize*glob.page.scale*0.3/1.41;
            ctx.moveTo(x-s,y-s);
            ctx.lineTo(x+s,y-s);
            ctx.lineTo(x+s,y+s);
            ctx.lineTo(x-s,y+s);
            ctx.closePath();
            ctx.fillStyle="#000000"
            ctx.fill();
            ctx.fillStyle="#ffffff"
            break;   
        }
        case 1://place marker - solid
        {
            var r = cellSize*0.4*glob.page.scale*0.9;
            ctx.beginPath();
            ctx.moveTo(x,y+r);
            ctx.lineTo(x-r/2,y);
            ctx.bezierCurveTo(x-r,y-r,x+r,y-r,x+r/2,y);
            //ctx.lineTo(x+r/4,y-2*r);
            ctx.closePath();
            ctx.fillStyle="#000000"
            ctx.fill();
            ctx.fillStyle="#ffffff"
            break;               
        }
        case 2://liquid - drop
        {
            var r = cellSize*0.4*glob.page.scale*0.9;
            ctx.beginPath();
            ctx.moveTo(x,y-r);
            ctx.lineTo(x-r/2,y);
            ctx.bezierCurveTo(x-r,y+r,x+r,y+r,x+r/2,y);
            //ctx.lineTo(x+r/4,y-r);
            ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();
            break;   
        }
        case 3://circle - outline        
        {
            ctx.beginPath();
            ctx.arc(x,y,cellSize*0.3*glob.page.scale,0,2*Math.PI);
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();
            break;   
        }
        case 4://dot
        {
            ctx.beginPath();
            ctx.arc(x,y,5*glob.page.scale,0,2*Math.PI);   
            ctx.fillStyle="#000000";
            ctx.fill();
            ctx.fillStyle="#ffffff"
            break;   
        }
        case 5://concetric circles
        {   
            var r = cellSize*0.4*glob.page.scale;
            var oldR=r;
            ctx.beginPath();
            ctx.arc(x,y,r,0,2*Math.PI);
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();

            r-=oldR*0.333;
            ctx.beginPath();
            ctx.arc(x,y,r,0,2*Math.PI);
            ctx.fill();
            ctx.stroke();

            r-=oldR*0.333;
            ctx.beginPath();
            ctx.arc(x,y,r,0,2*Math.PI);
            ctx.fill();
            ctx.stroke();
            break;   
        }
        case 6://diamond
        {
            ctx.beginPath();
            var s = cellSize*glob.page.scale*0.4;
            ctx.moveTo(x-s,y);
            ctx.lineTo(x,y+s);
            ctx.lineTo(x+s,y);
            ctx.lineTo(x,y-s);
            ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();
            break;   
        }  
        case 7://triangle outline            
        {
            ctx.beginPath();
            var s = cellSize*glob.page.scale*0.4/1000;
            ctx.moveTo(x+triangle[2*0+0]*s,y+triangle[2*0+1]*s);
            ctx.lineTo(x+triangle[2*2+0]*s,y+triangle[2*2+1]*s);
            ctx.lineTo(x+triangle[2*1+0]*s,y+triangle[2*1+1]*s);
            ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();
            break;  
        }    
        case 8://square - outline
        {
            ctx.beginPath();
            var s = cellSize*glob.page.scale*0.4/1.41;
            ctx.moveTo(x-s,y-s);
            ctx.lineTo(x+s,y-s);
            ctx.lineTo(x+s,y+s);
            ctx.lineTo(x-s,y+s);
            ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();
            break;   
        }   
        case 9://star            
        {

            ctx.beginPath();
            var s = cellSize*glob.page.scale*0.4/1000;
            ctx.moveTo(x+pentagon[2*0+0]*s,y+pentagon[2*0+1]*s);
            ctx.lineTo(x+pentagon[2*2+0]*s,y+pentagon[2*2+1]*s);
            ctx.lineTo(x+pentagon[2*4+0]*s,y+pentagon[2*4+1]*s);
            ctx.lineTo(x+pentagon[2*1+0]*s,y+pentagon[2*1+1]*s);
            ctx.lineTo(x+pentagon[2*3+0]*s,y+pentagon[2*3+1]*s);
            ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();
            break;   
        }
        case 10://clover
        {
            ctx.beginPath();
            var s = cellSize*glob.page.scale*0.2/1.41;
            ctx.moveTo(x-s,y-s);
            ctx.bezierCurveTo(x-2*s,y-3*s,x+2*s,y-3*s,x+s,y-s);
            ctx.bezierCurveTo(x+3*s,y-2*s,x+3*s,y+2*s,x+s,y+s);
            ctx.bezierCurveTo(x+2*s,y+3*s,x-2*s,y+3*s,x-s,y+s);
            ctx.bezierCurveTo(x-3*s,y+2*s,x-3*s,y-2*s,x-s,y-s);
            ctx.fill();
            ctx.stroke();
            break;   
        }
        case 11://interlocking circles
        {
            ctx.beginPath();
            var r = cellSize*0.3*glob.page.scale
            ctx.arc(x-r/2,y,r,0,2*Math.PI);
            ctx.arc(x+r/2,y,r,0,2*Math.PI);
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.beginPath();                
            ctx.arc(x-r/2,y,r,0,2*Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x+r/2,y,r,0,2*Math.PI);
            ctx.stroke();
            break;   
        }
        case 12://keyhole
        {
            ctx.beginPath();
            var r = cellSize*0.2*glob.page.scale;
            var s = cellSize*0.3*glob.page.scale; 
            var t = cellSize*0.2*glob.page.scale; 
            var a = 0.8*Math.PI/4;
            var dy = +cellSize*0.05*glob.page.scale;
            ctx.arc(x,y-r+dy,r,Math.PI/2+a,Math.PI*5/2-a);
            ctx.lineTo(x+t,y+s+dy);
            ctx.lineTo(x-t,y+s+dy);
            ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();  
            break;
        }
        case 13://half-circle, outline
        {
            ctx.beginPath();
            var r = cellSize*0.3*glob.page.scale
            ctx.arc(x+r/3,y,r,Math.PI/2,3*Math.PI/2);
            ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();  
            break;
        } 
        case 14://crown - outline
        {
            ctx.beginPath();
            var s = cellSize*glob.page.scale*0.2/1.41;
            var t = cellSize*glob.page.scale*0.5/1.41;
            var pointHeight = cellSize*glob.page.scale*0.3/1.41;
            var l = x-t;
            var r = x+t;
            var apex = y-s-pointHeight;
            var pointBottom=y-s;
            var dy = cellSize*glob.page.scale*0.1/1.41;
            ctx.moveTo(l,dy+apex);
            ctx.lineTo(l,dy+y+s);
            ctx.lineTo(r,dy+y+s);
            ctx.lineTo(r,dy+apex);
            ctx.lineTo(l*0.25+r*0.75,dy+pointBottom);   
            ctx.lineTo((l+r)/2,dy+apex);
            ctx.lineTo(l*0.75+r*0.25,dy+pointBottom);   
            ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();
            break;   
        }  
        case 15://eye
        {
            var r = cellSize*0.4*glob.page.scale;
            ctx.beginPath();
            ctx.moveTo(x-r,y);
            var top=r*0.8;
            ctx.bezierCurveTo(x-r/2,y-top,x+r/2,y-top,x+r,y);
            ctx.bezierCurveTo(x+r/2,y+top,x-r/2,y+top,x-r,y);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x,y,r/4,0,2*Math.PI);
            ctx.stroke();
            break;   
        }
        case 16://open mouth
        {
            ctx.fillStyle="#ffffff"
            ctx.strokeStyle="#000000"
            var r = cellSize*0.4*glob.page.scale;
            ctx.beginPath();
            ctx.moveTo(x-r,y);
            var top=r*0.8;
            ctx.bezierCurveTo(x-r/2,y-1.5*top,x+r/2,y-1.5*top,x+r,y);
            ctx.bezierCurveTo(x+r/2,y+1.5*top,x-r/2,y+1.5*top,x-r,y);
            ctx.fill();
            ctx.bezierCurveTo(x-r/2,y-top,x+r/2,y-top,x+r,y);
            ctx.bezierCurveTo(x+r/2,y+top,x-r/2,y+top,x-r,y);
            ctx.stroke();
            break;   
        }
        case 17://hand
        {
            ctx.beginPath();
            var s = cellSize*glob.page.scale*0.4/1.41;
            ctx.moveTo(x-s*0.8,y-2*s+s/2);
            ctx.lineTo(x-s*0.8,y+s);
            ctx.lineTo(x+s*0.8,y+s);
            ctx.lineTo(x+s*0.8,y-s/2);
            ctx.lineTo(x-s/4,y-s+s/2);
            ctx.lineTo(x-s/4,y-2*s+s/2);
            ctx.bezierCurveTo(x-s/4,y-2*s+s/2-s/2,x-s*0.8,y-2*s+s/2-s/2,x-s*0.8,y-2*s+s/2);
            ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();
            break;   
        }
        case 18://ear
        {
            ctx.beginPath();
            var dx = -cellSize*glob.page.scale*0.1/1.41;
            var e = cellSize*glob.page.scale*0.05/1.41;
            var s = cellSize*glob.page.scale*0.3/1.41;
            var t = cellSize*glob.page.scale*0.3/1.41;
            var u = cellSize*glob.page.scale*0.2/1.41;   
            x+=dx;             
            ctx.moveTo(x,y-u);
            ctx.bezierCurveTo(x-s,y-u,x-s,y-u-t,x,y-u-t);
            ctx.bezierCurveTo(x+2*s,y-u-t,x+2*s,y+u+t,x,y+u+t);
            ctx.bezierCurveTo(x-s,y+u+t,x-s,y+u,x,y+u);
            ctx.bezierCurveTo(x+s/2,y+u,x+s/2,y-u,x,y-u);
            ctx.fill();
            ctx.stroke();
            break;   
        }
        case 19://teeth
        {
            var r = cellSize*0.4*glob.page.scale;
            ctx.beginPath();
            ctx.moveTo(x-r,y);
            var top=r*0.8;
            ctx.bezierCurveTo(x-r/2,y-top,x+r/2,y-top,x+r,y);
            ctx.bezierCurveTo(x+r/2,y+top,x-r/2,y+top,x-r,y);
            ctx.fill();
            ctx.lineTo(x+r,y);

            ctx.moveTo(x,y-r/2);
            ctx.lineTo(x,y+r/2);
            ctx.moveTo(x-r/2,y-r/3);
            ctx.lineTo(x-r/2,y+r/3);
            ctx.moveTo(x+r/2,y-r/3);
            ctx.lineTo(x+r/2,y+r/3);
            ctx.stroke();
            break;   
        }       
        case 20://vertical eye                 
        {
            var r = cellSize*0.4*glob.page.scale;


            ctx.beginPath();
            ctx.moveTo(x,y-r);
            var top=r*0.8;
            ctx.bezierCurveTo(x-top,y-r/2,x-top,y+r/2,x,y+r);
            ctx.bezierCurveTo(x+top,y+r/2,x+top,y-r/2,x,y-r);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x,y,r/5,0,2*Math.PI);
            ctx.fillStyle="#000000"
            ctx.fill();
            ctx.fillStyle="#ffffff"
            break;   
        }
        case 21://nose
        {
            var r = cellSize*0.4*glob.page.scale*0.9;
            var dy = cellSize*0.4*glob.page.scale*0.1;
            y+=dy;
            ctx.beginPath();
            ctx.moveTo(x-r/4,y-r);
            ctx.lineTo(x-r/2,y);
            ctx.bezierCurveTo(x-r,y+r,x+r,y+r,x+r/2,y);
            ctx.lineTo(x+r/4,y-r);
            //ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();
            break;   
        }
        case 22://box with bent sides
        {
            ctx.beginPath();
            var r = cellSize*glob.page.scale*0.3;
            var s = cellSize*glob.page.scale*0.3;
            var t = cellSize*glob.page.scale*0.05;
            ctx.moveTo(x-s,y-r);
            ctx.lineTo(x+s,y-r);
            //ctx.bezierCurveTo(x,y-t,x,y-t,x+s,y-r);    
            ctx.bezierCurveTo(x+t,y,x+t,y,x+s,y+r);
            ctx.lineTo(x-s,y+r);
            //ctx.bezierCurveTo(x,y+t,x,y+t,x-s,y+r); 
            ctx.bezierCurveTo(x-t,y,x-t,y,x-s,y-r);
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();
            break;   
        }
        case 23://right-angled triangle
        {
            ctx.beginPath();
            var s = cellSize*glob.page.scale*0.4/1.41;
            x-=cellSize*glob.page.scale*0.15/1.41;
            y-=cellSize*glob.page.scale*0.15/1.41;

            ctx.moveTo(x+s,y-s);
            ctx.lineTo(x+s,y+s);
            ctx.lineTo(x-s,y+s);
            ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();
            break;   
        }   
        case 24://banana peel
        {
            ctx.beginPath();
            var e = cellSize*glob.page.scale*0.1;
            var r = cellSize*glob.page.scale*0.4;
            var t = cellSize*glob.page.scale*0.4;
            var dy = -cellSize*glob.page.scale*0.1;
            var yc = y-dy;
            y+=dy;
            ctx.moveTo(x-e,y-r/2);
            ctx.bezierCurveTo(x-2*e,y+r/5,x-e/5,y+r/5,x-t,y+r);
            ctx.bezierCurveTo(x,y+r,x-e/5,y+r/5,x,yc);

            ctx.bezierCurveTo(x+e/5,y+r/5,x,y+r,x+t,y+r);
            ctx.bezierCurveTo(x+e/5,y+r/5,x+2*e,y+r/5,x+e,y-r/2);

            ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();
            break;   
        }
        case 25://hexagon
        {
            ctx.beginPath();
            var a = Math.PI/3;
            var r = cellSize*glob.page.scale*0.4/1.41;                
            for (var i=0;i<=6;i++){
                var px = r*Math.sin(i*a);
                var py = r*Math.cos(i*a);
                if (i===0){
                    ctx.lineTo(x+px,y+py);
                } else {
                    ctx.lineTo(x+px,y+py);
                }
            }
            ctx.closePath();
            ctx.fillStyle="#ffffff"
            ctx.strokeStyle="#000000"
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();             
            for (var i=0;i<6;i+=2){
                var px = r*Math.sin(i*a);
                var py = r*Math.cos(i*a);
                ctx.moveTo(x,y);
                ctx.lineTo(x+px,y+py);                    
            }

            ctx.stroke();
            break;   
        }
        case 26://arrow
        {
            ctx.beginPath();
            var s = cellSize*glob.page.scale*0.4/1.41;
            var t = cellSize*glob.page.scale*0.4/1.41;
            ctx.moveTo(x-s,y-t);
            ctx.lineTo(x,y-t/3);
            ctx.lineTo(x+s,y-t);
            ctx.lineTo(x,y+t);
            ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();
            break;  
        }  
        case 27://diagonal flare            
        {
            ctx.beginPath();
            var r = cellSize*glob.page.scale*0.4;
            var s = cellSize*glob.page.scale*0.4;
            var t = cellSize*glob.page.scale*0.05;
            ctx.moveTo(x-s,y-r);
            ctx.bezierCurveTo(x,y-t,x,y-t,x+s,y-r);    
            ctx.bezierCurveTo(x+t,y,x+t,y,x+s,y+r);
            ctx.bezierCurveTo(x,y+t,x,y+t,x-s,y+r); 
            ctx.bezierCurveTo(x-t,y,x-t,y,x-s,y-r);
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();
            break;   
        }  
        case 28://lambda            
        {
            var r=cellSize*0.4*glob.page.scale;
            ctx.beginPath();
            ctx.arc(x,y,r,0,2*Math.PI);
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.moveTo(x-r/1.414,y+r/1.414);
            ctx.lineTo(x+r/1.414,y-r/1.414);
            ctx.moveTo(x+r/1.414,y+r/1.414);
            ctx.lineTo(x,y);
            ctx.stroke();
            break;   
        }  
        case 29://cross - outline
        {
            ctx.beginPath();
            var s = cellSize*glob.page.scale*0.15/1.41;
            var t = 3*s;
            ctx.moveTo(x-s,y-s);
            ctx.lineTo(x-s,y-t);
            ctx.lineTo(x+s,y-t);
            ctx.lineTo(x+s,y-s);
            ctx.lineTo(x+t,y-s);
            ctx.lineTo(x+t,y+s);
            ctx.lineTo(x+s,y+s);
            ctx.lineTo(x+s,y+t);
            ctx.lineTo(x-s,y+t);
            ctx.lineTo(x-s,y+s);
            ctx.lineTo(x-t,y+s);
            ctx.lineTo(x-t,y-s);
            ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();
            break;   
        }   
        case 30://yin yang
        {
            var r = cellSize*0.35*glob.page.scale;
            ctx.beginPath();
            ctx.arc(x,y,r,Math.PI/2,Math.PI/2+2*Math.PI);
            ctx.fillStyle="#000000"
            ctx.fill();                

            ctx.beginPath();
            ctx.arc(x,y,r,Math.PI/2+Math.PI/2,Math.PI/2+3*Math.PI/2);
            ctx.fillStyle="#ffffff"
            ctx.fill();


            ctx.beginPath();
            ctx.arc(x+r/2,y,r/2,Math.PI/2+0,Math.PI/2+2*Math.PI);
            ctx.fillStyle="#000000"
            ctx.fill();
            

            ctx.beginPath();
            ctx.arc(x-r/2,y,r/2,Math.PI/2+0,Math.PI/2+2*Math.PI);
            ctx.fillStyle="#ffffff"
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x,y,r,Math.PI/2+0,Math.PI/2+2*Math.PI);
            ctx.strokeStyle="#000000"      
            ctx.stroke();

            break;
        }

        case 31: //inside/outside box in box
        {
            ctx.beginPath();
            var s = cellSize*glob.page.scale*0.3;
            ctx.moveTo(x-s,y-s);
            ctx.lineTo(x+s,y-s);
            ctx.lineTo(x+s,y+s);
            ctx.lineTo(x-s,y+s);
            ctx.closePath();
            s*=0.66;
            ctx.moveTo(x-s,y-s);
            ctx.lineTo(x+s,y-s);
            ctx.lineTo(x+s,y+s);
            ctx.lineTo(x-s,y+s);
            ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();
            break;   
        }
        case 32: // part/many division
        {
            ctx.beginPath();
            var r = cellSize*0.4*glob.page.scale;
            ctx.arc(x,y,r,0,2*Math.PI);
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.moveTo(x-r,y);
            ctx.lineTo(x+r,y);
            ctx.strokeStyle="#000000"
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x,y-r/2,1,0,2*Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x,y+r/2,1,0,2*Math.PI);
            ctx.stroke();
            break;   
        }
        case 33://desire spiral
        {
            var r = cellSize*0.4*glob.page.scale;
            ctx.beginPath();
            ctx.arc(x,y,r,0,2*Math.PI);
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();          
            ctx.beginPath();
            var r2=r*2/3;
            var r3=r2/2;
            ctx.arc(x,y+r-r2-r3,r3,Math.PI/2,Math.PI*3/2);
            ctx.arc(x,y+r-r2,r2,3*Math.PI/2,Math.PI/2);
            ctx.arc(x,y,r,Math.PI/2,2*Math.PI);
            ctx.stroke();

            break;
        }
        case 34://page
        {
            ctx.beginPath();
            var s = cellSize*glob.page.scale*0.4/1.41;
            ctx.moveTo(x-s,y-s);
            ctx.lineTo(x+s,y-s);
            ctx.lineTo(x+s,y+s);
            ctx.lineTo(x-s,y+s);
            ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.moveTo(x-s*2/3,y-s/2);
            ctx.lineTo(x+s*2/3,y-s/2);
            ctx.moveTo(x-s*2/3,y);
            ctx.lineTo(x+s*2/3,y);
            ctx.moveTo(x-s*2/3,y+s/2);
            ctx.lineTo(x+s*2/3,y+s/2);
            ctx.stroke();
            break;   
        }
    }
}

function shouldDrawGridLine(x1,y1,x2,y2){
    if (glob.drawSelectiveGridLines===false){
        return true;
    }
    for (var i=0;i<glob.page.elements.length;i++){
        var e = glob.page.elements[i];
        var ex = glob.page.offsetX+e[0]*cellSize*glob.page.scale;
        var ey = glob.page.offsetY+e[1]*cellSize*glob.page.scale;

        if (PointOnLine([ex,ey],[x1,y1,x2,y2])){
            return true;
        }
    }
    return false;
}

var ctx=glob.ctx;
var canvas=glob.canvas;
function orthoRender(){            
  if (glob.ctx) { 
    ctx=glob.ctx;
    canvas=glob.canvas;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);  
    ctx.lineWidth = 1.0;                        

    if (glob.drawGridLines){
        //draw gui
        ctx.beginPath();
        var adjustX = glob.page.offsetX-Math.floor(glob.page.offsetX/(cellSize*glob.page.scale))*(cellSize*glob.page.scale);
        var adjustY = glob.page.offsetY-Math.floor(glob.page.offsetY/(cellSize*glob.page.scale))*(cellSize*glob.page.scale);
        adjustX/=2;
        adjustY/=2;
        var startX = Math.floor(adjustX-cellSize*glob.page.scale)+0.5;
        var startY = Math.floor(adjustY-cellSize*glob.page.scale)+0.5;
        
        for (var i=startX;i<canvas.width;i+=cellSize*glob.page.scale){ 
            var [x1,y1] = [i+adjustX,0]
            var [x2,y2] = [i+adjustX,ctx.canvas.height]
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
        }
        for (var j=startY;j<canvas.height;j+=cellSize*glob.page.scale){ 
            var [x1,y1] = [0,j+adjustY];
            var [x2,y2] = [ctx.canvas.width,j+adjustY];
            if (shouldDrawGridLine(x1,y1,x2,y2)){
                ctx.moveTo(x1,y1);
                ctx.lineTo(x2,y2);
            }
        }
        //log(adjustX+","+adjustY)
        if (glob.drawGridLines_Diagonal){     
            for (var i=startX;i<canvas.width;i+=cellSize*glob.page.scale){
                var [x1,y1] = [i+adjustX,startY+startX];
                var [x2,y2] = [i+adjustX+2*canvas.height,+startY+startX+2*canvas.height];
                if (shouldDrawGridLine(x1,y1,x2,y2)){
                    ctx.moveTo(x1,y1);
                    ctx.lineTo(x2,y2);
                }
            }       
            for (var i=startX-cellSize*glob.page.scale;i>-canvas.height;i-=cellSize*glob.page.scale){
                var [x1,y1] = [i+adjustX,+startY+startX];
                var [x2,y2] = [i+adjustX+2*canvas.height,+startY+startX+2*canvas.height];
                if (shouldDrawGridLine(x1,y1,x2,y2)){
                    ctx.moveTo(x1,y1);
                    ctx.lineTo(x2,y2);
                }
            }    
            for (var i=startX;i<(canvas.width+canvas.height);i+=cellSize*glob.page.scale){
                var [x1,y1] = [i+adjustX,+startY+startX];
                var [x2,y2] = [i+adjustX-2*canvas.height,+startY+startX+2*canvas.height];
                if (shouldDrawGridLine(x1,y1,x2,y2)){
                    ctx.moveTo(x1,y1);
                    ctx.lineTo(x2,y2);
                }
            }
        }
        var pc = 1-(glob.page.scale-glob.scaleMin)/(glob.scaleMax-glob.scaleMin);
        if (pc>1){
            pc=1;
        }
        if (pc<0){
            pc=0;
        }
        var a = Math.round(220+35*pc).toString(16);
        ctx.strokeStyle="#"+a+a+a;
        ctx.stroke();
    }

    if (glob.drawLines){
        ctx.beginPath();
        for (var i=0;i<glob.page.lines.length;i++){
            var l = glob.page.lines[i];
            var x1 = Math.floor(glob.page.offsetX+l[0]*cellSize*glob.page.scale)+0.5;
            var y1 = Math.floor(glob.page.offsetY+l[1]*cellSize*glob.page.scale)+0.5;
            var x2 = Math.floor(glob.page.offsetX+l[2]*cellSize*glob.page.scale)+0.5;
            var y2 = Math.floor(glob.page.offsetY+l[3]*cellSize*glob.page.scale)+0.5;
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            if (l[4]===1){
                var mx = (x1+x2)/2;
                var my = (y1+y2)/2;
                var t = Math.atan2(x2-x1,y2-y1);
                var dx = Math.sin(t+Math.PI/2);
                var dy = Math.cos(t+Math.PI/2);
                ctx.moveTo(
                    mx-dx*cellSize*glob.page.scale/5,
                    my-dy*cellSize*glob.page.scale/5);
                ctx.lineTo(
                    mx+dx*cellSize*glob.page.scale/5,
                    my+dy*cellSize*glob.page.scale/5);
            }
        }
        ctx.strokeStyle="#000000"
        ctx.stroke();
    }

    if (glob.drawElements){
        for (var i=0;i<glob.page.elements.length;i++){
            var e = glob.page.elements[i];
            drawIcon(glob.page.offsetX+e[0]*cellSize*glob.page.scale,glob.page.offsetY+e[1]*cellSize*glob.page.scale,e[2]);        
        }
    }

  }
}

module.exports.render=orthoRender;
module.exports.drawIcon=drawIcon;
},{"./orthoGlobals":2}]},{},[1]);
