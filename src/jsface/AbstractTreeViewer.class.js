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
 * @extends gara.jsface.ColumnViewer
 * @namespace gara.jsface
 * @author Thomas Gossmann
 */
$class("AbstractTreeViewer", {
	$extends : gara.jsface.ColumnViewer,

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
	
	_doGetColumnCount : function() {
		return 0;
	},

	
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
		if (columnCount == 0) // If no columns are created then fake one
			columnCount = 1;

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
		} else if ($class.instanceOf(cp, gara.jsface.ITreeContentProvider)) {
			var result = cp.getChildren(parent);
			if (result != null) {
				return result;
			}
		}
		
		return [];
	},

	inputChanged : function(input, oldInput) {
		this._treeRemoveAll();

		var children = this._getSortedChildren(this._getRoot());

		for (var i = 0; i < children.length; ++i) {
			var el = children[i];
			this._createTreeItem(this.getControl(), el, i);
		}

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

					}
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
		// Make sure setExpanded is called after updatePlus, since
		// setExpanded(false) fails if item has no children.
		// Need to call setExpanded for both expanded and unexpanded
		// cases since the expanded state can change either way.
		// This needs to be done in a second loop, see bug 148025.
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
					// Make sure setExpanded is called after updatePlus (called
					// in createTreeItem), since
					// setExpanded(false) fails if item has no children.
					// Only need to call setExpanded if element was expanded
					// since new items are initially unexpanded.
					if (expanded.contains(elementChildren[i])) {
						this._setExpanded(items[i], true);
					}
				}
			}
		}
		
		
		//this._associate(element, widget);
	},

	setContentProvider : function(contentProvider) {
		if (!$class.instanceOf(contentProvider, gara.jsface.ITreeContentProvider)) {
			throw new TypeError("contentProvider is not type of gara.jsface.ITreeContentProvider");
		}
		this._contentProvider = contentProvider;
	}
});