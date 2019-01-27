let Game = {
	chapter: {
		number: -1,
		dialog: 0,
		unlocked:{
			menu:true,
			zero:false,
			one:false
		}
	},
	language: 'en',
	stage: 0,
	prevS: 0
};

let justType = {type: true};

// Game.story = function(){

// 	// MENU HERE
// 	if(!UserData.chapter){
// 		cliHandle.hide();
// 		Interface.hide();
// 		Game.menu(0);
// 	}
// 	else
// 		Game.menu(UserData.chapter);
// }

Game.menu = function(chapter){
	
	Screen.clear();

	if(!chapter)
		chapter = this.chapter;

	//TODO: Menu
	//Screen.addLines(
	//	
	//	);
	//Screen.applyToAll(true,true,0);

}

Game.goTo = function(stage, chapter){
	console.log(stage);
	if(stage === this.stage)
		return;
	if(chapter === this.chapter)
		return;
	if(!stage && stage !== 0)
		return;
	if(!chapter && chapter !== 0)
		return;
	Typer.promiseEnd().then(()=>{
		Cli.resetAll();
		Screen.clear();
		Screen.clearStorage();
		if(chapter === -1){
			this.prevS = this.stage;
			switch(stage){
			case 0:
				// this.start();
			break;
			case 1:
				// this.tutorial()
				// .then($=>this.story()).catch(console.error);
			break;
			case 2:
				// this.story();
			break;
		}
		}
		else{
			let chpt;
			eval(`chpt = chapter${chapter}.goTo`);
			if(chpt)
				chpt(stage);
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
				// this.start();
			break;
			case 1:
				// this.tutorial()
				// .then($=>this.story()).catch(console.error);
			break;
			case 2:
				// this.story();
			break;
		}
	});
	
}

// Game.tutorial = function(){

// 	//console.log('Got here!');

// 	return new Promise((res,rej)=>{

// 		//TUTORIAL HERE

// 		/*
// 		tutorial1,
// 		tutorial2
// 		*/
// 		Screen.addLines(
// 			Lang.getCenter('tutorialMain', {inter:-1, wait: 10}, [`unselectable`,`title`, 'p30', 'lime']),
// 			`<ol class='green p20'><li>`+
// 			Lang.getSpan('tutorial1', {inter: 10, wait: 10, cp:false, tF:`i:\`ign1\``}, [`unselectable`])+
// 			`<br>`+
// 			Lang.getSpan('tutorial1_1', {inter: 10, wait: 100, cp: false},[`unselectable`])+
// 			`<br>`+
// 			Lang.getSpan('tripleDots', {inter: 500, wait: 10, cp:false, tF:`a:\`aft1\``}, [`unselectable`])+
// 			Lang.getSpan('tutorial2', {inter: 10, wait: 100, cp:false}, [`unselectable`])+
// 			Lang.getSpan('tripleDots', {inter: 500, wait: 10, cp:true}, [`unselectable`])+
// 			`</li><br>`+
// 			Lang.getSpan('tutorial3', {inter: 10, wait: 10, cp: false}, [`unselectable`])+
// 			`<br>`+
// 			Lang.getSpan('tutorial4', {inter: 10, wait:1500, cp: false}, [`unselectable`])+
// 			Lang.getSpan('tripleDots', {inter: 500, wait: 100, cp:false, tF:`i:\`ign2\``}, [`unselectable`])+
// 			`<br>`+
// 			Lang.getSpan('tutorial5', {inter: 10, wait: 2000, cp: false, tF:`i:\`ign3\``}, [`unselectable`])+
// 			Lang.getSpan(`tutorial6`, {inter: 10, wait: 1000, cp:true}, ['unselectable'])+
// 			`</li></ol>`
// 		);
// 		let CPFns = {tF:
// 			{
// 				ign1:()=>{
// 					Screen.e.addClasses('flashingBorderRed');
// 				},
// 				aft1:()=>{
// 					Screen.e.classList.remove('flashingBorderRed');
// 				},
// 				ign2:()=>{
// 					cliHandle.hide();
// 				},
// 				ign3:()=>{
// 					Interface.hide();
// 				}
// 			}, 	type:true};
// 		Screen.applyToAll(true,true,true,CPFns).then($=>{
// 			res();
// 		});
// 		// TUTORIAL END
// 		/*
// 			Screen.addLines(Lang.getSpan('clickToProceed', {wait:1000, inter:-1, cp:true}));
// 			ll = Array.from(Screen.getLines()).splice(Screen.getLines().length-1);
// 			Lang.setLangToLines(ll);
// 			Lang.translate(ll);
// 			Coder.processAll(ll);
// 			Typer.typeAll(ll).then($=>res());
// 		*/
		

// 	});

// }

// Game.disclaimers = function(){
	
// 	return new Promise((rs,rj)=>{

// 		// Showing disclaimers
// 		/*
// 		disclaimer1,
// 		disclaimerPt1,
// 		disclaimerPt2,
// 		disclaimerPt3,
// 		disclaimerPt4,
// 		disclaimerPt5
// 		*/

// 		Screen.addLines(Lang.getSpan('disclaimer1', {inter: 10}, [`unselectable`,'p30', 'red']),
// 			``,
// 			Lang.getSpan('disclaimerPt1', {inter: -1, wait:500}, [`unselectable`,'p20', 'green']),
// 			Lang.getSpan('disclaimerPt2', {inter: -1, wait:500}, [`unselectable`,'p20', 'green']),
// 			Lang.getSpan('disclaimerPt3', {inter: -1, wait:500}, [`unselectable`,'p20', 'green']),
// 			Lang.getSpan('disclaimerPt4', {inter: -1, wait:500}, [`unselectable`,'p20', 'green']),
// 			Lang.getSpan('disclaimerPt5', {inter: -1, wait:500}, [`unselectable`,'p20', 'green'])+
// 			Lang.getSpan('clickToProceed', {wait:1000, inter:-1,cp:true}, [`unselectable`,'p15', 'black']));
		
// 		//Show and Type text on Screen
// 		Screen.applyToAll(true,true,true,justType).then(()=>{
// 			rs();
// 		});
// 		// Directly after typing

// 	});

// }

// Game.askTutorial = function(){
// 	return new Promise((rs,rj)=>{
// 		// After typing has ended and player proceeded(if clickPass)
// 		Screen.clear();
// 		Screen.clearStorage();
// 		/*
// 		begin1
// 		*/
// 		Screen.addLines(Lang.getSpan('begin1', {inter:10}, [`unselectable`,'crimson', 'p30']));
// 		Screen.applyToAll(true,true,false,justType).then(()=>{
// 			Screen.applyToAll(true,true,true,false).then(()=>{

// 				// Set Alias for yes/no options for tutorial
// 				Cli.alias('yesH2P',eval(eval(`Lang.${Lang.language}['yesFilter']`)), ()=>{

// 					// PLAYER SAID YES TO TUTORIAL

// 					Screen.clear();Screen.clearStorage();

// 					// RESET EVENT TO NOT TRIGGER ANYMORE
// 					Cli.reset('yesH2P');
// 					Cli.reset('noH2P'); 

// 					// Play through tutorial then play story mode
// 					rs(true);

// 				});
// 				Cli.alias('noH2P',eval(eval(`Lang.${Lang.language}['noFilter']`)), ()=>{

// 					//PLAYER SAID NO TO HOW2PLAY

// 					Screen.clear();Screen.clearStorage();

// 					// RESET EVENT TO NOT TRIGGER ANYMORE
// 					Cli.reset('yesH2P');
// 					Cli.reset('noH2P');

// 					// Play through story mode
// 					rs(false);

// 				});
// 			}).catch(console.error);
// 		}).catch(console.error);
// 	})
// }

Game.firstLangSelect = function(cb){
	return new Promise((rs,rj)=>{
		Screen.addLines(Lang.getCenter('startScreen1', 0, ['p25', 'title']),
			`<b class='p20'>`+
			Lang.getSpan('chooseLanguage1')+
			`&emsp;<select id='languageSelection' val='${Lang.language || ""}'><option value='en'>English</option><option value='de'>Deutsch</option><option value='pl'>Polski</option></select>`+
			Lang.getSpan(`chooseLanguage2`)+
			`</b>`
		);
		Screen.getLines()[1].getElementsByTagName('select').item(0).onchange = (e)=>{
			Lang.language = e.target.value;
			Lang.retranslateTo(Screen.getLines());
			Screen.applyToAll(false,false,true,false);
		};
		Screen.applyToAll(true,true,true,false).then($=>{
			Cli.alias('start', /start(?:[^]*)?/i, cb);
			rs({
				choice:Screen.getLines()[1].getElementsByTagName('select').item(0).value,
				reset: ()=>Cli.reset('start'),
				getAlias: ()=>Cli.get('start')
			});
		});
	});
}
