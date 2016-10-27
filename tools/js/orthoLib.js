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
    ar_shuffle(page.elements)
    ar_shuffle(page.lines)
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

function pageArea(){
	var [top,bottom,left,right] = getBounds();
	var h = (bottom-top+1)
	var w = (right-left+1)
	var area = w*h
	return area
}

function saveFile(fileName){
    var sketch_save = JSON.stringify(page);    
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
		var e_x = data[p++]-0x80
		var e_y = data[p++]-0x80
		var e_s = data[p++]
		page.elements.push([e_x,e_y,e_s])
	}

	var L = data[p++]
	//log(L)

	for (var i=0;i<L;i++){
		//log(data[0],data[p+1],data[p+2],data[p+3],data[p+4])
		var l_x1 = data[p++]-0x80
		var l_y1 = data[p++]-0x80
		var l_x2 = data[p++]-0x80
		var l_y2 = data[p++]-0x80
		var l_s = data[p++]
		//page.lines.push([l_x1,l_y1,l_x2,l_y2,l_s])
	}

}

function saveBinary(fileName){
	var E = page.elements.length
	var L = page.lines.length

	var dat = [0x4f,0x72,0x74,0x68]
	dat.push(ORTHO_VERSION)


	dat.push(E&0xff)
	//log(E&0xff)
	for (var i=0;i<E;i++){
		var e 	= page.elements[i];
		var x 	= (e[0]+0x80)&0xff
		var y 	= (e[1]+0x80)&0xff
		var t 	= e[2]&0xff

		//log(x,y,t)
		dat.push(x,y,t)
	}

	//log(L&0xFF)
	dat.push(L&0xFF)

	for (var i=0;i<L;i++){
		var l 	= page.lines[i];
		var x1 	= (l[0]+0x80)&0xff
		var y1 	= (l[1]+0x80)&0xff
		var x2 	= (l[2]+0x80)&0xff
		var y2 	= (l[3]+0x80)&0xff

		var t 	= e[2]&0xff
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
	page = JSON.parse(str);
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