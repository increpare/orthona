


function Topologize(){
	console.log(page);
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

//all this code assumes no loops!
function Instantiate(T){
	clearGraph();
	var S = T.S;
	var M = T.M;

	page.elements = [];
	page.lines = [];

	//first, make an impure model with overlapping elements
	if (S.length>0){
		var s = S[0];
		page.elements.push([0,0,s]);
		var visited=[0];
		var unvisited=[];
		for (var i=1;i<S.length;i++){
			unvisited.push(i);
		}


		var current=0;
		while (unvisited.length>0){
			for (var i=0;i<unvisited.length;i++){
				var uv = unvisited[i];
				//if connected to any existing thing
				var connections = GetConnected(uv,M);
				var parentIndex = -1;
				for (var i=0;i<connections.length;i++){
					if (visited.indexOf(connections[i])>=0){
						parentIndex=connections[i];
						break;
					}
				}
				if (parentIndex>=0){
					var connectionType = M[uv][parentIndex]
					var vec = axes[connectionType]
					console.log(connectionType,vec)
					unvisited.splice(i,1)
					visited.push(uv)
					var parentNode_Physical_index=visited.indexOf(parentIndex)
					log(parentNode_Physical_index)
					log(page.elements)
					var parentNode_Physical=page.elements[parentNode_Physical_index]
					var x1 = parentNode_Physical[0]
					var y1 = parentNode_Physical[1]
					var x2 = parentNode_Physical[0]+vec[0]
					var y2 = parentNode_Physical[1]+vec[1]
					var newElement = [x2,y2,S[uv]]
					page.elements.push(newElement)					
					page.lines.push([x1,y1,x2,y2,0])
					break;
				}
			}
		}
	}
}