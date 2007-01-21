function Queue() {
	this.aEntries = new Array();
}

Queue.prototype = new AbstractList();

Queue.prototype.peek = function() {
	if (this.empty()) {
		return false;
	} else {
		return this.aEntries[0];
	}
}

Queue.prototype.pop = function() {
	var Elem = this.aEntries[0];

	// shift everything up
	for (var i = 0; i < this.aEntries.length - 1; ++i) {
		if (i + 1 <= this.aEntries.length) {
			this.aEntries[i] = this.aEntries[i + 1];
		}
	}
	this.aEntries.pop();
	
	return Elem;
}