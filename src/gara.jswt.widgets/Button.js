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

gara.provide("gara.jswt.widgets.Button", "gara.jswt.widgets.Control");

gara.use("gara.jswt.JSWT");
gara.use("gara.jswt.widgets.Composite");

/**
 * @summary
 * gara Button Widget
 *
 * @description
 * long description for the Button Widget...
 *
 * @class Button
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Control
 */
gara.Class("gara.jswt.widgets.Button", function() { return {
	$extends : gara.jswt.widgets.Control,

	/**
	 * @field
	 * Contains the text.
	 *
	 * @private
	 * @type {String}
	 */
	text : "",

	/**
	 * @field
	 * Contains the image.
	 *
	 * @private
	 * @type {Image}
	 */
	image : null,

	// nodes
	/**
	 * @field
	 * Img's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	img : null,

	/**
	 * @field
	 * Span's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	span : null,

	/**
	 * @field
	 * Span's text DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	spanText : null,

	/**
	 * @field
	 * The event that triggers the press.
	 *
	 * @private
	 * @type {Event}
	 */
	pressEvent : null,

	// selection
	/**
	 * @field
	 * Contains the selection
	 *
	 * @private
	 * @type {boolean}
	 */
	selected : false,

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
		// content
		this.text = "";
		this.image = null;

		// nodes
		this.img = null;
		this.span = null;
		this.spanText = null;

		this.pressEvent = null;

		// selection
		this.selected = false;
		this.selectionListeners = [];

		// make PUSH-Button when no other is styled
		if (!((style & gara.jswt.JSWT.PUSH) === gara.jswt.JSWT.PUSH
				|| (style & gara.jswt.JSWT.RADIO) === gara.jswt.JSWT.RADIO
				|| (style & gara.jswt.JSWT.CHECK) === gara.jswt.JSWT.CHECK)) {
			style |= gara.jswt.JSWT.PUSH;
		}

		// make default orientation
		if (!((style & gara.jswt.JSWT.VERTICAL) === gara.jswt.JSWT.VERTICAL
				|| (style & gara.jswt.JSWT.HORIZONTAL) === gara.jswt.JSWT.HORIZONTAL)) {
			style |= gara.jswt.JSWT.HORIZONTAL;
		}

		this.$super(parent, style);
	},

	/**
	 * @method
	 * Adds a selection listener on the list
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.SelectionListener} listener the desired listener to be added to this list
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	addSelectionListener : function (listener) {
		this.checkWidget();
		if (!this.selectionListeners.contains(listener)) {
			this.selectionListeners.push(listener);
		}
		return this;
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
		var focus, door;
		this.createHandle("span");

		this.handle.setAttribute("role", "button");
		this.handle.setAttribute("aria-disabled", !this.enabled);
		this.handle.setAttribute("aria-labelledby", this.getId()+"-label");

		// css
		this.addClass("garaButton");
		this.setClass("garaButtonPush", (this.style & gara.jswt.JSWT.PUSH) === gara.jswt.JSWT.PUSH);
		this.setClass("garaButtonHorizontal", (this.style & gara.jswt.JSWT.HORIZONTAL) === gara.jswt.JSWT.HORIZONTAL);
		this.setClass("garaButtonVertical", (this.style & gara.jswt.JSWT.VERTICAL) === gara.jswt.JSWT.VERTICAL);

		// checkbox
		if ((this.style & gara.jswt.JSWT.CHECK) === gara.jswt.JSWT.CHECK) {
			this.addClass("garaButtonCheckbox");
			this.handle.setAttribute("role", "checkbox");
			this.handle.setAttribute("aria-checked", this.selected);
		}

		// radio
		if ((this.style & gara.jswt.JSWT.RADIO) === gara.jswt.JSWT.RADIO) {
			this.addClass("garaButtonRadio");
			this.handle.setAttribute("role", "radio");
			this.handle.setAttribute("aria-checked", this.selected);
		}

		// listeners
		this.addListener("mousedown", this);
		this.addListener("mouseup", this);

		// nodes
		focus = document.createElement("span");
		focus.widget = this;
		focus.className = "garaButtonFocus garaFocus";
		focus.setAttribute("role", "presentation");

		door = document.createElement("span");
		door.widget = this;
		door.className = "garaButtonDoor garaDoor";
		door.setAttribute("role", "presentation");

		// create image node
		this.img = document.createElement("img");
		this.img.id = this.getId() + "-image";
		this.img.widget = this;
		this.img.control = this.list;
		this.img.className = "garaImage garaButtonImage";
		this.img.setAttribute("role", "presentation");

		// set image
		if (this.image !== null) {
			this.img.src = this.image.src;
		} else {
			this.img.style.display = "none";
		}

		// creating text node
		this.spanText = document.createTextNode(this.text);
		this.span = document.createElement("span");
		this.span.id = this.getId()+"-label";
		this.span.widget = this;
		this.span.control = this.list;
		this.span.className = "garaText";
		this.span.appendChild(this.spanText);
		this.span.setAttribute("role", "presentation");

		this.handle.appendChild(focus);
		this.handle.appendChild(door);
		door.appendChild(this.img);
		door.appendChild(this.span);
	},

	destroyWidget : function () {
		this.selectionListeners = null;
		
		this.img = null;
		this.span = null;
		
		this.$super();
	},

	getImage : function () {
		return this.image;
	},

	getSelection : function () {
		return this.selected;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	getSiblingRadioButtons : function () {
		var controls, childs, i, child, buttons, index;
		// parent is composite
		if (this.parent instanceof gara.jswt.widgets.Composite) {
			controls = this.parent.getChildren();
		}

		// parent is dom node
		else {
			controls = [];
			childs = this.parent.childNodes;
			for (i = 0, len = childs.length; i < len; i++) {
				child = childs[i];
				if (child.widget && child.widget instanceof gara.jswt.widgets.Control) {
					controls.push(child.widget);
				}
			}
		}
		buttons = [this];
		index = controls.indexOf(this);
		for (i = index - 1; i >= 0 && controls[i] instanceof gara.jswt.widgets.Button && (controls[i].getStyle() & gara.jswt.JSWT.RADIO) === gara.jswt.JSWT.RADIO; --i) {
			buttons.unshift(controls[i]);
		}

		for (i = index + 1; i < controls.length && controls[i] instanceof gara.jswt.widgets.Button && (controls[i].getStyle() & gara.jswt.JSWT.RADIO) === gara.jswt.JSWT.RADIO; ++i) {
			buttons.push(controls[i]);
		}
		return buttons;
	},

	getText : function () {
		return this.text;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	focusGained : function (e) {
		var buttons, current, prev, next;
		if((this.style & gara.jswt.JSWT.RADIO) === gara.jswt.JSWT.RADIO) {
			buttons = this.getSiblingRadioButtons();
			current = buttons.indexOf(this);
			prev = current - 1;
			next = current + 1;

			while (buttons[prev]) {
				buttons[prev].handle.tabIndex = -1;
				prev--;
			}

			while (buttons[next]) {
				buttons[next].handle.tabIndex = -1;
				next++;
			}

			this.handle.tabIndex = 0;
		}

		this.$super(e);
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

		this.handleMouseEvents(e);
		if (this.menu !== null && this.menu.isVisible()) {
			this.menu.handleEvent(e);
		} else {
			this.handleKeyEvents(e);
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
	 *
	 * @private
	 */
	handleMouseEvents : function (e) {
		switch (e.type) {
		case "mousedown":
			this.handle.setAttribute("aria-pressed", true);
			this.pressEvent = gara.EventManager.addListener(document, "mouseup", this);
			break;

		case "mouseup":
			this.handle.setAttribute("aria-pressed", false);
			if (this.pressEvent !== null) {
				gara.EventManager.removeListener(document, "mouseup", this);
				this.pressEvent = null;
			}
			if (e.target.widget && e.target.widget === this) {
				this.setSelection((this.style & gara.jswt.JSWT.RADIO) === gara.jswt.JSWT.RADIO ? true : !this.getSelection());
			}
			break;
		}
	},

	/**
	 * @method
	 *
	 * @private
	 */
	handleKeyEvents : function (e) {
		var buttons, current, next, prev;
		switch (e.type) {
		case "keyup":
			this.handle.setAttribute("aria-pressed", false);
			this.preventScrolling(e);
			break;

		case "keydown":
			switch (e.keyCode) {
				case gara.jswt.JSWT.SPACE:
					this.handle.setAttribute("aria-pressed", true);
					this.setSelection((this.style & gara.jswt.JSWT.RADIO) === gara.jswt.JSWT.RADIO ? true : !this.getSelection());
					break;

				case gara.jswt.JSWT.ARROW_DOWN:
				case gara.jswt.JSWT.ARROW_RIGHT:
					buttons = this.getSiblingRadioButtons();
					current = buttons.indexOf(this);
					next = current + 1;

					// set to first radio button, when we are at the end
					if (next >= buttons.length) {
						next = 0;
					}

					// iterate over next radio buttons, take next enabled button, jump to the beginning if we hit the end
					while (next <= buttons.length) {
						if (buttons[next].getEnabled()) {
							break;
						}

						next = next < buttons.length - 1 ? next + 1 : buttons.length - 1;

						// next control not a radio button, get the first one
						if (next <= buttons.length && !buttons[next].getEnabled()) {
							next = 0;
						}
					}

					if (!e.ctrlKey) {
						buttons[next].setSelection(true);
					}
					buttons[next].forceFocus();
					break;

				case gara.jswt.JSWT.ARROW_UP:
				case gara.jswt.JSWT.ARROW_LEFT:
					buttons = this.getSiblingRadioButtons();
					current = buttons.indexOf(this);
					prev = current - 1;

					// get the last radio button, when we are at the first position
					if (prev < 0) {
						prev = buttons.length - 1;
					}

					// iterate over previous radio buttons, take next enabled button, jump to the end if we hit first
					while (prev >= 0) {
						if (buttons[prev].getEnabled()) {
							break;
						}

						prev = prev > 0 ? prev - 1 : 0;

						// prev control not a radio button, get the last
						if (prev >= 0 && !buttons[prev].getEnabled()) {
							prev = buttons.length - 1;
						}
					}

					if (!e.ctrlKey) {
						buttons[prev].setSelection(true);
					}
					buttons[prev].forceFocus();
					break;

				case gara.jswt.JSWT.ENTER:
					this.notifySelectionListener();
					break;
			}
			this.preventScrolling(e);
			break;
		}
	},

	/**
	 * @method
	 * Notifies selection listener about the changed selection within the List
	 *
	 * @private
	 * @return {void}
	 */
	notifySelectionListener : function () {
		this.selectionListeners.forEach(function (listener) {
			if (listener.widgetSelected) {
				listener.widgetSelected(this.event);
			}
		}, this);
	},


	/**
	 * @method
	 * Removes a selection listener from this list
	 *
	 * @param {gara.jswt.events.SelectionListener} listener the listener to remove from this list
	 * @return {void}
	 */
	removeSelectionListener : function (listener) {
		this.checkWidget();
		this.selectionListeners.remove(listener);
	},

	setImage : function (image) {
		this.image = image;
		if (this.handle) {
			// update image
			if (this.image !== null) {
				this.img.src = this.image.src;
				this.img.style.display = "";
			}

			// hide image
			else {
				this.img.src = "";
				this.img.style.display = "none";
			}
		}
		return this;
	},

	/**
	 * @method
	 * Sets the selection of the <code>Button</code>
	 *
	 * @param {boolean} selected new selected state
	 * @return {void}
	 */
	setSelection : function (selected) {
		var buttons, current, prev, next;
		this.checkWidget();

		if (((this.style & gara.jswt.JSWT.CHECK) === gara.jswt.JSWT.CHECK ||
				(this.style & gara.jswt.JSWT.RADIO) === gara.jswt.JSWT.RADIO)
				&& this.enabled) {
			this.selected = selected;
			if (this.handle) {
				this.handle.setAttribute("aria-checked", this.selected);
			}

			// if radio uncheck siblings
			if ((this.style & gara.jswt.JSWT.RADIO) === gara.jswt.JSWT.RADIO && selected) {
				buttons = this.getSiblingRadioButtons();
				current = buttons.indexOf(this);
				prev = current - 1;
				next = current + 1;

				while (buttons[prev]) {
					buttons[prev].setSelection(false);
					prev--;
				}

				while (buttons[next]) {
					buttons[next].setSelection(false);
					next++;
				}
			}


		}
		this.notifySelectionListener();

		return this;
	},

	setText : function (text) {
		this.text = text;
		this.spanText.nodeValue = this.text;
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
	 * Updates the <code>Button</code>
	 *
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	update : function () {
		this.checkWidget();

		// setting measurements
//		this.handle.style.width = this.width !== null ? (this.width - parseInt(gara.Utils.getStyle(this.handle, "padding-left")) - parseInt(gara.Utils.getStyle(this.handle, "padding-right")) - parseInt(gara.Utils.getStyle(this.handle, "border-left-width")) - parseInt(gara.Utils.getStyle(this.handle, "border-right-width"))) + "px" : "auto";
//		this.handle.style.height = this.height !== null ? (this.height - parseInt(gara.Utils.getStyle(this.handle, "padding-top")) - parseInt(gara.Utils.getStyle(this.handle, "padding-bottom")) - parseInt(gara.Utils.getStyle(this.handle, "border-top-width")) - parseInt(gara.Utils.getStyle(this.handle, "border-bottom-width"))) + "px" : "auto";
	}
};});