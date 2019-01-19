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
	<link rel="stylesheet" type="text/css" href="TextGame.css">

	<!-- USER CSS STYLES -->
	<link rel="stylesheet" type="text/css" href="anims.css">
	<link rel="stylesheet" type="text/css" href="gui.css">

	<!-- THOSE ARE LIBRARIES NEEDED FOR -min VERSION -->
	<script src='./../Libs/options.js'></script>
	<script src='./../Libs/setTitle.js'></script>
	<script src='./../Libs/Extends.js'></script>

	<!-- THIS LIBRARY -->
	<script src='TextGame-min.js'></script>

	<!-- USER FILES -->
	<script src='Game.js'></script>
	<script src='CLI.js'></script>
	<script src='userInstant.js'></script>
	<script defer src='userDefer.js'></script>
</head>
<body>
	<input type='hidden' id='usr_n' value=<?php echo "\"$user\""; ?>>
	<div id='grid' >
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
	</script>
</body>
</html>