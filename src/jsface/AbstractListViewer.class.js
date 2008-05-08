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

	_internalRefresh : function(element) {
		if (element == null || element == this._getRoot()) {
			// store selection
			var storedSelection = this.getControl().getSelection();

			var children = this._getSortedChildren(this._getRoot());
			var items = this.getControl().getItems();

			for (var i = 0; i < children.length; i++) {
				if (typeof(items[i]) != "undefined"
						&& items[i].getData() == children[i]) {
					this._updateItem(items[i], children[i]);
				} else {
					var item = this._createListItem(children[i], gara.jswt.JSWT.DEFAULT, i);
					this._associate(children[i], item);
				}
			}

			// kill items
			for (var i = children.length; i < items.length; i++) {
				if (storedSelection.contains(items[i])) {
					storedSelection.remove(items[i]);
				}

				this.getControl().remove(items[i]);
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