function strReplace(string, search, replace) {
	output = "" + string;
	while( output.indexOf(search) > -1 ) {
		pos = output.indexOf(search);
		output = "" + (output.substring(0, pos) + replace +
			output.substring((pos + search.length), output.length));
	}
	return output;
}

function uniqueId() {
	var d = new Date();
	var ID = d.getDate()+""+d.getMonth() + 1+""+d.getFullYear()+""+d.getHours()+""+d.getMinutes()+""+d.getSeconds()+""+d.getMilliseconds();
	return ID;
}

function error(sClass, sMethod, sMessage) {
	alert("Error\n-----\n\n" + sClass + "::" + sMethod + "\n" + sMessage);
}