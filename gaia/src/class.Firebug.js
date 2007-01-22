/**
 * Firebug LogWriter
 * 
 * @author Thomas Gossmann
 * @class Firebug
 * @constructor
 */
function Firebug() {
	this.updated = new Array();
	this.root = null;
}

/**
 * set the root element in the FirebugWriter.
 * 
 * @author Thomas Gossmann
 * @param {LogNode} the root node
 * @type void
 */
Firebug.prototype.setRoot = function(root) {
	this.root = root;
}

/**
 * Update the passed node
 * 
 * @author Thomas Gossmann
 * @param {LogNode} the node to update
 * @type void
 */
Firebug.prototype.update = function(node) {
	if (typeof(node) == "undefined") {
		return;
	}
	else if (node == -1) {
		console.groupEnd();
	}
	else if (this.updated.contains(node)) {
		return;
	}
	else if (node instanceof(LogErrorNode)) {
		console.error(node.getText());
	}
	else if (node instanceof(LogMessageNode)) {
		console.info(node.getText());
	}
	else if (node instanceof(LogWarningNode)) {
		console.warn(node.getText());
	}
	else if (node instanceof(LogFolderNode) && node != this.root) {
		console.group(node.getText());
	}
	else if (node instanceof(LogNode)) {
		// do nothing
	}
	
	this.updated.push(node);
}

/**
 * Simply tells, what object _this_ is
 * 
 * @author Thomas Gossmann
 */
Firebug.prototype.toString = function() {
	return "[object Firebug]";
}