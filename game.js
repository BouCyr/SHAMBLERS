var width=0;
var height = 0;

var shamblers = [];


var iX = 0;
var iY = 1;
var iDIV = 2;
var iANGLE = 3;
var iTGT = 4;
var iSIDE = 5;

var noGoZoneSize = 14; //no shambler can go this close of another shambler
var NGSS= noGoZoneSize*noGoZoneSize;

var SPEED = 50; //px per sec.
var NB_SHAMBLERS = 100 ;

var SIDE_LEFT  = (0.5 * Math.PI)+(0.1 *Math.PI);
var SIDE_RIGHT = (-0.5* Math.PI)+(-0.1*Math.PI);

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

	addShamblers(NB_SHAMBLERS);



	document.getElementById('gameTable').addEventListener("mousemove", mouseMove);

	setInterval(update, 30);
}

var t = 0;

function update(){

	t++;
	document.getElementById('outTop').innerHTML = t;

	for( zIdx = 0 ; zIdx < shamblers.length ; zIdx++){
		var zx = shamblers[zIdx][iX];
		var zy = shamblers[zIdx][iY];

		var targetX = shamblers[zIdx][iTGT][0];
		var targetY = shamblers[zIdx][iTGT][1];

		var dirX = targetX - zx;
		var dirY = targetY - zy;

		var toTarget = Math.sqrt(dirX*dirX + dirY*dirY);

		if(toTarget < 15){
			continue;
		}

		dirX = dirX/toTarget;
		dirY = dirY/toTarget;

		var moveX = SPEED*dirX*(30/1000);
		var moveY = SPEED*dirY*(30/1000);

		var newX = zx+moveX;
		var newY = zy+moveY;

		//check obstacles
		var blocked = checkOtherShamblers(zIdx, newX, newY);

		
		if(blocked){
			//shambler is blocked ; try sideways ?	
			var degrees= shamblers[zIdx][iSIDE];		
			
    		var sideX = zx + SPEED*(30/1000)*(dirX * Math.cos(degrees) - dirY * Math.sin(degrees));
    		var sideY = zy + SPEED*(30/1000)*(dirX * Math.sin(degrees) + dirY * Math.cos(degrees));

    		if(!checkOtherShamblers(zIdx, sideX, sideY)){
    			newX = sideX;
    			newY = sideY;
				updateShamblerDirection(zIdx, shamblers[zIdx][iTGT][0],  shamblers[zIdx][iTGT][1]);

    		}else{
    			
    			//try to change direction
    			degrees = (degrees >0 ? SIDE_RIGHT:SIDE_LEFT);

    			sideX = zx + SPEED*(30/1000)*(dirX * Math.cos(degrees) - dirY * Math.sin(degrees));
    		 	sideY = zy + SPEED*(30/1000)*(dirX * Math.sin(degrees) + dirY * Math.cos(degrees));

    			if(!checkOtherShamblers(zIdx, sideX, sideY)){
	    			newX = sideX;
	    			newY = sideY;
	    			updateShamblerDirection(zIdx, shamblers[zIdx][iTGT][0],  shamblers[zIdx][iTGT][1]);

	    			//this direction is free ; next loop, try this one first.
	    			shamblers[zIdx][iSIDE] = degrees;

    			}
    			else{
    				//shambler blocked in both direction
    				newX = zx;
    				newY = zy;
    			}
			}
		}


		shamblers[zIdx][iX] = newX;
		shamblers[zIdx][iY] = newY;


		var zDiv = shamblers[zIdx][iDIV] ;
		zDiv.style.top=(shamblers[zIdx][iY]-10)+"px";
		zDiv.style.left=(shamblers[zIdx][iX]-10)+"px";
	}

}

function checkOtherShamblers(zIdx, zx, zy){
	//other shamblers
	for( ozIdx = 0 ; ozIdx < shamblers.length ; ozIdx++){
		if(ozIdx === zIdx){
			continue; // the shambler should not block himself...
		}

		var ozx = shamblers[ozIdx][iX];
		var ozy = shamblers[ozIdx][iY];

		var dZOSquare = (ozx - zx)*(ozx - zx) + (ozy - zy)*(ozy - zy);


		//if (zx > ozx-noGoZoneSize && zx < ozx + noGoZoneSize 
		//	&&
		//	zy > ozy-noGoZoneSize && zy < ozy + noGoZoneSize ){
		if(dZOSquare < NGSS){

			//shambler is about to enter another Z no go zone
			return true;
		}
	}
	return false;

}

function updateShamblerDirection(zIdx, lookAtX, lookAty){

	var zx = shamblers[zIdx][iX];
	var zy = shamblers[zIdx][iY];


	var vx = zx - lookAtX;
	var vy = zy - lookAty;


	//unit
	var vectorLength = Math.sqrt(vx*vx + vy*vy);

	var uvx = vx/vectorLength;
	var uvy = vy/vectorLength;


	var m = uvy/uvx;

	var angleRadians = Math.acos(uvx);
	var angle = 90 + angleRadians * (180 / Math.PI);

	if(uvy < 0){
		angle = 180 -1*angle;
	}


	shamblers[zIdx][iANGLE] = angle;
	shamblers[zIdx][iTGT][0] = lookAtX;
	shamblers[zIdx][iTGT][1] = lookAty;

	shamblers[zIdx][iDIV].style.transform="rotate("+angle+"deg)";

}

function addShamblers(nbZ){

	var tableWidth = width -200;
	var tableHeight = height - 200;


	for (y = 0; y < nbZ; y++) { 



		var zX = 100 + Math.floor(tableWidth * Math.random());
		var zY = 100 + Math.floor(tableHeight * Math.random());

		if(checkOtherShamblers(999999, zX,zY)){
			//another shambler is too near
			y--;
			continue;
		}

		var iDiv = document.createElement('div');
		iDiv.id = 'z'+y;
		iDiv.className = 'shambler';
		iDiv.style.top=zY-10+"px";
		iDiv.style.left=zX-10+"px";

		var sideDirection = SIDE_LEFT;

		if(y%2 === 1){
			sideDirection = SIDE_RIGHT;			
		}

		shamblers[y] = [zX, zY, iDiv, 0, [0,0], sideDirection];

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