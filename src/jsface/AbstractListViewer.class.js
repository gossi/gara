/*	$Id $

		gara - Javascript Toolkit
	===========================================================================

		Copyright (c) 2007 Thomas Gossmann
	
		Homepage:
			http://gara.creative2.net

		This library is free software;  you  can  redistribute  it  and/or
		modify  it  under  the  terms  of  the   GNU Lesser General Public
		License  as  published  by  the  Free Software Foundation;  either
		version 2.1 of the License, or (at your option) any later version.

		This library is distributed in  the hope  that it  will be useful,
		but WITHOUT ANY WARRANTY; without  even  the  implied  warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See  the  GNU
		Lesser General Public License for more details.

	===========================================================================
*/

/**
 * @class AbstractListViewer
 * @extends gara.jsface.StructuredViewer
 * @namespace gara.jsface
 * @author Thomas Gossmann
 */
$class("AbstractListViewer", {
	$extends : gara.jsface.StructuredViewer,

	/**
	 * @constructor
	 * 
	 */
	$constructor : function() {
		this._storedSelection = [];
	},

	_createListItem : $abstract(function(element, style, index) {}),
	
	/* Method declared on StructuredViewer. */
	_doFindInputItem : function(element) {
		// compare with root
		var root = this._getRoot();
		if (root == null) {
			return null;
		}

		if (root == element) {
			return this.getControl();
		}
		return null;
	},
	
	_doUpdateItem : function(item, element) {
		if (item.isDisposed()) {
			this._unmapElement(element, item);
			return;
		}

		item.setText(this._getLabelProviderText(this.getLabelProvider(), element));
		item.setImage(this.getLabelProvider().getImage(element));

		this._associate(element, item);
	},

	getControl : $abstract(function() {}),

	_getLabelProviderText : function(labelProvider, element) {
		var text = labelProvider.getText(element);
		if (text == null) {
			text = "";
		}

		return text;
	},

	inputChanged : function(input, oldInput) {
		this._listRemoveAll();
		this.getControl().setSelection([]);

		this._internalRefresh();
	},

	_internalRefresh : function(element, updateLabels) {
		if (element == null || element == this._getRoot()) {
			// store selection
			var storedSelection = this.getControl().getSelection();

			var children = this._getSortedChildren(this._getRoot());
			var items = this.getControl().getItems();
			var itemCount = items.length;			
			var min = Math.min(children.length, items.length);

			// compare first min items, and update item if necessary
			// need to do it in two passes:
			// 1: disassociate old items
			// 2: associate new items
			// because otherwise a later disassociate can remove a mapping made for
			// a previous associate,
			// making the map inconsistent
			for (var i = 0; i < min; ++i) {
				var item = items[i];
				var oldElement = item.getData();
				if (oldElement != null) {
					var newElement = children[i];
					if (newElement != oldElement) {
						if (newElement == oldElement) {
							// update the data to be the new element, since
							// although the elements
							// may be equal, they may still have different labels
							// or children
							var data = item.getData();
							if (data != null) {
								this._unmapElement(data, item);
							}
							item.setData(newElement);
							this._mapElement(newElement, item);
						} else {
							this._disassociate(item);
							// Clear the text and image to force a label update
							item.setImage(null);
							item.setText("");

							if (storedSelection.contains(items[i])) {
								storedSelection.remove(items[i]);
							}
						}
					}
				}
			}

			for (var i = 0; i < min; ++i) {
				var item = items[i];
				var newElement = children[i];
				if (item.getData() == null) {
					// old and new elements are not equal
					this._associate(newElement, item);
					this._updateItem(item, newElement);
				} else {
					// old and new elements are equal
					if (updateLabels) {
						this._updateItem(item, newElement);
					}
				}
			}

			// add any remaining elements
			if (min < children.length) {
				for (var i = min; i < children.length; ++i) {
					//this._createListItem(widget, children[i], i);
					var item = this._createListItem(children[i], gara.jswt.JSWT.DEFAULT, i);
					this._associate(children[i], item);
				}
			}

			// remove unused items
			for (var i = 0; (min + i) < itemCount; ++i) {
				this.getControl().remove(min);
			}

			// restore selection
			this.getControl().setSelection(storedSelection);
		} else {
			var item = this._getItemFromElementMap(element);
			if (item != null) {
				this._updateItem(item, element);
			}
		}
		
		this.getControl().update();
	},

	_listRemoveAll : $abstract(function() {}),

	_listSetItems : $abstract(function() {})
});