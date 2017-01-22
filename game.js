var width=0;
var height = 0;

var shamblers = [];



function mouseMove(e){

	var x = e.clientX ;
	var y = e.clientY;



	for(i = 0 ; i < shamblers.length ; i++){
		updateShamblerDirection(i, x,y);
	}

}



function init(){
	width = window.innerWidth;
	height = window.innerHeight;
	

	document.getElementById('outTop').style.width=(width-200)+"px";
	document.getElementById('outDown').style.width=(width-200)+"px";

	createTable();

	addShamblers(1);



	document.getElementById('gameTable').addEventListener("mousemove", mouseMove);
}

function updateShamblerDirection(zIdx, lookAtX, lookAty){

	var zx = shamblers[zIdx][0];
	var zy = shamblers[zIdx][1];

	var m = (zy-lookAty)/(zx-lookAtX);//TODO : check m & unit m first

	var angleRadians = Math.atan(m);
	var angle = angleRadians * (180 / Math.PI);

	console.log("SHAMBLER : "+zx+";"+zy);
	console.log("TARGET : "+lookAtX+";"+lookAty);
	console.log("ANGLE : "+angle);
	console.log("rads : "+angleRadians);

	shamblers[zIdx][2].style.transform="rotate("+angle+"deg)";

}

function addShamblers(nbZ){

	var tableWidth = width -200;
	var tableHeight = height - 200;


	for (y = 0; y < nbZ; y++) { 



		var zX = Math.floor(tableWidth * Math.random());
		var zY = Math.floor(tableHeight * Math.random());

		shamblers[y] = [zX, zY];

		var iDiv = document.createElement('div');
		iDiv.id = 'z'+y;
		iDiv.className = 'shambler';
		iDiv.style.top=zY+"px";
		iDiv.style.left=zX+"px";

		shamblers[y] = [zX, zY, iDiv];

		document.getElementsByTagName('body')[0].appendChild(iDiv);

	}
}

function createTable() {
	var tableWidth = width -200;
	var tableHeight = height - 200;

	var nbCellsW = Math.floor(tableWidth / 80);
	var nbCellsH = Math.ceil(tableHeight / 80);

	var table = document.getElementById("gameTable");

	for (y = 0; y < nbCellsH; y++) { 
		var row = table.insertRow(y);

		for (x = 0; x < nbCellsW; x++) { 
			var cell = row.insertCell(x);
			cell.className="gameCell";
		}

	}
}