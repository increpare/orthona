
function findMostCentralVal(v,grid){
	function dsq(x1,y1,x2,y2){
		var dx=x2-x1
		var dy=y2-y1
		return dx*dx+dy*dy
	}

	var mx=grid.length/2;
	var my=grid[0].length/2;

	var closest=1000000;
	var closestcoords=null;
	for (var i=0;i<grid.length;i++){
		for (var j=0;j<grid[0].length;j++){
			if (grid[i][j]===v){
				if (dsq(i,j,mx,my)<closest){
					closest=dsq(i,j,mx,my)
					closestcoords=[i,j]
				}
			}
		}
	}
	return closestcoords
}


function Topologize(){
	var elements = page.elements;
	var lines = page.lines;

	
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
			let r = Connection(e1,e2,lines)
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
		var bounds = getBounds();
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
		for (var i=0;i<page.elements.length;i++){
			var e = page.elements[i];
			
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

				var diff = axes[j];
				var bounded = (x,y) => (x>=0&&x<w&&y>=0&&y<h);
				var start=true;
				while(bounded(px,py)){
					var e_here = ElementAt(px+xoffset,py+yoffset);
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
		var bounds = getBounds();
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
		for (var i=0;i<page.elements.length;i++){

			var e = page.elements[i];
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

				var diff = axes[j];
				var bounded = (x,y) => (x>=0&&x<w&&y>=0&&y<h);
				var start=true;
				while(bounded(px,py)){
					var e_here = ElementAt(px+xoffset,py+yoffset);
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
	clearGraph();
	var S = T.S;
	var M = T.M;
	var N = T.N;

	//first, make an impure model with overlapping elements
	if (S.length===0){
		return;
	}

	var s = S[0];
	page.elements.push([0,0,s]);
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
					var v_node = page.elements[j];
					var [newE,newL] = FindInsertionPosition(uv,M[v_index][uv_index],v_node);
					newL[4]=N[uv_index][v_index];
					page.elements.push(newE);
					page.lines.push(newL);

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

			page.elements.push(newE);

			unvisited.splice(0,1);
			visited.push(uv)

			//PrintImage();
			blah++;
		}

	}
}