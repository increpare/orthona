var fs = require('fs')
var log = console.log

function countTabs(text) {
  var count = 0;
  var index = 0;
  while (text.charAt(index++) === "\t") {
    count++;
  }
  return count;
}

function empty(obj){
    return Object.keys(obj).length === 0;
}

function parseString(s){
	//preprocess
	//[tabCount,hasColon,key,value]
	lines = s.split("\n")
	processed = []
	for (var i=0;i<lines.length;i++){
		var l = lines[i]

		var hasColon = l.indexOf(":")>=0;

		var parts = l.trim().split(/:(.+)?/)
		var processedL=[]
		for (var j=0;j<parts.length;j++){
			if (parts[j]!=null&&parts[j].trim()!=''){
				processedL.push(parts[j].trim())
			}
		}

		if (processedL.length>0){
			if (i>0 &&
				hasColon===false &&
				processedL.length===1 &&
				processed[processed.length-1].length===4){
				processed[processed.length-1][3]+=" "+processedL[0]
				continue;
			} else {
				var tabCount = countTabs(l);		
				processedL.splice(0,0,hasColon)	
				processedL.splice(0,0,tabCount)
			}
		}
		if (processedL.length===0 && (i===0||processed[processed.length-1].length===0)){
			continue;
		}
		if (processedL.length===4){
			if (processedL[3]==="none"){
				processedL[3]=null;
			}
		}
		processed.push(processedL)
	}

	
	result=[]

	var curObject={};
	var subObject=[];
	result.push(curObject);
	
	var state = "REG"//"PUSHing to subobject//conCATenating strings"
	for (var i=0;i<processed.length;i++){
		var final = i===processed.length-1
		var penultimate = i===processed.length-2
		var l = processed[i];

		switch(state){
			case "REG":
			{
				if (l.length===0){
					if (!empty(curObject)){
						curObject={}
						result.push(curObject)
					}
				} else if (l.length===3){
					var key = l[2]
					subObject=[]
					curObject[key]=subObject
					state="PUSH"
				} else if (l.length===4){
					//[indent,colon,key,value]
					var indent=l[0];
					var colon=l[1]
					var key=l[2]
					var value=l[3]
					curObject[key]=value
				}
				break;
			}
			case "PUSH":
			{
				if (l.length===0){
					//this is either the end of the 
					//whole record, or a boundary 
					//between two subrecords
					if (!final&&processed[i+1][0]===0){
						i--;
						state="REG";
						break;
					} else {
						subObject.push([]);
					}
				} else if (l.length===3){
					//if it's an unindented record, break out and try again in regular state
					if (l[0]===0){
						i--;
						state="REG";
						break;
					} else {
						var value=l[2]
						subObject.push(value)
					}
					//reading into array
				} else if (l.length===4){
					//reading into record
					var indent=l[0];
					if (indent===0){
						i--;
						state="REG";
						break;
					}
					var colon=l[1]
					var key=l[2]
					var value=l[3]
					if (subObject.length===0){
						subObject.push([])
					}
					subObject[subObject.length-1][key]=value
				}

				break;
			}
			case "CAT":
			{
				break;
			}
		}
	}
	if (empty(result[result.length-1])){
		result.splice(result.length-1,1);
	}
	return result
}

function loadFile(fileName){
	var fileDat=fs.readFileSync(fileName,'utf8')
	var dat = parseString(fileDat)
	return dat
}

//var loaded = loadFile("../res/docDatabase.slab")
//log(loaded)

module.exports.parseString=parseString
module.exports.loadFile=loadFile