let Game = {started: false, language: 'en', stage: 0, prevS: 0};

let justType = {type: true};

Game.story = function(){

	Screen.clear();

	// STORY HERE

}

Game.goTo = function(stage){
	if(stage === this.stage)
		return;
	Typer.promiseEnd().then(()=>{
		Cli.resetAll();
		Screen.clear();
		Screen.clearStorage();
		this.prevS = this.stage;
		switch(stage){
			case -1:
				location.reload();
			break;
			case 0:
				this.start();
			break;
			case 1:
				this.tutorial();
			break;
		}
	});
}

Game.goBack = function(){
	if(this.prevS === this.stage)
		return;
	Typer.promiseEnd().then(()=>{
		Cli.restoreBRA();
		Screen.clear();
		Screen.clearStorage();
		this.stage = this.prevS;
		switch(this.prevS){
			case 0:
				this.start();
			break;
		}
	});
	
}

Game.tutorial = function(){

	this.stage = 1;

	//console.log('Got here!');

	return new Promise((res,rej)=>{

		//TUTORIAL HERE

		/*
		tutorial1,
		tutorial2
		*/
		Screen.addLines(
			Lang.getCenter('tutorial1', {inter:-1, wait: 10}, [`title`]),
			Lang.getSpan('tutorial2', {inter:5, cp:true, tF:`i:\`ign1\`,a:\`aft1\`` }),
			Lang.getSpan('tutorial3', {cp:true, tF:`i:\`ign2\`,a:\`aft2\``}),
			Lang.getSpan('tutorial4', {cp:true})
		);
		let CPFns = {tF:
			{
				ign1:()=>{
					Screen.e.addClasses('flashingBorderRed');
				},
				aft1:()=>{
					Screen.e.classList.remove('flashingBorderRed');
				},
				ign2:()=>{
					cliHandle.addClasses('flashingBorderRed');
				},
				aft2:()=>{
					cliHandle.classList.remove('flashingBorderRed');
				},
				ign3:()=>{
					
				}
			}, 	type:true};
		Screen.applyToAll(true,true,true,CPFns).then($=>{
			
		});

		// TUTORIAL END
		/*
			Screen.addLines(Lang.getSpan('clickToProceed', {wait:1000, inter:-1, cp:true}));
			ll = Array.from(Screen.getLines()).splice(Screen.getLines().length-1);
			Lang.setLangToLines(ll);
			Lang.translate(ll);
			Coder.processAll(ll);
			Typer.typeAll(ll).then($=>res());
		*/
		

	});

}

Game.start = function(){
	this.stage = 0;
	this.started = true; //Game has been started
	Cli.reset('start'); // start no longer triggers
	Screen.clear(); // Clear screen
	Screen.clearStorage();
	// Showing disclaimers
	/*
	disclaimer1,
	disclaimerPt1,
	disclaimerPt2,
	disclaimerPt3,
	disclaimerPt4,
	disclaimerPt5
	*/

	Screen.addLines(Lang.getSpan('disclaimer1', {inter: 10}, ['p30']),
		``,
		Lang.getSpan('disclaimerPt1', {inter: -1, wait:500}, ['p20']),
		Lang.getSpan('disclaimerPt2', {inter: -1, wait:500}, ['p20']),
		Lang.getSpan('disclaimerPt3', {inter: -1, wait:500}, ['p20']),
		Lang.getSpan('disclaimerPt4', {inter: -1, wait:500}, ['p20']),
		Lang.getSpan('disclaimerPt5', {inter: -1, wait:500}, ['p20'])+
		Lang.getSpan('clickToProceed', {wait:1000, inter:-1,cp:true}));
	
	//Show and Type text on Screen
	Screen.applyToAll(true,true,true,justType).then(()=>{
		// After typing has ended and player proceeded(if clickPass)
		Screen.clear();
		Screen.clearStorage();
		/*
		begin1
		*/
		Screen.addLines(Lang.getSpan('begin1', {inter:10}));
		Screen.applyToAll(true,true,true,justType).then(()=>{
			
			// Set Alias for yes/no options for tutorial
			Cli.alias('yesH2P',eval(eval(`Lang.${Lang.language}['yesFilter']`)), ()=>{

				// PLAYER SAID YES TO TUTORIAL

				Screen.clear();Screen.clearStorage();

				// RESET EVENT TO NOT TRIGGER ANYMORE
				Cli.reset('yesH2P');
				Cli.reset('noH2P'); 

				// Play through tutorial then play story mode
				Game.tutorial().then($=>{Game.story();});

			});
			Cli.alias('noH2P',eval(eval(`Lang.${Lang.language}['noFilter']`)), ()=>{

				//PLAYER SAID NO TO HOW2PLAY

				Screen.clear();Screen.clearStorage();

				// RESET EVENT TO NOT TRIGGER ANYMORE
				Cli.reset('yesH2P');
				Cli.reset('noH2P');

				// Play through story mode
				Game.story();

			});
		}).catch(console.error);
	});
	// Directly after typing
}