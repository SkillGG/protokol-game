<?php
if(!isset($_GET['user'])){
	$user = 'default';
}
else{
	$user = $_GET['user'];
}
?>
<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="width: device-width, scale: 1, height: device-height">
	<meta charset="utf-8">
	<link rel="stylesheet" type="text/css" href="./Engine/TextEngine.css">

	<!-- USER CSS STYLES -->
	<link rel="stylesheet" type="text/css" href="anims.css">
	<link rel="stylesheet" type="text/css" href="gui.css">

	<script src='./Libs/options.js'></script>
	<script src='./Libs/setTitle.js'></script>

	<!-- THIS LIBRARY -->
	<script src='./Engine/TextEngine.js'></script>

	<!-- USER FILES -->
	<script src='Game.js'></script>
	<script src='CLI.js'></script>
	<script src='instant.js'></script>
	<script defer src='ConsoleNScreen.js'></script>
	<script defer src='start.js'></script>
</head>
<body>
	<input type='hidden' id='usr_n' value=<?php echo "\"$user\""; ?>>
	<div id='grid' style="grid-template-areas: 'info gui''info gui''console console'">
		<div id='info'></div>
		<div id='playerInput'>
			<input type='text' id='playerInputInput'>
		</div>
		<div id='console'></div>
		<div id='Interface'></div>
	</div>
	<script defer>
		let x = document.getElementById('top_10');
		if(x)
			x.replaceWith(document.createElement('div'));
		x = document.querySelector('div');
		if(x)
			if(!x.matches('#grid'))
				x.replaceWith(document.createElement('div'));
	</script>
</body>
</html>