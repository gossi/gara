function LogMessageNode(sText, sDescription) {
//	this.sText;
	LogNode.prototype.constructor.call(this, sText, sDescription);
}
LogMessageNode.inheritsFrom(LogNode);

LogMessageNode.prototype.getImage = function() {
	image = new Image();
	image.src = gaia.getBaseUrl() + "/res/images/message.png";

	return image;
}