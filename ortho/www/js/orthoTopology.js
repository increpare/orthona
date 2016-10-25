


function Topologize(){
	var elements = page.elements;
	var lines = page.lines;

	
	var S = []
	for (var i=0;i<elements.length;i++){
		var e = elements[i];
		S.push(e[2])
	}

	var M = [];
	for (var i=0;i<elements.length;i++){
		var r = [];
		for (var j=0;j<elements.length;j++){
			r.push(0);
		}
		M.push(r);
	}

	for (var i=0;i<elements.length;i++){
		var e1 = elements[i]
		for (var j=i+1;j<elements.length;j++){			
			var e2 = elements[j]
			var c = Connection(e1,e2,lines)
			M[i][j]=c;
			M[j][i]=-c;
		}
	}

	var T = {S:S,M:M};
	return {S:S,M:M};
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
function FindInsertionPosition(uv,vec,v_node,M){
	var margin=1;
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

		log("margin = "+margin+" w,h = "+w+","+h)
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
		log(grid_s);

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
		if (margin>5){
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

	while (unvisited.length>0){
		//unvisited node connected to graph
		for (var i=0;i<unvisited.length;i++){
			var breakout=false;
			var uv = unvisited[i];
			var uv_index=uv[0];
			for (var j=0;j<visited.length;j++){
				var v = visited[j];
				var v_index = v[0];
				if (M[uv_index][v_index]!==0){
					var v_node = page.elements[j];
					var [newE,newL] = FindInsertionPosition(uv,M[v_index][uv_index],v_node);

					page.elements.push(newE);
					page.lines.push(newL);

					unvisited.splice(i,1);
					visited.push(uv)

					SaveImage(blah+".png");
					blah++;
				}
			}
			if (breakout){
				break;
			}
		}

	}
}