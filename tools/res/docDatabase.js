module.exports=[
	{
		name:"Person A",
		description:"",
		uses:[],
		lines:[	
		],
		triple:"",
		examples:[]
	},
	{
		name:"Person B",
		description:"",
		uses:[],
		lines:[	
		],
		triple:"",
		examples:[]
	},
	{
		name:"Object X",
		description:"",
		uses:[],
		lines:[		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Object Y",
		description:"",
		uses:[],
		lines:[	
		],
		triple:"",
		examples:[]
	},
	{
		name:"Dot",
		description:"",
		uses:[],
		lines:[
		],
		triple:"",
		examples:[
			{
				file:"dotExample",
				description:"A dot sign is used to split lines into multiple parts, to allow aggregate statements.",
				translation:"Person A watches Person B while touching themselves."
			}
		]
	},
	{
		name:"Identity",
		description:"Used to indicate who the speaker is, and who they are addressing.",
		uses:["A","B","G","H"],
		lines:[
			"A has an identity",
			"You are B.",
			"I am G.",
			"Any H"
		],
		triple:"",
		examples:[
			{
				file:"personExample",
				description:"",
				translation:"I am Person A, you are Person B."
			}]
	},
	{
		name:"Good",
		description:"Used to indicate something is positive or negative (good/bad, happy/unhappy, &c.).",
		uses:["B","G"],
		lines:[
			"B is bad.",
			"G is good."	
		],
		triple:"",
		examples:[]
	},
	{
		name:"Change",
		description:"",
		uses:["A","B","G","H"],
		lines:[
			"A changes H.",
			"B is changed.",
			"G is static."
		],
		triple:"",
		examples:[]
	},
	{
		name:"Collection",
		description:"",
		uses:["A","B","G","H"],
		lines:[
			"A is a collection of H.",
			"One B.",
			"All G."
		],
		triple:"",
		examples:[
			{
				file:"notOnePerson",
				description:`"Not" applied to "One" means "none"`,
				translation:"No person"
			},
			{
				file:"notAllPeople",
				description:`"Not" applied to "All" means "some"`,
				translation:"All people"
			}]
	},
	{
		name:"Event",
		description:"",
		uses:["A","H"],
		lines:[
			"A's event.",
			"H is at an event."		
		],
		triple:"",
		examples:[
			{
				file:"afterParty",
				description:"",
				translation:"Party and after-party."
			}]
	},
	{
		name:"Necessary",
		description:"",
		uses:["A","B","G","H"],
		lines:[
			"A necessitates H.",
			"B is possible.",
			"G is necessary."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Relationship",
		description:"",
		uses:["A","B","G","H"],
		lines:[
			"A has a relationship with H.",
			"B is self-interested.",
			"G is friendly."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Ask",
		description:"",
		uses:["A","B","G","H"],
		lines:[
			"A asks G about H.",
			"B answers",
		],
		triple:"",
		examples:[]
	},
	{
		name:"Want",
		description:"",
		uses:["A","B","G","H"],
		lines:[
			"A has control of their desires.",
			"B desires G.",
			"H is desired."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Power",
		description:"",
		uses:["A","C","F","H"],
		lines:[
			"A has X.",
			"C is X.","F is X.",
			"X has H."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"See",
		description:"",
		uses:["A","C","F","H"],
		lines:[
			"A has X.",
			"C is X.","F is X.",
			"X has H."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Say",
		description:"",
		uses:["A","C","F","H"],
		lines:[
			"A has X.",
			"C is X.","F is X.",
			"X has H."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Touch",
		description:"",
		uses:["A","C","F","H"],
		lines:[
			"A has X.",
			"C is X.","F is X.",
			"X has H."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Hear",
		description:"",
		uses:["A","C","F","H"],
		lines:[
			"A has X.",
			"C is X.","F is X.",
			"X has H."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Eat",
		description:"",
		uses:["A","C","F","H"],
		lines:[
			"A has X.",
			"C is X.","F is X.",
			"X has H."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Know",
		description:"",
		uses:["A","C","F","H"],
		lines:[
			"A has X.",
			"C is X.","F is X.",
			"X has H."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Smell",
		description:"",
		uses:["A","C","F","H"],
		lines:[
			"A has X.",
			"C is X.","F is X.",
			"X has H."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Time",
		description:"",
		uses:["A","B","G","H"],
		lines:[
			"A has much time left",
			"B is old",
			"G is young/new",
			"H is old-fashioned."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Action",
		description:"",
		uses:["A","C","F","H"],
		lines:[
			"A has X.",
			"C is X.","F is X.",
			"X has H."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Go",
		description:"",
		uses:["A","C","F","H"],
		lines:[
			"A has X.",
			"C is X.","F is X.",
			"X has H."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Size",
		description:"",
		uses:["A","C","F","H"],
		lines:[
			"A has X.",
			"C is X.","F is X.",
			"X has H."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Pain",
		description:"",
		uses:["A","C","F","H"],
		lines:[
			"A has X.",
			"C is X.","F is X.",
			"X has H."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Ease",
		description:"",
		uses:["A","C","F","H"],
		lines:[
			"A has X.",
			"C is X.","F is X.",
			"X has H."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Cause",
		description:"",
		uses:["A","C","F","H"],
		lines:[
			"A has X.",
			"C is X.","F is X.",
			"X has H."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Able",
		description:"",
		uses:["A","C","F","H"],
		lines:[
			"A has X.",
			"C is X.","F is X.",
			"X has H."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Sex",
		description:"",
		uses:["A","C","F","H"],
		lines:[
			"A has X.",
			"C is X.","F is X.",
			"X has H."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Internal",
		description:"",
		uses:["A","C","F","H"],
		lines:[
			"A has X.",
			"C is X.","F is X.",
			"X has H."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Familiar",
		description:"",
		uses:["A","C","F","H"],
		lines:[
			"A has X.",
			"C is X.","F is X.",
			"X has H."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Living",
		description:"",
		uses:["A","C","F","H"],
		lines:[
			"A has X.",
			"C is X.","F is X.",
			"X has H."		
		],
		triple:"",
		examples:[]
	},
	{
		name:"Read",
		description:"",
		uses:["A","C","F","H"],
		lines:[
			"A has X.",
			"C is X.","F is X.",
			"X has H."		
		],
		triple:"",
		examples:[]
	}
]