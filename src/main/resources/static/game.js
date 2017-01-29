
var shamblers = [];

var obstacles = [];





function setTarget(e){

	var x = e.clientX ;
	var y = e.clientY;



	/*for(var i = 0 ; i < shamblers.length ; i++){
		updateShamblerTarget(i, x,y);
	}*/

}



function init(){



	createTable();

	document.getElementById('gameTable').addEventListener("click", setTarget);

}






function addOrUpdateShambler(shambler){

	var divId = 'z'+shambler.id;

	if( document.getElementById(divId)){
		
		var iDiv = getElementById(divId);
		
		iDiv.style.left=shambler.x-10+"px";
		iDiv.style.top=shambler.y-10+"px";
		
		iDix.style.transform="rotate("+shambler.angle+"deg)";
		
	} else {
		
		var iDiv = document.createElement('div');
		iDiv.id = 'z'+shambler.id;
		
		iDiv.className = 'shambler';
		var head = createPart('head',y);
		head.style.backgroundImage = 'url("shamblers/h.png")';
		iDiv.appendChild(head);
		
		var skin = shambler.skin;
		
		var torso = createPart('torso',y);
		torso.style.backgroundImage = 'url("shamblers/'+skin+'/t.png")';
		iDiv.appendChild(torso);
	
		var arms = createPart('arms',y);
		arms.style.backgroundImage = 'url("shamblers/'+skin+'/a.png")';
		iDiv.appendChild(arms);
	
		var ll = createPart('leftLeg',y);
		iDiv.appendChild(ll);
	
		var rl = createPart('rightLeg',y)
		iDiv.appendChild(rl);
		
		document.getElementsByTagName('body')[0].appendChild(iDiv);

		iDiv.style.left=shambler.x-10+"px";
		iDiv.style.top=shambler.y-10+"px";
	
		
		iDix.style.transform="rotate("+shambler.angle+"deg)";

	}
}

function createPart(cssClass, zindex){
	var iDiv = document.createElement('div');
	iDiv.id = 'z_'+cssClass+"_"+zindex;
	iDiv.classList.add(cssClass);

	return iDiv;
}

function addObstacle(cellX, cellY){
	var floorDiv = document.createElement('img');
	floorDiv.classList.add("ground");
	floorDiv.src = 'GROUND.png';

	var roofDiv = document.createElement('div');
	roofDiv.classList.add("roof");
	roofDiv.style.backgroundImage = 'url("ROOF.png")';


	cell = document.getElementById("cell"+cellX+"_"+cellY);
	cell.appendChild(floorDiv);
	cell.appendChild(roofDiv);



	obstacles.push( {
		cell:cell, 
		x : cellX*80, 
		y : cellY*80, 
		width:80, 
		height:80,
		block:function(tgtx,tgty,indexMover) {
			return (tgty  > this.y && tgty < (this.y+this.height))
			&&
			(tgtx  > this.x && tgtx < (this.x+this.width))
		} 
	});
}

function createTable() {
	var tableWidth = width;// -200;
	var tableHeight = height;// - 200;

	var nbCellsW = Math.floor(tableWidth / 80);
	var nbCellsH = Math.ceil(tableHeight / 80);

	var table = document.getElementById("gameTable");

	for (var y = 0; y < nbCellsH; y++) { 
		var row = table.insertRow(y);

		for (var x = 0; x < nbCellsW; x++) { 

			var cell = row.insertCell(x);

			cell.id="cell"+x+"_"+y;
			cell.className="gameCell";

		}

	}
}