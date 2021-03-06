


function init(){

	createTable();
	//document.getElementById('gameTable').addEventListener("click", setTarget);

}



function addOrUpdateShambler(shambler){

	var divId = 'z'+shambler.id;

	if( document.getElementById(divId)){

		var iDiv = document.getElementById(divId);

		iDiv.style.left=shambler.x-10+"px";
		iDiv.style.top=shambler.y-10+"px";

		iDiv.style.transform="rotate("+shambler.angle+"deg)";

	} else {

		var iDiv = document.createElement('div');
		iDiv.id = 'z'+shambler.id;

		iDiv.className = 'shambler';
		var head = createPart('head',iDiv.id);
		head.style.backgroundImage = 'url("shamblers/h.png")';
		iDiv.appendChild(head);

		var skin = shambler.skin;

		var torso = createPart('torso',iDiv.id);
		torso.style.backgroundImage = 'url("shamblers/'+skin+'/t.png")';
		iDiv.appendChild(torso);

		var arms = createPart('arms',iDiv.id);
		arms.style.backgroundImage = 'url("shamblers/'+skin+'/a.png")';
		iDiv.appendChild(arms);

		var ll = createPart('leftLeg',iDiv.id);
		iDiv.appendChild(ll);

		var rl = createPart('rightLeg',iDiv.id)
		iDiv.appendChild(rl);

		document.getElementsByTagName('body')[0].appendChild(iDiv);

		iDiv.style.left=shambler.x-10+"px";
		iDiv.style.top=shambler.y-10+"px";


		iDiv.style.transform="rotate("+shambler.angle+"deg)";

	}
}

function createPart(cssClass, zindex){
	var iDiv = document.createElement('div');
	iDiv.id = 'z_'+cssClass+"_"+zindex;
	iDiv.classList.add(cssClass);

	return iDiv;
}


function addOrUpdateObstacle(obstacle){

	if(!document.getElementById(obstacle.id)) {
		var floorDiv = document.createElement('img');
		floorDiv.classList.add("ground");
		floorDiv.src = 'houses/floor.png';
		floorDiv.id = obstacle.id;

		var roofDiv = document.createElement('div');
		roofDiv.classList.add("roof");
		roofDiv.style.backgroundImage = 'url("houses/roof'+obstacle.skin+'.png")';
		roofDiv.id = 'r'+obstacle.id;

		
		var cellX = obstacle.topLeftX / 80;
		var cellY = obstacle.topLeftY / 80;

		cell = document.getElementById("cell"+cellX+"_"+cellY);
		cell.appendChild(floorDiv);
		cell.appendChild(roofDiv);
	}
}

function createTable() {
	var tableWidth = 1000; //width;// -200;
	var tableHeight = 500; //height;// - 200;

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