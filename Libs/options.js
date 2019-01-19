
let Options = {};

let NameRegex = /^@name: *([^\n\r]+$)/i;
let SubNameRegex = /^@sub: *([^\n\r]+$)/i;
let VersionRegex = /^@version: *([0-9_\-ab ]+)$/i;
let NameVersionRegex = /^@version: *([^\n\r]+)$/i;
let MadeByRegex = /^@madeby: *([^\n\r]+)$/i;

Options.parseOptions = (data) => {

	let reto = {};

	let arr = data.split('\n');
	arr.forEach((e,i,a)=>{
		let cmd = e.replace(/[\r]/gi, "");
		
		//Title
		let nameExec = NameRegex.exec(cmd);
		if(nameExec)
			if(nameExec.length >= 2)
				reto.title = nameExec[1];

		//SubTitle
		let subExec = SubNameRegex.exec(cmd);
		if(subExec)
			if(subExec.length >= 2)
				reto.subtitle = subExec[1];

		//Version
		let verExec = VersionRegex.exec(cmd);
		if(verExec)
			if(verExec.length >= 2)
				reto.version = verExec[1];

		if(!reto.version){
			verExec = NameVersionRegex.exec(cmd);
			if(verExec)
				if(verExec.length >= 2){
					reto.version = verExec[1] || "";
				}
		}
		else
			reto.version = "v. "+reto.version;

		//Made By
		let madeExec = MadeByRegex.exec(cmd);
		if(madeExec)
			if(madeExec.length >= 2)
				reto.madeby = madeExec[1];


	});

	return reto;

}