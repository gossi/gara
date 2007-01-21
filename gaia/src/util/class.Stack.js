function Stack() {
	//this.aEntries = new Array();
	AbstractList.prototype.constructor.call(this);
}

Stack.inheritsFrom(AbstractList);

Stack.prototype.peek = function() {
	if (this.empty()) {
		return false;
	} else {
		return this[this.length - 1];
	}
}

//Stack.prototype.pop = function() {
//	return this.aEntries.pop();
//}