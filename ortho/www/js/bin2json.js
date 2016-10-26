#!/usr/bin/env node

var fs = require('fs')
eval(fs.readFileSync('orthoGlobals.js')+'')
eval(fs.readFileSync('orthoRender.js')+'')
eval(fs.readFileSync('orthoLib.js')+'')
eval(fs.readFileSync('orthoTopology.js')+'')


if (process.argv.length===2){
	console.log("USAGE: bin2json INPUT [OUTPUT]")
	return
}

var inputFileName=""
var outputFileName=""
for (var i=2;i<process.argv.length;i++){
	var t = process.argv[i]
	if (inputFileName===""){
		inputFileName=t
	} else if (outputFileName===""){
		outputFileName=t
	} else {
		console.log("Too many arguments. Unexpected argument \""+t+"\".")		
	}
}

if (inputFileName=="")
{
	console.log("need to supply input file")
}

if (outputFileName===""){
	outputFileName = inputFileName.substring(0, inputFileName.indexOf('.bin'))+'.json'
}

loadBinary(inputFileName)

saveFile(outputFileName)
log("saved " + outputFileName)
