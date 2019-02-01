let Game = {};
let justType = {type: true};

Game.start = function(GameData){
	// Start Game
	if(!GameData)
		throw "GData";
	this.data = GameData;
}