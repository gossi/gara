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

gara.provide("gara.viewers.IBaseLabelProvider");

/**
 * @interface IBaseLabelProvider
 * @namespace gara.viewers
 * @author Thomas Gossmann
 *
 * @summary
 * A label provider maps an element of the viewer's model to an optional image
 * and optional text string used to display the element in the viewer's control.
 *
 * @description
 * <p>
 * A label provider maps an element of the viewer's model to an optional image
 * and optional text string used to display the element in the viewer's control.
 * Certain label providers may allow multiple labels per element. This is an
 * "abstract interface", defining methods common to all label providers, but
 * does not actually define the methods to get the label(s) for an element.
 * This interface should never be directly implemented. Most viewers will take
 * either an ILabelProvider or an ITableLabelProvider.
 * </p>
 */
gara.Class("gara.viewers.IBaseLabelProvider", {

	/**
	 * @method
	 * Returns whether the label would be affected by a change to the given
	 * property of the given element.
	 *
	 * @param {Object} element
	 * @param {String} property
	 * @returns {boolean} <code>true</code> if the label would be affected, and <code>false</code> if it would be unaffected
	 */
	isLabelProperty : function(element, property) {}
});