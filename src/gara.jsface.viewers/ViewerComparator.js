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

gara.provide("gara.jsface.viewers.ViewerComparator");

/**
 * @class ViewerComparator
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.jsface.viewers.ViewerComparator", {

	$constructor : function () {
	},

	/**
     * Returns the category of the given element. The category is a
     * number used to allocate elements to bins; the bins are arranged
     * in ascending numeric order. The elements within a bin are arranged
     * via a second level sort criterion.
     * <p>
     * The default implementation of this framework method returns
     * <code>0</code>. Subclasses may reimplement this method to provide
     * non-trivial categorization.
     * </p>
     *
     * @param {object} element the element
     * @return the category
     */
	category : function (element) {
        return 0;
	},

	/**
     * Returns a negative, zero, or positive number depending on whether
     * the first element is less than, equal to, or greater than
     * the second element.
     * <p>
     * The default implementation of this method is based on
     * comparing the elements' categories as computed by the <code>category</code>
     * framework method. Elements within the same category are further
     * subjected to a case insensitive compare of their label strings, either
     * as computed by the content viewer's label provider, or their
     * <code>toString</code> values in other cases. Subclasses may override.
     * </p>
     *
     * @param {gara.jsface.viewers.Viewer} viewer the viewer
     * @param {object} e1 the first element
     * @param {object} e2 the second element
     * @return a negative number if the first element is less  than the
     *  second element; the value <code>0</code> if the first element is
     *  equal to the second element; and a positive number if the first
     *  element is greater than the second element
     */
    compare : function (e1, e2) {
		var a = e1.toString().toLowerCase(),
			b = e2.toString().toLowerCase();

		if (a < b) {
			return -1;
		} else if (a > b) {
			return 1;
		}

		return 0;
	},

	/**
     * Returns whether this viewer sorter would be affected
     * by a change to the given property of the given element.
     * <p>
     * The default implementation of this method returns <code>false</code>.
     * Subclasses may reimplement.
     * </p>
     *
     * @param {object} element the element
     * @param {string} property the property
     * @return <code>true</code> if the sorting would be affected,
     *    and <code>false</code> if it would be unaffected
     */
    isSorterProperty : function (element, property) {
        return false;
    },

	/**
     * Sorts the given elements in-place, modifying the given array.
     * <p>
     * The default implementation of this method uses the
     * Array#sort algorithm on the given array,
     * calling <code>compare</code> to compare elements.
     * </p>
     * <p>
     * Subclasses may reimplement this method to provide a more optimized implementation.
     * </p>
     *
     * @param {gara.jsface.viewers.Viewer} viewer the viewer
     * @param {object[]} elements the elements to sort
     */
    sort : function (viewer, elements) {
		return elements.sort(this.compare);
    }
});