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

gara.provide("gara.viewers.BaseLabelProvider");

/**
 * @class BaseLabelProvider
 * @namespace gara.viewers
 * @author Thomas Gossmann
 * @implements gara.viewers.IBaseLabelProvider
 */
gara.Class("gara.viewers.BaseLabelProvider", {

	/**
	 * @field
	 * Contains a collection of ILabelProviderListeners.
	 *
	 * @private
	 * @type {gara.viewers.ILabelProviderListener[]}
	 */
	listeners : [],

	$constructor : function () {
		this.listeners = [];
	},

	/**
	 * @method
	 * Adds a ILabelProviderListener to this listeners collection.
	 *
	 * @param {gara.viewers.ILabelProviderListener} listener
	 */
	addListener : function (listener) {
		if (!this.listeners.contains(listener)) {
			this.listeners.push(listener);
		}
	},

//	isLabelProperty : function (element, property) {
//		return true;
//	},

	/**
	 * @method
	 * Removes a ILabelProviderListener from this listeners collection.
	 *
	 * @param {gara.viewers.ILabelProviderListener} listener
	 */
	removeListener : function (listener) {
		this.listener.remove(listener);
	}
});