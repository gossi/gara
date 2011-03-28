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

gara.provide("gara.viewers.AbstractTreeViewer", "gara.viewers.ColumnViewer");

/**
 * @class AbstractTreeViewer
 * @extends gara.viewers.ColumnViewer
 * @namespace gara.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.viewers.AbstractTreeViewer", function () { return {
	$extends : gara.viewers.ColumnViewer,

	/**
	 * @constructor
	 *
	 */
	$constructor : function () {
		this.$super();
	},

	/**
	 * @method
	 *
	 * @private
	 */
	createTreeItem : function (parent, element, index) {
		var item = this.newItem(parent, gara.NULL, index);
		this.updateItem(item, element);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	disassociate : function (item) {
		this.$super(item);
		this.disassociateChildren(item);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	disassociateChildren : function (item) {
		var items = this.getChildren(item);
		for (var i = 0; i < items.length; i++) {
			if (items[i].getData() !== null) {
				this.disassociate(items[i]);
			}
		}
	},

	/**
	 * @method
	 *
	 * @private
	 */
	doGetColumnCount : function () {
		return 0;
	},

	/**
	 * @method
	 *
	 * @abstract
	 * @private
	 */
	doGetSelection : function () {},

	/* Method declared on StructuredViewer. */
	/**
	 * @method
	 *
	 * @private
	 */
	doFindInputItem : function (element) {
		var root = this.getRoot();
		if (root === null) {
			return null;
		}

		if (root === element) {
			return this.getControl();
		}
		return null;
	},

	/* Method declared on StructuredViewer. */
	/**
	 * @method
	 *
	 * @private
	 */
	doFindItem : function (element) {
		var root = getRoot(), items, i, o;
		if (root === null) {
			return null;
		}

		items = this.getChildren(this.getControl());
		if (items !== null) {
			for (i = 0; i < items.length; i++) {
				o = this.internalFindItem(items[i], element);
				if (o !== null) {
					return o;
				}
			}
		}
		return null;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	doUpdateItem : function (item, element) {
		var viewerRowFromItem, columnCount, column, columnViewer, cellToUpdate;
		if (item.isDisposed()) {
			this.unmapElement(element, item);
			return;
		}

		viewerRowFromItem = this.getViewerRowFromItem(item);
		columnCount = this.doGetColumnCount();
		if (columnCount === 0){columnCount = 1;}

		for (column = 0; column < columnCount; column++) {
			columnViewer = this.getViewerColumn(column);
			cellToUpdate = this.updateCell(viewerRowFromItem, column, element);

			columnViewer.refresh(cellToUpdate);

			if (item.isDisposed()) {
				this.unmapElement(element, item);
				return;
			}
		}

		this.associate(element, item);
	},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	getChildren : function () {},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	getControl : function () {},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	getExpanded : function (item) {},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	getLabelProviderText : function (labelProvider, element) {
		var text = null;
		if (labelProvider.getText) {
			text = labelProvider.getText(element);
		}
		if (text === null) {
			text = "";
		}

		return text;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	getRawChildren : function (parent) {
		var cp = this.getContentProvider(), result;
		if (parent === this.getRoot()) {
			return this.$super(parent);
		} else if (cp.getChildren) {
			result = cp.getChildren(parent);
			if (result !== null) {
				return result;
			}
		}

		return [];
	},

	/**
	 * @method
	 *
	 * @private
	 */
	getSelectionFromWidget : function () {
		var items = this.doGetSelection(), list = [], item, i, e;
		for (i = 0; i < items.length; i++) {
			item = items[i];
			e = item.getData();
			if (e !== null) {
				list.push(e);
			}
		}
		return list;
	},

	inputChanged : function (input, oldInput) {
		this.treeRemoveAll();
		this.internalRefresh();
	},

	/**
	 * @method
	 *
	 * @private
	 */
	internalFindItem : function (parent, element) {
		var data = parent.getData(), items, i, w;
		if (data !== null) {
			if (data === element) {
				return parent;
			}
		}

		// recurse over children
		items = this.getChildren(parent);
		for (i = 0; i < items.length; i++) {
			w = this.internalFindItem(items[i], element);
			if (w !== null) {
				return w;
			}
		}
		return null;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	internalRefresh : function (element, updateLabels) {
		// save selected elements
		var selected = [], selection = this.getControl().getSelection(), i, items;
		for (i = 0; i < selection.length; ++i) {
			selected.push(selection[i].getData());
		}

		if (typeof(element) === "undefined" || element === null || element === this.getRoot()) {
			this.internalRefreshItems(this.getControl(), this.getRoot(), updateLabels);
		} else {
			items = this.findItems(element);
			if (items.length !== 0) {
				for (i = 0; i < items.length; i++) {
					this.internalRefreshItems(items[i], element, updateLabels);
				}
			}
		}

		// restore selection
		selection = [];
		selected.forEach(function (elem) {
			var item = this.getItemFromElementMap(elem);
			if (item !== null) {
				selection.push(item);
			}
		}, this);
		this.getControl().update();
		this.getControl().setSelection(selection);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	internalRefreshItems : function (widget, element, updateLabels) {
		var children, i, item, data;
		
		this.updateChildren(widget, element, updateLabels);
		children = this.getChildren(widget);
		if (children !== null) {
			for (i = 0; i < children.length; i++) {
				item = children[i];
				data = item.getData();
				if (data !== null) {
					this.internalRefreshItems(item, data, updateLabels);
				}
			}
		}
	},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	newItem : function (parent, style, index) {},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	setExpanded : function (item, expanded) {},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	treeRemoveAll : function () {},

	/**
	 * @method
	 *
	 * @private
	 */
	updateChildren : function (widget, parent, updateLabels) {
		var elementChildren = this.getSortedChildren(parent),
			tree = this.getControl(),
			items = this.getChildren(widget),
			expanded = [], i, element, min, numItemsToDispose, children, data,
			item, oldElement, newElement;

		// save the expanded elements
		for (i = 0; i < items.length; ++i) {
			if (this.getExpanded(items[i])) {
				element = items[i].getData();
				if (element !== null) {
					expanded.push(element);
				}
			}
		}

		min = Math.min(elementChildren.length, items.length);
		// dispose of surplus items, optimizing for the case where elements have
		// been deleted but not reordered, or all elements have been removed.
		numItemsToDispose = items.length - min;
		if (numItemsToDispose > 0) {
			children = [];
			for (i = 0; i < elementChildren.length; i++) {
				children.push(elementChildren[i]);
			}

			i = 0;
			while (numItemsToDispose > 0 && i < items.length) {
				data = items[i].getData();
				if (data === null || items.length - i <= numItemsToDispose || !children.contains(data)) {
					if (data !== null) {
						this.disassociate(items[i]);
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
		for (i = 0; i < min; ++i) {
			item = items[i];
			oldElement = item.getData();
			if (oldElement !== null) {
				newElement = elementChildren[i];
				if (newElement === oldElement) {
					// update the data to be the new element, since
					// although the elements
					// may be equal, they may still have different labels
					// or children
					data = item.getData();
					if (data !== null) {
						this.unmapElement(data, item);
					}
					item.setData(newElement);
					this.mapElement(newElement, item);
				} else {
					this.disassociate(item);
					// Clear the text and image to force a label update
					item.setImage(null);
					item.setText("");
				}
			}
		}

		for (i = 0; i < min; ++i) {
			item = items[i];
			newElement = elementChildren[i];
			if (item.getData() === null) {
				// old and new elements are not equal
				this.associate(newElement, item);
				this.updateItem(item, newElement);
			} else {
				// old and new elements are equal
				if (updateLabels) {
					this.updateItem(item, newElement);
				}
			}
		}

		// Restore expanded state for items that changed position.
		for (i = 0; i < min; ++i) {
			if (expanded.contains(items[i].getData())) {
				this.setExpanded(items[i], true);
			} else {
				this.setExpanded(items[i], false);
			}
		}

		// add any remaining elements
		if (min < elementChildren.length) {
			for (i = min; i < elementChildren.length; ++i) {
				this.createTreeItem(widget, elementChildren[i], i);
			}

			// Need to restore expanded state in a separate pass
			// because createTreeItem does not return the new item.
			// Avoid doing this unless needed.
			if (expanded.length > 0) {
				// get the items again, to include the new items
				items = this.getChildren(widget);
				for (i = min; i < elementChildren.length; ++i) {
					// Restore expanded state for items that changed position.
					// Only need to call setExpanded if element was expanded
					if (expanded.contains(elementChildren[i])) {
						this.setExpanded(items[i], true);
					}
				}
			}
		}
	},

	/**
	 * @method
	 *
	 * @param {gara.viewers.ITreeContentProvider} contentProvider
	 */
	setContentProvider : function (contentProvider) {
		this.contentProvider = contentProvider;
	}
};});