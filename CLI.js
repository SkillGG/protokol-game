class CLI {
	constructor(s,c,l,t,g){
		this.Console = c;
		this.Screen = s;
		this.Typer = t;
		this.Game = g;
		this.Lang = l;
		this.lastError = "";
		this.lastCommands = [];
		this.aliases = [];
		this.commandPointer = 0;
		this.commandRegex = /(\/?[^\n\r\.\:]+)((?:(\:[^\n\r\.\:]+)(\.[^\n\r\.\:]+)*)*)/i;
	}
}

CLI.prototype.getError = function(){
	return this.lastError;
}

CLI.prototype.getLastCommands = function() {
	return this.lastCommands;
};

CLI.prototype.showNext = function(element){
	
	if(this.commandPointer < this.lastCommands.length-1){
		this.commandPointer++;
		element.value = this.lastCommands[this.commandPointer] || "";
	}
	else{
		element.value = this.lastCommands[this.commandPointer] || "";
	}

}

CLI.prototype.showPrev = function(element){
	if(this.commandPointer !== 0){
		this.commandPointer--;
		element.value = this.lastCommands[this.commandPointer] || "";
	}
	else{
		element.value = this.lastCommands[0] || "";
	}
}

function doSafe(c){
	switch(c){
		case '<': c = '&lt;'; break;
		case '>': c = '&gt;'; break;
		case '>': c = '&gt;'; break;
		case '>': c = '&gt;'; break;
		case '>': c = '&gt;'; break;
		case '>': c = '&gt;'; break;
		case '>': c = '&gt;'; break;
		case '>': c = '&gt;'; break;
		case '>': c = '&gt;'; break;
		case '>': c = '&gt;'; break;
		case '>': c = '&gt;'; break;

	}
	return c;
}

function htmlEncodeSafe(match, char, tag, close, off, whole){
	char = doSafe(char);
	close = doSafe(close);
	return [char, tag, close].join('');
}

CLI.prototype.get = function(name){
	let ptr = -1;
	this.aliases.forEach((e,i,a)=>{
		if(ptr !== -1)
			return;
		else{
			if(e.n === name)
				ptr = i;
		}
	});
	if(ptr !== -1){
		return null;
	}
	return aliases[ptr];
}

/*
	Resets alias
*/
CLI.prototype.reset = function(name) {
	let ptr = -1;
	this.aliases.forEach((e,i,a)=>{
		if(ptr !== -1)
			return;
		else{
			if(e.n === name)
				ptr = i;
		}
	});
	if(ptr !== -1){
		this.aliases[ptr] = {n:name, fn: $=>{}, rx: this.aliases[ptr].rx};
	}
};

/*
	Sets new alias
	'func' will be invoked every time player sends 'regex' match
	'func' will recieve two args:
		- whole string
		- 'regex'.match('uInput')
	'name' is a name alias to use in #reset()
*/
CLI.prototype.alias = function(name, regex, func){
	let ptr = -1;
	this.aliases.forEach((e,i,a)=>{
		if(ptr !== -1)
			return;
		else{
			if(e.n === name)
				ptr = i;
		}
	});
	if(ptr === -1){
		this.aliases.push({n:name, fn:func, rx:regex});
	}
	else{
		this.aliases[ptr] = {n:name, fn: (func?func:this.aliases[ptr].fn), rx: (regex?regex:this.aliases[ptr].rx)};
	}
}

// Reset all aliases (and save to restore via .restoreBRA() )
CLI.prototype.resetAll = function(){
	this.aliasSS = [...this.aliases];
	this.aliases.forEach(e=>{
		this.reset(e.n);
	});
}

//Restore to state before .resetAll()
CLI.prototype.restoreBRA = function(){
	if(this.aliasSS)
		this.aliases = [...this.aliasSS];
}

// Processes every command given by player
CLI.prototype.process = function(element){

	let cmd = element.value || "";
	element.value = "";
	this.Console.neutral(`> ${cmd}`);
	this.Console.scrollDown();
	if(String(cmd.length) > 1){	
		this.commandPointer = 0;
		this.lastCommands.splice(0,0,cmd);
		let exec = this.commandRegex.exec(cmd);
		let cm = {name:exec[1], command: false, args:[]};
		if(cm.name.charAt(0) === '\/'){
			cm.name = cm.name.replace(/\//g,'');
			cm.command = true;
		}
		else{
			cm = exec[0];
		}
		if(cm.command){
			cm.args = exec[2].split(":");
			cm.args.splice(0,1);
			cm.args.forEach((e,i,a)=>{
				//console.log(`e '${e}' %o [${i}]`, a);
				let all = e.split('.');
				let name = all[0];
				all.splice(0,1);	
				a[i] = {name:name,args:all};	
			});

			// TYPING COMMAND
			if(/^(?:console|c)$/i.test(cm.name)){
				if(cm.args.length == 0){
					this.Console.error(`<b class='blue'><code>/${cm.name}</code></b> command requires at least one argument! Check <b class='blue'><code>/${cm.name}:help</code></b> for more info.`);
				}
				cm.args.forEach((argument,i,a)=>{
					if(argument.args.length === 0){
						if(/^(?:\-h|help)$/i.test(argument.name)){
							this.Screen.addLines(``,
								`<b><span class='helpHeader blue'>===CONSOLE HELP===</span></b>`,
								``,
								`<span class='helpInfo green'><b class='blue'><code>/console:</b><b class='purple'>help</b></code> <span class='helpInfo black'>or</span> <code><b class='blue'>/c:</b><b class='purple'>-h</b></code> - shows this message</span>`,
								``,
								`<span class='helpInfo green'><b class='blue'><code>/console:</b><b class='purple'>hide</b></code> <span class='helpInfo black'>or</span> <code><b class='blue'>/c:</b><b class='purple'>h</b></code> - hides debug console</span>`,
								`<span class='helpInfo green'><b class='blue'><code>/console:</b><b class='purple'>show</b></code> <span class='helpInfo black'>or</span> <code><b class='blue'>/c:</b><b class='purple'>s</b></code> - shows debug console</span>`,
								`<span class='helpInfo green'><b class='blue'><code>/console:</b><b class='purple'>clear</b></code> <span class='helpInfo black'>or</span> <code><b class='blue'>/c:</b><b class='purple'>c</b></code> - clears debug console</span>`,
								``,
								`<span class='helpInfo green'><a target="_blank" href='./doc.html#consolePrintLn' target="_blank" class='docRef'><code><b class='blue'>/console:</b><b class='purple'>print</b><b class='crimson'><span class='bigDOT'>.</span>&lt;PrintLine&gt;+</b></code> <span class='helpInfo black'>or</span> <code><b class='blue'>/c:</b><b class='purple'>-p</b><b class='crimson'><span class='bigDOT'>.</span>&lt;PrintLine&gt;+</b></code></a> - prints line in console</span>`,
								``,
								`<span class='helpInfo green'>For additional help <a href='./doc.html#console'>click here for <b class='blue'><code>console</code></b> documentation</a></span>`);
						}
						else if(/^(?:hide|h)$/gi.test(argument.name)){
							this.Console.hide();
						}
						else if(/^(?:show|s)$/gi.test(argument.name)){
							this.Console.show();
						}
						else if(/^(?:c|clear)$/gi.test(argument.name)){
							this.Console.clear();
						}
						else if(/^(println|pl|-p)$/gi.test(argument.name)){
							this.Console.error(`<code><b class='blue'>/${cm.name}</b><b class='purple'>:${argument.name}</b></code> requires at least one parameter!`);
						}
						else{
							this.Console.error(`<b class='blue'><code>/${cm.name}</code></b> command does not support <b class='purple'><code>${argument.name}</code></b> argument! Check <b class='blue'><code>/${cm.name}:help</code></b> for more info.`);
						}
					}
					else{
						// Console thingies, that require arguments
						if(/^(\-h|h|s|c|help|hide|show|clear)$/gi.test(argument.name)){
							this.Console.error(`<b class='blue'><code>/${cm.name}:<b class='purple'>${argument.name}</b></code></b> does not require any parameter(after '.').`)
						}
						else if(/^(println|pl|-p)$/gi.test(argument.name)){
							argument.args.forEach((e,i,a)=>{
								e = e.replace(/([<])([^>\n\r]+)([>])/g, htmlEncodeSafe);
								a[i] = e;
							});
							this.Console.addLine(argument.args);
						}
						else{
							this.Console.error(`<b class='blue'><code>/${cm.name}</code></b> command does not support <b class='purple'><code>${argument.name}</code></b> argument! Check <b class='blue'><code>/${cm.name}:help</code></b> for more info.`);
						}
					}

				});

			}
			else if(/^(?:screen|s)$/i.test(cm.name)){
				if(cm.args.length == 0){
					this.Console.error(`<b class='blue'><code>/${cm.name}<code></b> command requires at least one argument! Check <b class='blue'><code>/${cm.name}:help</code></b> for more info.`);
				}
				cm.args.forEach((argument,i,a)=>{

					if(argument.args.length === 0){

						if(/^(clear|c)$/i.test(argument.name)){
							this.Screen.clear();
						}
						else if(/^(restore|res|-r)$/i.test(argument.name)){
							this.Screen.restore();
						}
						else{
							this.Console.error(`<b class='blue'><code>/${cm.name}</code></b> command does not support <b class='purple'><code>${argument.name}</code></b> argument! Check <b class='blue'><code>/${cm.name}:help</code></b> for more info.`);
						}

					}
					else{
						if(/^(clear|c)$/i.test(argument.name)){
							this.Console.error(`<b class='blue'><code>/${cm.name}:<b class='purple'>${argument.name}</b></code></b> does not require any parameter(after '.').`)
						}
						else if(/^(println|pl|-p)$/gi.test(argument.name)){
							argument.args.forEach((e,i,a)=>{
								e = e.replace(/([<])([^>\n\r]+)([>])/g, htmlEncodeSafe);
								a[i] = e;
							});
							this.Screen.addLine(argument.args);
						}
						else{
							this.Console.error(`<b class='blue'><code>/${cm.name}</code></b> command does not support <b class='purple'><code>${argument.name}</code></b> argument! Check <b class='blue'><code>/${cm.name}:help</code></b> for more info.`);
						}
					}

				});

			}
			else if(/^(?:game|g)$/i.test(cm.name)){
				if(cm.args.length == 0){
					this.Console.error(`<b class='blue'><code>/${cm.name}<code></b> command requires at least one argument! Check <b class='blue'><code>/${cm.name}:help</code></b> for more info.`);
				}
				cm.args.forEach((argument,i,a)=>{

					if(argument.args.length === 0){
						if(/^(language|lang|-l)$/i.test(argument.name)){
							this.Console.info(`Current language is: ${this.Game.language}`);
						}else if(/^(go|goto|g)$/i.test(argument.name)){
							this.Console.info(`Current stage is: ${this.Game.stage}`);
						}else{
							this.Console.error(`<b class='blue'><code>/${cm.name}</code></b> command does not support <b class='purple'><code>${argument.name}</code></b> argument! Check <b class='blue'><code>/${cm.name}:help</code></b> for more info.`);
						}
					}
					else{
						if(/^(language|lang|-l)$/i.test(argument.name)){
							Lang.retranslateTo(this.Screen.getLines(), argument.args[0]?argument.args[0]:"en");
							this.Console.info(`Game.language set to 'pl'`);
						}
						else if(/^(go|goto|g)$/i.test(argument.name)){

						}
						else{
							this.Console.error(`<b class='blue'><code>/${cm.name}</code></b> command does not support <b class='purple'><code>${argument.name}</code></b> argument! Check <b class='blue'><code>/${cm.name}:help</code></b> for more info.`);
						}
					}

				});
			}
			else{
				this.Console.error(`ERROR! <b class='blue'><code>${cm.name}</code></b> is not a proper command!`);
				console.error(`ERROR! '${cm.name.toUpperCase()}' is not a proper command!`);
			}


		}
		else{
			this.Screen.addLine(`<b>&gt; ${cm}</b>`);
			
			this.aliases.forEach((e,i,a)=>{
				//console.log(e);
				if(!e.rx instanceof RegExp){return;}
				if(e.rx.test(cm)){
					e.fn(cm, e.rx.exec(cm));
				}
			});

		}

	}

}