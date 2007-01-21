function Queue() {
	AbstractList.prototype.constructor.call(this);
}

Queue.inheritsFrom(AbstractList);

Queue.prototype.peek = function() {
	if (this.empty()) {
		return false;
	} else {
		return this[0];
	}
}

Queue.prototype.pop = function() {
	return this.shift();
}