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

gara.provide("gara.jsface.viewers.ViewerFilter");

/**
 * @class ViewerFilter
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
  */
gara.Class("gara.jsface.viewers.ViewerFilter", {

	/**
	 * @constructor
	 */
	$constructor : function () {
	},

	/**
     * Filters the given elements for the given viewer.
     * The input array is not modified.
     * <p>
     * The default implementation of this method calls
     * <code>select</code> on each element in the array,
     * and returns only those elements for which <code>select</code>
     * returns <code>true</code>.
     * </p>
     * @param {gara.jsface.viewers.Viewer} viewer the viewer
     * @param {object} parent the parent element
     * @param {object[]} elements the elements to filter
     * @return {object[]} the filtered elements
     */
    filter : function (viewer, parent, elements) {
        var out = [];
		elements.forEach(function (elem, index, arr){
			if (this.select(viewer, parent, elem)) {
				out.push(elem);
			}
		}, this);

        return out;
    },

    /**
     * Returns whether this viewer filter would be affected
     * by a change to the given property of the given element.
     * <p>
     * The default implementation of this method returns <code>false</code>.
     * Subclasses should reimplement.
     * </p>
     *
     * @param {object} element the element
     * @param {String} property the property
     * @return <code>true</code> if the filtering would be affected,
     *    and <code>false</code> if it would be unaffected
     */
    isFilterProperty : function (element, property) {
        return false;
    },

    /**
     * Returns whether the given element makes it through this filter.
     *
     * @abstract
     * @param {gara.jsface.viewers.Viewer} viewer the viewer
     * @param {object} parentElement the parent element
     * @param {object} element the element
     * @return {boolean} <code>true</code> if element is included in the
     *   filtered set, and <code>false</code> if excluded
     */
    select : function (viewer, parentElement, element){}
});