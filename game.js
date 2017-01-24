var width=0;
var height = 0;

var shamblers = [];

var obstacles = [];

var FRAME_PERIOD = 45 ;



var noGoZoneSize = 14; //no shambler can go this close of another shambler
var NGSS= noGoZoneSize*noGoZoneSize;

var SPEED = 40; //px per sec.
var J_SPEED_VARIANCE = 20; //between 0 and this will be added to the speed of each individual shamblers
var NB_SHAMBLERS = 100 ;

var SIDE_LEFT  = (0.5 * Math.PI)+(0.05 *Math.PI);
var SIDE_RIGHT = (-0.5* Math.PI)+(-0.05*Math.PI);



function setTarget(e){

	var x = e.clientX ;
	var y = e.clientY;



	for(var i = 0 ; i < shamblers.length ; i++){
		updateShamblerTarget(i, x,y);
	}

}



function init(){
	width = window.innerWidth;
	height = window.innerHeight;
	

	//document.getElementById('outTop').style.width=(width-200)+"px";
	//document.getElementById('outDown').style.width=(width-200)+"px";

	createTable();

	addObstacle(7,3);
	addObstacle(2,2);

	addShamblers(NB_SHAMBLERS);



	document.getElementById('gameTable').addEventListener("click", setTarget);

	setInterval(update, FRAME_PERIOD);
}

var t = 0;

function update(){

	t++;
	var woken = Math.ceil(t / 5 );

	//do not start all shamblers at the sime time
	var maxUpdate = woken>shamblers.length?shamblers.length:woken; 

	for(var zIdx = 0 ; zIdx < maxUpdate ; zIdx++){


		var ll = document.getElementById('z_leftLeg_'+zIdx);
		if(!ll.classList.contains('walkLeft')){
			ll.classList.add("walkLeft"); 
		}
	
		var rl = document.getElementById('z_rightLeg_'+zIdx);
		if(!rl.classList.contains('walkRight')){
			rl.classList.add("walkRight"); 
		}


		var zx = shamblers[zIdx].x;
		var zy = shamblers[zIdx].y;

		var targetX = shamblers[zIdx].target[0];
		var targetY = shamblers[zIdx].target[1];

		var dirX = targetX - zx;
		var dirY = targetY - zy;

		var toTarget = Math.sqrt(dirX*dirX + dirY*dirY);

		if(toTarget < 15){
			continue;
		}

		dirX = dirX/toTarget;
		dirY = dirY/toTarget;

		var moveX = shamblers[zIdx].speed*dirX*(FRAME_PERIOD/1000);
		var moveY = shamblers[zIdx].speed*dirY*(FRAME_PERIOD/1000);

		var newX = zx+moveX;
		var newY = zy+moveY;

		//check obstacles
		var blocked = checkIfDirectionBlocked(zIdx, newX, newY);

		
		if(blocked){
			//shambler is blocked ; try sideways ?	
			var degrees= shamblers[zIdx].side;		
			
			//speed halved when going sideways
    		var sideX = zx + 0.5*shamblers[zIdx].speed*(FRAME_PERIOD/1000)*(dirX * Math.cos(degrees) - dirY * Math.sin(degrees));
    		var sideY = zy + 0.5*shamblers[zIdx].speed*(FRAME_PERIOD/1000)*(dirX * Math.sin(degrees) + dirY * Math.cos(degrees));

    		if(!checkIfDirectionBlocked(zIdx, sideX, sideY)){
    			newX = sideX;
    			newY = sideY;
				updateShamblerTarget(zIdx, shamblers[zIdx].target[0],  shamblers[zIdx].target[1]);

    		}else{
    			
    			//try to change direction
    			degrees = (degrees >0 ? SIDE_RIGHT:SIDE_LEFT);

    			//speed halved when going sideways
    			sideX = zx + 0.5*shamblers[zIdx].speed*(FRAME_PERIOD/1000)*(dirX * Math.cos(degrees) - dirY * Math.sin(degrees));
    		 	sideY = zy + 0.5*shamblers[zIdx].speed*(FRAME_PERIOD/1000)*(dirX * Math.sin(degrees) + dirY * Math.cos(degrees));

    			if(!checkIfDirectionBlocked(zIdx, sideX, sideY)){
	    			newX = sideX;
	    			newY = sideY;
	    			updateShamblerTarget(zIdx, shamblers[zIdx].target[0],  shamblers[zIdx].target[1]);

	    			//this direction is free ; next loop, try this one first.
	    			shamblers[zIdx].side = degrees;

    			}
    			else{
    				//shambler blocked in both direction
    				newX = zx;
    				newY = zy;
    			}
			}
		}


		shamblers[zIdx].x = newX;
		shamblers[zIdx].y = newY;


		var zDiv = shamblers[zIdx].element ;
		zDiv.style.left=(shamblers[zIdx].x-10)+"px";
		zDiv.style.top=(shamblers[zIdx].y-10)+"px";
	}

}

function checkIfDirectionBlocked(zIdx, zx, zy){


	for(var o = 0 ; o < obstacles.length ; o++){
		if(obstacles[o].block(zx,zy, zIdx)){
			return true;
		}
	}
	return false;
}


function updateShamblerTarget(zIdx, lookAtX, lookAty){

	var zx = shamblers[zIdx].x;
	var zy = shamblers[zIdx].y;


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


	shamblers[zIdx].angle = angle;
	shamblers[zIdx].target[0] = lookAtX;
	shamblers[zIdx].target[1] = lookAty;

	shamblers[zIdx].element.style.transform="rotate("+angle+"deg)";

}


function addShamblers(nbZ){

	var tableWidth = width ;//-200;
	var tableHeight = height ;//- 200;


	for (var y = 0; y < nbZ; y++) { 

		var zX = Math.floor(Math.random()*50);
		var zY = Math.floor(Math.random()*50);

		var origin = Math.floor(Math.random()*4);


		if(origin === 0){
			//on the top side
			zX = Math.floor(Math.random()*width);
			zY =-30-1*Math.floor(Math.random()*50);
		}else if(origin === 1){
			//on the right side
			zX = width +30+ Math.floor(Math.random()*50);
			zY = Math.floor(Math.random()*height);
		}else if(origin === 2){
			//on the bottom side
			zX = Math.floor(Math.random()*tableWidth);
			zY = height +30 + Math.floor(Math.random()*50);			
		}else if(origin === 3){
			//on the left side
			zX = -30 - Math.floor(Math.random()*50);
			zY = Math.floor(Math.random()*height);		
		}
		

		if(checkIfDirectionBlocked(999999, zX,zY)){
			//another shambler is too near
			y--;
			continue;
		}

		var zSpeed = SPEED + Math.ceil(Math.random()*J_SPEED_VARIANCE);

		var iDiv = document.createElement('div');
		iDiv.id = 'z'+y;
		iDiv.className = 'shambler';
		iDiv.style.top=zY-10+"px";
		iDiv.style.left=zX-10+"px";

		var skin = 1 + (y%7);

		var head = createPart('head',y);
		head.style.backgroundImage = 'url("shamblers/h.png")';
		iDiv.appendChild(head);

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

		var sideDirection = SIDE_LEFT;

		if(y%2 === 1){
			sideDirection = SIDE_RIGHT;			
		}

		shamblers[y] = {
			index:y,
			x:zX,
			y:zY,
			element:iDiv,
			angle:0, 
			target:[0,0], 
			side:sideDirection, 
			speed:zSpeed,
			block:function(zx,zy,indexMover){
				if(this.index === indexMover){
					//shamblers should not block himself...
					return false;
				}
				var distanceSquare = (this.x - zx)*(this.x - zx) + (this.y - zy)*(this.y - zy);

				return (distanceSquare < NGSS);
			}
		}
		obstacles.push(shamblers[y]);

		document.getElementsByTagName('body')[0].appendChild(iDiv);

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