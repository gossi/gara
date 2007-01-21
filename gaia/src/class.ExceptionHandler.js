// constants... hust
function ExceptionHandler() {
	this.ER_ALERT = 1;
	this.ER_LOG = 2;
	this.sErrorMessage;
	this.sErrorDescription = "";
	this.log;
	this.iErrorReporting = this.ER_ALERT;
}

ExceptionHandler.prototype.setErrorReporting = function(iER) {
	this.iErrorReporting = iER;	
}

ExceptionHandler.prototype.setLog = function(log) {
	this.log = log;
}

ExceptionHandler.prototype.exceptionRaised = function(e) {
	
	this.buildError(e);
	
	switch (this.iErrorReporting) {
		
		case this.ER_LOG:
			//sError = strReplace("\n", "\n<br/>", sError);
			this.Log.addError(this.sErrorMessage, this.sErrorDescription);
			break;

		case this.ER_ALERT:
		default:
			alert(this.sErrorMessage + "\n" + this.sErrorDescription);
			break;
	}
}

ExceptionHandler.prototype.buildError = function(e) {

	this.sErrorDescription = "";

	if (e instanceof Exception) {
		var sExceptionType = e.getExceptionType();
		this.sErrorMessage = "[" + sExceptionType + "] " + e.getMessage();
		
		if (typeof(e.getErrClass()) != "undefined" 
			&& typeof(e.getErrMethod()) != "undefined") {	
			this.sErrorDescription = e.getErrClass() + "::" + e.getErrMethod() + "\n";
		}
	
		if (e instanceof(DefectInterfaceImplementationException)) {
			this.sErrorDescription += "\nMissing Methods: " + e.getMissingMethods();
		}
	} else if (typeof(e) == "string"){
		this.sErrorMessage = e;
	} else {
		this.sErrorMessage = e.toString();		
	}
}