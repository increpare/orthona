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
            var s = cellSize*page.scale*0.3/1.41;
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
            var r = cellSize*0.4*page.scale*0.9;
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
            var r = cellSize*0.4*page.scale*0.9;
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
            ctx.arc(x,y,cellSize*0.3*page.scale,0,2*Math.PI);
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();
            break;   
        }
        case 4://dot
        {
            ctx.beginPath();
            ctx.arc(x,y,5*page.scale,0,2*Math.PI);   
            ctx.fillStyle="#000000";
            ctx.fill();
            ctx.fillStyle="#ffffff"
            break;   
        }
        case 5://concetric circles
        {   
            var r = cellSize*0.4*page.scale;
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
            var s = cellSize*page.scale*0.4;
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
            var s = cellSize*page.scale*0.4/1000;
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
            var s = cellSize*page.scale*0.4/1.41;
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
            var s = cellSize*page.scale*0.4/1000;
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
            var s = cellSize*page.scale*0.2/1.41;
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
            var r = cellSize*0.3*page.scale
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
            var r = cellSize*0.2*page.scale;
            var s = cellSize*0.3*page.scale; 
            var t = cellSize*0.2*page.scale; 
            var a = 0.8*Math.PI/4;
            var dy = +cellSize*0.05*page.scale;
            ctx.arc(x,y-r+dy,r,Math.PI/2+a,Math.PI*5/2-a);
            ctx.lineTo(x+t,y+s+dy);
            ctx.lineTo(x-t,y+s+dy);
            ctx.closePath();
            ctx.strokeStyle="#000000"
            ctx.fillStyle="#ffffff"
            ctx.fill();
            ctx.stroke();  
            /*ctx.beginPath();
            ctx.arc(x,y-r+dy,r*0.6,0,2*Math.PI);
            ctx.stroke(); */
            break;
        }
        case 13://half-circle, outline
        {
            ctx.beginPath();
            var r = cellSize*0.3*page.scale
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
            var s = cellSize*page.scale*0.2/1.41;
            var t = cellSize*page.scale*0.5/1.41;
            var pointHeight = cellSize*page.scale*0.3/1.41;
            var l = x-t;
            var r = x+t;
            var apex = y-s-pointHeight;
            var pointBottom=y-s;
            var dy = cellSize*page.scale*0.1/1.41;
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
            var r = cellSize*0.4*page.scale;
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
            var r = cellSize*0.4*page.scale;
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
            var s = cellSize*page.scale*0.4/1.41;
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
            var dx = -cellSize*page.scale*0.1/1.41;
            var e = cellSize*page.scale*0.05/1.41;
            var s = cellSize*page.scale*0.3/1.41;
            var t = cellSize*page.scale*0.3/1.41;
            var u = cellSize*page.scale*0.2/1.41;   
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
            var r = cellSize*0.4*page.scale;
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
            var r = cellSize*0.4*page.scale;


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
            var r = cellSize*0.4*page.scale*0.9;
            var dy = cellSize*0.4*page.scale*0.1;
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
            var r = cellSize*page.scale*0.3;
            var s = cellSize*page.scale*0.3;
            var t = cellSize*page.scale*0.05;
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
            var s = cellSize*page.scale*0.4/1.41;
            x-=cellSize*page.scale*0.15/1.41;
            y-=cellSize*page.scale*0.15/1.41;

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
            var e = cellSize*page.scale*0.1;
            var r = cellSize*page.scale*0.4;
            var t = cellSize*page.scale*0.4;
            var dy = -cellSize*page.scale*0.1;
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
            var r = cellSize*page.scale*0.4/1.41;                
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
            var s = cellSize*page.scale*0.4/1.41;
            var t = cellSize*page.scale*0.4/1.41;
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
            var r = cellSize*page.scale*0.4;
            var s = cellSize*page.scale*0.4;
            var t = cellSize*page.scale*0.05;
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
            var r=cellSize*0.4*page.scale;
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
            var s = cellSize*page.scale*0.15/1.41;
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
            var r = cellSize*0.35*page.scale;
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
            var s = cellSize*page.scale*0.3;
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
            var r = cellSize*0.4*page.scale;
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
            var r = cellSize*0.4*page.scale;
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
            var s = cellSize*page.scale*0.4/1.41;
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

function orthoRender(){            
  if (canvas.getContext) { 
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);  
    ctx.lineWidth = 1.0;                        

    if (drawGridLines){
        //draw gui
        ctx.beginPath();
        var adjustX = page.offsetX-Math.floor(page.offsetX/(cellSize*page.scale))*(cellSize*page.scale);
        var adjustY = page.offsetY-Math.floor(page.offsetY/(cellSize*page.scale))*(cellSize*page.scale);
        adjustX/=2;
        adjustY/=2;
        var startX = Math.floor(adjustX-cellSize*page.scale)+0.5;
        var startY = Math.floor(adjustY-cellSize*page.scale)+0.5;
        
        for (var i=startX;i<canvas.width;i+=cellSize*page.scale){ 
            ctx.moveTo(i+adjustX,0);
            ctx.lineTo(i+adjustX,ctx.canvas.height);
        }
        for (var j=startY;j<canvas.height;j+=cellSize*page.scale){ 
            ctx.moveTo(0,j+adjustY);
            ctx.lineTo(ctx.canvas.width,j+adjustY);
        }
        //log(adjustX+","+adjustY)
        if (drawGridLines_Diagonal){     
            for (var i=startX;i<canvas.width;i+=cellSize*page.scale){
                ctx.moveTo(i+adjustX,startY+startX);
                ctx.lineTo(i+adjustX+2*canvas.height,+startY+startX+2*canvas.height);
            }       
            for (var i=startX-cellSize*page.scale;i>-canvas.height;i-=cellSize*page.scale){
                ctx.moveTo(i+adjustX,+startY+startX);
                ctx.lineTo(i+adjustX+2*canvas.height,+startY+startX+2*canvas.height);
            }    
            for (var i=startX;i<(canvas.width+canvas.height);i+=cellSize*page.scale){
                ctx.moveTo(i+adjustX,+startY+startX);
                ctx.lineTo(i+adjustX-2*canvas.height,+startY+startX+2*canvas.height);
            }
        }
        var pc = 1-(page.scale-scaleMin)/(scaleMax-scaleMin);
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

    if (drawLines){
        ctx.beginPath();
        for (var i=0;i<page.lines.length;i++){
            var l = page.lines[i];
            var x1 = Math.floor(page.offsetX+l[0]*cellSize*page.scale)+0.5;
            var y1 = Math.floor(page.offsetY+l[1]*cellSize*page.scale)+0.5;
            var x2 = Math.floor(page.offsetX+l[2]*cellSize*page.scale)+0.5;
            var y2 = Math.floor(page.offsetY+l[3]*cellSize*page.scale)+0.5;
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            if (l[4]===1){
                var mx = (x1+x2)/2;
                var my = (y1+y2)/2;
                var t = Math.atan2(x2-x1,y2-y1);
                var dx = Math.sin(t+Math.PI/2);
                var dy = Math.cos(t+Math.PI/2);
                ctx.moveTo(
                    mx-dx*cellSize*page.scale/5,
                    my-dy*cellSize*page.scale/5);
                ctx.lineTo(
                    mx+dx*cellSize*page.scale/5,
                    my+dy*cellSize*page.scale/5);
            }
        }
        ctx.strokeStyle="#000000"
        ctx.stroke();
    }

    if (drawElements){
        for (var i=0;i<page.elements.length;i++){
            var e = page.elements[i];
            drawIcon(page.offsetX+e[0]*cellSize*page.scale,page.offsetY+e[1]*cellSize*page.scale,e[2]);        
        }
    }

  }
}