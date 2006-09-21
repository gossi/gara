function LogErrorNode(sText, sDescription) {
	LogNode.prototype.constructor.call(this, sText, sDescription);
}
LogErrorNode.inheritsFrom(LogNode);

LogErrorNode.prototype.getImage = function() {
	image = new Image();
	image.src = jsRIA.getBaseUrl() + "/res/images/error.png";

	return image;
}