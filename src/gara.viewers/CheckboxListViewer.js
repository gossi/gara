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

gara.provide("gara.viewers.CheckboxListViewer", "gara.viewers.ListViewer");

//gara.use("gara.viewers.ICheckable");
//gara.use("gara.viewers.ICheckStateListener");
//gara.use("gara.viewers.ICheckStateChangedEvent");
gara.use("gara.viewers.CheckStateChangedEvent");
gara.use("gara.widgets.List");

/**
 * @class CheckboxListViewer
 * @extends gara.viewers.ListViewer
 * @namespace gara.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.viewers.CheckboxListViewer", function () { return {
	$extends : gara.viewers.ListViewer,

	/**
	 * @field
	 *
	 * @private
	 * @type {gara.viewers.ICheckStateListener[]}
	 */
	checkStateListener : [],

	$constructor : function (list) {
		if (!(list instanceof gara.widgets.List)) {
			throw new TypeError("list not instance of gara.widgets.List");
		}
		this.checkStateListener = [];
		this.$super(list);
	},

	newCheckList : gara.$static(function (parent, style) {
		var list = new gara.widgets.List(parent, style | gara.CHECK);
		return new gara.viewers.CheckboxListViewer(list);
	}),

	/**
	 * @method
	 *
	 * @private
	 */
	fireCheckStateChanged : function (event) {
		this.checkStateListener.forEach(function (listener, index, arr) {
			if (listener.checkStateChanged) {
				listener.checkStateChanged(event);
			}
		});
	},

	/**
	 * @methods
	 *
	 * @param {gara.viewers.ICheckStateListener} listener
	 */
	addCheckStateListener : function (listener) {
		if (!this.checkStateListener.contains(listener)) {
			this.checkStateListener.push(listener);
		}
	},

	getChecked : function (element) {
		var item = this.getItemFromElementMap(element);
		if (item !== null) {
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
	getCheckedElements : function () {
		var items = this.list.getItems();
		var checkedItems = [];
		items.forEach(function (item, index, arr) {
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
	getGrayed : function (element) {
		var item = this.getItemFromElementMap(element);
		if (item !== null) {
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
	getGrayedElements : function () {
		var items = this.list.getItems();
		var checkedItems = [];
		items.forEach(function (item, index, arr) {
			if (item.getGrayed()) {
				checkedItems.push(item.getData());
			}
		}, this);
		return checkedItems;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	handleSelect : function (event) {
		this.$super(event);

		if (event.garaDetail && event.garaDetail === gara.CHECK) {
			var item = event.item;
			var data = item.getData();
			if (data !== null) {
				// negated state, because state changes after mouseup and we are in mousedown event
				this.fireCheckStateChanged(new gara.viewers.CheckStateChangedEvent(this, data, !item.getChecked()));
			}
		}
	},

	/**
	 * @methods
	 *
	 * @param {gara.viewers.ICheckStateListener} listener
	 */
	removeCheckStateListener : function (listener){
		this.checkStateListener.remove(listener);
	},

	/**
     * Sets to the given value the checked state for all elements in this viewer.
     *
     * @param {boolean} state <code>true</code> if the element should be checked,
     *  and <code>false</code> if it should be unchecked
     */
    setAllChecked : function (state) {
        var items = this.list.getItems();
		items.forEach(function (item, index, arr) {
			item.setChecked(state);
		}, this);
    },

    /**
     * Sets to the given value the grayed state for all elements in this viewer.
     *
     * @param {boolean} state <code>true</code> if the element should be grayed,
     *  and <code>false</code> if it should be ungrayed
     */
    setAllGrayed : function (state) {
        var items = this.list.getItems();
		items.forEach(function (item, index, arr) {
			item.setGrayed(state);
		}, this);
    },

	setChecked : function (element, checked) {
		var item = this.getItemFromElementMap(element);
		if (item !== null) {
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
    setCheckedElements : function (elements) {
		var items = this.list.getItems();
		items.forEach(function (item, index, arr) {
			var element = item.getData();
			if (element !== null) {
				var check = elements.contains(element);
				// only set if different, to avoid flicker
				if (item.getChecked() !== check) {
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
	setGrayed : function (element, grayed) {
		var item = this.getItemFromElementMap(element);
		if (item !== null) {
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
	setGrayedElements : function (elements) {
		var items = this.list.getItems();
		items.forEach(function (item, index, arr) {
			var element = item.getData();
			if (typeof(element) !== "undefined" && element !== null) {
				var check = elements.contains(element);
				// only set if different, to avoid flicker
				if (item.getGrayed() !== check) {
				    item.setGrayed(check);
				}
			}
		});
	}
};});