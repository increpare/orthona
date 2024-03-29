var fs = require('fs')
var glob = require('./orthoGlobals')
var lib = require('./orthoLib')
var log = console.log


function dirToPronunciation(dir){
	var [dx,dy] = lib.axes[dir];

	if (dx===0&&dy===1){
		return "a";
	} else if (dx===1&&dy===1){
		return "ala"
	} else if (dx===1&&dy===0){
		return "la"
	} else if (dx===1&&dy===-1){
		return "ya"
	} else if (dx===0&&dy===-1){
		return "e"
	} else if (dx===-1&&dy===-1){
		return "yo"
	} else if (dx===-1&&dy===0){
		return "o"
	} else if (dx===-1&&dy===1){
		return "wa"
	} 
	console.log ("ERROR shouldn't be here something edges")
}

function symbolToPronunciation(s,capitalize=true){
	var x=s%5;
	var y = Math.floor(s/5);
	var v = ["a","e","i","o","u"][x];
	var c = ["p","d","t","ch","b","k","g"][y];
	if (capitalize===false){
		return c+v+c;
	}
	var init = c[0].toUpperCase()+c.substring(1);
	return init+v+c;
}


function getNeighbours(v,M){
	var result = []
	for (var i=0;i<M.length;i++){
		if (M[i][v]!==0){
			result.push(i)
		}
	}
	return result;
}

function RemoveStrayEdges(){
	for (var i=glob.lines.length-1;i>=0;i--){
		var [x1,y1,x2,y2,t] = glob.lines[i];
		if (!lib.iconAt(x1,y1)|!lib.iconAt(x2,y2)){
			glob.lines.splice(i,1);
		}
	}
}

function getOutgoingLineIndices(v){
	var [sx,sy,st] = glob.page.elements[v];
	var result=[]
	var lines = glob.page.lines;
	for (var i=0;i<lines.length;i++){
		var [x1,y1,x2,y2,t] = lines[i];
		if (  (sx===x1&&sy===y1) || (sx===x2&&sy===y2) ){
			result.push(i);
		}
	}
	return result;
}

function getOppositeElementIndex(eIndex,lIndex){
	var [ex1,ey1]=glob.page.elements[eIndex];
	var [x1,y1,x2,y2]=glob.page.lines[lIndex];
	var ox,oy;
	if (ex1===x1&&ey1===y1){
		[ox,oy]=[x2,y2]
	} else {
		[ox,oy]=[x1,y1]		
	}
	return lib.getIconIndexAt(ox,oy)
}

function recurse(visitedLines,visitedElements,thisElementIndex){
	var page=glob.page;
	var result = {v:thisElementIndex,e:{}};	
	// log("visiting V"+thisElementIndex)

	if (visitedElements.indexOf(thisElementIndex)===-1) {
		visitedElements.push(thisElementIndex)		
	} else {
		result.silent=true;
		// log("V"+thisElementIndex+" silent")
		return result;
	}
	var outgoingLineIndices = getOutgoingLineIndices(thisElementIndex);
	for (var i=0;i<outgoingLineIndices.length;i++){
		var l_i = outgoingLineIndices[i];		
		var l = page.lines[l_i]
		if (l_i in visitedLines){
			continue;
		}
		visitedLines.push(l_i)
		var nextElement = getOppositeElementIndex(thisElementIndex,l_i);
		// log(`${thisElementIndex} -${l_i}-> ${nextElement}`)
		result.e[l_i]=recurse(visitedLines,visitedElements,nextElement)
	}
	return result
}

Object.prototype.empty = function(){
	return Object.keys(this).length===0;
}

function prefixVowel(dir,c){
	var vowel = dirToPronunciation(dir)
	if (c.length===0){
		return vowel
	}
	if (vowel[vowel.length-1]===c[0]){
		return vowel+"'"+c
	} else {
		return vowel+c;
	}
}

function speakTree(branch){
	var v = branch.v;
	var e = branch.e;
	var result = []
	if (branch.silent===true || glob.page.elements[v]===4){
		result.push("");
	} else {
		result.push(symbolToPronunciation(glob.page.elements[v][2],false));
	}	

	var outGoingLineIndices = Object.keys(e);
	for (var l_i of outGoingLineIndices){
		var l = glob.page.lines[l_i]
		var dirIndex = lib.LineDirection(l)
		var subBranch = e[l_i];
		var childWords = speakTree(subBranch);
		// log("childWords = " +JSON.stringify(childWords))
		for (var c of childWords){

			if (l[4]===1){
				c="n"+c;	
			}

			// log("C = " +JSON.stringify(c))
			var length = lib.LineLength(l);
			// log(" L = "+length)
			for (var i=0;i<length;i++){
				var c = prefixVowel(dirIndex,c);
			}
			result.push(c);
		}
	}
	return result;
}

function topToSpeech2(){
	//lib.ConnectLines();
	// log("elements : "+JSON.stringify(glob.page.elements))
	// log("lines : "+JSON.stringify(glob.page.lines)+"\n")
	var tree = recurse([],[],0)
	var sentence = speakTree(tree).join(" ")+".";
	sentence = sentence[0].toUpperCase()+sentence.substring(1)

	// log("words : "+sentence)
	return sentence
}

function branchTraverse(S,M,N,visited,curIndex){
	// log(visited+" visiting "+curIndex)
	visited.push(curIndex)
	var result = []
	for (var neighbourIndex=0;neighbourIndex<M.length;neighbourIndex++){
		var direction = M[curIndex][neighbourIndex];
		if (direction===0||visited.indexOf(neighbourIndex)>=0){
			continue;
		}
		var branchwords = branchTraverse(S,M,N,visited,neighbourIndex);
		//prepend directions to each of these words
		// log ("direction "+direction)
		var prefix = dirToPronunciation(direction)
		if (N[curIndex][neighbourIndex]!==0){
			prefix=prefix+"n"
		}
		// log(`prepending dir ${prefix} to ${prependedWords}`)
		var prependedWords = branchwords.map(w => prefix+w)
		result = result.concat(prependedWords);
	}

	var symbolSound = symbolToPronunciation(S[curIndex]);
	//if it's empty, return a terminal character
	if (result.length===0){
		// log("reached end!"+symbolSound)
		return [symbolSound]
	}
	//log(`prepending icon ${symbolSound} to ${result}`)	
	//if it's not empty, prepend this element
	for (var i=0;i<result.length;i++){
		"prepending"	
		result[i]=symbolSound+result[i]
	}
	// log("result "+result)
	return result;
}


function branchTraverse(S,M,N,visited,curIndex){
	// log(visited+" visiting "+curIndex)
	visited.push(curIndex)
	var result = []
	for (var neighbourIndex=0;neighbourIndex<M.length;neighbourIndex++){
		var direction = M[curIndex][neighbourIndex];
		if (direction===0||visited.indexOf(neighbourIndex)>=0){
			continue;
		}
		var branchwords = branchTraverse(S,M,N,visited,neighbourIndex);
		//prepend directions to each of these words
		// log ("direction "+direction)
		var prefix = dirToPronunciation(direction)
		if (N[curIndex][neighbourIndex]!==0){
			prefix=prefix+"n"
		}
		// log(`prepending dir ${prefix} to ${prependedWords}`)
		var prependedWords = branchwords.map(w => prefix+w)
		result = result.concat(prependedWords);
	}

	var symbolSound = symbolToPronunciation(S[curIndex]);
	//if it's empty, return a terminal character
	if (result.length===0){
		// log("reached end!"+symbolSound)
		return [symbolSound]
	}
	//log(`prepending icon ${symbolSound} to ${result}`)	
	//if it's not empty, prepend this element
	for (var i=0;i<result.length;i++){
		"prepending"	
		result[i]=symbolSound+result[i]
	}
	// log("result "+result)
	return result;
}

function topToSpeech(T){
	var S = T.S;
	var M = T.M;
	var N = T.N;
	var visited=[]
	var resultSentence="";

			//index,symbol,edge type
	while(visited.length<S.length){
		var toSelect=-1;
		for (var i=0;i<S.length;i++){
			if (visited.indexOf(i)<0){
				toSelect=i;
				break;
			}
		}
		if(toSelect===-1){
			break;
		}
		var result=branchTraverse(S,M,N,visited,toSelect)
		var sentence = result.join(" ")
		if (resultSentence.length>0){
			var lswords = resultSentence.split(" ")
			var lastWord = lswords[lswords.length-1];
			if (lastWord.substring(0,3)===sentence.substring(0,3)){
				resultSentence+=","
			}
			resultSentence+=" ";
			
		}
		resultSentence+=sentence;

	}

	resultSentence=resultSentence[0].toUpperCase()+resultSentence.substring(1)

	var repeat=true;
	while(repeat){
		var newstr1 = resultSentence.replace(/pup(an|alan|lan|yan|en|yon|on|wan)/ig,"n")
		var newstr = newstr1.replace(/pup(ala|la|a|ya|e|yo|o|wa)/ig,"")
		repeat = newstr.length!=resultSentence.length;
		resultSentence=newstr;
	}

	return resultSentence
}


function Topologize(){

	lib.ConnectLines();

	var elements = glob.page.elements;
	var lines = glob.page.lines;

	var S = []
	for (var i=0;i<elements.length;i++){
		var e = elements[i];
		S.push(e[2])
	}

	var M = [];
	var N = [];
	for (var i=0;i<elements.length;i++){
		var r = [];
		var rn = [];
		for (var j=0;j<elements.length;j++){
			r.push(0);
			rn.push(0);
		}
		M.push(r);
		N.push(rn);
	}

	for (var i=0;i<elements.length;i++){
		var e1 = elements[i]
		for (var j=i+1;j<elements.length;j++){			
			var e2 = elements[j]
			let r = lib.Connection(e1,e2,lines,elements)
			var c=r[0];
			if  (r!==0&&c!==0){
				//log("found start");
				//log(r)
				let c = r[0]
				let l = r[1]
				//log("r = "+r)
				//log("c:"+c,"l:"+l)
				M[i][j]=c;
				M[j][i]=-c;
				N[i][j]=l[4]
				N[j][i]=l[4]
				//log("found end");
			}
		}
	}
	return {S:S,M:M,N:N};
}

function GetConnected(s,M){
	var result=[]
	for(var j=0;j<M.length;j++){
		if (M[s][j]!==0){
			result.push(j);
		}
	}
	return result;
}


//so long as it's a tree, you only need to know your connection from a single symbol
function FindDisconnectedInsertionPosition(uv,vec,v_node,M){
	//log("FindDisconnectedInsertionPosition");
	var margin=0;
	while(true) {
		var bounds = lib.getBounds();
		var top = bounds[0];
		var bottom = bounds[1];
		var left = bounds[2];
		var right = bounds[3];

		left-=margin;
		right+=margin;
		top-=margin;
		bottom+=margin;
		
		var xoffset=left
		var yoffset=top
		var w = right-left+1
		var h = bottom-top+1

		//log("margin = "+margin+" w,h = "+w+","+h)
		//populate blank one
		var grid=[]
		for (var i=0;i<w;i++){
			var col=[]
			for (var j=0;j<h;j++){
				col.push(0)
			}
			grid.push(col)
		}

		//populate with obstructions (obstruction=+1)
		for (var i=0;i<glob.page.elements.length;i++){
			var e = glob.page.elements[i];
			
			var px = e[0]-xoffset
			var py = e[1]-yoffset
			
			for (var j=-4;j<=4;j++){
				if (j===0) {
					continue;
				}
				
				var targetval=-2;
				
				var px = e[0]-xoffset;
				var py = e[1]-yoffset;
				grid[px][py]=-3;

				var diff = lib.axes[j];
				var bounded = (x,y) => (x>=0&&x<w&&y>=0&&y<h);
				var start=true;
				while(bounded(px,py)){
					var e_here = lib.ElementAt(px+xoffset,py+yoffset);
					if (e_here!==null&&!start){
						break;
					}
					start=false;
					grid[px][py]=Math.min(grid[px][py],targetval);
					px+=diff[0];
					py+=diff[1];
				}
			}
		}

		var grid_s = "";
		for (var j=0;j<grid[0].length;j++){
			for (var i=0;i<grid.length;i++){
				grid_s+="ox*."[grid[i][j]+3];
			}
			grid_s+="\n";
		}
		//log(grid_s);

		//find a -1
		for (var i2=0;i2<w;i2++){
			for (var j2=0;j2<h;j2++){
				if (grid[i2][j2]===0){
					return [i2+xoffset,j2+yoffset];
				}
			}
		}
		margin++;
		if (margin>5){
			return [0,1];
		}
	}
	return [0,1];
}

//so long as it's a tree, you only need to know your connection from a single symbol
function FindInsertionPosition(uv,vec,v_node,M){
	var margin=0;
	while(true) {
		var bounds = lib.getBounds();
		var top = bounds[0];
		var bottom = bounds[1];
		var left = bounds[2];
		var right = bounds[3];

		left-=margin;
		right+=margin;
		top-=margin;
		bottom+=margin;
		
		var xoffset=left
		var yoffset=top
		var w = right-left+1
		var h = bottom-top+1

		//log("margin = "+margin+" w,h = "+w+","+h)
		//populate blank one
		var grid=[]
		for (var i=0;i<w;i++){
			var col=[]
			for (var j=0;j<h;j++){
				col.push(0)
			}
			grid.push(col)
		}

		//populate with obstructions (obstruction=+1)
		for (var i=0;i<glob.page.elements.length;i++){

			var e = glob.page.elements[i];
			var px = e[0]-xoffset
			var py = e[1]-yoffset
			
			for (var j=-4;j<=4;j++){
				if (j===0) {
					continue;
				}
				
				var targetval=-2;
				
				if (j===-vec && e===v_node){
					targetval=-1;
				}
				var px = e[0]-xoffset;
				var py = e[1]-yoffset;
				grid[px][py]=-3;

				var diff = lib.axes[j];
				var bounded = (x,y) => (x>=0&&x<w&&y>=0&&y<h);
				var start=true;
				while(bounded(px,py)){
					var e_here = lib.ElementAt(px+xoffset,py+yoffset);
					if (e_here!==null&&!start){
						break;
					}
					start=false;
					grid[px][py]=Math.min(grid[px][py],targetval);
					px+=diff[0];
					py+=diff[1];
				}
			}
		}

		var grid_s = "";
		for (var j=0;j<grid[0].length;j++){
			for (var i=0;i<grid.length;i++){
				grid_s+="ox*."[grid[i][j]+3];
			}
			grid_s+="\n";
		}
		//log(grid_s);

		//find a -1
		for (var i2=0;i2<w;i2++){
			for (var j2=0;j2<h;j2++){
				if (grid[i2][j2]===-1){
					var resultE = [i2+xoffset,j2+yoffset,uv[1]];
					var resultL = [v_node[0],v_node[1],i2+xoffset,j2+yoffset,0];
					return [resultE,resultL];
				}
			}
		}
		margin++;
		if (margin>100){
			return [0,1];
		}
	}
	return [0,1];
}

var blah=0;

//all this code assumes no loops!
function Instantiate(T){
	lib.clearGraph();
	var S = T.S;
	var M = T.M;
	var N = T.N;

	//first, make an impure model with overlapping elements
	if (S.length===0){
		return;
	}

	var s = S[0];
	glob.page.elements.push([0,0,s]);
	var visited=[ [0,S[0]] ];
	var unvisited=[];	
	for (var i=1;i<S.length;i++){
		unvisited.push([i,S[i]]);
	}

	var found=false;
	while (unvisited.length>0){
		found=false;
		//unvisited node connected to graph
		for (var i=0;i<unvisited.length;i++){
			var breakout=false;
			var uv = unvisited[i];
			var uv_index=uv[0];
			for (var j=0;j<visited.length;j++){
				var v = visited[j];
				var v_index = v[0];
				if (M[uv_index][v_index]!==0){
					found=true;
					var v_node = glob.page.elements[j];
					var [newE,newL] = FindInsertionPosition(uv,M[v_index][uv_index],v_node);
					newL[4]=N[uv_index][v_index];
					glob.page.elements.push(newE);
					glob.page.lines.push(newL);

					unvisited.splice(i,1);
					visited.push(uv)

					//PrintImage();
					blah++;
				}
			}
			if (breakout){
				break;
			}
		}

		//remained of unvisited is disconnected - just add the first one
		if (found===false){		
			var breakout=false;
			var uv = unvisited[0];
			var uv_index=uv[0];
			var newE = FindDisconnectedInsertionPosition()
			newE[2]=uv[1];

			glob.page.elements.push(newE);

			unvisited.splice(0,1);
			visited.push(uv)

			//PrintImage();
			blah++;
		}

	}
}


module.exports.Topologize=Topologize
module.exports.Instantiate=Instantiate
module.exports.topToSpeech=topToSpeech
module.exports.topToSpeech2=topToSpeech2