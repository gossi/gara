function ItemNotExistsException(sMessage, sClass, sMethod) {
	Exception.prototype.constructor.call(this, sMessage, sClass, sMethod);
}
ItemNotExistsException.inheritsFrom(Exception);