var fs = require('fs')

var glob = require('./orthoGlobals')
var intersects = require('line-segments-intersect');
var log = console.log
var ORTHO_VERSION=0;

var axes = {};
axes[-4]=[-1,-1]
axes[-3]=[0,-1]
axes[-2]=[1,-1]
axes[-1]=[-1,0]
axes[1]=[1,0]
axes[2]=[-1,1]
axes[3]=[0,1]
axes[4]=[1,1]


function Diagonal(l){
	var [x1,y1,x2,y2,t]=l
	return (x2-x1)*(y2-y1)!==0;
}

function LineLength(l){
	var [x1,y1,x2,y2,t]=l
	var dx = Math.abs(x2-x1)
	var dy = Math.abs(y2-y1)
	if (Diagonal(l)){
		return dx
	} else {
		return dx+dy;
	}
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


function getIconIndexAt(tx,ty){
    for (var i=0;i<glob.page.elements.length;i++){
        var el = glob.page.elements[i];
        if (el[0]===tx&&el[1]===ty){
            return i;
        }
    }
    return -1;
}


function getLineIndicesWithEndpoint(tx,ty){
	var result=[]
    for (var i=0;i<glob.page.lines.length;i++){
        var [x1,y1,x2,y2,lt] = glob.page.lines[i];
        if ( (x1===tx&&y1===ty) || (x2===tx&&y2===ty) ){
        	result.push(i);
        }
    }
    return result;
}


function tryRemoveCellAt(x,y,shouldRemoveLines=true){
	var result=false;
    for (var i=0;i<glob.page.elements.length;i++){
        var e = glob.page.elements[i];
        if (e[0]===x&&e[1]===y){
            glob.page.elements.splice(i,1);
            result=true;
            break;
        }
    }   

    if (shouldRemoveLines){
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
	}

	return result;
}

function ar_shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}

function shuffle() {
    ar_shuffle(glob.page.elements)
    ar_shuffle(glob.page.lines)
}

var blah=0;
function PrintImage(){
	var tmp = require('tmp');
	var name = tmp.tmpNameSync();
	saveFile(name)
	var cmd = './printJson '+name;
	var capturedOutput = require('child_process').execSync(cmd, {stdio:[0,1,2]})
}

function ElementAt(x,y){
	for (var i=0;i<glob.page.elements.length;i++){
		var e= glob.page.elements[i];
		if (e[0]===x&&e[1]===y){
			return  e;
		}
	}
	return null;
}

function NoPointBetween(e1,e2,elements){
	var dx=0;
	var dy=0;
	
	if (e1[0]<e2[0]) dx=1;
	if (e1[0]>e2[0]) dx=-1;

	if (e1[1]<e2[1]) dy=1;
	if (e1[1]>e2[1]) dy=-1;
	var x1=e1[0]+dx
	var y1=e1[1]+dy

	var x2=e2[0]
	var y2=e2[1]

	while(x1!==x2||y1!==y2){
		for (var i=0;i<elements.length;i++){
			var e = elements[i]
			if (e[0]===x1&&e[1]===y1){
				return false;
			}
		}
		x1+=dx
		y1+=dy
	}
	return true;
}

function Connection(e1,e2,lines,elements){
	for (var i=0;i<lines.length;i++){
		var l = lines[i];
		if (PointOnLine(e1,l)&&PointOnLine(e2,l)){
			if (NoPointBetween(e1,e2,elements))
			{
				var r = Relation(e1,e2)
				return [r,l];
			}
		}
	}
	return 0;
}

function pageArea(){
	var [top,bottom,left,right] = getBounds();
	var h = (bottom-top+1)
	var w = (right-left+1)
	var area = w*h
	return area
}

function saveFile(fileName){
	FixPageLines();
    var sketch_save = JSON.stringify(glob.page);    
	str = fs.writeFileSync(fileName,sketch_save);
}

function arrayToUInt16(a1,a2){
	return a1+a2*0x100
}
function arrayToInt16(ar){
	return a1+a2*0x100-0x7FFF
}

function loadBinary(fileName){
	clearGraph();

	var data = fs.readFileSync(fileName);
	//log("buffer = "+data.toString('hex'))
	var signature = [data[0],data[1],data[2],data[3]]
	var version = data[4]
	var E = data[5]
	//log(E)
	
	var p=6;

	for (var i=0;i<E;i++){
		//log(data[0],data[p+1],data[p+2])
		var e_x = data[p++]
		var e_y = data[p++]
		var e_s = data[p++]
		glob.page.elements.push([e_x,e_y,e_s])
	}

	var L = data[p++]
	//log(L)

	for (var i=0;i<L;i++){
		//log(data[0],data[p+1],data[p+2],data[p+3],data[p+4])
		var l_x1 = data[p++]
		var l_y1 = data[p++]
		var l_x2 = data[p++]
		var l_y2 = data[p++]
		var l_s = data[p++]
		glob.page.lines.push([l_x1,l_y1,l_x2,l_y2,l_s])
	}

}

function TranslateGraph(dx,dy){

	for (var i=0;i<glob.page.elements.length;i++){
		var e = glob.page.elements[i];
		e[0]+=dx
		e[1]+=dy
	}
	for (var i=0;i<glob.page.lines.length;i++){
		var l = glob.page.lines[i];
		l[0]+=dx
		l[1]+=dy
		l[2]+=dx
		l[3]+=dy
	}
}

function MoveOriginToTopLeft(dx=0,dy=0){
	var minx=10000;
	var miny=10000;
	for (var i=0;i<glob.page.elements.length;i++){
		var e = glob.page.elements[i];
		minx=Math.min(minx,e[0]);
		miny=Math.min(miny,e[1]);
	}
	for (var i=0;i<glob.page.lines.length;i++){
		var l = glob.page.lines[i];
		minx=Math.min(minx,l[0]);
		miny=Math.min(miny,l[1]);
		minx=Math.min(minx,l[2]);
		miny=Math.min(miny,l[3]);
	}
	TranslateGraph(dx-minx,dy-miny)
}

function CenterPortrait(s){
	//find 
	var dx=0;
	var dy=0;
	for (var i=0;i<glob.page.elements.length;i++){
		var e = glob.page.elements[i];
		if (e[2]==s){
			[dx,dy]=e;
		}
	}

	dx--;
	dy--;

	for (var i=0;i<glob.page.elements.length;i++){
		var e = glob.page.elements[i];
		e[0]-=dx
		e[1]-=dy
	}
	for (var i=0;i<glob.page.lines.length;i++){
		var l = glob.page.lines[i];
		l[0]-=dx
		l[1]-=dy
		l[2]-=dx
		l[3]-=dy
	}
}

function saveBinary(fileName){
	MoveOriginToTopLeft();

	var E = glob.page.elements.length
	var L = glob.page.lines.length

	var dat = [0x4f,0x72,0x74,0x68]
	dat.push(ORTHO_VERSION)


	dat.push(E&0xff)
	//log(E&0xff)
	for (var i=0;i<E;i++){
		var e 	= glob.page.elements[i];
		var x 	= (e[0])&0xff
		var y 	= (e[1])&0xff
		var t 	= e[2]&0xff

		//log(x,y,t)
		dat.push(x,y,t)
	}

	//log(L&0xFF)
	dat.push(L&0xFF)

	for (var i=0;i<L;i++){
		var l 	= glob.page.lines[i];
		var x1 	= (l[0])&0xff
		var y1 	= (l[1])&0xff
		var x2 	= (l[2])&0xff
		var y2 	= (l[3])&0xff

		var t 	= l[5]&0xff
		//log(x1,y1,x2,y2,t)
		dat.push(x1,y1,x2,y2,t)
	}

	var buffer = Buffer.from(dat)
	
	var s=""
	for (var i=0;i<dat.length;i++){
		s+=("00" + dat[i].toString(16)).substr(-2,2);
	}
	//log("dat = "+dat);
	//log("dat = "+s);
	//log("buffer = "+buffer.toString('hex'))
	fs.writeFileSync(fileName,buffer);
}

function loadFile(fileName,fixlines=true){
	str = fs.readFileSync(fileName)+'';
	loadString(str,fixlines);
}

function loadString(str,fixlines=true){
	glob.page = JSON.parse(str);
	if (fixlines){
		FixPageLines();
	}
}



function clearGraph(){
	glob.page={
	    elements:[],
	    lines:[],
	    offsetX:0,
	    offsetY:0,
	    scale:1,
	    sketchTitle:""
	};
	glob.sketchBook[0]=glob.page
	glob.sketchBookIndex=0
}

function getBounds(){
	var top		= 1000;
	var bottom	=-1000;
	var left	= 1000;
	var right	=-1000;

	for (var i=0;i<glob.page.elements.length;i++){
		var e = glob.page.elements[i];
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

	for (var i=0;i<glob.page.lines.length;i++){
		var l = glob.page.lines[i];
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
	glob.page.offsetX=-bounds[2]*glob.cellSize+glob.cellSize*0.75;
	glob.page.offsetY=-bounds[0]*glob.cellSize+glob.cellSize*0.75;
}

function canvasSize(){
	var bounds = getBounds();
	var width = (bounds[3]-bounds[2]+1.5)*glob.cellSize;
	var height = (bounds[1]-bounds[0]+1.5)*glob.cellSize;
	return [width,height];
}


function PointOnLine(e,line){
	var ex=e[0];
	var ey=e[1];
	var lx1=line[0];
	var ly1=line[1];
	var lx2=line[2];
	var ly2=line[3];

	var ll = LineLength(line)
	var ld = LineDirection(line)
	var [dx,dy]=axes[ld]

	for (var i=0;i<=ll;i++){
		if (ex===lx1&&ey===ly1){
			return true;
		}
		lx1+=dx;
		ly1+=dy;
	}
	return false;
}

function ConnectLines(){
	//modify lines so they go right and down

	for (var i=0;i<glob.page.lines.length;i++){
		var l = glob.page.lines[i];
		if (l[0]===l[2]){
			if (l[1]>l[3]){
				[l[0],l[1],l[2],l[3]]=[l[2],l[3],l[0],l[1]]
			}
		} else if (l[0]>l[2]){
			[l[0],l[1],l[2],l[3]]=[l[2],l[3],l[0],l[1]]
		}
	}

	for (var i=0;i<glob.page.lines.length;i++){
		var l1 = glob.page.lines[i]
		for (var j=0;j<glob.page.lines.length;j++){
			if (i===j){
				continue;
			}
			var l2 = glob.page.lines[j]	
			if (LineDirection(l1)!==LineDirection(l2)){
				continue;
			}

			if (l1[2]===l2[0]&&l1[3]===l2[1]&&l1[4]===l2[4]){
				var first = Math.max(i,j)
				var second = Math.min(i,j)
				glob.page.lines.splice(first,1)
				glob.page.lines.splice(second,1)
				newline = [l1[0],l1[1],l2[2],l2[3],Math.max(l1[4],l2[4])]
				glob.page.lines.push(newline)				
				i=-1;
				break;
			}
		}
	}
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

function saveCanvasToPng(fileName){
	var dataURL = glob.canvas.toDataURL();
	var data = dataURL.replace(/^data:image\/\w+;base64,/, "");
	var buf = new Buffer(data, 'base64');
	fs.writeFile(fileName, buf);
}

//adds a line unless there's a line there already
function tryAddLine(x1,y1,x2,y2,lineMode){
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
            l[4]=lineMode;
            return;
        }
    }
    
    glob.page.lines.push([x1,y1,x2,y2,lineMode]);
}

function FixPageLines(){
	for (var i=0;i<glob.page.lines.length;i++){
		var l = glob.page.lines[i];
		var [x1,y1,x2,y2,lt]=l

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

	    glob.page.lines[i]= [x1,y1,x2,y2,lt]
	}
}

function LinesHaveIntervalOverlap(l1,l2){
	var d1 = LineDirection(l1)
	var d2 = LineDirection(l2)

	var l1Points_interior = LinePoints(l1)
	var l2Points_exterior = LinePoints(l2)
	var overlapCount=0;
	for ([l1x,l1y] of l1Points_interior){
		for ([l2x,l2y] of l2Points_exterior){
			if (l1x===l2x&&l1y===l2y){
				overlapCount++;
			}
		}
	}
	return overlapCount>=2;
}

//slightly fancier variation, for the touch program
function makeLine(x1,y1,x2,y2,lineMode=0){
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

    var removed=false;
    var l_cand=[x1,y1,x2,y2,lineMode]
    for (var i=0;i<glob.page.lines.length;i++){
        var l = glob.page.lines[i];
        if (l[0]===x1&&l[1]===y1&&l[2]===x2&&l[3]===y2) {
            if (l[4]===0){
                l[4]=1;
            } else {
                glob.page.lines.splice(i,1);
            }
            return;
        } else if (LinesHaveIntervalOverlap(l,l_cand)){
            glob.page.lines.splice(i,1);
            removed=true;            
        }
    }

    if (removed===true){
    	return;
    }

    glob.page.lines.push([x1,y1,x2,y2,lineMode]);
}


function LinesIntersect(l,m){
	//log(JSON.stringify(l)+ " _ "+JSON.stringify(m))
	var e=0.1
	var [l1x,l1y,l2x,l2y] = l;
	var [m1x,m1y,m2x,m2y] = m;

	var ld = LineDirection(l)
	var [dlx,dly] = axes[ld]
	l1x+=dlx*e;
	l1y+=dly*e;
	l2x-=dlx*e;
	l2y-=dly*e;

	var md = LineDirection(m)
	var [dmx,dmy] = axes[md]
	m1x+=dmx*e;
	m1y+=dmy*e;
	m2x-=dmx*e;
	m2y-=dmy*e;
	
	if (intersects([[l1x,l1y],[l2x,l2y]], [[m1x,m1y],[m2x,m2y]])) {
		return true;
	}

	return false;
}

function LinePoints(l,){
	var points = [
			[l[0],l[1]],
			[l[2],l[3]]
			]
	var ld = LineDirection(l)
	var ll = LineLength(l)
	var [dlx,dly] = axes[ld]
	var [x1,y1,x2,y2]=l;
	for (var i=0;i<ll-1;i++){
		x1+=dlx;
		y1+=dly;
		points.push([x1,y1])
	}
	return points;
}

function ElementInInterior(e,l){
	var [ex,ey,et]=e
	var ld = LineDirection(l)
	var ll = LineLength(l)
	var [dlx,dly] = axes[ld]
	var [x1,y1,x2,y2]=l;
	var result = [];
	for (var i=0;i<ll-1;i++){
		x1+=dlx;
		y1+=dly;
		if (ex===x1&&ey===y1){
			return true;
		}
	}
	return false;
}

function SelfIntersects(){
	var elements = glob.page.elements;
	var lines = glob.page.lines;

	for (var i=0;i<elements.length;i++){
		var [e1x,e1y,e1t]=elements[i];
		for (var j=i+1;j<elements.length;j++){
			var [e2x,e2y,e2t]=elements[j];
			if (e1x===e2x&&e1y===e2y){
				return true;
			}
		}
	}


	for (var i=0;i<lines.length;i++){
		var l1=lines[i];
		for (var j=i+1;j<lines.length;j++){
			var l2=lines[j];
			if (LinesIntersect(l1,l2)){
				return true;
			}
		}
	}

	//check none of the interior poitns on a line segment intersect an element

	for (var i=0;i<lines.length;i++){
		var l=lines[i];
		for (var j=0;j<elements.length;j++){
			var e = elements[j];
			if (ElementInInterior(e,l)){
				return true;
			}
		}
	}
	return false;
}

function ConnectedComponents(){
	var lines = glob.page.lines;
	var elements= glob.page.elements;
	var l_colours = []
	var e_colours = []
	var c = 0;
	for (var i=0;i<lines.length;i++){
		l_colours.push(c);
		c++
	}
	for (var i=0;i<elements.length;i++){
		e_colours.push(c);
		c++
	}

	var modified=true
	while(modified){
		modified=false;
		for (var l_i=0;l_i<lines.length;l_i++){
			var l = lines[l_i];

			var [x1,y1,x2,y2,lt]=l;

			//1 - spread between lines and elements
			var lc =l_colours[l_i];
			var e1=null;
			var e1c=-1;

			var e1_i = getIconIndexAt(x1,y1);
			if (e1_i>=0){
				e1 = elements[e1_i];
				e1c = e_colours[e1_i];
				if (lc!==e1c){
					modified=true;
				}
				var newC = Math.min(lc,e1c);
				e_colours[e1_i]=newC
				l_colours[l_i]=newC
			}

			var e2_i = getIconIndexAt(x2,y2);
			if (e2_i>=0){
				var e2 = elements[e2_i];
				var e2c = e_colours[e2_i];
				if (lc!==e1c){
					modified=true;
				}
				var newC = Math.min(lc,e2c);
				e_colours[e2_i]=newC
				l_colours[l_i]=newC
				if (e1_i>=0){
					e_colours[e1_i]=newC					
				}
			}


			//2 - spread between lines and lines
			var lineIndices = getLineIndicesWithEndpoint(x1,y1)
			lineIndices = lineIndices.concat(getLineIndicesWithEndpoint(x2,y2))
			var minc = l_colours[lineIndices[0]];
			for (var i=0;i<lineIndices.length;i++){
				var li = lineIndices[i]
				var lc = l_colours[li]
				if (lc!==minc){
					modified=true;
				}
				minc = Math.min(minc,lc)
			}

			for (var i=0;i<lineIndices.length;i++){
				var li = lineIndices[i]
				l_colours[li]=minc;
			}

		}
	}

	var colours = e_colours.concat(l_colours)
	var count = colours.reduce(function(values, v) {
	  if (!values.set[v]) {
	    values.set[v] = 1;
	    values.count++;
	  }
	  return values;
	}, { set: {}, count: 0 }).count;

	return count;
}

function IsCyclic(){
	var lines = [].concat(glob.page.lines)
	log(JSON.stringify(lines))
	//algorithm prune lines until no more lines with stray branches left
	for (var i=0;i<lines.length;i++){
		var [x1,y1,x2,y2,lt]=lines[i]
		var linesAtA = getLineIndicesWithEndpoint(x1,y1);
		var linesAtB = getLineIndicesWithEndpoint(x2,y2);
		if (linesAtA.length===1||linesAtB.length===1){
			lines.splice(i,1);
			i=-1;
			if (lines.length===0){
				break;
			}
		}
		log(JSON.stringify(lines))
	}
	return lines.length>0;
}

function LinesOccupied(){
	var lines = glob.page.lines;
	for (var i=0;i<lines.length;i++){
		var [x1,y1,x2,y2,lt]=lines[i];
		if (getIconIndexAt(x1,y1)==-1 || getIconIndexAt(x2,y2)==-1){
			return false
		}
	}
	return true;
}
module.exports.Relation=Relation
module.exports.LineDirection=LineDirection
module.exports.ConnectLines=ConnectLines
module.exports.PointOnLine=PointOnLine
module.exports.shuffle=shuffle
module.exports.PrintImage=PrintImage
module.exports.ElementAt=ElementAt
module.exports.NoPointBetween=NoPointBetween
module.exports.Connection=Connection
module.exports.saveFile=saveFile
module.exports.saveBinary=saveBinary
module.exports.loadFile=loadFile
module.exports.loadString=loadString
module.exports.loadBinary=loadBinary
module.exports.pageArea=pageArea
module.exports.setOffsetToTopLeft=setOffsetToTopLeft
module.exports.clearGraph=clearGraph
module.exports.getBounds=getBounds
module.exports.canvasSize=canvasSize
module.exports.axes=axes
module.exports.MoveOriginToTopLeft=MoveOriginToTopLeft
module.exports.CenterPortrait=CenterPortrait
module.exports.saveCanvasToPng=saveCanvasToPng
module.exports.tryRemoveCellAt=tryRemoveCellAt
module.exports.iconAt=iconAt
module.exports.getIconIndexAt=getIconIndexAt
module.exports.makeLine=makeLine
module.exports.tryAddLine=tryAddLine
module.exports.LineLength=LineLength;
module.exports.TranslateGraph=TranslateGraph
module.exports.FixPageLines=FixPageLines
module.exports.IsCyclic=IsCyclic
module.exports.SelfIntersects=SelfIntersects
module.exports.ConnectedComponents=ConnectedComponents
module.exports.LinesOccupied=LinesOccupied