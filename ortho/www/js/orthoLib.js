var axes = {};
axes[-4]=[-1,-1]
axes[-3]=[0,-1]
axes[-2]=[1,-1]
axes[-1]=[-1,0]
axes[1]=[1,0]
axes[2]=[-1,1]
axes[3]=[0,1]
axes[4]=[1,1]


var blah=0;
function SaveImage(filename){
	saveFile("dat/temp.json")
	var cmd = './printOrtho dat/temp.json';
	var capturedOutput = require('child_process').execSync(cmd, {stdio:[0,1,2]})
}

function ElementAt(x,y){
	for (var i=0;i<page.elements.length;i++){
		var e= page.elements[i];
		if (e[0]===x&&e[1]===y){
			return  e;
		}
	}
	return null;
}

function Connection(e1,e2,lines){
	for (var i=0;i<lines.length;i++){
		var l = lines[i];
		if (PointOnLine(e1,l)&&PointOnLine(e2,l)){
			var r = Relation(e1,e2)
			return [r,l];
		}
	}
	return 0;
}

function saveFile(fileName){
    var sketch_save = JSON.stringify({book:sketchBook,page:sketchBookIndex});    
	str = fs.writeFileSync(fileName,sketch_save);
}

function loadFile(fileName){
	str = fs.readFileSync(fileName)+'';
	loadString(str);
}

function loadString(str){
	page = JSON.parse(str).book[0];
	var bounds = getBounds();
}



function clearGraph(){
	page={
	    elements:[],
	    lines:[],
	    offsetX:0,
	    offsetY:0,
	    scale:1,
	    sketchTitle:""
	};
	sketchBook[0]=page
	sketchBookIndex=0
}

function getBounds(){
	var top		= 1000;
	var bottom	=-1000;
	var left	= 1000;
	var right	=-1000;

	for (var i=0;i<page.elements.length;i++){
		var e = page.elements[i];
		if (e[0]<left){
			left=e[0];
		}
		if (e[0]>right){
			right=e[0];
		}
		if (e[1]<top){
			top=e[1];
		}
		if (e[1]>bottom){
			bottom=e[1];
		}
	}

	for (var i=0;i<page.lines.length;i++){
		var l = page.lines[i];
		if (l[0]<left){
			left=l[0];
		}
		if (l[0]>right){
			right=l[0];
		}
		if (l[1]<top){
			top=l[1];
		}
		if (l[1]>bottom){
			bottom=l[1];
		}
		if (l[2]<left){
			left=l[2];
		}
		if (l[2]>right){
			right=l[2];
		}
		if (l[3]<top){
			top=l[3];
		}
		if (l[3]>bottom){
			bottom=l[3];
		}
	}
	
	if (top===-1000){
		return [0,0,0,0];
	}	

	return [top,bottom,left,right]
}

function setOffsetToTopLeft(){
	var bounds = getBounds();
	page.offsetX=-bounds[2]*cellSize+cellSize*0.75;
	page.offsetY=-bounds[0]*cellSize+cellSize*0.75;
}

function canvasSize(){
	var bounds = getBounds();
	var width = (bounds[3]-bounds[2]+1.5)*cellSize;
	var height = (bounds[1]-bounds[0]+1.5)*cellSize;
	return [width,height];
}


function PointOnLine(e,line){
	var ex=e[0];
	var ey=e[1];
	var lx1=line[0];
	var ly1=line[1];
	var lx2=line[2];
	var ly2=line[3];

	//check by triangle inequality
	var dlx = lx2-lx1;
	var dly = ly2-ly1;

	var dx1 = ex-lx1;
	var dy1 = ey-ly1;

	var dx2 = ex-lx2;
	var dy2 = ey-ly2;

	var d12 = Math.sqrt(dlx*dlx+dly*dly)
	var d1 = Math.sqrt(dx1*dx1+dy1*dy1)
	var d2 = Math.sqrt(dx2*dx2+dy2*dy2)
	var diff = d12-d1-d2
	var d = Math.abs(d12-d1-d2);
	return d<0.1;
}

function LineDirection(l){
	return Relation([l[2],l[3]],[l[0],l[1]])
}

//returns 0 if no relation, otherwise axis index (-4 to 4)
function Relation(e1,e2){
	var adx=Math.abs(e2[0]-e1[0]);
	var ady=Math.abs(e2[1]-e1[1]);
	
	if (adx===0&&ady===0){
		return 0
		console.log("eep! scary shizzle two entities at the same point!")
	}
	if (adx!==0&&ady!==0&&adx!==ady){
		return 0;
	}
	var dx=0
	var dy=0

	if (e1[0]<e2[0]){
		dx=-1;
	} else if (e1[0]>e2[0]){
		dx=1;
	}
	if (e1[1]<e2[1]){
		dy=-1;
	} else if (e1[1]>e2[1]){
		dy=1;
	}
	return dx+3*dy
}

var log = console.log