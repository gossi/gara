function ListItem(control) {
	if (!control instanceof List) {
		throw new WrongObjectException("Control is not instance of List", "ListItem", "ListItem");
	}

	control.addItem(this);
	Item.prototype.constructor.call(this);
}

ListItem.inheritsFrom(Item);