var css = require('css');
var fs = require('fs')

var cssPath = ("./docs/css/custom.css");
var custom=fs.readFileSync("./docs/css/custom.css",'utf8');

var obj = css.parse(custom,{});

function findCssVar(cssDat,varName){
	for (var i=0;i<cssDat.stylesheet.rules.length;i++){
		var r = cssDat.stylesheet.rules[i];
		for (var j=0;j<r.declarations.length;j++){
			var d = r.declarations[j];
			if (d.type==='declaration' && d.property===varName){
				return d.value;
			}
		}
	}
	return null;
}
console.log(obj.stylesheet.rules[0])

console.log("--fg", findCssVar(obj,"--fg"))
console.log("--bg", findCssVar(obj,"--bg"))
console.log("--link", findCssVar(obj,"--link"))
console.log("--asd", findCssVar(obj,"--asd"))