let Typer = {};
let Coder = {};
let Lang = {};

// CODER
{
//	Changes every code.typeIn element in all lines
//	to change value of cli into its innerText
//
//		lines:
//			Typer.LinesArray (check documentation for more info)
//		cli:
//			DOMInputElement
	Coder.processAll = (lines, cli)=>{
		if(cli){
			Array.from(lines).forEach(e=>{
				Array.from(e.querySelectorAll('code.typeIn'))
				.forEach((e2,i2,a2)=>{
					e2.onclick = (e)=>{
						cli.value = e.target.innerText;
						cli.onkeyup({target: cli,which: 13});
					};
				});
			});
		}
	}
}
// CODER

// LANG

{
	Lang.language = "";
	Lang.defaultLanguage = "";

	Lang.load = false;
	Lang.en = {};

	Lang.loaded = function(){
		return this.load;
	}

//	Returns single Dictionary (see documentation for further info)
//	
//		f:
//			fileFetch (see documentation for further info)
	Lang.loadDictionary = function(f){
		let rer = {};
		if((!(f instanceof Promise)) && (!(f.file instanceof Promise))){
			console.error("Could not load properly");
			this.load = false;
			location.reload();
		}
		else{
			let ff = (f instanceof Promise) ? f : f.file;
			ff.then(r=>{
				r.text().then(x=>{
					rer['asText'] = x;
					this.load = true;
					rer['asText'].split(/[\n\r]{2}/).forEach((e)=>{
						e = e.replace(/(?:[ \t]*)([^]*)/, (m,p1)=>{return p1;}); //get rid of spaces in front
						e = e
						.replace(/([^/]*)(?:\/\/[^]*)?/, (m,p1)=>{return p1;}) // Get rid of everything post '//'
						.replace(/\$([1$])/g, (m,p1)=>{if(p1==='1') return "/"; if(p1==='$') return "$"}); // Change every $1 into '/'
						if(e){
							let extract = /([^{}]+)\{`([^\r\n`]*)`\}/.exec(e);
							rer[extract[1]] = extract[2];
						}
					});
				});
			})
			.catch(e=>{console.error(e);this.load = false;});
		}
		return rer;

	}

// Loads every Dictionary given
//
//		d:
//			dictionaryFile (see documentation for further info)
	Lang.loadDictionaries = (...d)=>{

		d.forEach((e)=>{
			if(e.lang && e.path){
				if(!Lang.defaultLanguage)
					Lang.defaultLanguage = e.lang;

				eval(`Lang.${e.lang} = Lang.loadDictionary({file: fetch('${e.path}',ncH)});`);
			}
		});
	}

//	Returns Typer.Line.innerHTML with given parameters
//
//		get:
//			Lang.Line.get (check documentation for more info)
//		type:
//			Lang.Line.Type (check documentation for more info)
//		classes:
//			array of classes to give for returned element
//		el:
//			nodeName of new element
	Lang.getFrom = (get, type, classes, el)=>{
		let clsS = "";
		if(typeof classes === 'string')
			classes = classes.split(' ');
		if(classes){
			Array.from(classes).forEach(e=>clsS += ` ${e.replace(/[']/g, "\"")}`);
		}
		clsS = clsS.split('').splice(1).join('');

		return `<${el||`span`} get='${get||'NONEXIST'}'${type?type.cp?` clickPass='' `:" ":" "}${type?type.tF?(" tF='"+type.tF+"'"):" ":" "}${type?type.wait?(" wait='"+type.wait+"'"):"":""} lang='${(Lang.language || Lang.defaultLanguage) || "en"}' class='${clsS} langText ${type?"typeText":""}' ${type?type.inter?("charInter='"+type.inter+"' "):"":""}></${el||`span`}>`;
	}

	// Lang.getFrom(g,t,c,'span')
	// For backwards compatibility
	Lang.getSpan = (g,t,c)=>{return Lang.getFrom(g,t,c,'span');}

	//Lang.getFrom(g,t,c,'center')
	// For backwards compatibility
	Lang.getCenter = (g,t,c)=>{return Lang.getFrom(g,t,c,'center')};

//	Sets Lang.Line.language to Lang.language for 
//	firstI->lines.length lines
//
//		lines:
//			Lang.LineArray (check documentation for further info)
//		firstI:
//			index of first line to proceed on
	Lang.setLangToLinesFrom = function(lines, firstI){
		setLangToLines(Array.from(lines).splice(firstI));
	}

//	Sets to every given Lang.Line from Lang.LineArray
//	Lang.Line.language to Lang.language or Lang.defaultLanguage
//
//		lines:
//			Lang.LineArray (check documentation for further info)
	Lang.setLangToLines = function(lines){
		Array.from(lines).forEach(e=>{
			Array.from(e.getElementsByClassName('langText'))
			.forEach((e2,i2,a2)=>{
				let newE = e2;
				if(e2.hasAttribute('get')){
					newE.setAttribute('lang', (this.language || this.defaultLanguage) || "en");
				}
				e.getElementsByClassName('langText').item(i2).replaceWith(newE);
			});
		});
	}

	/*
	 	Takes every .langText reads its 'get' and 'lang' argument 
		then replaces it's innerHTML with Lang.{lang}.{get}.
		If Lang.{lang}.{get} does not exists does not write anything.
	*/
//	Takes every Lang.Line from lines and takes its 'get' and 'language'
//	values and replaces its its innerHTML = Lang.{language}.{get}
//
//		lines:
//			Lang.LineArray (check documentation for further info)
	Lang.translate = function(lines){
		Array.from(lines).forEach(e=>{
			Array.from(e.getElementsByClassName('langText'))
			.forEach((e2,i2,a2)=>{
				let newE = e2;
				if(e2.hasAttribute('lang') && e2.hasAttribute('get')){
					let lang = e2.getAttribute('lang');
					let get = e2.getAttribute('get');
					newE.innerHTML = 
					( 
						eval(`Lang.${lang}.${get}`) ||
						 ( 
						 	( 
						 		()=>{
						 			console.error(`${lang} has no ${get} translation!`); 
						 			if(Lang.en[get])
						 				return Lang.en[get];
						 			window.onclick=()=>{location.reload();};
						 			newE.removeAllAttributes();
						 			return `<span class='red'> MISSING: ${get}</span>`;
						 		} 
						 	)()
						 ) 
					);
					//newE.innerHTML = (eval(`Lang.${lang}.${get}`)===undefined ? (!!(console.error(`${lang} has no ${get} translation!`)))?`?`:Lang.en[get]===undefined?((((()=>{})&&(window.onclick=()=>{location.reload();}))?`<span class='red'> MISSING: ${get}</span>`:""):Lang.en[get] : eval(`Lang.${lang}.${get}`));
				}
				e.getElementsByClassName('langText').item(i2).replaceWith(newE);
			});
		});
	}

}

//	Changes every given Lang.Line.language to nl
//	If nl was not specified changes to Lang.defaultLang or Lang.language
//
//		lines:
//			Lang.LinesArray (check documentation for further info)
//		nl:
//			new language value
	Lang.retranslateTo = function(lines, nl){
		if(nl)
			this.language = nl;
		Array.from(lines).forEach(e=>{
			Array.from(e.getElementsByClassName('langText'))
			.forEach((e2,i2,a2)=>{
				let newE = e2;
				if(e2.hasAttribute('lang') && e2.hasAttribute('get')){
					newE.setAttribute('lang', (this.language || this.defaultLanguage) || "en");
				}
				e.getElementsByClassName('langText').item(i2).replaceWith(newE);
			});
		});
		this.translate(lines);
	}

// LANG

// TYPER
{
	Typer.typeArray = [];
	Typer.typing = null;
	Typer.isTyping = false;

//		w:
//			DOMElement to copy innerHTML from
//		e:
//			Typer.TypeElement (check documentation for further info) 
//		cpF:
//			clickPassFunctions (check documentation for further info)
	Typer.typeClick = (w,e,cpF)=>{
		return new Promise((res,rej)=>{
			let cpFO = {};

			eval('cpFO={'+e.tF.join(',')+'}');

			let ignite = ()=>{};
			let before = ()=>{};
			let after = ()=>{};

			// IGNITE SET
			if(cpFO.i){
				let ign = eval(`cpF.${cpFO.i}`);
				if(ign){
					if(typeof ign === 'function')
						ignite = ign;
				}
			}

			// BEFORE CLICK SET
			if(cpFO.b){
				let bef = eval(`cpF.${cpFO.b}`);
				if(bef){
					if(typeof bef === 'function')
						before = bef;
				}
			}

			// AFTER CLICK SET
			if(cpFO.a){
				let aft = eval(`cpF.${cpFO.a}`);
				if(aft){
					if(typeof aft === 'function')
						after = aft;
				}
			}

			ignite();

			if(e.charInterval === '-1'){
				before();
				e.typeTo.innerHTML = w.innerHTML;
				window.onclick = ()=>{
					after();
					res();
					window.onclick = ()=>{};
				};
			}
			else{
				let ptr = 0;
				let add = [];

				let toAdd = w.innerHTML.replace(/([<][^>]*[>])/g,'\n$1\n').split('\n');

				toAdd.forEach(x=>{
					if(x.length > 0){
						if(x.charAt(0) !== '<'){
							x.split('').forEach(c=>{
								add.push(c);
							});
						}
						else{
							add.push(x);
						}
					}
				});
				let innerH = "";
				let typedAll = false;
				let timer = setInterval(()=>{
					innerH += add[ptr];
					e.typeTo.innerHTML = innerH;
					ptr++;
					if(ptr >= add.length){
						before();
						typedAll = true;
						clearInterval(timer);
					}
				}, /^[0-9]+$/.test(e.charInterval)?parseInt(e.charInterval): 10);

				window.onclick = ()=>{
					if(typedAll){
						after();
						res();
						window.onclick = ()=>{};
					}
				};
			}

		});
	}


	// asyncronously waits ms ammount of miliseconds
	// if sc is true player can 'skip' by pressing lpm anywhere
	Typer.waitFor = (ms, sc)=>{
		return new Promise((res,rej)=>{
			let st = setTimeout($=>res(),ms);

			// stop waiting if clicked
			if(sc)
			{
				window.onclick = ()=>{
					window.onclick = ()=>{};
					clearTimeout(st);
					res();
				}
			}
		});
	}

//		w:
//			DOMElement to copy innerHTML from
//		e:
//			Typer.TypeElement (check documentation for further info) 
//		tF:
//			typeFunctions (check documentation for further info)	
	Typer.type = (w, e, tF)=>{
		Typer.isTyping = true;
		return new Promise((res,rej)=>{

			let tFO = {};

			eval('tFO={'+e.tF.join(',')+'}');

			let ignite = ()=>{};
			let after = ()=>{};


			// IGNITE SET
			if(tFO.i){
				let ign = eval(`cpF.${tFO.i}`);
				if(ign){
					if(typeof ign === 'function')
						ignite = ign;
				}
			}

			// AFTER TYPE SET
			if(tFO.a){
				let aft = eval(`cpF.${tFO.a}`);
				if(aft){
					if(typeof aft === 'function')
						after = aft;
				}
			}


			ignite();

			if(e.charInterval === '-1'){
				e.typeTo.innerHTML = w.innerHTML;
				after();
				res();
				return;
			}
			let ptr = 0;
			let add = [];

			let toAdd = w.innerHTML.replace(/([<][^>]*[>])/g,'\n$1\n').split('\n');
			
			toAdd.forEach(x=>{
				if(x.length > 0){
					if(x.charAt(0) !== '<'){
						x.split('').forEach(c=>{
							add.push(c);
						});
					}
					else{
						add.push(x);
					}
				}
			});
			
			let innerH = "";
			
			let timer = setInterval(()=>{
				innerH += add[ptr];
				e.typeTo.innerHTML = innerH;
				ptr++;
				if(ptr >= add.length){
					clearInterval(timer);
					after();
					res('done');
				}
			}, /^[0-9]+$/.test(e.charInterval)?parseInt(e.charInterval): 10);

		});
	}

//		lines:
//			Typer.LineArray (check documentation for further info)
//		firstI:
//			Index of first item from lines to type (types every line
//			firstI->lines.length)
	Typer.typeFrom = function(lines, firstI){
		let lt = Array.from(lines).splice(firstI);
		return this.typeAll(lt);
	}

//		Returns promise that will resolve if Typer won't be typing anything
//		! Better use 'type().then()' than 'type();promiseEnd().then()' !
	Typer.promiseEnd = ()=>{
		return new Promise((res,rej)=>{
			let rif = setInterval(e=>{
				if(!Typer.isTyping)
					res("FREE");
			},100);
		});
	}

//		lines:
//			Typer.LineArray (check documentation for further info)
//		cpF:
//			clickPassFunctions (also typerFunctions)
//			(check documentation for further info)
	Typer.typeAll = async function(lines, cpF){
		this.isTyping = true;
		try{
			this.typeArray = [];
			Array.from(lines).forEach(e=>{
				Array.from(e.getElementsByClassName('typeText'))
				.forEach((e2,i2,a2)=>{
					let newE = e2;
					this.typeArray.push({
						tF: (e2.getAttribute('tF')||"").split(','),
						wb: parseInt(e2.getAttribute("wait")) || 0,
						typeTo: newE,
						typeFrom: e2.innerHTML,
						charInterval: e2.getAttribute("charInter") || 10,
						cP: e2.hasAttribute('clickPass')
					});
					newE.innerHTML = "";
					e.getElementsByClassName('typeText').item(i2).replaceWith(newE);
				});
			});
			for(let i = 0; i < this.typeArray.length; i++){
				let e = this.typeArray[i];
				let whole = document.createElement('div');
				this.whole = whole;
				whole.innerHTML = e.typeFrom;
				if(!e.cP){
					await this.waitFor(e.wb, e.wb?true:false);
					await this.type(whole, e, cpF || {});
				}
				else{
					await this.waitFor(e.wb, e.wb?true:false);
					await this.typeClick(whole, e, cpF || {});
				}
			}

		}
		catch(e){
			this.isTyping = false;
			console.error(e);
			throw e;
		}
		this.isTyping = false;
	}
}
// TYPER


