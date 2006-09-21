function LogMessageNode(sText, sDescription) {
//	this.sText;
	LogNode.prototype.constructor.call(this, sText, sDescription);
}
LogMessageNode.inheritsFrom(LogNode);

LogMessageNode.prototype.getImage = function() {
	image = new Image();
	image.src = jsRIA.getBaseUrl() + "/res/images/message.png";

	return image;
}