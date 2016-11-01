//fromsvgrender
        case 34: //page
            {
                var s = DOC_CELLSIZE * 0.4 / 1.41;
                result += `\t\t<path stroke-width='${STROKE_WIDTH}' fill='${fillCol}' stroke='${strokeCol}' d='`
                result += [
                    "M", x - s, y - s,
                    "L", x + s, y - s,
                    "L", x + s, y + s,
                    "L", x - s, y + s,
                    "Z",
                    "M", x - s * 0.6, y - s / 2,
                    "L", x + s * 0.6, y - s / 2,
                    "M", x - s * 0.6, y,
                    "L", x + s * 0.6, y,
                    "M", x - s * 0.6, y + s / 2,
                    "L", x + s * 0.6, y + s / 2,
                    "'/>\n"
                ].compileList();
                

                break;
            }



        case 30://yin yang outline
        {
            var r = cellSize*0.35*glob.page.scale;
            
            ctx.fillStyle="#ffffff"     
            ctx.strokeStyle="#000000"          

            ctx.beginPath();
            ctx.arc(x,y,r,Math.PI/2,Math.PI/2+2*Math.PI);
            ctx.fill();              
            ctx.stroke();      


            ctx.beginPath();
            ctx.arc(x-r/2,y,r/2,Math.PI,2*Math.PI);   
            ctx.stroke();  
            ctx.beginPath();
            ctx.arc(x+r/2,y,r/2,2*Math.PI,3*Math.PI);  
            ctx.stroke();  


            break;
        }

        case 30: //yin yangoutline
            {

                var r = DOC_CELLSIZE * 0.3
                result += `\t\t<circle stroke-width='${STROKE_WIDTH}' cx='${tof(x)}' cy='${tof(y)}' r='${tof(r)}' fill='${fillCol}' stroke='${strokeCol}' />\n`

                result += `\t\t<path  stroke-width='${STROKE_WIDTH}' fill='transparent" stroke='transparent' d='`
                result += [
                  describeArc(x-r/2, y, r/2, Math.PI,2*Math.PI),
                  describeArc(x+r/2, y, r/2, 2*Math.PI, Math.PI),
                  "'/>\n"].compileList();

                break;
            }