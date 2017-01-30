package com.cbo.shamblers.engine;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.cbo.shamblers.game.Game;
import com.cbo.shamblers.game.GameStatus;
import com.cbo.shamblers.socketTest.GreetingController;

@Component
public class Runner {

	private Game g;
	
	@Autowired
	private GreetingController sockets;
	
	@PostConstruct
	public void init(){
		
		g=  new Game();
		g.create();
	}
	
	@Scheduled(fixedRate=30)
	public void runUpdate(){
		
		
		long nanoTime = System.nanoTime();
		
		g.update();
		

		
		GameStatus status = g.getStatus();
		long ellapsed = (System.nanoTime() - nanoTime)/(1000);
		//System.out.println("STATUS : "+ellapsed+"µs");
		sockets.fireSatus(status);
		
		ellapsed = (System.nanoTime() - nanoTime)/(1000);
		//System.out.println("STATUS & SEND: "+ellapsed+"µs");
	}
}
