package com.cbo.shamblers.game;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import com.cbo.shamblers.components.HasCoord;
import com.cbo.shamblers.components.Obstacle;
import com.cbo.shamblers.components.Point;
import com.cbo.shamblers.elements.Building;
import com.cbo.shamblers.elements.Foe;

public class Game {
	
	
	private List<Foe> shamblers = new ArrayList<>();
	private List<Building> buildings = new ArrayList<>();
	private List<Obstacle> obstacles = new ArrayList<>();
	
	
	
	


	private int SPEED = 40; //px per sec.
	private int J_SPEED_VARIANCE = 20; //between 0 and this will be added to the speed of each individual shamblers
	private int NB_SHAMBLERS = 100 ;

	//side and a tad backward
	private double SIDE_LEFT  = (0.5 * Math.PI)+(0.05 *Math.PI);
	private double SIDE_RIGHT = (-0.5* Math.PI)+(-0.05*Math.PI);
	


	
	double FRAME_PERIOD = 30 ;
	
	
	
	
	private int t;
	
	public GameStatus getStatus(){
		return new GameStatus(buildings, shamblers);
	}

	public void create(){
		int tableWidth = 2000 ;//-200;
		int tableHeight = 2000;//- 200;


		Random r = new Random();
		
		{
			int skin = 1 ;
			
			Building b = new Building(1, 3*80, 3*80, 80,80,skin);
			obstacles.add(b);
			buildings.add(b);
		}
		
		{
			int skin = 2 ;
			
			Building b = new Building(2, 7*80, 5*80, 80,80,skin);
			obstacles.add(b);
			buildings.add(b);
		}
		
		
		for (int y = 0; y < NB_SHAMBLERS; y++) { 

			int zX = r.nextInt(tableWidth);
			int zY = r.nextInt(tableHeight);

			if(checkIfDirectionBlocked(new Foe(0, 0, new Point(zX,zY), 0, 0, 0), zX,zY)){
				//another shambler is too near
				y--;
				continue;
			}

			double zSpeed = SPEED + Math.ceil(r.nextDouble()*J_SPEED_VARIANCE);

			int skin = 1 + (y%7);

			double sideDirection = SIDE_LEFT;

			if(y%2 == 1){
				sideDirection = SIDE_RIGHT;			
			}

			Foe shambler = new Foe(y, r.nextInt(360), new Point(zX, zY), zSpeed, sideDirection, skin);
			shambler.updateTarget(new Point(300, 300));
			obstacles.add(shambler);
			shamblers.add(shambler);

		}
		

	}
	
	
	
	public void update(){

		t++;
		int woken = (t / 5 );

		//do not start all shamblers at the sime time
		int maxUpdate = woken>shamblers.size()?shamblers.size():woken; 

		for(int zIdx = 0 ; zIdx < maxUpdate ; zIdx++){

			Foe shambler = shamblers.get(zIdx);

			double zx = shambler.getX();
			double zy = shambler.getY();

			double targetX = shambler.getTarget().getX();
			double targetY = shambler.getTarget().getY();

			double dirX = targetX - zx;
			double dirY = targetY - zy;

			double toTarget = Math.sqrt(dirX*dirX + dirY*dirY);

			if(toTarget < 15){
				continue;
			}

			dirX = dirX/toTarget;
			dirY = dirY/toTarget;

			double moveX = shambler.getSpeed()*dirX*(FRAME_PERIOD/1000);
			double moveY = shambler.getSpeed()*dirY*(FRAME_PERIOD/1000);

			double newX = zx+moveX;
			double newY = zy+moveY;

			//check obstacles
			boolean blocked = checkIfDirectionBlocked(shambler, newX, newY);

			
			if(blocked){
				//shambler is blocked ; try sideways ?	
				double degrees= shambler.getSide();		
				
				//speed halved when going sideways
	    		double sideX = zx + 0.5*shambler.getSpeed()*(FRAME_PERIOD/1000)*(dirX * Math.cos(degrees) - dirY * Math.sin(degrees));
	    		double sideY = zy + 0.5*shambler.getSpeed()*(FRAME_PERIOD/1000)*(dirX * Math.sin(degrees) + dirY * Math.cos(degrees));

	    		if(!checkIfDirectionBlocked(shambler, sideX, sideY)){
	    			newX = sideX;
	    			newY = sideY;
					shambler.updateDirection();

	    		}else{
	    			
	    			//try to change direction
	    			degrees = (degrees >0 ? SIDE_RIGHT:SIDE_LEFT);

	    			//speed halved when going sideways
	    			sideX = zx + 0.5*shamblers.get(zIdx).getSpeed()*(FRAME_PERIOD/1000)*(dirX * Math.cos(degrees) - dirY * Math.sin(degrees));
	    		 	sideY = zy + 0.5*shamblers.get(zIdx).getSpeed()*(FRAME_PERIOD/1000)*(dirX * Math.sin(degrees) + dirY * Math.cos(degrees));

	    			if(!checkIfDirectionBlocked(shambler, sideX, sideY)){
		    			newX = sideX;
		    			newY = sideY;
		    			
		    			shambler.updateDirection();

		    			//this direction is free ; next loop, try this one first.
		    			shamblers.get(zIdx).setSide( degrees );

	    			}
	    			else{
	    				//shambler blocked in both direction
	    				newX = zx;
	    				newY = zy;
	    			}
				}
			}


			shamblers.get(zIdx).setX(newX);
			shamblers.get(zIdx).setY(newY);
		}

	}

	private boolean checkIfDirectionBlocked(HasCoord mover, double zx, double zy){


		for(int o = 0 ; o < obstacles.size() ; o++){
			if(obstacles.get(o).block(mover, zx,zy )){
				return true;
			}
		}
		return false;
	}


	
	
}
