package com.cbo.shamblers.components;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;

@JsonAutoDetect(fieldVisibility = Visibility.NONE,
getterVisibility = Visibility.ANY, 
setterVisibility = Visibility.ANY)
public class Point implements HasCoord{

	private double x;
	private double y;

	public Point(double i, double j) {
		x=i;
		y=j;
	}
	public double getX() {
		return x;
	}
	public void setX(double x) {
		this.x = x;
	}
	public double getY() {
		return y;
	}
	public void setY(double y) {
		this.y = y;
	}

	public void set(double x, double y){
		this.x= x;
		this.y = y;
	}



}
