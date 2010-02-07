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

gara.provide("gara.jswt.widgets.Button");

gara.require("gara.jswt.JSWT");
gara.require("gara.jswt.widgets.Control");
gara.require("gara.jswt.widgets.Composite");

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
gara.Class("gara.jswt.widgets.Button", {
	$extends : gara.jswt.widgets.Control,

	/**
	 * @constructor
	 * Constructor
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style The style for the list
	 */
	$constructor : function(parent, style) {
		// content
		this._text = "";
		this._image = null;

		// nodes
		this._img = null;
		this._span = null;
		this._spanText = null;

		this._pressEvent = null;

		// selection
		this._selected = false;
		this._selectionListener = [];

		this.$base(parent, style || gara.jswt.JSWT.PUSH);
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
	addSelectionListener : function(listener) {
		this.checkWidget();
		if (!gara.instanceOf(listener, gara.jswt.events.SelectionListener)) {
			throw new TypeError("listener is not instance of gara.jswt.events.SelectionListener");
		}

		this._selectionListener.push(listener);
	},

	getImage : function() {
		return this._image;
	},

	getSelection : function() {
		return this._selected;
	},

	getText : function() {
		return this._text;
	},

	_createWidget : function() {
		this.$base("span");

		this.handle.setAttribute("role", "button");
		this.handle.setAttribute("aria-disabled", !this._enabled);
		this.handle.setAttribute("aria-labelledby", this.getId()+"-label");

		// css
		this.addClass("jsWTButton");
		this.setClass("jsWTButtonPush", (this._style & gara.jswt.JSWT.PUSH) == gara.jswt.JSWT.PUSH);

		// checkbox
		if ((this._style & gara.jswt.JSWT.CHECK) == gara.jswt.JSWT.CHECK) {
			this.addClass("jsWTButtonCheckbox");
			this.handle.setAttribute("role", "checkbox");
			this.handle.setAttribute("aria-checked", this._selected);
		}

		// radio
		if ((this._style & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO) {
			this.addClass("jsWTButtonRadio");
			this.handle.setAttribute("role", "radio");
			this.handle.setAttribute("aria-checked", this._selected);
		}

		// listeners
		this.addListener("mousedown", this);
		this.addListener("mouseup", this);

		// nodes
		var focus = document.createElement("span");
		focus.widget = this;
		focus.className = "focus";
		base2.DOM.Event(focus);
		focus.setAttribute("role", "presentation");

		var door = document.createElement("span");
		door.widget = this;
		door.className = "door";
		base2.DOM.Event(door);
		door.setAttribute("role", "presentation");

		// create image node
		this._img = document.createElement("img");
		this._img.id = this.getId() + "-image";
		this._img.widget = this;
		this._img.control = this._list;

		base2.DOM.Event(this._img);
		this._img.setAttribute("role", "presentation");

		// set image
		if (this._image != null) {
			this._img.src = this._image.src;
		} else {
			this._img.style.display = "none";
		}

		// creating text node
		this._spanText = document.createTextNode(this._text);
		this._span = document.createElement("span");
		this._span.id = this.getId()+"-label";
		this._span.widget = this;
		this._span.control = this._list;
		this._span.className = "text";
		this._span.appendChild(this._spanText);
		base2.DOM.Event(this._span);
		this._span.setAttribute("role", "presentation");

		this.handle.appendChild(focus);
		this.handle.appendChild(door);
		door.appendChild(this._img);
		door.appendChild(this._span);
	},

	dispose : function() {
		this.$base();

		this._items.forEach(function(item, index, arr) {
			item.dispose();
		}, this);

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.handle);
		}
		delete this.handle;
	},

	_getSiblingButtons : function() {
		var controls;
		// parent is composite
		if (gara.instanceOf(this._parent, gara.jswt.widgets.Composite)) {
			controls = this._parent.getChildren();
		}

		// parent is dom node
		else {
			controls = [];
			var childs = this._parent.childNodes;
			for (var i = 0, len = childs.length; i < len; i++) {
				var child = childs[i];
				if (child.widget && gara.instanceOf(child.widget, gara.jswt.widgets.Control)) {
					controls.push(child.widget);
				}
			}
		}
		var buttons = [];
		controls.forEach(function(control) {
			if (gara.instanceOf(control, gara.jswt.widgets.Button)) {
				buttons.push(control);
			}
		}, this);
		return buttons;
	},

	focusGained : function(e) {
		if((this._style & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO) {
			var buttons = this._getSiblingButtons();
			var current = buttons.indexOf(this);
			var prev = current - 1;
			var next = current + 1;

			while (buttons[prev] && (buttons[prev].getStyle() & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO) {
				buttons[prev].handle.tabIndex = -1;
				prev--;
			}

			while (buttons[next] && (buttons[next].getStyle() & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO) {
				buttons[next].handle.tabIndex = -1;
				next++;
			}

			this.handle.tabIndex = 0;
		}

		this.$base(e);
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

		if (e.item != null) {
			e.item.handleEvent(e);
		}

		e.stopPropagation();
		/* in case of ie6, it is necessary to return false while the type of
		 * the event is "contextmenu" and the menu isn't hidden in ie6
		 */
		return false;
	},

	_handleMouseEvents : function(e) {
		switch (e.type) {
			case "mousedown":
				this.handle.setAttribute("aria-pressed", true);
				this._pressEvent = gara.EventManager.addListener(document, "mouseup", this);
				break;

			case "mouseup":
				this.handle.setAttribute("aria-pressed", false);
				if (this._pressEvent != null) {
					gara.EventManager.removeListener(document, "mouseup", this);
					this._pressEvent = null;
				}
				if (e.target.widget && e.target.widget == this) {
					this.setSelection((this._style & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO ? true : !this.getSelection());
				}
				break;
		}
	},

	_handleKeyEvents : function(e) {
		switch (e.type) {
			case "keyup":
				this.handle.setAttribute("aria-pressed", false);
				break;

			case "keydown":
				if (e.keyCode == gara.jswt.JSWT.SPACE) {
					this.handle.setAttribute("aria-pressed", true);
					this.setSelection((this._style & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO ? true : !this.getSelection());
				}

				var buttons = this._getSiblingButtons();
				var current = buttons.indexOf(this);

				switch (e.keyCode) {
					case gara.jswt.JSWT.ARROW_DOWN:
					case gara.jswt.JSWT.ARROW_RIGHT:
						var next = current + 1;

						// when current button is last radio, get the first one
						if ((buttons[next].getStyle() & gara.jswt.JSWT.RADIO) != gara.jswt.JSWT.RADIO || !buttons[next].getEnabled()) {
							next--;
							while ((buttons[next].getStyle() & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO && buttons[next].getEnabled()) {
								next--;
							}
							next++;
						}

						if ((buttons[next].getStyle() & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO && buttons[next].getEnabled()) {
							if (!e.ctrlKey) {
								buttons[next].setSelection(true);
							}
							buttons[next].forceFocus();
						}
						break;

					case gara.jswt.JSWT.ARROW_UP:
					case gara.jswt.JSWT.ARROW_LEFT:
						var prev = current - 1;

						// when current button is first radio, get the last one
						if ((buttons[prev].getStyle() & gara.jswt.JSWT.RADIO) != gara.jswt.JSWT.RADIO || !buttons[prev].getEnabled()) {
							prev++;
							while ((buttons[prev].getStyle() & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO && buttons[prev].getEnabled()) {
								prev++;
							}
							prev--;
						}

						if ((buttons[prev].getStyle() & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO && buttons[prev].getEnabled()) {
							if (!e.ctrlKey) {
								buttons[prev].setSelection(true);
							}
							buttons[prev].forceFocus();
						}
						break;
				}
				break;
		}
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
	 * Removes a selection listener from this list
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.SelectionListener} listener the listener to remove from this list
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
	},

	setImage : function(image) {
		this._image = image;
		if (this.handle) {
			// update image
			if (this._image != null) {
				this._img.src = this._image.src;
				this._img.style.display = "";
			}

			// hide image
			else {
				this._img.src = "";
				this._img.style.display = "none";
			}
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

		if (((this._style & gara.jswt.JSWT.CHECK) == gara.jswt.JSWT.CHECK ||
				(this._style & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO)
				&& this._enabled) {
			this._selected = selected;
			if (this.handle) {
				this.handle.setAttribute("aria-checked", this._selected);
			}

			// if radio uncheck siblings
			if ((this._style & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO && selected) {
				var buttons = this._getSiblingButtons();
				var current = buttons.indexOf(this);
				var prev = current - 1;
				var next = current + 1;

				while (buttons[prev] && (buttons[prev].getStyle() & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO) {
					buttons[prev].setSelection(false);
					prev--;
				}

				while (buttons[next] && (buttons[next].getStyle() & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO) {
					buttons[next].setSelection(false);
					next++;
				}
			}


		}
		this._notifySelectionListener();

		return this;
	},

	setText : function(text) {
		this._text = text;
		if (this.handle) {
			this._spanText.nodeValue = this._text;
		}
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
	 * Updates the <code>Button</code>
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