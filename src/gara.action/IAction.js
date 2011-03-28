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

gara.provide("gara.action.IAction");

/**
 * Action Interface
 * 
 * @interface gara.action.IAction
 * @name gara.action.IAction
 * @class
 * 
 * TODO: Remove class in favor of interface
 */
gara.Class("gara.action.IAction", /** @lends gara.action.IAction# */ {
	
	/**
	 * Adds an action change listener to this action.
	 * 
	 * @description
	 * Adds an action change listener to this action. Has no effect if an identical listener 
	 * is already registered. 
	 * 
	 * @param {gara.action.ActionChangedListener} listener an action changed listener
	 */
	addActionChangedListener : function (listener) {},
	
	/**
	 * Returns a unique identifier for this action, or <code>null</code> if it has
	 * none.
	 *
	 * @returns {String} the action id, or <code>null</code> if none
	 */
	getId : function () {},
	
	/**
	 * Returns the text for this action.
	 * 
	 * @returns {String} the text
	 */
	getText : function () {},
	
	/**
	 * Returns the image for this action.
	 * 
	 * @returns {Image} the image
	 */
	getImage : function () {},
	
	/**
	 * Returns whether this action is enabled.
	 * 
	 * @returns {boolean} <code>true</code> if enabled, and <code>false</code> if disabled
	 */
	getEnabled : function () {},
	
	/**
	 * Removes the given listener from this action.
	 * 
	 * @description
	 * Removes the given listener from this action. Has no effect if an identical listener 
	 * is not registered. 
	 * 
	 * @param {gara.action.ActionChangedListener} listener an action changed listener
	 */
	removeActionChangedListener : function (listener) {},
	
	/**
	 * Runs this action. Each action implementation must define the steps needed to carry out 
	 * this action. The default implementation of this method in Action does nothing. 
	 */
	run : function () {}
});
