var glob = require('./orthoGlobals')
var canvasRender = require('./canvasRender')
var entityNames = require('../res/entityNames.json')
var lib = require('./orthoLib')

const cellSize = glob.cellSize;
var iconSelect=false;

const scaleMin=glob.scaleMin;
const scaleMax=glob.scaleMax;
var toolbarSelect=false;

var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

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

var emailAddress = '';

var emailLoaded = (localStorage.getItem("glob.emailAddress"));
if (emailLoaded){
    emailAddress=emailLoaded;
}

function DoUndo(){
    if (UndoStack.length<2){
        return;
    }

    UndoStack.splice(UndoStack.length-1,1);
    var last = UndoStack[UndoStack.length-1];
    TryRestoreState(last) 
    lib.FixPageLines()
    SaveState(false,false);
}

function SaveState(fullbookprint=false,pushToUndoStack=true){
    var sketch_save = JSON.stringify({book:glob.sketchBook,page:glob.sketchBookIndex});
    localStorage.setItem("glob.sketchBookDat",sketch_save);
    if (pushToUndoStack){
        UndoStack.push(sketch_save)
    }
}

function DoPrint(printAll){
    if(printAll){
        alert(JSON.stringify(glob.sketchBook))
    } else {
        alert(JSON.stringify(glob.page))
    }
}

function DoLoad(loadAll){
    var str = prompt("Enter page data", "");
    var newPage = JSON.parse(str);

    if (newPage.elements===undefined){
        glob.sketchBook = newPage;
        glob.page=glob.sketchBook[0]
        glob.sketchBookIndex=0;
    } else {        
        if (PageEmpty()&&glob.sketchBookIndex===glob.sketchBook.length-1){
            glob.sketchBook.splice(glob.sketchBookIndex,1);
        }
        glob.sketchBook.push(newPage);
        glob.sketchBookIndex=glob.sketchBook.length-1;    
    }
    LoadPage();   
    lib.MoveOriginToTopLeft(12,7)
    SaveState(true);
}

var clipboard="";
function DoCopy(){
    clipboard=JSON.stringify(glob.page)
}
function DoPaste(){
    if (clipboard===""){
        return;
    }
    var newPage = JSON.parse(clipboard);

    if (PageEmpty()&&glob.sketchBookIndex===glob.sketchBook.length-1){
        glob.sketchBook.splice(glob.sketchBookIndex,1);
    }
    glob.sketchBook.push(newPage);
    glob.sketchBookIndex=glob.sketchBook.length-1;    

    LoadPage();   
    lib.MoveOriginToTopLeft(4,4)
    SaveState(true);

}

function TryRestoreState(sketch_save){
/*

       var dict = require("../../dat/scrapbook/dictionarytemplate.json")
        glob.sketchBook=dict;
        glob.sketchBookIndex=0;
        LoadPage();
*/
    var undoing=sketch_save!=null;

    sketch_save = sketch_save || localStorage.getItem("glob.sketchBookDat");
    if (sketch_save!==null){
        if (!undoing){
            UndoStack.push(sketch_save);
        }
        var dat = JSON.parse(sketch_save);
        glob.sketchBook=dat.book;
        glob.sketchBookIndex=dat.page;
        lib.FixPageLines();
        LoadPage();
    } else {        
        SaveState();
    }
}

var ctx
var canvas


function DoShowGfxLink(){
    var pageCode="";

    pageCode+=glob.page.elements.length+",";
    for (var e of glob.page.elements){
        pageCode+=`${e[0]},${e[1]},${e[2]},`
    }
    pageCode+=glob.page.lines.length+",";
    for (var l of glob.page.lines){
        pageCode+=`${l[0]},${l[1]},${l[2]},${l[3]},${l[4]},`
    }
    var linkURL = "../../webrender/?r="+pageCode.substring(0,pageCode.length-1);
    window.open(linkURL,'_blank');
}

function doStart(){
    glob.canvas = document.getElementById("mainCanvas");
    glob.ctx=glob.canvas.getContext('2d');
    canvas=glob.canvas
    ctx = glob.ctx;
    ctx.imageSmoothingEnabled = false;


    function handleKeyDown(evt){
        if (evt.keyCode===13){
            newTitle();
            renderApp();
        } else if (evt.keyCode===37){
            PageLeft();
            renderApp();
        } else if (evt.keyCode===39){
            PageRight();
            renderApp();
        }  else if (evt.keyCode===90){
            DoUndo();
            renderApp();
        } else if (evt.keyCode===80){
            DoPrint(evt.shiftKey);
        }  else if (evt.keyCode===76){
            DoLoad(evt.shiftKey);
        }   else if (evt.keyCode===67){
            DoCopy();
        }   else if (evt.keyCode===86){
            DoPaste();
        } else if (evt.keyCode===75){
            DoShowGfxLink();
        } else if (evt.keyCode===87){
            //up
            glob.page.offsetY+=glob.cellSize;
            SaveState(true);
            renderApp();
        }   else if (evt.keyCode===83){
            //down
            glob.page.offsetY-=glob.cellSize;
            SaveState(true);
            renderApp();
        }    else if (evt.keyCode===65){
            //left
            glob.page.offsetX+=glob.cellSize;
            SaveState(true);
            renderApp();
        }    else if (evt.keyCode===68){
            //right
            glob.page.offsetX-=glob.cellSize;
            SaveState(true);
            renderApp();
        } 

    }

    document.addEventListener('keydown', handleKeyDown, false);

    glob.canvas.addEventListener("mousedown", handleStart, false);
    glob.canvas.addEventListener("mousemove", handleMove, false);
    glob.canvas.addEventListener("mouseup", handleEnd, false);

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
    glob.page=glob.sketchBook[glob.sketchBookIndex];

    lib.FixPageLines()
    renderApp();
}

function PageLeft(){
    if (glob.sketchBookIndex===0){
        return;
    }
    if (PageEmpty()&&glob.sketchBookIndex===glob.sketchBook.length-1){
        glob.sketchBook.splice(glob.sketchBookIndex,1);
    }
    glob.sketchBookIndex--;  
    LoadPage();      
    SaveState(true);
}

function PageEmpty(){
    return glob.page.lines.length===0&&glob.page.elements.length===0&&glob.page.sketchTitle==="";
}
function PageRight(){
    if (PageEmpty()===false){
        glob.sketchBookIndex++;
        LoadPage();
        SaveState(true);
    }
}

function clearEverything(){        
    glob.sketchBook.splice(glob.sketchBookIndex,1);
    if (glob.sketchBookIndex===glob.sketchBook.length &&
        glob.sketchBookIndex>0){
        glob.sketchBookIndex--;
    }
    LoadPage();
    SaveState();
}

function triggerPan(evt){
    if ("touches" in evt){
        if (evt.touches.length===2){
            return true;
        }
        return false;
    } else {
        return evt.button===2;
    }
}

function zoomCoords(evt){
    if ("touches" in evt){
         return evt.touches.length===2 ?
                [evt.touches[0].clientX,evt.touches[0].clientY,evt.touches[1].clientX,evt.touches[1].clientY] :
                [evt.touches[0].clientX,evt.touches[0].clientY,evt.touches[0].clientX,evt.touches[0].clientY];
    } else {
        return [evt.clientX,event.clientY,event.clientX,event.clientY]
    }
}

function exactlyOneDown(evt){
    if ("touches" in evt){
        return evt.touches.length===1;
    } else {
        return mouseState!==-1;
    }
}

function noTouches(evt){
    if ("touches" in evt){
        return evt.touches.length===0;
    } else {
        return true
    }
}
function getTouch(evt){
    if ("touches" in evt){
        return evt.touches[0];
    } else {
        return evt;
    }

}

function changedTouch(evt){
    if ("touches" in evt){
        return evt.changedTouches[0];
    } else {
        return evt;
    }
}


function changedTouches(evt){
    if ("touches" in evt){
        return evt.changedTouches;
    } else {
        return [evt];
    }
}

var mouseState=-1; //global check mouse state

function handleStart(evt) {
    mouseState=evt.button;

    if (iconSelect===true){
        iconSelect=false;
    }
    evt.preventDefault();

    if (triggerPan(evt)){
        moved=true;
        oldtouches=zoomCoords(evt);
    } 
   if (exactlyOneDown(evt)){

        var t= changedTouch(evt);

        var cx = t.clientX-glob.page.offsetX;
        var cy = t.clientY-glob.page.offsetY;

        if (t.clientY<cellSize+20){

            toolbarSelect=true;
            
            if (t.clientX<cellSize){
                //delete
                clearEverything();
            } else if (t.clientX<glob.canvas.width-3*cellSize){
                //set title
                newTitle();
            } else if (t.clientX<glob.canvas.width-2*cellSize){
                //set title
                if (iOS){
                    var dat = JSON.stringify(glob.sketchBook)

                    console.log("EMAIL ADDY '" + emailAddress+"'");

                    if (emailAddress == ""){
                        emailAddress = prompt("enter email address","");
                        localStorage.setItem("glob.emailAddress",emailAddress);
                    }

                    cordova.plugins.email.open({
                        to:      emailAddress,
                        //cc:      'erika@mustermann.de',
                        //bcc:     ['john@doe.com', 'jane@doe.com'],
                        subject: 'Orthona Sketchbook',
                        body:    dat
                    });
                } else {
                    
                    DoPrint(true);                
                }

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
        oldtouches=zoomCoords(evt);

        var gx = Math.round(cx/(cellSize*glob.page.scale));
        var gy = Math.round(cy/(cellSize*glob.page.scale));
        mousex=t.clientX;
        mousey=t.clientY;
        var iconat = lib.iconAt(gx,gy);
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
//    if (s.length>5){
//        s=s.substr(0,5);
//    }
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




function handleEnd(evt){
    mouseState=-1;
    evt.preventDefault();
    if (cleared===true || moved===true || toolbarSelect===true){
        if (noTouches(evt)){
            cleared=false;
            moved=false;
            toolbarSelect=false;
        }
        renderApp();
        return;

    }

    if (glob.page.scale<=scaleMin){
        renderApp();
        return;
    }

    if (noTouches(evt)){
        if (iconSelect){
            if (minDistHit){
                var t = changedTouch(evt);
                var px = t.clientX;
                var py = t.clientY;
                drawSelectionPanel(true,px,py);
                iconSelect=false;
                renderApp();
                return;
            }/* else {
                clickCell(oldX,oldY,4);
                renderApp();
                return;
            }*/
        }
    }

    var ct = changedTouches(evt)
    for (var i=0;i<ct.length;i++){

        var t= ct[i];

        var cx = t.clientX-glob.page.offsetX;
        var cy = t.clientY-glob.page.offsetY;

        var gx = Math.round(cx/(cellSize*glob.page.scale));
        var gy = Math.round(cy/(cellSize*glob.page.scale));

        if (oldX===gx && oldY===gy){
            lib.tryRemoveCellAt(gx,gy);
            SaveState();
        } else {
            lib.makeLine(oldX,oldY,gx,gy);
            SaveState();
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


old_SP_Highlighted_Glyph=-14;

function handleMove(evt) {
    if (mouseState===-1){
        iconSelect=false;
    }

    evt.preventDefault();

    if (cleared===true){
        return;
    }
    if (exactlyOneDown(evt)&&glob.page.scale>scaleMin){  
        var t = getTouch(evt);          
        mousex=t.clientX;
        mousey=t.clientY;
        var d = dist([startPosX,startPosY,mousex,mousey]);
        var oldminDistHit=minDistHit;
        if (iconSelect&& d>minDist){
            minDistHit=true;
        }

        var ct = changedTouch(evt)
        var px = ct.clientX;
        var py = ct.clientY;
        var highlightedGlyph = getHighlightedGlyphIndex(px,py);
        if (old_SP_Highlighted_Glyph!==highlightedGlyph ||
            oldminDistHit!==minDistHit){
            renderApp();

        }
        old_SP_Highlighted_Glyph=highlightedGlyph;

        return;
    }

    if (triggerPan(evt)||(exactlyOneDown(evt)&&glob.page.scale<=scaleMin)){
        var curtouches = zoomCoords(evt);
                
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
        if ( triggerPan(evt)){
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
    }


    if (mouseState!==-1) {
        renderApp();
        oldtouches=null;
    }
    
}




function getHighlightedGlyphIndex(x,y){
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
    panelTop+=cellSize/2;
    panelBottom+=cellSize/2;

    var ox = panelLeft;
    var oy = panelTop;


    var dx=x-ox;
    var dy=y-oy;
    var w = panelRight-panelLeft;
    var h = panelBottom-panelTop;
    var highlightedglyphicon;
    if (dx<0||dy<0||dx>=w||dy>=h){
        highlightedglyphicon=-1;
        //nothing
    } else {
        var xpos = Math.floor(dx/cellSize);
        var ypos = Math.floor(dy/cellSize);
        var i = xpos+ypos*panelRows;
        highlightedglyphicon=i;
    }
    
    return highlightedglyphicon;

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
    panelTop+=cellSize/2;
    panelBottom+=cellSize/2;

    var ox = panelLeft;
    var oy = panelTop;


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

        highlightedglyphtext=entityNames[i].toUpperCase();
        if (select===true){
            clickCell(oldX,oldY,i);
            return;
        }
    }
    

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

    //draw name
    ctx.lineWidth = 0;                        
    ctx.fillStyle="#000000";
    ctx.textAlign ="center";
    ctx.font = "38px helvetica";
    ctx.fillText(highlightedglyphtext,(titleBarLeft+titleBarRight)/2,titleBarBottom-14);
    if (highlightedglyphicon>=0){
        var titleBarMid = (titleBarTop+titleBarBottom)/2;

        canvasRender.drawIcon(
            titleBarLeft+cellSize/2,titleBarMid,highlightedglyphicon);
        canvasRender.drawIcon(
            titleBarRight-cellSize/2,titleBarMid,highlightedglyphicon);
    }

    var oldscale=glob.page.scale;
    glob.page.scale=1;
    for (var i=0;i<35;i++){            
        var ix = i%panelRows;
        var iy = Math.floor(i/panelRows);
        if (ix===gridx&&iy===gridy){
            ctx.globalalpha=1.0;
        }
        var mx = ox+ix*cellSize+cellSize/2;
        var my = oy+iy*cellSize+cellSize/2;
        if (i===highlightedglyphicon){
            ctx.fillStyle="#bbbbbb";
            ctx.beginPath();
            ctx.moveTo(mx-cellSize/2,my-cellSize/2);
            ctx.lineTo(mx+cellSize/2,my-cellSize/2);
            ctx.lineTo(mx+cellSize/2,my+cellSize/2);
            ctx.lineTo(mx-cellSize/2,my+cellSize/2);
            ctx.closePath();
            ctx.fill()
        }
        canvasRender.drawIcon(mx,my,i);

    }
    glob.page.scale=oldscale;

    ctx.globalalpha=1.0;
    return true;
}

function renderApp(){
    console.log("rendering")
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    
    canvasRender.render();

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
            canvasRender.drawIcon(cellSize/2,20+cellSize/2,-3);
        }

        ctx.fillStyle="#000000";
        ctx.textAlign ="center";
        ctx.font = "38px helvetica";
        ctx.fillText(glob.page.sketchTitle,(glob.canvas.width-cellSize)/2,20+cellSize-14);

        if (glob.sketchBookIndex>0){
            canvasRender.drawIcon(glob.canvas.width-3*cellSize/2,20+cellSize/2,-1);
        } 
        if (!PageEmpty()){
            if (glob.sketchBookIndex===glob.sketchBook.length-1){
                canvasRender.drawIcon(glob.canvas.width-cellSize/2,20+cellSize/2,-4);
            } else {
                canvasRender.drawIcon(glob.canvas.width-cellSize/2,20+cellSize/2,-2);
            }
        }
        canvasRender.drawIcon(glob.canvas.width-5*cellSize/2,20+cellSize/2,-5);
    }

    if (iconSelect&&minDistHit)
    {            
        drawSelectionPanel(false,mousex,mousey);
    }
    //draw top panel
}

window.onload = doStart
window.onresize = renderApp

