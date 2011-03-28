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

gara.provide("gara.viewers.LabelProvider", "gara.viewers.BaseLabelProvider");

/**
 * @class LabelProvider
 * @namespace gara.viewers
 * @author Thomas Gossmann
 * @extends gara.viewers.BaseLabelProvider
 * @implements gara.viewers.ILabelProvider
 *
 * @summary
 * A label provider implementation which, by default, uses an element's
 * <code>toString</code> value for its text and <code>null</code> for its image.
 *
 * @description
 * A label provider implementation which, by default, uses an element's <code>toString</code>
 * value for its text and <code>null</code> for its image. This class may be used as is, or
 * subclassed to provide richer labels. Subclasses may override any of the
 * following methods:
 * <ul>
 * <li><code>isLabelProperty</code></li>
 * <li><code>getImage</code></li>
 * <li><code>getText</code></li>
 * </ul>
 */
gara.Class("gara.viewers.LabelProvider", function () { return {
	$extends : gara.viewers.BaseLabelProvider,

	/**
	 * @constructor
	 */
	$constructor : function () {},

	getImage : function (element) {
		return null;
	},

	getText : function (element) {
		return "" + element;
	}
};});