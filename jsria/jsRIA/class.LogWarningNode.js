function LogWarningNode(sText, sDescription) {
	LogNode.prototype.constructor.call(this, sText, sDescription);
}
LogWarningNode.inheritsFrom(LogNode);

LogWarningNode.prototype.getImage = function() {
	image = new Image();
	image.src = jsRIA.getBaseUrl() + "/res/images/warning.png";

	return image;
}