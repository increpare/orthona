{
  function everyOther(ar) {
	var result = []
    for (var i=0;i<ar.length;i++){
	    result.push(ar[i][1]);	
    }
    return result
  }
  function processThing(thing,rayLists){
      if (rayLists===null){
       	return ["THINGS",thing,["RAYLIST"]]
      }
      var rays = ["RAYLIST"];
      //console.log("RL\n\n"+JSON.stringify(rayLists[3],1,"\t"))
      for (var i=0;i<rayLists[3][0].length;i++){
         var r=rayLists[3][0][i];
         rays.push(r)
      }
	  return ["THING",thing,rays]
  }

  function normalizeRay(dir,things){
  	var rayList=["RAYLIST"];
  	for (var i=1;i<things.length;i++){      
  		rayList.push(["RAY",dir,things[i]])
  	}
    console.log("things : "+things)
    console.log("RAYLIST : "+rayList)
  	return rayList
  }
	function processThings(remainder){
		var result = []
		for (var i=0;i<remainder.length;i++){
			result.push(remainder[i][1]);
		}console.log(`PT\n\n\n${remainder}\n\n\n${result}\n\n\n`)
		return result;
	}
    
    function combineThings(things){
	    var result=["THINGS",]
        for (var i=0;i<things.length;i++){
        	result.push(things[i][1])
        }
        return result;
    }
}

start
  = thing?

symbol "symbol"
	= symbol:('a'/'b'/'x'/'y'/'dot'/'identity'/'good'/'change'/'group'/'event'/'need'/'friend'/'question'/'want'/'power'/'sight'/'smell'/'touch'/'sound'/'eat'/'know'/'scary'/'time'/'action'/'play'/'size'/'pain'/'ease'/'cause'/'safe'/'sex'/'internal'/'familiar'/'living'/'sleep') {console.log(symbol+"\n\n\n");return ["SYMBOL",symbol]}

dir "dir"
	= modifier:[-]? dir:('ul'/'ur'/'dl'/'dr'/'u'/'d'/'l'/'r') {return ["DIR",modifier===null?0:1,dir]}
    
thing "thing"
	= _ thing:symbol rayLists:( _ leftBrace _ ray* _ rightBrace )?   {						
							return processThing(thing,rayLists)
						} 

things = first:thing remainder:(__ thing)* {return combineThings([first].concat(processThings(remainder)))}

ray "ray"// returns an array list though
	= dir:dir __ things:things _ {return normalizeRay(dir,things)}
    
leftBrace = "[" {return null;}
rightBrace = "]" {return null;}

// optional whitespace
_  = [ \t\r\n]* {return null;}

// mandatory whitespace
__ = [ \t\r\n]+ {return null;}




