package com.cbo.shamblers.elements;

import java.io.Serializable;

import com.cbo.shamblers.components.HasCoord;
import com.cbo.shamblers.components.Obstacle;
import com.cbo.shamblers.components.Point;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;


@JsonAutoDetect(fieldVisibility = Visibility.NONE,
	getterVisibility = Visibility.ANY, 
	setterVisibility = Visibility.ANY)
public class Foe extends Point implements HasCoord, Obstacle, Serializable{
	
	
	private static final long serialVersionUID = 2160112897937111589L;
	
	protected int noGoZoneSize = 14; //no shambler can go this close of another shambler
	protected int NGSS= noGoZoneSize*noGoZoneSize;
	
	private Integer id;
	
	private double angle;
	private HasCoord target;
	
	private double speed;
	private double side;
	
	private int skin;
	
	
	public Foe(Integer id, int angle, HasCoord point, double zSpeed, double sideDirection, int skin) {
		super(point.getX(), point.getY());
		this.id = id;
		this.angle = angle;
		this.target = point;
		this.speed = zSpeed;
		this.side = sideDirection;
		this.skin = skin;
	}
	
	
	public void updateDirection(){
		this.updateTarget(getTarget());
	}
	
	public void updateTarget(HasCoord target){

		double zx = this.getX();
		double zy = this.getY();


		double vx = zx - target.getX();
		double vy = zy - target.getY();


		//unit
		double vectorLength = Math.sqrt(vx*vx + vy*vy);

		double uvx = vx/vectorLength;
		double uvy = vy/vectorLength;


		//double m = uvy/uvx;

		double angleRadians = Math.acos(uvx);
		double angle = 90 + angleRadians * (180 / Math.PI);

		if(uvy < 0){
			angle = 180 -1*angle;
		}


		this.setAngle(angle);;
		this.getTarget().setX(target.getX());
		this.getTarget().setY(target.getY());


	}
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public double getAngle() {
		return angle;
	}
	public void setAngle(double angle) {
		this.angle = angle;
	}
	public HasCoord getTarget() {
		return target;
	}
	public void setTarget(HasCoord target) {
		this.target = target;
	}
	public double getSpeed() {
		return speed;
	}
	public void setSpeed(double speed) {
		this.speed = speed;
	}
	public double getSide() {
		return side;
	}
	public void setSide(double side) {
		this.side = side;
	}


	@Override
	public boolean block(HasCoord caller, double x, double y) {
		
		double distanceSquare = (this.getX() - x)*(this.getX() - x) + (this.getY() - y)*(this.getY() - y);

		if(caller == this){
			return false ; //cannot block itself
		}
		
		return (distanceSquare < NGSS);
	}


	public int getSkin() {
		return skin;
	}


	public void setSkin(int skin) {
		this.skin = skin;
	}
}
