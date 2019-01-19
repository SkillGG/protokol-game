let Console = {e:document.querySelector('div#console')};
let grid = document.querySelector('div#grid');
let cli = document.querySelector('#playerInput input');
let cliHandle = document.querySelector('#playerInput');
let Screen = {e:document.createElement('div')};
let Cli = new CLI(Screen,Console, Lang, Typer, Game);
let Interface = {e: document.querySelector('#Interface')};

let Audio = {access: false};

let UserData = {};

if(document.querySelector('#usr_n').value || 'default'){
	fetch('./users/'+document.querySelector('#usr_n').value+".json")
	.then((r)=>{
		return r.json();
	})
	.then((j)=>{
		Lang.language = j.lang; // Loads language of the user
		UserData.stage = parseInt(j.stage) || 0; // Loads stage, player's in.
		UserData.hasStarted = parseInt(j.started) || 0; // Checks if player has past language selection
		Lang.loadDictionaries(
			{lang:'en', path:"./../languages/en.lang"},
			{lang:'pl', path:"./../languages/pl.lang"},
			{lang:'de', path:"./../languages/de.lang"});
	})
	.catch(console.error);
}

Screen.lines = [];
Screen.storage = [];
Console.lines = [];
Interface.elements = [];

Interface.setElements = function(){
	this.e.clear();
	this.elements.forEach(e=>{
		if(!e)
			return;
		if(e instanceof Element)
			this.e.append(e);
	});
}

Interface.addElement = function(element, name, behaviour){
	if(!element || !name || !behaviour)
		return null;
	let occl = document.createElement('div');
	occl.classEqual(`intEl`);
	// TODO: ADDING THINGS TO OCCL ELEMENT
	this.elements.push(occl);

}

Screen.getElement = function(){
	return this.e;
}

Screen.setLine = function(index, replacement){
	this.e.getElementsByClassName('screenLINE').item(index).replaceWith(replacement);
}

Screen.getLines = function(){
	return this.e.getElementsByClassName('screenLINE');
}

Screen.replaceEachLine = function(replacementArray){
	if(Array.isArray(replacementArray) && replacementArray === Screen.getLines().length){
		replacementArray.forEach((e,i)=>{
			this.setLine(i,e);
		});
	}
}

Console.show = ()=>{
	Console.e.style.display = 'initial';
	grid.style.gridTemplateAreas = `'info gui' 'input gui' 'console console'`;
	cli.style.fontSize = 'initial';
}

Console.hide = ()=>{
	Console.e.style.display = 'none';
	grid.style.gridTemplateAreas = `'info gui''info gui' 'input gui'`;
	cli.style.fontSize = '40px';
}

Console.clear= function(){
	this.lines = [];
	this.showLines();
}

Screen.scrollDown = function(){
	this.e.scrollTo(0,this.e.scrollHeight);
}

Screen.removeLine = function(i){
	this.lines.splice(i,1);
}

// set line from array
Screen.setLineFA = function (i, l){
	if(this.lines[i])
		this.lines[i] = l;
}

Screen.addLine = function(l, sp){
	if(typeof l !== 'function'){
		if(!(l instanceof Element)){
			let lx = document.createElement('span');
			lx.addClasses('screenLINE');
			lx.innerHTML = l.toString();
			l = lx;

		}
		this.lines.push(l);
		if(!sp)
			this.storage.push(l.innerHTML);
	}
	this.showLines();
}


Screen.showLines = function(){
	this.e = document.createElement('div');
	this.e.id = 'info';
	this.lines.forEach((e,i,a)=>{
		this.e.append(e);
		this.e.append(document.createElement('br'));
	});
	document.querySelector('div#info').replaceWith(this.e);
	this.scrollDown();
}

Screen.addLines = function(...lines){
	for(x in lines){
		this.addLine(lines[x]);
	}
}

Screen.restore = function(){
	this.storage.forEach(e=>this.addLine(e,true));
	this.applyToAll(true,true,true,true);
}

Screen.clearStorage = function(){
	this.storage = [];
}

Screen.clear =function(){
	this.lines = [];
	this.showLines();
}

Screen.applyToAll = (lSTL, lT, cP, tT)=>{
	//console.log("ATA-g: ", tT);
	if(lSTL)
		Lang.setLangToLines(Screen.getLines());
	if(lT)
		Lang.translate(Screen.getLines());
	if(cP)
		Coder.processAll(Screen.getLines(), cli);
	if(tT){
		if(tT.type){
			return Typer.typeAll(Screen.getLines(), tT.tF).then((a)=>{
				if(cP)
					Coder.processAll(Screen.getLines(), cli);
				return a;
			});
		}
		else{
			return new Promise((res,rej)=>res());
		}
	}
	else
		return new Promise((res,rej)=>res());
}

Console.scrollDown = function(){
	this.e.scrollTo(0,this.e.scrollHeight);
}
Console.addLine = function(l){
	if(typeof l !== 'function'){
		if(!(l instanceof Element)){
			if(!Array.isArray(l)){
				let lx = document.createElement('span');
				lx.innerHTML = l.toString();
				l = lx;
			}
			else{
				l.forEach(e=>{this.addLine(e);});
				this.showLines();
				return;
			}

		}
		this.lines.push(l);
	}
	this.showLines();
}
Console.addLines = function(...s){
	for(x in s){
		this.addLine(s[x]);
	}
}
Console.removeLine = function(i){
	this.lines.splice(i,1);
}
Console.error = (msg)=>{
	Console.addLines(`<span class='ConsoleError'>${msg}</span>`);
}
Console.info = (msg)=>{
	Console.addLines(`<span class='ConsoleInfo'>${msg}</span>`);
}
Console.neutral = (msg)=>{
	Console.addLines(`<span>${msg}</span>`);
}
Console.showLines = function(){
	let el = document.createElement('div');
	el.id = 'console';
	let orig = document.querySelector('div#console');
	el.style.display = orig.style.display;
	this.lines.forEach((x,i,a)=>{
		el.append(x);
		el.append(document.createElement('br'));
	});
	orig.replaceWith(el);
	this.e = el;
	this.scrollDown();
}

cli.onkeyup = (e)=>{
	if(e.which === 13){
		if(window.onclick)
			window.onclick();
		Cli.process(e.target);
	}
	if(e.key === 'ArrowUp')
		Cli.showNext(e.target);
	if(e.key === 'ArrowDown')
		Cli.showPrev(e.target);
};

cli.value = "";

Console.clear();
Console.hide();
Screen.clear();

Screen.addLines(`<center style='font-size: 35px'>Loading...</center>`);
let startGame = ()=>{
	Screen.clear();
	Screen.clearStorage();
	if(!UserData.hasStarted)
	{
		/*
		startScreen1
		chooseLanguage2
		chooseLanguage1
		chooseLanguage2
		*/
		Screen.addLines(Lang.getCenter('startScreen1', 0, ['p25']),
			`<b class='p20'>`+
			Lang.getSpan('chooseLanguage1')+
			`&emsp;<select id='languageSelection' val='${Lang.language || ""}'><option value='en'>English</option><option value='de'>Deutsch</option><option value='pl'>Polski</option></select>`+
			Lang.getSpan(`chooseLanguage2`)+
			`</b>`);
		Screen.getLines()[1].getElementsByTagName('select').item(0).onchange = (e)=>{
			Lang.language = e.target.value;
			Lang.retranslateTo(Screen.getLines());
			Screen.applyToAll(false,false,true,false);
		};
		Screen.applyToAll(true,true,true,false);
	
		Cli.alias('start', /start(?:[^]*)?/i, Game.start);
	}
	clearInterval(gameInit);

	Game.goTo(UserData.stage || 0);
}

let gameInit = setInterval($=>{
	if(Lang.loaded()){ // If all language files has been loaded / may take a while
		startGame();
	}
}, 0);
