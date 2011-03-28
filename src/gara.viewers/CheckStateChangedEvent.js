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

gara.provide("gara.viewers.CheckStateChangedEvent");

/**
 * @class CheckStateChangedEvent
 * @namespace gara.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.viewers.CheckStateChangedEvent", {

	/**
	 * @field
	 * The source originated the event
	 *
	 * @private
	 * @type {gara.viewers.Viewer}
	 */
	source : null,

	/**
	 * @field
	 * The element on which the event occured
	 *
	 * @private
	 * @type {Object}
	 */
	element : null,

	/**
	 * @field
	 * The elements check state
	 *
	 * @private
	 * @type {boolean} true for checked
	 */
	state : null,

	/**
	 * @constructor
	 *
	 * @param {gara.viewers.Viewer} source the source originating the event
	 * @param {Object} element the element on which the event occurs
	 * @param {boolean} state true for checked and false for non-checked state
	 */
	$constructor : function(source, element, state) {
		this.source = source;
		this.element = element;
		this.state = state;
	},

	/**
	 * @method
	 * Returns the element on which the event occurs.
	 *
	 * @return {Object} the element
	 */
	getElement : function() {
		return this.element;
	},

	/**
	 * @method
	 * Returns the source that originates this event.
	 *
	 * @return {gara.viewers.Viewer} the source
	 */
	getSource : function() {
		return this.source;
	},

	/**
	 * @method
	 * Returns the elements state.
	 *
	 * @return {boolean} true for checked and false for non-checked state
	 */
	getState : function() {
		return this.state;
	}
});