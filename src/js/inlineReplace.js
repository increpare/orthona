var glob = require('./orthoGlobals')
var lib = require('./orthoLib')
var svgRender = require("./svgRender_online")

function inlineReplace(document){
	glob.drawGridLines=false;
	

	var headers = document.getElementsByTagName("h2");
	var innerHTML="<ol>";
	for (var i=0;i<headers.length;i++) {
		var e = headers[i];
		e.id="section"+i;
		var title=e.innerHTML;
		innerHTML+=`<li><a href="#section${i}">${title}</a">`
	}
	innerHTML+="</ol>"
	var index= document.getElementById("index");
	index.innerHTML=innerHTML;
	
	var els = document.getElementsByTagName("span");
	for (var i=0;i<els.length;i++) {
		var e = els[i];
		if (e.className!=""){
			continue;
		}
		var s = e.innerHTML;
		if (!isNaN(s)){
			s=`{"elements":[[8,8,${s}]],"lines":[],"offsetX":0,"offsetY":0,"scale":1,"sketchTitle":""}`;
		}
		try{
			lib.loadString(s);			
			var svgDat = svgRender.render();
			e.innerHTML=svgDat;
		} catch (e) {
			console.log(e);
		}
	}
	var els2= document.getElementsByTagName("div");
	for (var i=0;i<els2.length;i++) {
		var e = els2[i];
		if (e.className!="" || e.id!=""){
			continue;
		}
		var s = e.innerHTML;
		if (!isNaN(s)){
			s=`{"elements":[[8,8,${s}]],"lines":[],"offsetX":0,"offsetY":0,"scale":1,"sketchTitle":""}`;
		}
		try {
			lib.loadString(s);
			var svgDat = svgRender.render();
			e.innerHTML=svgDat;
		} catch (e) {
			console.log(e);
		}
	}

}

module.exports.inlineReplace = inlineReplace