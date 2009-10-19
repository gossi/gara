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
 * @class CheckboxListViewer
 * @extends gara.jsface.viewers.ListViewer
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
$class("CheckboxListViewer", {
	$extends : gara.jsface.viewers.ListViewer,

	$implements : [gara.jsface.viewers.ICheckable],

	$constructor : function(list) {
		if (!$class.instanceOf(list, gara.jswt.widgets.List)) {
			throw new TypeError("list not instance of gara.jswt.widgets.List");
		}
		this._checkStateListener = [];
		this.$base(list);
	},

	newCheckList : $static(function(parent, style) {
		var list = new gara.jswt.widgets.List(parent, style | gara.jswt.JSWT.CHECK);
		return new gara.jsface.viewers.CheckboxListViewer(list);
	}),

	_fireCheckStateChanged : function(event) {
		this._checkStateListener.forEach(function(listener, index, arr) {
			listener.checkStateChanged(event);
		});
	},

	addCheckStateListener : function(listener) {
		if (!$class.instanceOf(listener, gara.jsface.viewers.ICheckStateListener)) {
			throw new TypeError("listener not instance of gara.jsface.viewers.ICheckStateListener");
		}

		if (!this._checkStateListener.contains(listener)) {
			this._checkStateListener.push(listener);
		}
	},

	getChecked : function(element) {
		var item = this._getItemFromElementMap(element);
		if (item != null) {
			return item.getChecked();
		}
		return null;
	},

	/**
     * Returns a list of elements corresponding to checked table items in this
     * viewer.
     * <p>
     * This method is typically used when preserving the interesting
     * state of a viewer; <code>setCheckedElements</code> is used during the restore.
     * </p>
     *
     * @return {Array} the array of checked elements
     */
	getCheckedElements : function() {
		var items = this._list.getItems();
		var checkedItems = [];
		items.forEach(function(item, index, arr) {
			if (item.getChecked()) {
				checkedItems.push(item.getData());
			}
		}, this);
		return checkedItems;
	},

	/**
     * Returns the grayed state of the given element.
     *
     * @param {object} element the element
     * @return {boolean} <code>true</code> if the element is grayed,
     *   and <code>false</code> if not grayed
     */
	getGrayed : function(element) {
		var item = this._getItemFromElementMap(element);
		if (item != null) {
			return item.getGrayed();
		}
		return null;
	},

	/**
     * Returns a list of elements corresponding to grayed nodes in this
     * viewer.
     * <p>
     * This method is typically used when preserving the interesting
     * state of a viewer; <code>setGrayedElements</code> is used during the restore.
     * </p>
     *
     * @return {Array} the array of grayed elements
     */
	getGrayedElements : function() {
		var items = this._list.getItems();
		var checkedItems = [];
		items.forEach(function(item, index, arr) {
			if (item.getGrayed()) {
				checkedItems.push(item.getData());
			}
		}, this);
		return checkedItems;
	},

	_handleSelect : function(event) {
		this.$base(event);

		if (event.garaDetail && event.garaDetail == gara.jswt.JSWT.CHECK) {
			var item = event.item;
			var data = item.getData();
			if (data != null) {
				// negated state, because state changes after mouseup and we are in mousedown event
				this._fireCheckStateChanged(new gara.jsface.viewers.CheckStateChangedEvent(this, data, !item.getChecked()));
			}
		}
	},

	removeCheckStateListener : function(listener){
		if (!$class.instanceOf(listener, gara.jsface.viewers.ICheckStateListener)) {
			throw new TypeError("listener not instance of gara.jsface.viewers.ICheckStateListener");
		}

		this._checkStateListener.remove(listener);
	},

	/**
     * Sets to the given value the checked state for all elements in this viewer.
     *
     * @param {boolean} state <code>true</code> if the element should be checked,
     *  and <code>false</code> if it should be unchecked
     */
    setAllChecked : function(state) {
        var items = this._list.getItems();
		items.forEach(function(item, index, arr) {
			item.setChecked(state);
		}, this);
    },

    /**
     * Sets to the given value the grayed state for all elements in this viewer.
     *
     * @param {boolean} state <code>true</code> if the element should be grayed,
     *  and <code>false</code> if it should be ungrayed
     */
    setAllGrayed : function(state) {
        var items = this._list.getItems();
		items.forEach(function(item, index, arr) {
			item.setGrayed(state);
		}, this);
    },

	setChecked : function(element, checked) {
		var item = this._getItemFromElementMap(element);
		if (item != null) {
			item.setChecked(checked);
			return true;
		}
		return false;
	},

	/**
     * Sets which nodes are checked in this viewer.
     * The given list contains the elements that are to be checked;
     * all other nodes are to be unchecked.
     * <p>
     * This method is typically used when restoring the interesting
     * state of a viewer captured by an earlier call to <code>getCheckedElements</code>.
     * </p>
     *
     * @param {Array} elements the list of checked elements (element type: <code>Object</code>)
     */
    setCheckedElements : function(elements) {
		var items = this._list.getItems();
		items.forEach(function(item, index, arr) {
			var element = item.getData();
			if (element != null) {
				var check = elements.contains(element);
				// only set if different, to avoid flicker
				if (item.getChecked() != check) {
				    item.setChecked(check);
				}
			}
		});
	},

	/**
     * Sets the grayed state for the given element in this viewer.
     *
     * @param {object} element the element
     * @param {boolean} state <code>true</code> if the item should be grayed,
     *  and <code>false</code> if it should be ungrayed
     * @return {boolean} <code>true</code> if the element is visible and the gray
     *  state could be set, and <code>false</code> otherwise
     */
	setGrayed : function(element, grayed) {
		var item = this._getItemFromElementMap(element);
		if (item != null) {
			item.setGrayed(grayed);
			return true;
		}
		return false;
	},

	/**
     * Sets which nodes are grayed in this viewer.
     * The given list contains the elements that are to be grayed;
     * all other nodes are to be ungrayed.
     * <p>
     * This method is typically used when restoring the interesting
     * state of a viewer captured by an earlier call to <code>getGrayedElements</code>.
     * </p>
     *
     * @param elements the array of grayed elements
     *
     * @see #getGrayedElements
     */
	setGrayedElements : function(elements) {
		var items = this._list.getItems();
		items.forEach(function(item, index, arr) {
			var element = item.getData();
			if (element != null) {
				var check = elements.contains(element);
				// only set if different, to avoid flicker
				if (item.getGrayed() != check) {
				    item.setGrayed(check);
				}
			}
		});
	},
});