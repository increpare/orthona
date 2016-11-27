var glob = require('./orthoGlobals')
var lib = require('./orthoLib')
var inlineReplace = require('./inlineReplace').inlineReplace
var svgRender = require("./svgRender_online")

function doStart(){
	glob.drawGridLines=false;
	
	inlineReplace(document)

}

window.onload = doStart