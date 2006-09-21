//function EmbeddedConsole(jsRIA) {
//	this.container = null;
//	this.parent.init(jsRIA);
//}

function EmbeddedConsole(jsRIA) {
	this.container = null;
	LogWriter.prototype.constructor.call(this, jsRIA);
}
EmbeddedConsole.inheritsFrom(LogWriter);

EmbeddedConsole.prototype.setContainer = function(container) {
	this.container = container;
}

EmbeddedConsole.prototype.show = function() {

	var html = this.build();

	if (this.container == null) {
		this.createContainer();	
	}
	this.container.appendChild(html);
}

EmbeddedConsole.prototype.createContainer = function() {
	var id = uniqueId();
	var div = document.createElement('div');
	div.setAttribute("id", id);
	div.setAttribute("style", "width: 100%; height: 400px; overflow: auto; border: 1px solid #BBB;");
	document.getElementsByTagName("body")[0].appendChild(div);
	this.setContainer(div);
}

EmbeddedConsole.prototype.toString = function() {
	return "Embedded Console";
}