
var glob 			= require('./orthoGlobals')
var canvasRender 	= require('./canvasRender')
var lib 			= require('./orthoLib')
var svgRender 		= require("./svgRender")
var log=console.log


function Relativize(){
	var page=glob.page;
	var elements=[]
	for (var i=0;i<page.elements.length;i++){
		elements.push(page.elements[i][2])
	}
	var lines=[];
	for(var i=0;i<page.lines.length;i++){
		var l = page.lines[i];
		var e_i1 = lib.getIconIndexAt(l[0],l[1])
		var e_i2 = lib.getIconIndexAt(l[2],l[3])
		var lt = l[4]
		var ll = lib.LineLength(l)
		var ld = lib.LineDirection(l)
		lines.push([e_i1,e_i2,ld,lt,ll])
	}
	var result = {
		elements:elements,
		lines:lines
	};
	return result
}

function Absolutize(dat){
	var r_elements=dat.elements;
	var r_lines = dat.lines;

	var visited_elems=[0]
	var visited_lines=[]

	var elements=[ [0, 0, 0 ] ]
	var lines=[]
	while (lines.length<r_lines.length){
		for (var i=0;i<r_lines.length;i++){
			if (visited_lines.indexOf(i)>=0){
				continue;
			}
			var l = r_lines[i]
			var ld = l[2]
			var lt = l[3]
			var ll = l[4]
			for (var j=0;j<elements.length;j++){
				var e = elements[j]
				var et=e[2]
				if (et===l[0]||et===l[1]){
					var e_o=l[1];
					if (et===l[1]){
						ld=-ld;
						e_o=l[0]
					}
					var [dx,dy]=lib.axes[ld]
					var nx = e[0]+ll*dx;
					var ny = e[1]+ll*dy;
					visited_lines.push(i);
					visited_elems.push(j);
					elements.push([nx,ny,e_o])
					// log("pushing "+elements[elements.length-1])
					lines.push([e[0],e[1],nx,ny,lt])
					break;
				}
			}
		}
	}
	// log("ELEMENTS "+elements)
	// log("visited_elems "+visited_elems)
	//dont' forget to replace the line type with the actual line type here
	for (var i=0;i<elements.length;i++){
		var e = elements[i]
		e[2]=r_elements[e[2]]
	}
	glob.page.elements=elements;
	glob.page.lines=lines;
}

function Contract(){
	var start = Relativize();

	var reduced=true;
	while(reduced){
		reduced=false;
		for (var i=0;i<start.lines.length;i++){
			var l = start.lines[i];
			var orig = l[4]
			for (var j=1;j<l[4];j++){
				l[4]=j;			
				Absolutize(start);
				if (lib.SelfIntersects()){
					l[4]=orig;
				} else {
					reduced=true;
					break;
				}
			}
		}
	}
	Absolutize(start);
}

module.exports.Contract = Contract