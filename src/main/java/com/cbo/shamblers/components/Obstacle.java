package com.cbo.shamblers.components;

public interface Obstacle {

	boolean block(HasCoord caller, double x, double y);
}
