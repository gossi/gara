function LogWriter(jsRIA) {
	this.jsRIA = jsRIA;
	this.root = null;
	this.builds = new Array();
	this.elements = new Object();
	this.html = null;
}

LogWriter.prototype.setRoot = function(rootNode) {
	if (rootNode instanceof(LogFolderNode)) {
		this.root = rootNode;
		this.html = document.createElement('ul');
		this.builds.push(this.root)
		this.elements[0] = this.html;
	}
}

LogWriter.prototype.build = function() {
	this.update();
	return this.html;
}

LogWriter.prototype.update = function(node) {
	if (typeof(node) == "undefined") {
		node = this.root;
	}
	
	if (node != -1 && node != this.root) {
		node = node.getParent();
	}
	
	this.doUpdate(node);
}

LogWriter.prototype.doUpdate = function(parentNode) {

	// go up ...
	if (parentNode == -1) {
		return;
	}

	var childs = parentNode.getNodes();
	
	for (var i = 0; i < childs.length; ++i) {
		var node = childs[i];
		
		if (this.builds.inArray(node)) {
			continue;
		}

		var parentNode = node.getParent();
		var isRoot = parentNode == this.root;
		var iOffset = this.builds.getKey(parentNode);
		var parentElement = this.elements[iOffset];
		var newElement;
		if (node instanceof(LogFolderNode)) {
			var caption = this.createNode(node);
			newElement = document.createElement('ul');
			newElement.style.listStyleImage = "url('"+node.getImage().src+"')";

			if (i + 1 <= childs.length
			&& this.builds.inArray(childs[i + 1]) ) {
				parentElement.insertBefore(newElement, childs[i + 1]);
				parentElement.insertBefore(caption, newElement);
			} else {
				parentElement.appendChild(caption);
				parentElement.appendChild(newElement);
			}
		} else {
			newElement = this.createNode(node);
			if (i + 1 <= childs.length
			&& this.builds.inArray(childs[i + 1]) ) {
				parentElement.insertBefore(newElement, childs[i + 1]);
			} else {
				parentElement.appendChild(newElement);
			}
		}
		
		this.builds.push(node);
		this.elements[this.builds.length - 1] = newElement;
		
		// apply childs, if node is a folder
		if (node instanceof(LogFolderNode)) {
			this.doUpdate(node);
		}
	}
}

LogWriter.prototype.createNode = function(node) {
	var newNode;
	newNode = document.createElement('li');
	newNode.appendChild(document.createTextNode(node.getText()));
	newNode.style.listStyleImage = "url('"+node.getImage().src+"')";
	
	return newNode;
}