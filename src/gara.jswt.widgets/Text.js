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

gara.provide("gara.jswt.widgets.Text", "gara.jswt.widgets.Scrollable");

gara.use("gara.jswt.JSWT");
gara.use("gara.jswt.widgets.Composite");

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
gara.Class("gara.jswt.widgets.Text", function() { return {
	$extends : gara.jswt.widgets.Scrollable,

	/**
	 * @field
	 * Multi distinguishes wether this is a single or multi line input.
	 *
	 * @private
	 * @type {boolean}
	 */
	multi : false,

	/**
	 * @field
	 * Contains a collection of listeners, that will be notified, when the
	 * <code>Text</code> is modified.
	 *
	 * @private
	 * @type {gara.jswt.events.ModifyListener[]}
	 */
	modifyListeners : [],

	/**
	 * @field
	 * Contains a collection of listeners, that will be notified, when the
	 * selection changes.
	 *
	 * @private
	 * @type {gara.jswt.events.SelectionListener[]}
	 */
	selectionListeners : [],

	/**
	 * @constructor
	 * Constructor
	 *
	 * @param {gara.jswt.widgets.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style The style for the list
	 */
	$constructor : function (parent, style) {
		// flags
		this.multi = (style & gara.jswt.JSWT.MULTI) === gara.jswt.JSWT.MULTI;
		this.lastValue = "";

		// listener
		this.modifyListeners = [];
		this.selectionListeners = [];

		this.$super(parent, style || gara.jswt.JSWT.SINGLE);
	},

	/**
	 * @method
	 * Adds the listener to the collection of listeners who will be notified when the receiver's
	 * text is modified, by sending it one of the messages defined in the <code>ModifyListener</code> interface.
	 *
	 * @param {gara.jswt.events.ModifyListener} listener the listener which should be notified
	 * @return {void}
	 */
	addModifyListener : function (listener) {
		this.checkWidget();
		if (!this.modifyListeners.contains(listener)) {
			this.modifyListeners.push(listener);
		}
		return this;
	},

	/**
	 * @method
	 * Adds a selection listener on the list
	 *
	 * @param {gara.jswt.events.SelectionListener} listener the listener which should be notified
	 * @return {void}
	 */
	addSelectionListener : function (listener) {
		this.checkWidget();
		if (!this.selectionListeners.contains(listener)) {
			this.selectionListener.push(listener);
		}
		return this;
	},

	/**
	 * @method
	 * Appends a string.
	 * The new text is appended to the text at the end of the widget.
	 *
	 * @param {String} string the string to be appended
	 * @return {void}
	 */
	append : function (string) {
		this.handle.value += string;
		this.lastValue = this.handle.value;
		this.notifyModifyListener();
	},

	/**
	 * @method
	 * Register listeners for this widget. Implementation for gara.jswt.widgets.Widget
	 *
	 * @private
	 * @return {void}
	 */
	bindListener : function (eventType, listener) {
		gara.EventManager.addListener(this.handle, eventType, listener);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	createWidget : function () {
		var handle;
		this.createHandle(this.multi ? "textarea" : "input");

		// if type is password, IE forbids setting an input's type. For a workaround
		// we need to clone the input, give it the desired type and replace the old
		// input with a new one.
		// See: http://bytes.com/topic/javascript/answers/705445-dynamically-change-input-type-text-password
		if (!this.multi) {
			handle = this.handle.cloneNode(false);
			handle.type = (this.style & gara.jswt.JSWT.PASSWORD) === gara.jswt.JSWT.PASSWORD ? "password" : "text";
			this.handle.parentNode.replaceChild(handle, this.handle);
			this.handle = handle;
			this.handle.widget = this;

			// bind listeners ...again
			for (eventType in this.listeners) {
				this.listeners[eventType].forEach(function (elem, index, arr) {
					this.bindListener(eventType, elem);
				}, this);
			}
		}

		this.handle.readOnly = (this.style & gara.jswt.JSWT.READ_ONLY) === gara.jswt.JSWT.READ_ONLY;
		this.handle.setAttribute("role", "textbox");
		this.handle.setAttribute("aria-disabled", !this.enabled);
		this.handle.setAttribute("aria-multiline", (this.style & gara.jswt.JSWT.SINGLE) !== gara.jswt.JSWT.SINGLE);
		this.handle.setAttribute("aria-readonly", this.handle.readOnly);

		// css
		this.addClass(this.multi ? "jsWTMultiText" : ((this.style & gara.jswt.JSWT.PASSWORD) === gara.jswt.JSWT.PASSWORD ? "jsWTPassword" : "jsWTText"));

		// listeners
		this.addKeyListener(this);
//		this.addListener("mousedown", this);
//		this.addListener("mouseup", this);
	},

	destroyWidget : function () {
		this.modifyListeners = null;
		this.selectionListeners = null;
		
		this.$super();
	},
	
	getSelection : function () {
		return {x:this.handle.selectionStart, y:this.handle.selectionEnd};
	},
	
	getSelectionCount : function () {
		return this.handle.selectionEnd - this.handle.selectionStart; 
	},

	getSelectionText : function () {
		return this.handle.value.substring(this.handle.selectionStart, this.handle.selectionEnd);
	},

	getText : function () {
		return this.handle.value;
	},

	/**
	 * @method
	 * Handles events on the list. Implements DOMEvent Interface by the W3c.
	 *
	 * @private
	 * @param {Event} e event the users triggers
	 * @return {void}
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
	 * @method
	 * Handles the internal key released behavior.
	 * 
	 * @private
	 * @param e
	 * @return {void}
	 */
	keyReleased : function (e) {
		if (this.handle.value !== this.lastValue) {
			this.notifyModifyListener();
		}
		this.lastValue = this.handle.value;
	},

	/**
	 * @method
	 * Notifies modify listener
	 *
	 * @private
	 * @return {void}
	 */
	notifyModifyListener : function () {
		this.modifyListeners.forEach(function (listener) {
			if (listener.modifyText) {
				listener.modifyText(this.event);
			}
		}, this);
	},

	/**
	 * @method
	 * Notifies selection listener about the changed selection within the List
	 *
	 * @private
	 * @return {void}
	 */
	notifySelectionListener : function () {
		this.selectionListener.forEach(function (listener) {
			if (listener.widgetSelected) {
				listener.widgetSelected(this.event);
			}
		}, this);
	},

	/**
	 * @method
	 * Removes the listener from the collection of listeners who will be notified when
	 * the <code>Text</code>'s text is modified.
	 *
	 * @param {gara.jswt.events.ModifyListener} listener the listener which should no longer be notified
	 * @return {void}
	 */
	removeModifyListener : function (listener) {
		this.checkWidget();
		this.modifyListeners.remove(listener);
		return this;
	},

	/**
	 * @method
	 * Removes a selection listener from this list
	 *
	 * @param {gara.jswt.events.SelectionListener} listener the listener which should no longer be notified
	 * @return {void}
	 */
	removeSelectionListener : function (listener) {
		this.checkWidget();
		this.selectionListeners.remove(listener);
		return this;
	},
	
	selectAll : function () {
		this.handle.select();
	},

	/**
	 * @method
	 * Sets the selection of the <code>Text</code>
	 *
	 * @param {boolean} selected new selected state
	 * @return {void}
	 */
	setSelection : function (start, end) {
		this.checkWidget();

		start = start || 0;
		end = end || this.handle.value.length;
		
		this.handle.setSelectionRange(start, end);
		this.notifySelectionListener();

		return this;
	},

	setText : function (text) {
		this.handle.value = text;
		this.lastValue = this.handle.value;
		this.notifyModifyListener();
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
	unbindListener : function (eventType, listener) {
		gara.EventManager.removeListener(this.handle, eventType, listener);
	},

	/**
	 * @method
	 * Updates the <code>Text</code>
	 *
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	update : function () {
		this.checkWidget();

		// setting measuremeents
//		this.handle.style.width = this.width !== null ? (this.width - parseInt(gara.Utils.getStyle(this.handle, "padding-left")) - parseInt(gara.Utils.getStyle(this.handle, "padding-right")) - parseInt(gara.Utils.getStyle(this.handle, "border-left-width")) - parseInt(gara.Utils.getStyle(this.handle, "border-right-width"))) + "px" : "auto";
//		this.handle.style.height = this.height !== null ? (this.height - parseInt(gara.Utils.getStyle(this.handle, "padding-top")) - parseInt(gara.Utils.getStyle(this.handle, "padding-bottom")) - parseInt(gara.Utils.getStyle(this.handle, "border-top-width")) - parseInt(gara.Utils.getStyle(this.handle, "border-bottom-width"))) + "px" : "auto";
	}
};});