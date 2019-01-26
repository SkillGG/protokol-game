let Game = {started: false, language: 'en', stage: 0, prevS: 0};

let justType = {type: true};

Game.story = function(){

	// MENU HERE
	if(!UserData.chapter){
		cliHandle.hide();
		Interface.hide();
		Game.menu(0);
	}
	else
		Game.menu(UserData.chapter);
}

Game.menu = function(chapter){

	this.stage = 2;
	
	Screen.clear();

	if(!chapter && chapter !== 0)
		return;
	else if(chapter === 0){
		// FIRST TIME MENU

		Screen.addLines(
			Lang.getCenter(`menu1`, 0, []),
			`<center>${Lang.getSpan('menuPlay1', 0, [])}`,
			Lang.getSpan('menuOptions', 0)
		);
		Screen.applyToAll(true,true,true);

	}
	else{
		// MAIN MENU
	}

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
				this.tutorial()
				.then($=>this.story()).catch(console.error);
			break;
			case 2:
				this.story();
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
			case 1:
				this.tutorial()
				.then($=>this.story()).catch(console.error);
			break;
			case 2:
				this.story();
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
			Lang.getCenter('tutorialMain', {inter:-1, wait: 10}, [`unselectable`,`title`, 'p30', 'lime']),
			`<ol class='green p20'><li>`+
			Lang.getSpan('tutorial1', {inter: 10, wait: 10, cp:false, tF:`i:\`ign1\``}, [`unselectable`])+
			`<br>`+
			Lang.getSpan('tutorial1_1', {inter: 10, wait: 100, cp: false},[`unselectable`])+
			`<br>`+
			Lang.getSpan('tripleDots', {inter: 500, wait: 10, cp:false, tF:`a:\`aft1\``}, [`unselectable`])+
			Lang.getSpan('tutorial2', {inter: 10, wait: 100, cp:false}, [`unselectable`])+
			Lang.getSpan('tripleDots', {inter: 500, wait: 10, cp:true}, [`unselectable`])+
			`</li><br>`+
			Lang.getSpan('tutorial3', {inter: 10, wait: 10, cp: false}, [`unselectable`])+
			`<br>`+
			Lang.getSpan('tutorial4', {inter: 10, wait:1500, cp: false}, [`unselectable`])+
			Lang.getSpan('tripleDots', {inter: 500, wait: 100, cp:false, tF:`i:\`ign2\``}, [`unselectable`])+
			`<br>`+
			Lang.getSpan('tutorial5', {inter: 10, wait: 2000, cp: false, tF:`i:\`ign3\``}, [`unselectable`])+
			Lang.getSpan(`tutorial6`, {inter: 10, wait: 1000, cp:true}, ['unselectable'])+
			`</li></ol>`
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
					cliHandle.hide();
				},
				ign3:()=>{
					Interface.hide();
				}
			}, 	type:true};
		Screen.applyToAll(true,true,true,CPFns).then($=>{
			res();
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

	Screen.addLines(Lang.getSpan('disclaimer1', {inter: 10}, [`unselectable`,'p30', 'red']),
		``,
		Lang.getSpan('disclaimerPt1', {inter: -1, wait:500}, [`unselectable`,'p20', 'green']),
		Lang.getSpan('disclaimerPt2', {inter: -1, wait:500}, [`unselectable`,'p20', 'green']),
		Lang.getSpan('disclaimerPt3', {inter: -1, wait:500}, [`unselectable`,'p20', 'green']),
		Lang.getSpan('disclaimerPt4', {inter: -1, wait:500}, [`unselectable`,'p20', 'green']),
		Lang.getSpan('disclaimerPt5', {inter: -1, wait:500}, [`unselectable`,'p20', 'green'])+
		Lang.getSpan('clickToProceed', {wait:1000, inter:-1,cp:true}, [`unselectable`,'p15', 'black']));
	
	//Show and Type text on Screen
	Screen.applyToAll(true,true,true,justType).then(()=>{
		// After typing has ended and player proceeded(if clickPass)
		Screen.clear();
		Screen.clearStorage();
		/*
		begin1
		*/
		Screen.addLines(Lang.getSpan('begin1', {inter:10}, [`unselectable`,'crimson', 'p30']));
		Screen.applyToAll(true,true,false,justType).then(()=>{
			Screen.applyToAll(true,true,true,false).then(()=>{

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
		}).catch(console.error);
	});
	// Directly after typing
}