function Log() {
	this.aWriter = new Array();
	this.root = new LogFolderNode();
	this.root.setLog(this);
	this.folders = new Stack();
	this.folders.push(this.root);
	this.currentFolder = this.root;
}

Log.prototype.addMessage = function(sText, sDescription) {
	var message = new LogMessageNode(sText, sDescription)
	message.setLog(this);
	this.append(message);
}

Log.prototype.addError = function(sText, sDescription) {
	var error = new LogErrorNode(sText, sDescription);
	error.setLog(this);
	this.append(error);
}

Log.prototype.createFolder = function(sText, sDescription) {
	var folder = new LogFolderNode(sText, sDescription);
	folder.setLog(this);	
	return folder;
}

Log.prototype.pushLogFolder = function(folder) {
	if (folder instanceof(LogFolderNode)) {
		this.append(folder);
		this.folders.push(folder);
		this.currentFolder = folder;
	}
}

Log.prototype.popLogFolder = function() {
	if (this.folders.peek() != this.root) {
		var returnFolder = this.folders.pop();
		this.currentFolder = this.folders.peek();
		this.notifyWriter(-1);
		return returnFolder;
	}
}

Log.prototype.append = function(node) {
	if (node instanceof(LogNode)) {
		node.setParent(this.currentFolder);
		this.currentFolder.addNode(node);
		this.notifyWriter(node);
	}
}

Log.prototype.addWriter = function(newWriter) {

//	if (!newWriter instanceof(LogWriter)) {
//		throw new WrongObjectException('newWriter is not instance of LogWriter', 'Log', 'addWriter');
//	}
	try {
		gaia.getInterfaceTester().isIWriter(newWriter);
	} catch (e) {
		gaia.getExceptionHandler().exceptionRaised(e);
	}
	this.aWriter.push(newWriter);

	// pass the root message to the writer...
	newWriter.setRoot(this.root);
}

Log.prototype.notifyWriter = function(node) {
	for (var i = 0; i < this.aWriter.length; ++i) {
		this.aWriter[i].update(node);
	}
}