function AbstractList () {
	this.aEntries = null;
}

AbstractList.prototype.empty = function() {
	return this.aEntries.length == 0;
}

AbstractList.prototype.push = function(NewEntry) {
	this.aEntries.push(NewEntry);
}

AbstractList.prototype.size = function() {
	return this.aEntries.length;
}

AbstractList.prototype.get = function(iOffset) {
	if (iOffset > this.size()) {
		throw new OutOfBoundsException("[AbstractList] Index (" + iOffset + ") out of bounds");
	} else {
		return this.aEntries[iOffset];
	}
}