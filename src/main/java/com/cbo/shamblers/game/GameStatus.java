package com.cbo.shamblers.game;

import java.util.List;

import com.cbo.shamblers.elements.Building;
import com.cbo.shamblers.elements.Foe;

public class GameStatus {

	private List<Building> buildings;
	private List<Foe> foes;
	
	public GameStatus(List<Building> buildings, List<Foe> foes) {
		super();
		this.buildings = buildings;
		this.foes = foes;
	}

	public List<Building> getBuildings() {
		return buildings;
	}

	public void setBuildings(List<Building> buildings) {
		this.buildings = buildings;
	}

	public List<Foe> getFoes() {
		return foes;
	}

	public void setFoes(List<Foe> foes) {
		this.foes = foes;
	}
	
	
}
