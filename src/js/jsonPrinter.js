var emoji = require('node-emoji');

var fs 				= require('fs')
var glob 			= require('./orthoGlobals')
var lib 			= require('./orthoLib')
var svgRender 		= require("./orthoTopology")
var log=console.log

function Print(skeleton=false, asciiCharacters=false){

	var symbols = [
		"ε","ჲ","ɣ","o","•",
		"Q","k","t","n","*",
		"T","⍵","Ω","c","M",
		"ϑ","U","h","Ɔ","W",
		"i","H","8️","L","Λ",
		"Y","V","X","λ","+",
		"s","G","φ","∂","R"];


	if (asciiCharacters){
		symbols = "1234.abcdefghijklmnopqrstuvwxyABCDE";
	}

	var page = glob.page;

	var bounds = lib.getBounds();
	var height = bounds[1]-bounds[0]+1
	var width = bounds[3]-bounds[2]+1

	var offsetX=bounds[2]
	var offsetY=bounds[0]



	if (skeleton){
		//GRID INDICES ARE Y,X
		var grid = []
		for (var j=0;j<height;j++){
			var row = []
			for (var i=0;i<width;i++){
				row.push(" ")
			}
			grid.push(row)
		}

		for (var i=0;i<page.elements.length;i++){
			var e = page.elements[i]
			var ex = e[0]-offsetX
			var ey = e[1]-offsetY
			var es = symbols[e[2]]
			grid[ey][ex]=es
		}
			
		var ans=""
		for (var j=0;j<height;j++){
			for (var i=0;i<width;i++){
				ans+=grid[j][i]
			}
			ans+="\n"
		}
		console.log(ans)
		return;
	}

	//GRID INDICES ARE Y,X
	var grid = []
	for (var j=0;j<2*height+1;j++){
		var row = []
		for (var i=0;i<2*width+1;i++){
			row.push(" ")
		}
		grid.push(row)
	}

	function LineAtPoint(p){
		for (var i=0;i<page.lines.length;i++){
			var l = page.lines[i];
			if (lib.PointOnLine(p,l)){		
				return  l;
			}
		}
		return null;
	}


	var lines = [" -/|\\"," …⋰⋮⋱"];
	for (var i=0;i<page.lines.length;i++){
		var l = page.lines[i]
		var ll = lib.LineLength(l)
		var ld = lib.LineDirection(l)
		var [x1,y1,x2,y2,lt]=l

		x1-=offsetX;
		y1-=offsetY;
		x2-=offsetX;
		y2-=offsetY;
		x1=x1*2+1;
		y1=y1*2+1;

		var [dx,dy]=lib.axes[ld]
		for (var j=0;j<2*ll+1;j++){
			grid[y1][x1]=lines[lt][Math.abs(ld)]
			x1+=dx;
			y1+=dy;
		}

	}

	for (var i=0;i<page.elements.length;i++){
		var e = page.elements[i]
		var ex = e[0]-offsetX
		var ey = e[1]-offsetY
		var es = symbols[e[2]]
		grid[2*ey+1][2*ex+1]=es
	}

	var ans=""
	for (var j=0;j<2*height+1;j++){
		for (var i=0;i<2*width+1;i++){
			ans+=grid[j][i]
		}
		ans+="\n"
	}
	return ans;
}

module.exports.Print=Print;