function DefectInterfaceImplementationException(sMessage, sErrClass, sErrMethod) {
	this.aMissingMethods = new Array();
	this.sType = "DefectInterfaceImplementationException";
	
	Exception.prototype.constructor.call(this, sMessage, sErrClass, sErrMethod);
}

DefectInterfaceImplementationException.inheritsFrom(Exception);

DefectInterfaceImplementationException.prototype.addMissingMethod = function(sMethod) {
	this.aMissingMethods.push(sMethod);
}

DefectInterfaceImplementationException.prototype.getMissingMethods = function() {
	var sReturn = "";
	
	for (var i = 0; i < this.aMissingMethods.length; ++i) {
		sReturn += this.aMissingMethods[i] + ", ";
	}
	sReturn = sReturn.substring(0, -2);
	return sReturn;
}

DefectInterfaceImplementationException.prototype.toString = function() {
	return "[DefectInterfaceImplementationException] " + this.sMessage + 
		"\nMissing Methods: " + this.getMissingMethods();
}