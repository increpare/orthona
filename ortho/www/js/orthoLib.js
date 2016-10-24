function loadFile(fileName){
	str = fs.readFileSync(fileName)+'';
	loadString(str);
}

function loadString(str){
	page = JSON.parse(str).book[0];
	var bounds = getBounds();
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


