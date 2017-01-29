<!DOCTYPE html>

<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<html>
<head>
	<meta charset="UTF-8">
	<title>NOEL 2016</title>
	<link rel="stylesheet" href="/style.css">
</head>
<body id="bod">

<script type="text/javascript">

function hideFront(){

	document.getElementById('front').className = ' widthZERO';


	setTimeout(function() { showBack(); },1000);
}

function showBack(){



	document.getElementById('back').className = ' widthFULL';
	document.getElementById('topout').className = ' widthFULL';
	document.getElementById('inside').className = ' widthFULL';

	setTimeout(function() { hideTop(); }, 1000);
}

function hideTop(){

	document.getElementById('snow').style.display='block';
	document.getElementById('card').style.display='block';

	
	document.getElementById('topout').className += ' heightZERO';

	setTimeout(function() { showTopIn(); }, 1000);
}

function showTopIn(){

	document.getElementById('topin').className += ' heightFULL';

	setTimeout(function() { moveCard(); }, 500);
}

function moveCard(){
	document.getElementById('card').className += ' moveCard';
	
}



</script>

	<div id="sky"></div>

	<div id="stars1"></div>
	
	<div id="snow"></div>


	<div id="center">

		<div class="ribbon"><div class="ribbon-stitches-top"></div><strong class="ribbon-content"><h1>Joyeux Noel !</h1></strong><div class="ribbon-stitches-bottom"></div></div>


		<div id="topin" class="widthFULL" > </div>
		<div id="topout"  onclick="launchTransionV();"  class="widthZERO">

		</div>
		<div id="front" onclick="hideFront();" class="widthFULL"></div>
		<div id="back"  onclick="launchTransionV();" class="widthZERO"></div>
		<div id="inside"  onclick="launchTransionV();" class="widthZERO"></div>
		<div id="card"  onclick="launchTransionV();" class="widthZERO">
			Bonjour <c:out value="${GIVER}"/>,<br>
			<br>
			Je suis un peu débordé à l'approche de la fin d'année - puis je te charger de trouver un cadeau pour <u><b><c:out value="${GIFTEE}"></c:out></b></u> ?<br>
			<br>
			Merci d'avance,<br>
			le père noêl<br>
		</div>
	</div>
</body>
</html>