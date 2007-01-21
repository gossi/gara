function LogFolderNode(sText, sDescription) {
	LogNode.prototype.constructor.call(this, sText, sDescription);
}
LogFolderNode.inheritsFrom(LogNode);

LogFolderNode.prototype.getImage = function() {
	image = new Image();
	image.src = gaia.getBaseUrl() + "/res/images/folder.png";

	return image;
}

LogFolderNode.prototype.addNode = function(node) {
	LogNode.prototype.addNode.call(this, node);
	if (typeof(this.log) != "undefined") {
		this.log.notifyWriter(this);
	}
}