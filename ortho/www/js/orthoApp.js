


function SaveState(){
    var sketch_save = JSON.stringify({book:sketchBook,page:sketchBookIndex});
    localStorage.setItem("sketchbookDat",sketch_save);
}
function TryRestoreState(){
    var sketch_save = localStorage.getItem("sketchbookDat");
    if (sketch_save!==null){
        var dat = JSON.parse(sketch_save);
        sketchBook=dat.book;
        sketchBookIndex=dat.page;
        LoadPage();
    }
}

function doStart(){
    for (var i=0;i<glyphNames.length;i++){
        glyphNames[i]=glyphNames[i].toUpperCase();
    }
    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    canvas.addEventListener("touchstart", handleStart, false);
    canvas.addEventListener("touchend", handleEnd, false);
    canvas.addEventListener("touchcancel", handleEnd, false);
    canvas.addEventListener("touchleave", handleEnd, false);
    canvas.addEventListener("touchmove", handleMove, false);
    TryRestoreState();

    renderApp();
}


function LoadPage(){
    if(sketchBookIndex===sketchBook.length){
        sketchBook.push({
            elements:[],
            lines:[],
            offsetX:0,
            offsetY:0,
            scale:1,
            sketchTitle:""
        });
    }
    page=sketchBook[sketchBookIndex];
    renderApp();
}
function PageLeft(){
    if (sketchBookIndex===0){
        return;
    }
    sketchBookIndex--;  
    LoadPage();      
    SaveState();
}

function PageEmpty(){
    return page.lines.length===0&&page.elements.length===0;
}
function PageRight(){
    if (PageEmpty()===false){
        sketchBookIndex++;
        LoadPage();
        SaveState();
    }
}

function clearEverything(){        
    sketchBook.splice(sketchBookIndex,1);
    if (sketchBookIndex===sketchBook.length &&
        sketchBookIndex>0){
        sketchBookIndex--;
    }
    LoadPage();
}

function iconAt(tx,ty){
    for (var i=0;i<page.elements.length;i++){
        var el = page.elements[i];
        if (el[0]===tx&&el[1]===ty){
            return true;
        }
    }
    return false;
}

function handleStart(evt) {

    console.log("handleStart\t"+evt.touches.length+"\t"+toolbarSelect);
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

        var cx = t.clientX-page.offsetX;
        var cy = t.clientY-page.offsetY;

        if (t.clientY<cellSize+20){

            toolbarSelect=true;
            console.log("toolbarSelect = "+toolbarSelect);

            if (t.clientX<cellSize){
                //delete
                clearEverything();
            } else if (t.clientX<canvas.width-2*cellSize){
                //set title
                newTitle();
            } else if (t.clientX<canvas.width-cellSize){
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

        var gx = Math.round(cx/(cellSize*page.scale));
        var gy = Math.round(cy/(cellSize*page.scale));
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
    var s = prompt("enter title",page.sketchTitle).toUpperCase();
    if (s.length>5){
        s=s.substr(0,5);
    }
    page.sketchTitle=s;
    SaveState();
}
function clickCell(x,y,n){
    for (var i=0;i<page.elements.length;i++){
        var e = page.elements[i];
        if (e[0]===x&&e[1]===y){
            page.elements.splice(i,1);
            break;
        }
    }
    page.elements.push([x,y,n]);
    SaveState();
}

function tryRemoveCell(x,y){
    for (var i=0;i<page.elements.length;i++){
        var e = page.elements[i];
        if (e[0]===x&&e[1]===y){
            page.elements.splice(i,1);
            break;
        }
    }   

    for (var i=0;i<page.lines.length;i++){
        var l = page.lines[i];
        var x1=l[0];
        var y1=l[1];
        var x2=l[2];
        var y2=l[3];
        if (x1===x&&y1===y){
            if (!iconAt(x2,y2)){
                page.lines.splice(i,1);
                i--;
            }
        } else if (x2===x&&y2===y){
            if (!iconAt(x1,y1)){
                page.lines.splice(i,1);
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

    for (var i=0;i<page.lines.length;i++){
        var l = page.lines[i];
        if (l[0]===x1&&l[1]===y1&&l[2]===x2&&l[3]===y2) {
            if (l[4]===0){
                l[4]=1;
            } else {
                page.lines.splice(i,1);
            }
            return;
        }
    }

    page.lines.push([x1,y1,x2,y2,0]);
    SaveState();
}


function handleEnd(evt){
    console.log("handleEnd\t"+evt.touches.length+"\t"+toolbarSelect);
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

    if (page.scale<=scaleMin){
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

        var cx = t.clientX-page.offsetX;
        var cy = t.clientY-page.offsetY;

        var gx = Math.round(cx/(cellSize*page.scale));
        var gy = Math.round(cy/(cellSize*page.scale));

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
    if (evt.touches.length===1&&page.scale>scaleMin){  
        var t = evt.touches[0];          
        mousex=t.clientX;
        mousey=t.clientY;
        var d = dist([startPosX,startPosY,mousex,mousey]);
        if (iconSelect&& d>minDist){
            minDistHit=true;
        }
        renderApp();
    }

    if (evt.touches.length===2||(evt.touches.length==1&&page.scale<=scaleMin)){
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
        page.offsetX+=(curCenterX-oldCenterX);
        page.offsetY+=(curCenterY-oldCenterY);


        var oldDist = dist(oldtouches);
        var newDist = dist(curtouches);
        var scaleMultiplier = newDist/oldDist;
        var oldScale=page.scale;
        if ( evt.touches.length===2){
            page.scale = page.scale * scaleMultiplier;
            if (page.scale<scaleMin){
                page.scale=scaleMin;
            } 
            if (page.scale>scaleMax){
                page.scale=scaleMax;
            }
            //scale around center
            var dOffsetX=page.offsetX-curCenterX;
            var dOffsetY=page.offsetY-curCenterY;
            page.offsetX=dOffsetX*page.scale/oldScale+curCenterX;
            page.offsetY=dOffsetY*page.scale/oldScale+curCenterY;
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
    var panelRows=5;
    var panelCols=Math.ceil(symbolCount/panelRows);

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
        highlightedglyphtext=glyphNames[i];
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

        drawIcon(
            titleBarLeft+cellSize/2,titleBarMid,highlightedglyphicon);
        drawIcon(
            titleBarRight-cellSize/2,titleBarMid,highlightedglyphicon);
    }

    var oldscale=page.scale;
    page.scale=1;
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
        drawIcon(mx,my,i);

    }
    page.scale=oldscale;

    ctx.globalalpha=1.0;
}

function renderApp(){
    orthoRender();


    {
        //window title bar
        ctx.strokeStyle="#000000";
        ctx.fillStyle="#ffffff";

        ctx.beginPath();
        ctx.moveTo(0,0);        
        ctx.lineTo(canvas.width,0);
        ctx.lineTo(canvas.width,20+cellSize);
        ctx.lineTo(0,20+cellSize);
        ctx.closePath();
        ctx.fill()
        ctx.stroke()

        //left button

        if (sketchBook.length===1&&PageEmpty()){
        } else {
            drawIcon(cellSize/2,20+cellSize/2,-3);
        }

        ctx.fillStyle="#000000";
        ctx.textAlign ="center";
        ctx.font = "38px helvetica";
        ctx.fillText(page.sketchTitle,(canvas.width-cellSize)/2,20+cellSize-14);

        if (sketchBookIndex>0){
            drawIcon(canvas.width-3*cellSize/2,20+cellSize/2,-1);
        } 
        if (!PageEmpty()){
            if (sketchBookIndex===sketchBook.length-1){
                drawIcon(canvas.width-cellSize/2,20+cellSize/2,-4);
            } else {
                drawIcon(canvas.width-cellSize/2,20+cellSize/2,-2);
            }
        }
    }

    if (iconSelect&&minDistHit)
    {            
        drawSelectionPanel(false,mousex,mousey);
    }

    //draw top panel
}