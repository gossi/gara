function Exception(sMessage, sErrClass, sErrMethod) {
	this.sMessage;
	this.sErrClass;
	this.sErrMethod;
	this.sType = "Exception";

	if (typeof(sMessage) == "string") {
		this.sMessage = sMessage;
	}

	if (typeof(sErrClass) == "string") {
		this.sErrClass = sErrClass;
	}

	if (typeof(sErrMethod) == "string") {
		this.sErrMethod = sErrMethod;
	}
}

Exception.prototype.getErrClass = function() {
	return this.sErrClass;
}

Exception.prototype.getExceptionType = function() {
	return this.sType;	
}

Exception.prototype.getErrMethod = function() {
	return this.sErrMethod;
}

Exception.prototype.getMessage = function() {
	return this.sMessage;
}

Exception.prototype.setErrClass = function(sErrClass) {
	this.sErrClass = sErrClass;
}

Exception.prototype.setErrMethod = function(sErrMethod) {
	this.sErrMethod = sErrMethod;
}

Exception.prototype.setMessage = function(sMessage) {
	this.sMessage = sMessage;
}

Exception.prototype.toString = function() {
	return "[Exception] " + this.sMessage;
}