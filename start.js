let Audio = {access: false};

let UserData = {};

let username = document.querySelector('#usr_n').value || 'default';
fetch('./users/'+username+".json")
.then((r)=>{
	return r.json();
})
.then((j)=>{
	UserData.language = j.lang;
	UserData.chapters = j.chapters;

	Lang.loadDictionaries(
		{lang:'en', path:"./languages/en.lang"},
		{lang:'pl', path:"./languages/pl.lang"},
		{lang:'de', path:"./languages/de.lang"});
})
.catch(console.error);

cli.value = "";

Console.clear();
Console.hide();
Screen.clear();

Screen.addLines(`<center style='font-size: 35px'>Loading...</center>`);
let startGame = ()=>{
	Screen.clear();
	Screen.clearStorage();
	clearInterval(gameInit);

	if(UserData.language === "NONE"){
		Game.firstLangSelect(Game.menu);
	}
}

let gameInit = setInterval($=>{
	if(Lang.loaded()){ // If all language files has been loaded / may take a while
		startGame();
	}
}, 0);
