Array.prototype.indexOf = function(value) {
	var key = false;
	for( var i = 0; i < this.length; ++i ) {
		if( this[i] == value ) {
			key = i;
			break;
		}
	}
	
	return key;
}

/**
 * 
 * @deprecated
 */
Array.prototype.getKey = Array.prototype.indexOf;

/**
 * Proves if the searchterm is in the array or not
 * @param mNeedle the searchterm
 * @return true if the Needle exists or false if the needle isn't in the array
 */
Array.prototype.contains = function(mNeedle) {
	for( var i = 0; i < this.length; ++i ) {
		if( this[i] == mNeedle ) {
			return true;
		}
	}
	
	return false;
}

/**
 * 
 * @deprecated
 */
//Array.prototype.inArray = Array.prototype.contains;

Array.prototype.remove = function(iOffset) {
	if (iOffset < this.length) {
		this.splice(iOffset, 1);
	}
}