var glob = require('./orthoGlobals')
var lib = require('./orthoLib')
var svgRender = require("./svgRender_online")

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
  return query_string;
}();

var str = QueryString.r;
var dat = str.split(",").map( n=>parseInt(n));
glob.drawGridLines=false;
glob.page = {
    elements:[],
    lines:[],
    offsetX:0,
    offsetY:0,
    scale:1,
    sketchTitle:""
}

var elementCount = dat[0];
dat.splice(0,1);

for (var i=0;i<elementCount;i++){
	glob.page.elements.push([dat[0],dat[1],dat[2]]);
	dat.splice(0,3);
}

var lineCount = dat[0];
dat.splice(0,1);

for (var i=0;i<lineCount;i++){
	glob.page.lines.push([dat[0],dat[1],dat[2],dat[3],dat[4]]);
	dat.splice(0,5);
}

var svgDat = svgRender.render();

document.body.innerHTML=svgDat;