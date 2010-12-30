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

gara.provide("gara.widgets.Text", "gara.widgets.Scrollable");

/**
 * gara Text Widget
 *
 * @description
 * long description for the Button Widget...
 *
 * @class gara.widgets.Text
 * @extends gara.widgets.Scrollable
 */
gara.Class("gara.widgets.Text", function() { return /** @lends gara.widgets.Text# */ {
	$extends : gara.widgets.Scrollable,

	/**
	 * Multi distinguishes wether this is a single or multi line input.
	 *
	 * @private
	 * @type {boolean}
	 */
	multi : false,

	/**
	 * Contains a collection of listeners, that will be notified, when the
	 * <code>Text</code> is modified.
	 *
	 * @private
	 * @type {gara.events.ModifyListener[]}
	 */
	modifyListeners : [],

	/**
	 * Contains a collection of listeners, that will be notified, when the
	 * selection changes.
	 *
	 * @private
	 * @type {gara.events.SelectionListener[]}
	 */
	selectionListeners : [],

	/**
	 * Creates a new Text.
	 * 
	 * @constructs
	 * @extends gara.widgets.Scrollable
	 * 
	 * @param {gara.widgets.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style The style for the list
	 */
	$constructor : function (parent, style) {
		// flags
		this.multi = (style & gara.MULTI) === gara.MULTI;
		this.lastValue = "";

		// listener
		this.modifyListeners = [];
		this.selectionListeners = [];

		this.$super(parent, style || gara.SINGLE);
	},

	/**
	 * Adds the listener to the collection of listeners who will be notified when the receiver's
	 * text is modified, by sending it one of the messages defined in the <code>ModifyListener</code> interface.
	 *
	 * @param {gara.events.ModifyListener} listener the listener which should be notified
	 * @returns {gara.widgets.Text} this
	 */
	addModifyListener : function (listener) {
		this.checkWidget();
		if (!this.modifyListeners.contains(listener)) {
			this.modifyListeners.push(listener);
		}
		return this;
	},

	/**
	 * Adds a selection listener on the list
	 *
	 * @param {gara.events.SelectionListener} listener the listener which should be notified
	 * @returns {gara.widgets.Text} this
	 */
	addSelectionListener : function (listener) {
		this.checkWidget();
		if (!this.selectionListeners.contains(listener)) {
			this.selectionListener.push(listener);
		}
		return this;
	},

	/**
	 * Appends a string.
	 * The new text is appended to the text at the end of the widget.
	 *
	 * @param {String} string the string to be appended
	 * @returns {void}
	 */
	append : function (string) {
		this.handle.value += string;
		this.lastValue = this.handle.value;
		this.notifyModifyListener();
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	bindListener : function (eventType, listener) {
		gara.addEventListener(this.handle, eventType, listener);
	},

	/*
	 * jsdoc in gara.widgets.Control
	 */
	createWidget : function () {
		var handle, eventType, i, len;
		this.createHandle(this.multi ? "textarea" : "input");

		// if type is password, IE forbids setting an input's type. For a workaround
		// we need to clone the input, give it the desired type and replace the old
		// input with a new one.
		// See: http://bytes.com/topic/javascript/answers/705445-dynamically-change-input-type-text-password
		if (!this.multi) {
			handle = this.handle.cloneNode(false);
			handle.type = (this.style & gara.PASSWORD) === gara.PASSWORD ? "password" : "text";
			this.handle.parentNode.replaceChild(handle, this.handle);
			this.handle = handle;
			this.handle.widget = this;

			// bind listeners ...again
			for (eventType in this.listeners) {
				if (Object.prototype.hasOwnProperty.call(this.listeners, eventType)) {
					for (i = 0, len = this.listeners[eventType].length; i < len; i++) {
						this.bindListener(eventType, this.listeners[eventType][i]);
					}
				}
			}
		}

		this.handle.readOnly = (this.style & gara.READ_ONLY) === gara.READ_ONLY;
		this.handle.setAttribute("role", "textbox");
		this.handle.setAttribute("aria-disabled", !this.enabled);
		this.handle.setAttribute("aria-multiline", (this.style & gara.SINGLE) !== gara.SINGLE);
		this.handle.setAttribute("aria-readonly", this.handle.readOnly);

		// css
		this.addClass(this.multi ? "garaMultiText" : ((this.style & gara.PASSWORD) === gara.PASSWORD ? "garaPassword" : "garaText"));

		// listeners
		this.addKeyListener(this);
//		this.addListener("mousedown", this);
//		this.addListener("mouseup", this);
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	destroyWidget : function () {
		this.modifyListeners = null;
		this.selectionListeners = null;
		
		this.$super();
	},
	
	/**
	 * Returns a Point whose x coordinate is the character position representing the start of the 
	 * selected text, and whose y coordinate is the character position representing the end of the 
	 * selection.
	 * 
	 * @returns {gara.widgets.Point} a point representing the selection start and end 
	 */
	getSelection : function () {
		return {x:this.handle.selectionStart, y:this.handle.selectionEnd};
	},
	
	/**
	 * Returns the number of selected characters. 
	 * 
	 * @returns {int} the number of selected characters.
	 */
	getSelectionCount : function () {
		return this.handle.selectionEnd - this.handle.selectionStart; 
	},

	/**
	 * Gets the selected text, or an empty string if there is no current selection.
	 * 
	 * @returns {String} the selected text 
	 */
	getSelectionText : function () {
		return this.handle.value.substring(this.handle.selectionStart, this.handle.selectionEnd);
	},

	/**
	 * Returns the widget text.
	 *  
	 * @returns {String} the widget text
	 */
	getText : function () {
		return this.handle.value;
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	handleEvent : function (e) {
		this.checkWidget();

		if (!this.enabled) {
			return;
		}

		// special events for the list
		e.widget = this;
		this.event = e;

//		this.handleMouseEvents(e);
		if (this.menu !== null && this.menu.isVisible()) {
			this.menu.handleEvent(e);
		} else {
//			this.handleKeyEvents(e);
			this.handleMenu(e);
		}

		this.$super(e);

		e.stopPropagation();
		/* in case of ie6, it is necessary to return false while the type of
		 * the event is "contextmenu" and the menu isn't hidden in ie6
		 */
		return false;
	},

	/**
	 * Internal keyReleased handler.
	 * 
	 * @private
	 * @param e
	 * @returns {void}
	 */
	keyReleased : function (e) {
		if (this.handle.value !== this.lastValue) {
			this.notifyModifyListener();
		}
		this.lastValue = this.handle.value;
	},

	/**
	 * Notifies modify listener
	 *
	 * @private
	 * @returns {void}
	 */
	notifyModifyListener : function () {
		this.modifyListeners.forEach(function (listener) {
			if (listener.modifyText) {
				listener.modifyText(this.event);
			}
		}, this);
	},

	/**
	 * Notifies selection listener about the changed selection within the List
	 *
	 * @private
	 * @returns {void}
	 */
	notifySelectionListener : function () {
		this.selectionListener.forEach(function (listener) {
			if (listener.widgetSelected) {
				listener.widgetSelected(this.event);
			}
		}, this);
	},

	/**
	 * Removes the listener from the collection of listeners who will be notified when
	 * the <code>Text</code>'s text is modified.
	 *
	 * @param {gara.events.ModifyListener} listener the listener which should no longer be notified
	 * @returns {gara.widgets.Text} this
	 */
	removeModifyListener : function (listener) {
		this.checkWidget();
		this.modifyListeners.remove(listener);
		return this;
	},

	/**
	 * Removes a selection listener from this list
	 *
	 * @param {gara.events.SelectionListener} listener the listener which should no longer be notified
	 * @returns {gara.widgets.Text} this
	 */
	removeSelectionListener : function (listener) {
		this.checkWidget();
		this.selectionListeners.remove(listener);
		return this;
	},
	
	/**
	 * Selects all the text in the receiver.
	 *  
	 * @returns {void}
	 */
	selectAll : function () {
		this.handle.select();
	},

	/**
	 * Sets the receiver's selection.
	 *
	 * @param {int} start start of the new selection
	 * @param {int} end end of the new selection
	 * @return {gara.widgets.Text} this
	 */
	setSelection : function (start, end) {
		this.checkWidget();

		start = start || 0;
		end = end || this.handle.value.length;
		
		this.handle.setSelectionRange(start, end);
		this.notifySelectionListener();

		return this;
	},

	/**
	 * Sets the contents of the receiver to the given string.
	 * 
	 * @param {String} text the new text
	 * @returns {gara.widgets.Text} this
	 */
	setText : function (text) {
		this.handle.value = text;
		this.lastValue = this.handle.value;
		this.notifyModifyListener();
		return this;
	},

	/*
	 * jsdoc in gara.widgets.Widget
	 */
	unbindListener : function (eventType, listener) {
		gara.removeEventListener(this.handle, eventType, listener);
	},

	/*
	 * jsdoc in gara.widgets.Control
	 */
	update : function () {
		this.checkWidget();

		// setting measuremeents
//		this.handle.style.width = this.width !== null ? (this.width - parseInt(gara.Utils.getStyle(this.handle, "padding-left")) - parseInt(gara.Utils.getStyle(this.handle, "padding-right")) - parseInt(gara.Utils.getStyle(this.handle, "border-left-width")) - parseInt(gara.Utils.getStyle(this.handle, "border-right-width"))) + "px" : "auto";
//		this.handle.style.height = this.height !== null ? (this.height - parseInt(gara.Utils.getStyle(this.handle, "padding-top")) - parseInt(gara.Utils.getStyle(this.handle, "padding-bottom")) - parseInt(gara.Utils.getStyle(this.handle, "border-top-width")) - parseInt(gara.Utils.getStyle(this.handle, "border-bottom-width"))) + "px" : "auto";
	}
};});