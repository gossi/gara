//function WronbObjectException(sMessage, sErrClass, sErrMethod) {
//	this.sType = "WrongObjectException";
//
//	if (typeof(sMessage) == "string") {
//		this.sMessage = sMessage;
//	}
//
//	if (typeof(sErrClass) == "string") {
//		this.sErrClass = sErrClass;
//	}
//
//	if (typeof(sErrMethod) == "string") {
//		this.sErrMethod = sErrMethod;
//	}
//}

function WrongObjectException(sMessage, sErrClass, sErrMethod) {
	this.sType = "WrongObjectException";
	
	Exception.prototype.constructor.call(this, sMessage, sErrClass, sErrMethod);
}

WrongObjectException.inheritsFrom(Exception);