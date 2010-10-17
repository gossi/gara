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

gara.provide("gara.viewers.Viewer");

//gara.use("gara.viewers.ISelectionChangedListener");

/**
 * @class Viewer
 * @author Thomas Gossmann
 * @namespace gara.viewers
 */
gara.Class("gara.viewers.Viewer", {

	/**
	 * @field
	 * Contains a collection of selection changed listeners
	 *
	 * @private
	 * @type {gara.viewers.ISelectionChangedListener[]}
	 */
	selectionChangedListeners : [],


	/**
	 * @constructor
	 */
	$constructor : function () {
		this.selectionChangedListeners = [];
	},

	/**
	 * @method
	 *
	 * @param {gara.viewers.ISelectionChangedListener} listener
	 */
	addSelectionChangedListener : function (listener) {
		if (!this.selectionChangedListeners.contains(listener)) {
			this.selectionChangedListeners.push(listener);
		}
	},

	/**
	 * @method
	 *
	 * @private
	 */
	fireSelectionChanged : function (event) {
		this.selectionChangedListeners.forEach(function (listener) {
			if (listener.selectionChanged) {
				listener.selectionChanged(event);
			}
		});
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
	 * @abstract
	 */
	getInput : function () {},

	/**
	 * Internal hook Method called when the input to this viewer is
     * initially set or subsequently changed.
     * <p>
     * The default implementation does nothing. Subclasses may override
     * this method to do something when a viewer's input is set.
     * A typical use is populate the viewer.
     * </p>
     *
     * @param input the new input of this viewer, or <code>null</code> if none
     * @param oldInput the old input element or <code>null</code> if there
     *   was previously no input
	 */
	inputChange : function (input, oldInput) {},

	/**
	 * @method
	 *
	 * @abstract
	 */
	refresh : function () {},

	/**
	 * @method
	 *
	 * @param {gara.viewers.ISelectionChangedListener} listener
	 */
	removeSelectionChangedListener : function (listener) {
		this.selectionChangedListeners.remove(listener);
	},

	/**
	 * @method
	 *
	 * @abstract
	 */
	setInput : function (input) {}
});