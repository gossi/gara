function main() {
	jsRIA.getConsole().printOpenBox();
	
	l = new List(document.getElementById('listArea'));
	
	var li = new ListItem(l);
	li.setText('foo');
	var li = new ListItem(l);
	li.setText('arrrgh');
	
	var i = new Image();
	i.src = jsRIA.getBaseUrl() + "/res/images/warning.png";
	
	li.setImage(i);
	
	listener = new ListListener();
	l.addSelectionListener(listener);
	
	l.update();
}

function addItem() {
	var text = window.prompt('Text eingeben: ');
	var li = new ListItem(l);
	li.setText(text);
	l.update();
	jsRIA.getLog().addMessage('added item: ' + text);
}

function activateEmbeddedConsole(that) {
	that.setAttribute('disabled', 'disabled');
	var EC = new EmbeddedConsole(jsRIA);
	EC.setContainer(document.getElementById('ec'));
	jsRIA.getLog().addWriter(EC);
	EC.show();
}

function raiseException() {
	var e =	new Exception('Exception demonstration');
	jsRIA.getExceptionHandler().exceptionRaised(e);
}

function ehLog() {
	eh = jsRIA.getExceptionHandler();
	eh.setErrorReporting(eh.ER_LOG);
	jsRIA.getLog().addMessage('ExceptionHandler: set reporting to Log');
}

function ehAlert() {
	eh = jsRIA.getExceptionHandler();
	eh.setErrorReporting(eh.ER_ALERT);
	jsRIA.getLog().addMessage('ExceptionHandler: set reporting to Alert');
}

function selectAll() {
	try {
		l.selectAll();
	} catch (e) {
		jsRIA.getExceptionHandler().exceptionRaised(e);
	}
}

function deselectAll() {
	l.deselectAll();
}

function ListListener() {
	
}

ListListener.prototype = {
	widgetSelected : function(listObj) {
		jsRIA.getLog().addMessage('selection changed in list');
	}
}

main();