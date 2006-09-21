function OutOfBoundsException(sMessage, sErrClass, sErrMethod) {
	this.sType = "OutOfBoundsException";
	
	Exception.prototype.constructor.call(this, sMessage, sErrClass, sErrMethod);
}

OutOfBoundsException.inheritsFrom(Exception);