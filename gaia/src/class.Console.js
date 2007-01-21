function Console() {
	LogWriter.prototype.constructor.call(this);
}
Console.inheritsFrom(LogWriter);

Console.prototype.open = function() {
	var iTop = 100;
	var iLeft = screen.width - 50 - 450;
	var consoleUrl = this.jsRIA.getBaseUrl() + "/res/console.html";
	var consoleWin = window.open(consoleUrl, 'ConsoleWin', 
		'width=450,height=600,top=' + iTop + 
		',left=' + iLeft + ',location=no,menubar=no,status=no,toolbar=no,' +
		'resizable=yes,scrollbars=yes');
	
	var html = this.build();

	consoleWin.onload = function() {
		consoleWin.document.getElementsByTagName('body')[0].appendChild(html);
	}
}

Console.prototype.printOpenBox = function() {
	var body = document.getElementsByTagName('body')[0];
	var box = document.createElement('div');
	box.setAttribute('style', 
	'position: absolute; top: 10px; right: 10px; padding: 10px;' +
	'border: 1px solid #000; background-color: #c0d2ec; width: 100px;');
	box['innerHTML'] = 
	'<input type="button" style="font-family: Verdana; font-size: 10px;"' +
	'onclick="jsRIA.getConsole().open()" value="Open Console"/>';
	
	body.appendChild(box);
}

Console.prototype.toString = function() {
	return "Console";
}