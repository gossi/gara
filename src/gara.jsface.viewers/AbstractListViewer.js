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

gara.provide("gara.jsface.viewers.AbstractListViewer", "gara.jsface.viewers.StructuredViewer");

gara.use("gara.jswt.JSWT");

/**
 * @class AbstractListViewer
 * @extends gara.jsface.StructuredViewer
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.jsface.viewers.AbstractListViewer", function () { return {
	$extends : gara.jsface.viewers.StructuredViewer,

	/**
	 * @field
	 *
	 * @private
	 * @type {}
	 */
	storedSelection : [],

	/**
	 * @constructor
	 *
	 */
	$constructor : function () {
		this.storedSelection = [];
	},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	createListItem : function (element, style, index) {},

	/* Method declared on StructuredViewer. */
	doFindInputItem : function (element) {
		// compare with root
		var root = this.getRoot();
		if (root === null) {
			return null;
		}

		if (root === element) {
			return this.getControl();
		}
		return null;
	},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	doGetSelection : function () {},

	/**
	 * @method
	 *
	 * @private
	 */
	doUpdateItem : function (item, element) {
		if (item.isDisposed()) {
			this.unmapElement(element, item);
			return;
		}

		item.setText(this.getLabelProviderText(this.getLabelProvider(), element));
		if (this.getLabelProvider().getImage) {
			item.setImage(this.getLabelProvider().getImage(element));
		}

		this.associate(element, item);
	},

	/**
	 * @method
	 *
	 * @abstract
	 */
	getControl : function () {},

	/**
	 * @method
	 *
	 * @private
	 */
	getLabelProviderText : function (labelProvider, element) {
		var text = "";
		if (labelProvider.getText) {
			text = labelProvider.getText(element);
		}

		return text;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	getSelectionFromWidget : function () {
		var items = this.doGetSelection(),
			list = [], i, item, e;
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
		this.listRemoveAll();
		this.getControl().setSelection([]);

		this.internalRefresh();
	},

	/**
	 * @method
	 *
	 * @private
	 */
	internalRefresh : function (element, updateLabels) {
		var selected, selection, elementChildren, items, itemCount, min, i, numItemsToDispose,
			children, data, item, oldElement, newElement;

		if (typeof(element) === "undefined" || element === null || element === this.getRoot()) {
			// store selection
			selected = [];
			selection = this.doGetSelection();
			for (i = 0; i < selection.length; ++i) {
				selected.push(selection[i].getData());
			}

			elementChildren = this.getSortedChildren(this.getRoot());
			items = this.getControl().getItems();
			itemCount = items.length;
			min = Math.min(elementChildren.length, items.length);

			// dispose of items, optimizing for the case where elements have
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
						// or elementChildren
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

			// add any remaining elements
			if (min < elementChildren.length) {
				for (i = min; i < elementChildren.length; ++i) {
					//this.createListItem(widget, elementChildren[i], i);
					item = this.createListItem(elementChildren[i], gara.jswt.JSWT.DEFAULT, i);
					this.associate(elementChildren[i], item);
				}
			}

			// restore selection
			selection = [];
			selected.forEach(function (elem) {
				var item = this.getItemFromElementMap(elem);
				if (item !== null && !item.isDisposed()) {
					selection.push(item);
				}
			}, this);
			this.getControl().update();
			this.getControl().setSelection(selection);
		} else {
			item = this.getItemFromElementMap(element);
			if (item !== null) {
				this.updateItem(item, element);
			}
			this.getControl().update();
		}
	},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	listRemoveAll : function () {},

	/**
	 * @method
	 *
	 * @private
	 * @abstract
	 */
	listSetItems : function () {}
};});