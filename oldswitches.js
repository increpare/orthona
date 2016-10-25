case 0: // good/bad yinyang
            {
                var r = cellSize*0.4*page.scale;
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
            case 1: //inside/outside box in box
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
            case 2: // part/many division
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
            case 3: // temperature (lines coming in from outside)
            {
                ctx.beginPath();
                var r = cellSize*0.4*page.scale;
                ctx.arc(x,y,r,0,2*Math.PI);
                ctx.strokeStyle="#000000"
                ctx.fillStyle="#ffffff"
                ctx.fill();
                ctx.moveTo(x-r,y);
                ctx.lineTo(x-r/2,y);
                ctx.moveTo(x,y-r);
                ctx.lineTo(x,y-r/2);
                ctx.moveTo(x+r,y);
                ctx.lineTo(x+r/2,y);
                ctx.moveTo(x,y+r);
                ctx.lineTo(x,y+r/2);
                ctx.stroke();
                break;   
            }
            case 4://desire spiral
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
            case 5://knowledge - page
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
            case 6://place, marker
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
            case 7://size arrows
            {
                ctx.beginPath();
                var r = cellSize*0.4*page.scale
                ctx.lineWidth = 2.0;      
                ctx.beginPath();
                ctx.moveTo(x-r,y-r/3);
                ctx.lineTo(x-r,y+r/3);
                ctx.moveTo(x+r,y-r/3);
                ctx.lineTo(x+r,y+r/3);
                ctx.moveTo(x-r/3,y-r);
                ctx.lineTo(x+r/3,y-r);
                ctx.moveTo(x-r/3,y+r);
                ctx.lineTo(x+r/3,y+r);
                ctx.moveTo(x-r,y);
                ctx.lineTo(x+r,y);
                ctx.moveTo(x,y-r);
                ctx.lineTo(x,y+r);
                ctx.stroke();
                ctx.lineWidth = 1.0;      
                break;   
            }
            case 8://height arrows
            {
                ctx.beginPath();
                ctx.lineWidth = 2.0;      
                var r = cellSize*0.4*page.scale
                ctx.beginPath();
                ctx.moveTo(x-r/3,y-r);
                ctx.lineTo(x+r/3,y-r);
                ctx.moveTo(x-r/3,y+r);
                ctx.lineTo(x+r/3,y+r);
                ctx.moveTo(x,y-r);
                ctx.lineTo(x,y+r);
                ctx.stroke();
                ctx.lineWidth = 1.0;      
                break;   
            }
            case 9://speaker thick dot
            {
                ctx.beginPath();
                ctx.arc(x,y,5*page.scale,0,2*Math.PI);   
                ctx.fillStyle="#000000";
                ctx.fill();
                ctx.fillStyle="#ffffff"
                break;   
            }
            /*ugly star
            case 10://object/life thick dot
            {   
                ctx.lineWidth = 2.0;      
                var r = cellSize*0.4*page.scale                  
                ctx.beginPath();
                ctx.moveTo(x,y-r); 
                ctx.lineTo(x,y+r);
                ctx.moveTo(x-r,y); 
                ctx.lineTo(x+r,y);  
                ctx.moveTo(x-r/1.4,y-r/1.4); 
                ctx.lineTo(x+r/1.4,y+r/1.4);  
                ctx.moveTo(x-r/1.4,y+r/1.4); 
                ctx.lineTo(x+r/1.4,y-r/1.4);  
                ctx.stroke();   
                ctx.lineWidth = 1.0;                        
                break;   
            }
            */   
            case 10://hourglass
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

            case 11://loudness concentric circles
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
            case 12://see - eye
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
            case 13://hear - ear
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
            case 14://touch - hand
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
            case 15://smell - nose
            {
                var r = cellSize*0.4*page.scale*0.9;
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
            case 16://talk - mouth
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
            case 17://eat - mouth
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

            case 18: // sex - 2 part
            {
                ctx.beginPath();
                var r = cellSize*0.3*page.scale;
                ctx.arc(x,y,r,0,2*Math.PI);
                ctx.fillStyle="#ffffff"
                ctx.strokeStyle="#000000"
                ctx.fill();
                ctx.moveTo(x,y-r);
                ctx.lineTo(x,y+r);
                ctx.stroke();
                break;   
            }
            case 19://perform - star
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
            case 19://perform - star
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
            case 20://pronoun 1 - triangle
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
            case 21://pronoun 2 - upside down triangle
            {
                ctx.beginPath();
                var s = cellSize*page.scale*0.4/1000;
                ctx.moveTo(x+triangle[2*0+0]*s,y-triangle[2*0+1]*s);
                ctx.lineTo(x+triangle[2*2+0]*s,y-triangle[2*2+1]*s);
                ctx.lineTo(x+triangle[2*1+0]*s,y-triangle[2*1+1]*s);
                ctx.closePath();
                ctx.strokeStyle="#000000"
                ctx.fillStyle="#ffffff"
                ctx.fill();
                ctx.stroke();
                break;  
            }  
            case 22://pronoun 3 - square
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
            case 23://pronoun 3 - diamond
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
            case 24://if - lambda
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
            case 25://liquid - drop
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
            case 26://solid - square
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
            case 27://gas - square
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
            case 28://curvature
            {
                ctx.beginPath();
                ctx.arc(x,y,cellSize*0.3*page.scale,0,2*Math.PI);
                ctx.strokeStyle="#000000"
                ctx.fillStyle="#ffffff"
                ctx.fill();
                ctx.stroke();
                break;   
            }
            case 29://knowledge interlocking circles
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
            }/*
            case 29://competition
            {
                ctx.beginPath();
                var s = cellSize*page.scale*0.3;
                ctx.moveTo(x-s,y-s);
                ctx.bezierCurveTo(x-2*s,y+s,x+2*s,y+s,x+s,y-s);
                ctx.bezierCurveTo(x-s,y-2*s,x-s,y+2*s,x+s,y+s);
                ctx.bezierCurveTo(x+2*s,y-s,x-2*s,y-s,x-s,y+s);
                ctx.bezierCurveTo(x+s,y+2*s,x+s,y-2*s,x-s,y-s);
                ctx.fill();
                ctx.stroke();
                break;   
            }*/
            case 1://circle
            {
                ctx.beginPath();
                ctx.arc(x,y,cellSize*0.2*page.scale,0,2*Math.PI);
                ctx.strokeStyle="#000000"
                ctx.fillStyle="#ffffff"
                ctx.fill();
                ctx.stroke();
                break;   
            }
            case 2://star
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
            case 3://triangle
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
            case 4://2 star
            {
                ctx.beginPath();
                var s = cellSize*page.scale*0.4/1.41;
                ctx.moveTo(0.5+x-s,0.5+y);
                ctx.lineTo(0.5+x+s,0.5+y);
                ctx.moveTo(0.5+x,0.5+y-s);
                ctx.lineTo(0.5+x,0.5+y+s);
                ctx.moveTo(0.5+x-s/1.414,0.5+y-s/1.414);
                ctx.lineTo(0.5+x+s/1.414,0.5+y+s/1.414);
                ctx.moveTo(0.5+x-s/1.414,0.5+y+s/1.414);
                ctx.lineTo(0.5+x+s/1.414,0.5+y-s/1.414);
                ctx.strokeStyle="#000000"
                ctx.stroke();
                break;   
            }
            case 5://square
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
            case 30://left button
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
            case 31://right button
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
            case 32://delete button
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
            case 33://new icon
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
        }