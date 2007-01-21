InterfaceTester.prototype.isFocusListener = function(obj) {
	var bOk = true;
	var e = new DefectInterfaceImplementationException();

	if (!obj.focusGained) {
		bOk = false;
		e.addMissingMethod('focusGained');
	}
	
	if (!obj.focusLost) {
		bOk = false;
		e.addMissingMethod('focusLost');
	}

	if (bOk) {
		delete e;
		return true;
	} else {
		throw e;
	}
}

InterfaceTester.prototype.isListener = function(obj) {
	var bOk = true;
	var e = new DefectInterfaceImplementationException();

	if (!obj.handleEvent) {
		bOk = false;
		e.addMissingMethod("handleEvent");
	}

	if (bOk) {
		delete e;
		return true;
	} else {
		throw e;
	}
}

InterfaceTester.prototype.isSelectionListener = function(obj) {
	var bOk = true;
	var e = new DefectInterfaceImplementationException();

	if (!obj.widgetSelected) {
		bOk = false;
		e.addMissingMethod('widgetSelected');
	}

	if (bOk) {
		delete e;
		return true;
	} else {
		throw e;
	}
}