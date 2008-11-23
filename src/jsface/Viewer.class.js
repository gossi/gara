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

/**
 * @class Viewer
 * @author Thomas Gossmann
 * @namespace gara.jsface
 */
$class("Viewer", {
	/**
	 * @constructor
	 */
	$constructor : function() {
		this._selectionChangedListeners = [];
	},
	
	addSelectionChangedListener : function(listener) {
		if (!$class.instanceOf(listener, gara.jsface.ISelectionChangedListener)) {
			throw new TypeError("listener not instance of gara.jsface.ISelectionChangedListener");
		}
		
		if (!this._selectionChangedListeners.contains(listener)) {
			this._selectionChangedListeners.push(listener);
		}
	},
	
	_fireSelectionChanged : function(event) {
		this._selectionChangedListeners.forEach(function(listener, index, arr) {
			listener.selectionChanged(event);
		});
	},

	getControl : $abstract(function() {}),

	getInput : $abstract(function() {}),

	/**
	 * Internal hook Method called when the input to this viewer is
     * initially set or subsequently changed.
     * <p>
     * The default implementation does nothing. Subclassers may override 
     * this method to do something when a viewer's input is set.
     * A typical use is populate the viewer.
     * </p>
     * 
     * @param input the new input of this viewer, or <code>null</code> if none
     * @param oldInput the old input element or <code>null</code> if there
     *   was previously no input
	 */
	inputChange : function(input, oldInput) {},

	refresh : $abstract(function() {}),
	
	removeSelectionChangedListener : function(listener) {
		if (!$class.instanceOf(listener, gara.jsface.ISelectionChangedListener)) {
			throw new TypeError("listener not instance of gara.jsface.ISelectionChangedListener");
		}
		
		this._selectionChangedListeners.remove(listener);
	},

	setInput : $abstract(function(input) {})
});