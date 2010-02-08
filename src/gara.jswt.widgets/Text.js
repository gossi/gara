/*	$Id: List.class.js 181 2009-08-02 20:51:16Z tgossmann $

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

gara.provide("gara.jswt.widgets.Text");

gara.use("gara.jswt.events.ModifyListener");
gara.use("gara.jswt.events.SelectionListener");
gara.use("gara.jswt.widgets.Composite");

gara.require("gara.jswt.JSWT");
gara.require("gara.jswt.widgets.Scrollable");


/**
 * @summary
 * gara Text Widget
 *
 * @description
 * long description for the Button Widget...
 *
 * @class Text
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Control
 */
gara.Class("gara.jswt.widgets.Text", {
	$extends : gara.jswt.widgets.Scrollable,

	/**
	 * @constructor
	 * Constructor
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style The style for the list
	 */
	$constructor : function(parent, style) {
		// flags
		this._multi = (style & gara.jswt.JSWT.MULTI) == gara.jswt.JSWT.MULTI;

		// listener
		this._modifyListener = [];
		this._selectionListener = [];

		this.$base(parent, style || gara.jswt.JSWT.SINGLE);
	},

	/**
	 * @method
	 * Adds the listener to the collection of listeners who will be notified when the receiver's
	 * text is modified, by sending it one of the messages defined in the <code>ModifyListener</code> interface.
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.ModifyListener} listener the listener which should be notified
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	addModifyListener : function(listener) {
		this.checkWidget();
		if (!gara.instanceOf(listener, gara.jswt.events.ModifyListener)) {
			throw new TypeError("listener is not instance of gara.jswt.events.ModifyListener");
		}

		this._modifyListener.push(listener);
		return this;
	},

	/**
	 * @method
	 * Adds a selection listener on the list
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.SelectionListener} listener the listener which should be notified
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	addSelectionListener : function(listener) {
		this.checkWidget();
		if (!gara.instanceOf(listener, gara.jswt.events.SelectionListener)) {
			throw new TypeError("listener is not instance of gara.jswt.events.SelectionListener");
		}

		this._selectionListener.push(listener);
		return this;
	},

	/**
	 * @method
	 * Appends a string.
	 * The new text is appended to the text at the end of the widget.
	 *
	 * @author Thomas Gossmann
	 * @param {String} string the string to be appended
	 * @return {void}
	 */
	append : function(string) {
		this.handle.value += string;
	},

	getSelection : function() {
		return this._selected;
	},

	getText : function() {
		return this.handle.value;
	},

	_createWidget : function() {
		this.$base(this._multi ? "textarea" : "input");

		this.handle.readOnly = (this._style & gara.jswt.JSWT.READ_ONLY) == gara.jswt.JSWT.READ_ONLY;
		this.handle.setAttribute("type", (this._style & gara.jswt.JSWT.PASSWORD) == gara.jswt.JSWT.PASSWORD ? "password" : "text");
		this.handle.setAttribute("role", "textbox");
		this.handle.setAttribute("aria-disabled", !this._enabled);
		this.handle.setAttribute("aria-multiline", (this._style & gara.jswt.JSWT.SINGLE) != gara.jswt.JSWT.SINGLE);
		this.handle.setAttribute("aria-readonly", this.handle.readOnly);

		// css
		this.addClass(this._multi ? "jsWTMultiText" : ((this._style & gara.jswt.JSWT.PASSWORD) == gara.jswt.JSWT.PASSWORD ? "jsWTPassword" : "jsWTText"));

		// listeners
//		this.addListener("mousedown", this);
//		this.addListener("mouseup", this);
	},

	dispose : function() {
		this.$base();

		delete this.handle;
	},

	/**
	 * @method
	 * Handles events on the list. Implements DOMEvent Interface by the W3c.
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {Event} e event the users triggers
	 * @return {void}
	 */
	handleEvent : function(e) {
		this.checkWidget();

		if (!this._enabled) {
			return;
		}

		// special events for the list
		e.widget = this;
		this._event = e;

		this._handleMouseEvents(e);
		if (this._menu != null && this._menu.isVisible()) {
			this._menu.handleEvent(e);
		} else {
			this._handleKeyEvents(e);
			this._handleContextMenu(e);
		}

		this.$base(e);

		e.stopPropagation();
		/* in case of ie6, it is necessary to return false while the type of
		 * the event is "contextmenu" and the menu isn't hidden in ie6
		 */
		return false;
	},

	_handleMouseEvents : function(e) {
		switch (e.type) {

		}
	},

	_handleKeyEvents : function(e) {
		this._notifyModifyListener();
		switch (e.type) {

		}
	},

	/**
	 * @method
	 * Notifies modify listener
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_notifyModifyListener : function() {
		this._modifyListener.forEach(function(listener) {
			listener.modifyText(this._event);
		}, this);
	},

	/**
	 * @method
	 * Notifies selection listener about the changed selection within the List
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_notifySelectionListener : function() {
		this._selectionListener.forEach(function(listener) {
			listener.widgetSelected(this._event);
		}, this);
	},

	/**
	 * @method
	 * Register listeners for this widget. Implementation for gara.jswt.widgets.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_registerListener : function(eventType, listener) {
		gara.EventManager.addListener(this.handle, eventType, listener);
	},

	/**
	 * @method
	 * Removes the listener from the collection of listeners who will be notified when
	 * the <code>Text</code>'s text is modified.
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.ModifyListener} listener the listener which should no longer be notified
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	removeSelectionListener : function(listener) {
		this.checkWidget();
		if (!gara.instanceOf(listener, gara.jswt.events.ModifyListener)) {
			throw new TypeError("listener is not instance of gara.jswt.events.ModifyListener");
		}

		if (this._modifyListener.contains(listener)) {
			this._modifyListener.remove(listener);
		}
		return this;
	},

	/**
	 * @method
	 * Removes a selection listener from this list
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.SelectionListener} listener the listener which should no longer be notified
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	removeSelectionListener : function(listener) {
		this.checkWidget();
		if (!gara.instanceOf(listener, gara.jswt.events.SelectionListener)) {
			throw new TypeError("listener is not instance of gara.jswt.events.SelectionListener");
		}

		if (this._selectionListener.contains(listener)) {
			this._selectionListener.remove(listener);
		}
		return this;
	},

	/**
	 * @method
	 * Sets the selection of the <code>Button</code>
	 *
	 * @author Thomas Gossmann
	 * @param {boolean} selected new selected state
	 * @return {void}
	 */
	setSelection : function(selected) {
		this.checkWidget();

		this._notifySelectionListener();

		return this;
	},

	setText : function(text) {
		this.handle.value = text;
		return this;
	},

	/**
	 * @method
	 * Unregister listeners for this widget. Implementation for gara.jswt.widgets.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_unregisterListener : function(eventType, listener) {
		gara.EventManager.removeListener(this.handle, eventType, listener);
	},

	/**
	 * @method
	 * Updates the <code>Text</code>
	 *
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	update : function() {
		this.checkWidget();

		// setting measurements
//		this.handle.style.width = this._width != null ? (this._width - parseInt(gara.Utils.getStyle(this.handle, "padding-left")) - parseInt(gara.Utils.getStyle(this.handle, "padding-right")) - parseInt(gara.Utils.getStyle(this.handle, "border-left-width")) - parseInt(gara.Utils.getStyle(this.handle, "border-right-width"))) + "px" : "auto";
//		this.handle.style.height = this._height != null ? (this._height - parseInt(gara.Utils.getStyle(this.handle, "padding-top")) - parseInt(gara.Utils.getStyle(this.handle, "padding-bottom")) - parseInt(gara.Utils.getStyle(this.handle, "border-top-width")) - parseInt(gara.Utils.getStyle(this.handle, "border-bottom-width"))) + "px" : "auto";
	}
});