let Game = {};

let justType = {type: true};

Game.start = async function(GameData){
	// Start Game
	if(!GameData)
		throw "No GameData";
	this.data = GameData;
	await new Promise(async (rs,rj)=>{
		if(/none/.test(this.data.language)){

			Screen.addLines(
				Lang.getSpan(`menu1`)
				);

			await Screen.applyToAll(true,true,true,justType);


		}
		else
			rs();
	})
	.catch(console.error);
}