
var FRAME_PERIOD = 45 ;

var t = 0;

var shamblers = [];

setInterval(update, FRAME_PERIOD);


self.onmessage = function (msg) {
    var shamblersJSON = msg.data;

    shamblers = JSON.parse(shamblersJSON);
}



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