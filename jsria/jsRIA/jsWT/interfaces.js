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