package com.cbo.shamblers.socketTest;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.cbo.shamblers.game.GameStatus;

@Controller
public class GreetingController {

	@Autowired
	private SimpMessagingTemplate template;

	@MessageMapping("/hello")
	@SendTo("/topic/status")
	public Greeting greeting(HelloMessage message) throws Exception {

		return new Greeting("Hello, " + message.getName() + "! Here time is "+new Date().toString());
	}

	
	private int t = 0;
	public void fireGreeting() {
		this.template.convertAndSend("/topic/status",
				new Greeting("SERVER time : "+new Date().toString()+", "+(t++) ));
	}
	
	int count = 0;
	public void fireSatus(GameStatus status){
		this.template.convertAndSend("/topic/status",status);
		
		//this.template.convertAndSend("/topic/greetings",count++);
	}

}

