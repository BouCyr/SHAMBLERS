package com.cbo.shamblers.elements;

import java.io.Serializable;

import com.cbo.shamblers.components.HasCoord;
import com.cbo.shamblers.components.Obstacle;

public class Building implements Obstacle, Serializable{

	private static final long serialVersionUID = -90917557552589733L;
	
	private int id;
	
	private int topLeftX;
	private int topLeftY;

	private int width;
	private int height;

	private int skin;



	public Building(int id, int topLeftX, int topLeftY, int width, int height, int skin) {
		super();
		this.id = id;
		this.topLeftX = topLeftX;
		this.topLeftY = topLeftY;
		this.width = width;
		this.height = height;
		this.skin = skin;
	}


	@Override
	public boolean block(HasCoord caller, double x, double y) {
		return (y  > this.topLeftY && y < (this.topLeftY+this.height))
				&&
				(x  > this.topLeftX && x < (this.topLeftX+this.width));
	} 



	public int getTopLeftX() {
		return topLeftX;
	}


	public void setTopLeftX(int topLeftX) {
		this.topLeftX = topLeftX;
	}


	public int getTopLeftY() {
		return topLeftY;
	}


	public void setTopLeftY(int topLeftY) {
		this.topLeftY = topLeftY;
	}


	public int getWidth() {
		return width;
	}


	public void setWidth(int width) {
		this.width = width;
	}


	public int getHeight() {
		return height;
	}


	public void setHeight(int height) {
		this.height = height;
	}


	public int getSkin() {
		return skin;
	}


	public void setSkin(int skin) {
		this.skin = skin;
	}


	public int getId() {
		return id;
	}


	public void setId(int id) {
		this.id = id;
	}


}
