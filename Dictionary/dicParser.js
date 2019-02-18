'use strict';

const Flags = {
	CASE_SENSITIVE: 1,
	SUFFIX: 2,
	PREFIX: 3
};
Object.freeze(Flags);

// [1] => Flag part
// [2] => name (romanization)
// [3] => e_code
// Regex matching line composed as such: [_|<Flag>{<romanization>[=><e_code>]--<romanization>[=><e_code>]--...}|<Flag>{<romanization>[=><e_code>]--<romanization>[=><e_code>]--...}|...|_]<romanization> => <e_code>
let lineRegex =/^#?(_\|(?:(?:(?:[sS][fF][xX])|(?:[pP][fF][xX])|(?:[cC][sS]))(?:\{(?:(?:(?:[^\WcCjJquUQyY_]+)(?:[\s\t]*\=[\s\t]*\>[\s\t]*(?:(?:(?:u[0-9a-fA-F]{2,3})+)))?(?:\-\-)?)|(?:\*[^\WcCjJquUQyY_]*))+\})?\|)+_)?[\s\t]*([^\WcCjJquUQyY_]+)[\s\t]*\=[\s\t]*\>[\s\t]*((?:u[0-9A-Fa-f]{2,3})+)$/i;

// [1] => flag name/type
// [2] => flag settings
let flagRegex = /^([^\W_]+)(?:\{((?:[a-zA-Z0-9\-=>]+)|(?:\*[^\WcCjJqQuUyY_]*))\})?$/;
	
class DicWord {
	// _|sfx{seta=>u011--setb}|_word=>u010
	parseFlag(f){
		try{
			let Flag = {};							// Flag is an object!
			// console.log('f:', f);				// debug info
			Flag.text = f;							// save f somewhere
			let frex = flagRegex.exec(f);			// exec regex for easier access to data

			if(/cs/i.test(frex[1])){				// cs
				Flag.type = Flags.CASE_SENSITIVE;	// set flag type
				Flag.name = "cs";					// set flag name
			}
			if(/[sp]fx/i.test(frex[1])){			// sfx/pfx
				let no_inDic = false;
				if(!frex[2]){						// sfx/pfx should have at least one thing to suf/prefix to.
					throw "Syntax Error #003. (No settings specified)";
				}
				let sets = frex[2].split(/\-\-/);	// get all flags to array
				sets.forEach((e, i, a)=>{
					if(no_inDic)					// if error occured
						return;						// don't bother anymore
					let sbq = e.split(/\=\>/); 		// get rid of an arrow
					let sn = sbq[0];				// unnecesarry assigment
					let sc = sbq[1] || null;		// unnecesarry assigment
					a[i] = {name: sn};				// to-array assigment
					if(sn.charAt(0) !== "*")					// if not all-p/sfx
						if(sc)						// if there is a sign change
							a[i].change = sc;		// assign sign change
					if(sn.charAt(0) !== "*")					// if not all-p/sfx
						if(!Dic.findWord(sn))		// if is not in dicionary
							no_inDic = sn;			// error!
				});
				if(no_inDic){
					if(!this.CODE_COMMENT)
						throw `Dictionary Error #004. Word '${no_inDic}' not present in dicitionary!`;
					throw `Dictionary Error #904. Word '${no_inDic}' not present in dicitionary! [silent]`;
				}
				Flag.name = frex[1];				// set flag name
				let tp = name.charAt(0);
				tp = tp === "s" ? Flags.SUFFIX : Flags.PREFIX;
				Flag.type = tp;						// set flag type
				Flag.settings = sets;				// set flag settings
			}

			return {flag:Flag, done:true};			//  return proper flag
		}catch(e){
			return {done: false, err:e};			// something went wrong!
		}
	}

	parseCheck(line){
		if(!line)
			return {done: false, err:`#000 Line not specified!`};
		let rx = lineRegex.exec(line);
		if(!rx)
			if(!this.CODE_COMMENT)
				return {done:false, err:`Syntax Error #001 (Format error)`};
			else return {done: false, err:`Syntax Error: #901 (Format error) [silent]`};
		return {done: true, exec:rx};
	}

	parseLine(l){
		let codecomment = false;
		try{
			let pc = this.parseCheck(l);
			if(!pc.done)
				throw pc.err;
			// console.log(pc.exec[1]);
			l = l.replace(/[\s\t]/g, "");
			let flags = [];
			flags = ((pc.exec[1] || "").replace(/_\||\|_/g, "")).split('|');
			flags.forEach(e=>{
				if(!e)
					return;
				let pf =  this.parseFlag(e);
				if(pf.done)
					this.FLAGS.push(pf.flag);
				else
					throw pf.err;
			});
			this.ROMAN = pc.exec[2];
			this.SIGNS = Kol.ecode(pc.exec[3]);
		}catch(e){
			if(this.CODE_COMMENT)
				console.warn(e);
			else
				console.error(e);
			return {done: false, err: e, n: parseInt(/\#([0-9]+)/.exec(e)[1])};
		}
		return {done: true};
	}

	constructor(line){
		try{
			this.LINE = line;
			this.CODE_COMMENT = line.trim().charAt(0) === "#";
			let inf = "";
			this.SIGNS = "";
			this.ROMAN = "";
			this.FLAGS = [];
			this.DONE = {done:false};
			if(!(inf = this.parseLine(line)).done){
				this.DONE = inf;
				if((isNaN(this.DONE.n)?-1:this.DONE.n) < 900)
					throw this.DONE.err;
			}
			else
				this.DONE.done = true;
		}catch(e){
				Dic.continue = false;
		}
	}
}

DicWord.prototype.getFlag = function(FlagType){
	let r = null;
	this.FLAGS.forEach((e)=>{
		if(!r){
			if(e.type === FlagType)
				r = e;
		}
	});
	return r;
}

DicWord.prototype.getWord = function(){
	return {rxword: RXCiS(this.ROMAN), word: this.ROMAN, case: !!(this.getFlag(Flags.CASE_SENSITIVE))};
}

DicWord.prototype.match = function(word) {
	word = /^[^ ]+/.exec(word)[0];
	let fl;
	if(fl = this.getFlag(Flags.SUFFIX)){
		// TODO: Suffix handling
	}
	else if(fl = this.getFlag(Flags.PREFIX)){
		let rx;
		if(fl.settings[0].name.charAt(0) === "*"){
			let cs_fl;
			let ncs = fl.settings[0].name.substr(1);
			let xncs = ncs.split("");
			if(cs_fl = this.getFlag(Flags.CASE_SENSITIVE)){
				let xrx = eval(`/^${this.ROMAN}([^ ]*)$/`);
				let ex_xrx = xrx.exec(word);
				if(ex_xrx){
					let ls = ex_xrx[1];
					if(ncs){
						let cap = false;
						xncs.forEach((e)=>{
							if(cap)
								return;
							if(ls.charAt(0) === e)
								cap = ls;
						});
						if(cap){
							let dw = Dic.findWord(ls);
							if(dw)
								return `${this.SIGNS}${dw.SIGNS}`;
						}
					}
					let dw = Dic.findWord(ls);
					if(dw){
						return `${this.SIGNS}${dw.SIGNS}`;
					}
				}
			}
			else{
				let xrx = eval(`/^${this.ROMAN}([^ ]*)$/i`);
				let ex_xrx = xrx.exec(word);
				if(ex_xrx){
					let ls = ex_xrx[1];
					if(ncs){
						let cap = false;
						xncs.forEach((e)=>{
							if(cap)
								return;
							if(ls.charAt(0) === e)
								cap = ls;
						});
						console.log(cap);
						if(cap){
							let dw = Dic.findWord(ls);
							if(dw)
								return `${this.SIGNS}${dw.SIGNS}`;
						}
					}else{
						let dw = Dic.findWord(ls);
						if(dw){
							return `${this.SIGNS}${dw.SIGNS}`;
						}
					}
				}
			}
		}else{
			// TODO: No-star prefix handle
		}
	}
	else{
		// Just match a word!
		if(this.getFlag(Flags.CASE_SENSITIVE)){
			let rx = eval(`/^${this.ROMAN}$/`);
			return rx.test(word.replace(/[\s\t]/g, ""))?this.SIGNS:false;
		}else{
			let rx = eval(`/^${this.ROMAN}$/i`);
			return rx.test(word.replace(/[\s\t]/g, ""))?this.SIGNS:false;
		}

	}

};


