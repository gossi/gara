function LogNode(sText, sDescription) {
//	this.sText = "bla";
	this.sDescription = "";
	this.parentNode = null;
	//this.log = null;
	this.nodes = new Array();

	this.setText(sText);
	this.setDescription(sDescription);
}

LogNode.prototype.setText = function(sText) {
	if (typeof(sText) != "string") {
		sText = "";
	}
	this.sText = sText;
}

LogNode.prototype.setDescription = function(sDescription) {
	if (typeof(sDescription) != "string") {
		sDescription = "";
	}
	this.sDescription = sDescription;
}

LogNode.prototype.setLog = function(log) {
	if (log instanceof(Log)) {
		this.log = log;
	}
}

LogNode.prototype.getLog = function() {
	return this.log;
}

LogNode.prototype.getText = function() {
	return this.sText;
}

LogNode.prototype.getDescription = function() {
	return this.sDescription;
}

/**
 * The content should be filled by the childs of this class
 * @abstract 
 */
LogNode.prototype.getImage = function() {
	return null;
}

LogNode.prototype.hasNodes = function() {
	return this.nodes.length > 0;
}

LogNode.prototype.getNodes = function() {
	return this.nodes;
}

LogNode.prototype.getNodesCount = function() {
	return this.nodes.length;
}

LogNode.prototype.addNode = function(node) {
	this.nodes.push(node);
}

LogNode.prototype.setParent = function(parentNode) {
	this.parentNode = parentNode;
}

LogNode.prototype.getParent = function() {
	return this.parentNode;
}