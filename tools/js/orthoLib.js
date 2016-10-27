var fs = require('fs')

var glob = require('./app/orthoGlobals')

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

function MoveOriginToTopLeft(){
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

	for (var i=0;i<glob.page.elements.length;i++){
		var e = glob.page.elements[i];
		e[0]-=minx
		e[1]-=miny
	}
	for (var i=0;i<glob.page.lines.length;i++){
		var l = glob.page.lines[i];
		l[0]-=minx
		l[1]-=miny
		l[2]-=minx
		l[3]-=miny
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

function loadFile(fileName){
	str = fs.readFileSync(fileName)+'';
	loadString(str);
}

function loadString(str){
	glob.page = JSON.parse(str);
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
	return d<0.001;
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