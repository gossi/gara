function InterfaceTester(jsRIA) {
	this.jsRIA = jsRIA;
}

//InterfaceTester.prototype.isIWriter = function(Obj) {
//	var bOk = true;
//	var e = new DefectInterfaceImplementationException();
//
//	if (!Obj.update) {
//		bOk = false;
//		e.addMissingMethod('update');
//	}
//
//	if (bOk) {
//		delete e;
//		return true;
//	} else {
//		throw e;
//	}
//}