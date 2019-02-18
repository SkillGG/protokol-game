'use strict';

let Dic = {as:{}, words:[], 
findWord:(w)=>{
	let found = false;
	Dic.words.forEach((e)=>{
		if(e.ROMAN === w)
			found = e;
	});
	if(!found)
		return false;
	else
		return found;
}};


Dic.processWords = function(){
	try{
		this.as.ncArray.forEach((e, i)=>{
			let nw = new DicWord(e);
			if(nw.DONE.done)
				this.words.push(nw);
			else{
				if(e.charAt(0)!=="#")
					throw nw.DONE.err;
				else
				{
					console.warn(nw.DONE.err);
					return;
				}
			}
		});
	}catch(e){
		throw e;
	}
}

Dic.matchWord = function(w){
	let found = false;
	this.words.reverse().forEach((e)=>{
		if(!found){
			found = e.match(w);
		}
		else
			return;
	});
	return found || Kol.simpleKol(w);
}

let process = (a, o)=>{

	// [1]=> case sensitive/continuous
	// [2]=> romanization
	// [3]=> UTF-8 Chars
	let regx = /([*_.,]?[*_.,]?[*_.,]?)([xaAbBdDeEfFgGhHiIkKlLwWnNmMoOpPrRzZsSvV_]+)\|((?:u[0-9abcdef]{2})+)/;

	if(!a || !o || !Array.isArray(a))
		return null;

	a.forEach((e,i)=>{
		let caseSensitive = false;
		let repeat = false;
		let loose = false;
		let free = false;
		if(regx.test(e)){
			let bS, aS, rxe = regx.exec(e);
			bS = rxe[1]+rxe[2];
			aS = rxe[3];
			aS = aS.replace(/ /g, "");
			aS = aS.replace(/u([0-9abcdef]{2})/g, (m,g1)=>String.fromCharCode(parseInt(`e0${g1}`, 16)));
			if(rxe[2].length*3 !== rxe[3].length)
				return;
			if(/\*/.test(rxe[1]))
				caseSensitive = true;
			if(/_/.test(rxe[1]))
				repeat = true;
			if(/\./.test(rxe[1]))
				loose = true;
			if(/,/.test(rxe[1])){
				loose = false;
				free = true;
			}
			let regex = eval(`/^${free?rxe[2]:""}((${(loose||free)?`[${rxe[2]}]{1,${free?`${rxe[2].length}`:`${rxe[2].length}`}}`:rxe[2]})${repeat?"*":""})$/${caseSensitive?"":"i"}`);
			Dic.words.push({value:aS, regx: regex, flags:{case:caseSensitive,repeat,loose,free}});
		}
	});
	
};

fetch("Kol.dic")
.then(r=>r.text())
.then(t=>{
	Dic.as.Text = t;
	Dic.as.Array = t.split('\n');
	Dic.as.ncArray = [];
	Dic.as.Array.forEach((e,i,a)=>{		// Clear commments
	 	e = a[i] = e.replace(/\r/gi,"");
	 	e = e.replace(/([^\n\/]*)\/\/([^\n]*)/, (m, g1)=>{return g1;});
	 	if(!e)
	 		return;
	 	Dic.as.ncArray.push(e.replace(/[\s\t]/g, ""));
	});
	Dic.processWords();
})
.catch(console.error);