

var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('/game');
    stompClient = Stomp.over(socket);
    stompClient.debug = null;
    stompClient.connect({}, 
    	function (frame) {
	        setConnected(true);
	        console.log('Connected: ' + frame);
	        stompClient.subscribe('/topic/status', function (greeting) {
	        	
	        	var content = JSON.parse(greeting.body);
	
	        	
	        	for(var z = 0; z < content.foes.length ; z++){
	        		var shambler = content.foes[z];
	        		addOrUpdateShambler(shambler);
	        		}
	        	
	        	for(var o = 0; o < content.buildings.length ; o++){
	        		var obstacle = content.buildings[o];
	        		addOrUpdateObstacle(obstacle);
	        		}
	        	
	        	});
    		},
    	function (message){
    			disconnect();
    		});
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}



$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
});