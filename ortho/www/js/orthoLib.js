function loadFile(fileName){
	str = fs.readFileSync('orthoGlobals.js')+'';
	loadString(str);
}

function getBounds(){
	var top		=-1000;
	var bottom	= 1000;
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
		if (e[1]<left){
			left=e[1];
		}
		if (e[1]>right){
			right=e[1];
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
		if (l[1]<left){
			left=l[1];
		}
		if (l[1]>right){
			right=l[1];
		}
		if (l[2]<left){
			left=l[0];
		}
		if (l[2]>right){
			right=l[0];
		}
		if (l[3]<left){
			left=l[1];
		}
		if (l[3]>right){
			right=l[1];
		}
	}
	
	if (top===-1000){
		return [0,0,0,0];
	}	

	return [top,bottom,left,right]
}

function setOffsetToTopLeft(){
	var bounds = getBounds();
	var left = bounds[0];
	var top = bounds[1];
	var offsetx=bounds[0]*cellSize-cellsize/2;
	var offsety=bounds[1]*cellSize-cellsize/2;
}

function canvasSize(){
	var bounds = getBounds();
	var width = (right-left+1)*cellSize;
	var height = (bottom-top+1)*cellSize;
	return [width,height];
}

function loadString(str){
	page = JSON.parse(str);
	var bounds = getBounds();
}

