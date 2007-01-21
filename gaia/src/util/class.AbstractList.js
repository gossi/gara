function AbstractList () {
	Array.prototype.constructor.call(this);
}

AbstractList.inheritsFrom(Array);

AbstractList.prototype.empty = function() {
	return this.length == 0;
}

AbstractList.prototype.size = function() {
	return this.length;
}

AbstractList.prototype.get = function(iOffset) {
	if (iOffset > this.length) {
		throw new OutOfBoundsException("[AbstractList] Index (" + iOffset + ") out of bounds");
	} else {
		return this[iOffset];
	}
}