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
 * @class AbstractTreeViewer
 * @extends gara.jsface.viewers.ColumnViewer
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
$class("AbstractTreeViewer", {
	$extends : gara.jsface.viewers.ColumnViewer,

	/**
	 * @constructor
	 * Top Constructor von die AbstractListViewer
	 */
	$constructor : function() {
	},

	_createTreeItem : function (parent, element, index) {
		var item = this._newItem(parent, gara.jswt.JSWT.NULL, index);
		this._updateItem(item, element);
	},

	_disassociate : function(item) {
		this.$base(item);
		this._disassociateChildren(item);
	},

	_disassociateChildren : function(item) {
		var items = this._getChildren(item);
		for (var i = 0; i < items.length; i++) {
			if (items[i].getData() != null) {
				this._disassociate(items[i]);
			}
		}
	},

	_doGetColumnCount : function() {
		return 0;
	},

	_doGetSelection : $abstract(function() {}),

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

	/* Method declared on StructuredViewer. */
	_doFindItem : function(element) {
		// compare with root
		var root = getRoot();
		if (root == null) {
			return null;
		}

		var items = this._getChildren(this.getControl());
		if (items != null) {
			for (var i = 0; i < items.length; i++) {
				var o = this._internalFindItem(items[i], element);
				if (o != null) {
					return o;
				}
			}
		}
		return null;
	},

	_doUpdateItem : function(item, element) {
		if (item.isDisposed()) {
			this._unmapElement(element, item);
			return;
		}

		var viewerRowFromItem = this._getViewerRowFromItem(item);
		var columnCount = this._doGetColumnCount();
		if (columnCount == 0){columnCount = 1;}

		for (var column = 0; column < columnCount; column++) {
			var columnViewer = this._getViewerColumn(column);
			var cellToUpdate = this._updateCell(viewerRowFromItem, column, element);

			columnViewer.refresh(cellToUpdate);

			// As it is possible for user code to run the event
			// loop check here.
			if (item.isDisposed()) {
				this._unmapElement(element, item);
				return;
			}
		}

		this._associate(element, item);
	},

	_getChildren : $abstract(function() {}),

	getControl : $abstract(function() {}),

	_getExpanded : $abstract(function(item) {}),

	_getLabelProviderText : function(labelProvider, element) {
		var text = labelProvider.getText(element);
		if (text == null) {
			text = "";
		}

		return text;
	},

	_getRawChildren : function(parent) {
		var cp = this.getContentProvider();
		if (parent == this._getRoot()) {
			return this.$base(parent);
		} else if ($class.instanceOf(cp, gara.jsface.viewers.ITreeContentProvider)) {
			var result = cp.getChildren(parent);
			if (result != null) {
				return result;
			}
		}

		return [];
	},

	_getSelectionFromWidget : function() {
		var items = this._doGetSelection();
		var list = [];
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var e = item.getData();
			if (e != null) {
				list.push(e);
			}
		}
		return list;
	},

	inputChanged : function(input, oldInput) {
		this._treeRemoveAll();
		this._internalRefresh();
	},

	_internalFindItem : function(parent, element) {
		// compare with node
		var data = parent.getData();
		if (data != null) {
			if (data == element) {
				return parent;
			}
		}

		// recurse over children
		var items = this._getChildren(parent);
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var w = this._internalFindItem(item, element);
			if (w != null) {
				return w;
			}
		}
		return null;
	},

	_internalRefresh : function(element, updateLabels) {
		// save selected elements
		var selected = [];
		var selection = this.getControl().getSelection();
		for (var i = 0; i < selection.length; ++i) {
			selected.push(selection[i].getData());
		}

		if (element == null || element == this._getRoot()) {
			this._internalRefreshItems(this.getControl(), this._getRoot(), updateLabels);
		} else {
			var items = this._findItems(element);
			if (items.length != 0) {
				for (var i = 0; i < items.length; i++) {
					this._internalRefreshItems(items[i], element, updateLabels);
				}
			}
		}

		// restore selection
		var selection = [];
		selected.forEach(function(elem, i, arr) {
			var item = this._getItemFromElementMap(elem);
			if (item != null) {
				selection.push(item);
			}
		}, this);
		this.getControl().update();
		this.getControl().setSelection(selection);
		this.getControl().update();
	},

	_internalRefreshItems : function(widget, element, updateLabels) {
		this._updateChildren(widget, element, updateLabels);
		var children = this._getChildren(widget);
		if (children != null) {
			for (var i = 0; i < children.length; i++) {
				var item = children[i];
				var data = item.getData();
				if (data != null) {
					this._internalRefreshItems(item, data, updateLabels);
				}
			}
		}
	},

	_newItem : $abstract(function(parent, style, index) {}),

	_setExpanded : $abstract(function(item, expanded) {}),

	_treeRemoveAll : $abstract(function() {}),

	_updateChildren : function(widget, parent, updateLabels) {
		var elementChildren = this._getSortedChildren(parent);
		var tree = this.getControl();
		var items = this._getChildren(widget);

		// save the expanded elements
		var expanded = [];

		for (var i = 0; i < items.length; ++i) {
			if (this._getExpanded(items[i])) {
				var element = items[i].getData();
				if (element != null) {
					expanded.push(element);
				}
			}
		}

		var min = Math.min(elementChildren.length, items.length);
		// dispose of surplus items, optimizing for the case where elements have
		// been deleted but not reordered, or all elements have been removed.
		var numItemsToDispose = items.length - min;
		if (numItemsToDispose > 0) {
			var children = [];
			for (var i = 0; i < elementChildren.length; i++) {
				children.push(elementChildren[i]);
			}

			var i = 0;
			while (numItemsToDispose > 0 && i < items.length) {
				var data = items[i].getData();
				if (data == null || items.length - i <= numItemsToDispose || !children.contains(data)) {
					if (data != null) {
						this._disassociate(items[i]);
					}
					items[i].dispose();
					items.removeAt(i);
					numItemsToDispose--;
				} else {
					i++;
				}
			}
		}

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
				var newElement = elementChildren[i];
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
				}
			}
		}

		for (var i = 0; i < min; ++i) {
			var item = items[i];
			var newElement = elementChildren[i];
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

		// Restore expanded state for items that changed position.
		for (var i = 0; i < min; ++i) {
			var item = items[i];
			var newElement = elementChildren[i];
			this._setExpanded(item, expanded.contains(newElement));
		}

		// add any remaining elements
		if (min < elementChildren.length) {
			for (var i = min; i < elementChildren.length; ++i) {
				this._createTreeItem(widget, elementChildren[i], i);
			}

			// Need to restore expanded state in a separate pass
			// because createTreeItem does not return the new item.
			// Avoid doing this unless needed.
			if (expanded.length > 0) {
				// get the items again, to include the new items
				items = this._getChildren(widget);
				for (var i = min; i < elementChildren.length; ++i) {
					// Restore expanded state for items that changed position.
					// Only need to call setExpanded if element was expanded
					if (expanded.contains(elementChildren[i])) {
						this._setExpanded(items[i], true);
					}
				}
			}
		}

	},

	setContentProvider : function(contentProvider) {
		if (!$class.instanceOf(contentProvider, gara.jsface.viewers.ITreeContentProvider)) {
			throw new TypeError("contentProvider is not type of gara.jsface.viewers.ITreeContentProvider");
		}
		this._contentProvider = contentProvider;
	}
});