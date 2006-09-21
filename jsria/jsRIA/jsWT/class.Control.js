function Control() {
	this.aItems = new Array();
	this.sClassName = 'jsWT';
	
	Widget.prototype.constructor.call(this);
	
	this.aSelectionListeners = new Array();
}

Control.inheritsFrom(Widget);

Control.prototype.addClassName = function(sClassName) {
	this.sClassName += " " + sClassName;
}

Control.prototype.addItem = function(newItem) {
	
	if (!newItem instanceof Item) {
		return error('Control', 'addItem', 'New Item is not instance of Item');
	}
	
	this.aItems.push(newItem);
}

Control.prototype.removeClassName = function(sClassName) {
	this.sClassName = strReplace(this.sClassName, " " + sClassName, "");
}

Control.prototype.setClassName = function(sClassName) {
	this.sClassName = sClassName;
}

Control.prototype.update = function() {
	this.paint();
}