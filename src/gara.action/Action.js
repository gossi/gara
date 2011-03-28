/*

		gara - Javascript Toolkit
	===========================================================================

		Copyright (c) 2007 Thomas Gossmann

		Homepage:
			http://garathekit.org

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

"use strict";

gara.provide("gara.action.Action");

/**
 * A basic implementation of IAction. It handles the listener management. You
 * should subclass this class and add those methods on your own:
 * <ul>
 *  <li>getText</li>
 *  <li>getImage</li>
 *  <li>run</li>
 * </ul>
 * You may use the <code>notifyActionChangedListener()</code> from your own
 * implementation to tell listeners about changes.
 * 
 * @class gara.action.Action
 */
gara.Class("gara.action.Action", /** @lends gara.action.Action# */ {
	/**
	 * Contains a collection of action changed listeners, that will be notified
	 * when this action changes.
	 *
	 * @private
	 * @type {gara.action.ActionChangedListener}
	 */
	listeners : [],

	/**
	 * Creates a new Action.
	 * @constructs
	 */
	$constructor : function () {
		this.listeners = [];
	},

	/**
	 * Adds an <code>ActionChangedListener</code> to the listeners' collection.
	 *
	 * @param {gara.action.ActionChangedListener} listener the new listener
	 * @returns {void}
	 */
	addActionChangedListener : function (listener) {
		if (!this.listeners.contains(listener)) {
			this.listeners.push(listener);
		}
	},
	
	/**
	 * Disposes this action
	 */
	dispose : function () {
		this.listeners = null;
	},

	/**
	 * Notifies all listener about changes
	 *
	 * @returns {void}
	 */
	notifyActionChangedListener : function () {
		this.listeners.forEach(function (listener) {
			if (listener.actionChanged) {
				listener.actionChanged(this);
			}
		}, this);
	},

	/**
	 * Removes an <code>ActionChangedListener</code> from the listeners' collection.
	 * 
	 * @param {gara.action.ActionChangedListener} listener the new listener
	 * @returns {void}
	 */
	removeActionChangedListener : function (listener) {
		this.listeners.remove(listener);
	}
});
