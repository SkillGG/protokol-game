'use strict';

let Kol = {};

Kol.backKol = (sentence)=>{
	return sentence
	.replace(/\ue010|\ue011|\ue012|\ue013/g, "a")
	.replace(/\ue014|\ue015/g, "b")
	.replace(/\ue016|\ue017|\ue018/g, "d")
	.replace(/\ue019|\ue01a/g, "e")
	.replace(/\ue01b|\ue01c/g, "f")
	.replace(/\ue01d|\ue01e/g, "g")
	.replace(/\ue01f|\ue020/g, "h")
	.replace(/\ue021|\ue022|\ue023|\ue024/g, "i")
	.replace(/\ue025|\ue026/g, "ii")
	.replace(/\ue027/g, "aa")
	.replace(/\ue028/g, "aA");
}
Kol.simpleKol = (word)=>{
	return word
	.replace(/b/gi, "\ue015")
	.replace(/d/gi, "\ue016")
	.replace(/f/gi, "\ue01c")
	.replace(/g/gi, "\ue01e")
	.replace(/h/gi, "\ue01f")
	.replace(/(i{1,2})/gi, (m,g1)=>g1.length===2?"\ue026":"\ue022")
	.replace(/(a{1,2})/gi, (m,g1)=>g1.length === 2?"\ue027":"\ue011")
	.replace(/(o{1,2})/gi, (m,g1)=>g1.length === 2?"\ue02a":"\ue03a")
	.replace(/(e{1,2})/gi, (m,g1)=>g1.length === 2?"\ue02b":"\ue019")
	.replace(/k/gi, "\ue02c")
	.replace(/l/gi, "\ue02f")
	.replace(/w/gi, "\ue032")
	.replace(/n/gi, "\ue035")
	.replace(/m/gi, "\ue037")
	.replace(/p/gi, "\ue03d");
}

Kol.ecode = (ec)=>{
	ec = ec.replace(/u([0-9a-f]{2,3})/gi, (m,g1)=>{
		if(g1.length === 2){
			return String.fromCharCode(parseInt(`e0${g1}`, 16));
		}
		else {
			return String.fromCharCode(parseInt(`e${g1}`, 16));
		}
	});
	return ec;
}