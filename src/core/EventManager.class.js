/*	$Id$

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
 * @class EventManager
 * @description
 * EventManager is used to store all event listeners throughout the document.
 * This helps to keep all listeners stored in one point and also pretend memory
 * leaks by releasing all listeners at the unload event.
 *
 * @see http://ajaxcookbook.org/event-handling-memory-leaks/
 * @author Thomas Gossmann
 * @namespace gara
 */
$class("EventManager", {
	/**
	 * @field
	 * Stores THE instance
	 * @private
	 */
	_instance : $static(null),
	_listeners : $static({}),

	$constructor : function() {
		base2.DOM.EventTarget(window);
		window.addEventListener("unload", this, false);
	},

	getInstance : $static(function() {
		if (this._instance == null) {
			this._instance = new gara.EventManager();
		}

		return this._instance;
	}),

	/**
	 * @method
	 * Adds a listener to a specified domNode and store the added event in the
	 * event manager.
	 *
	 * @param {HTMLElement} domNode the node where the event is added to
	 * @param {DOMString} type the event type
	 * @param {Object|Function} listener the desired action handler
	 * @return {Event} generated event-object for this listener
	 */
	addListener : $static(function(domNode, type, listener) {
		domNode.addEventListener(type, listener, false);

		var d = new Date();
		var hashAppendix = "" + d.getDay() + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds();

		if (!domNode._garaHash) {
			domNode._garaHash = domNode.toString() + hashAppendix;
		}

		if (!listener.hasOwnProperty("_garaHash")) {
			listener._garaHash = listener.toString() + hashAppendix;
		}

		var hash = "" + domNode._garaHash + type + listener._garaHash;
		var event = {
			domNode : domNode,
			type : type,
			listener : listener
		}
		this._listeners[hash] = event;

		return event;
	}),

	/**
	 * @method
	 * handleEvent is used to catch the unload-event of the window and pass
	 * it to _unregisterAllEvents() to free up memory.
	 *
	 * @private
	 */
	handleEvent : function(e) {
//		if (e.type == "unload") {
			this._unregisterAllEvents();
//		}
	},

	/**
	 * @method
	 * Removes a specified event
	 *
	 * @param {Event} event object which is returned by addListener()
	 * @see addListener
	 */
	removeListener : $static(function(domNode, type, listener) {
		if (domNode) {
			domNode.removeEventListener(type, listener, false);

			if (domNode._garaHash && listener.hasOwnProperty("_garaHash")) {
				var hash = domNode._garaHash + type + listener._garaHash;

				if (this._listeners[hash]) {
					delete this._listeners[hash];
				}
			}
		}
	}),

	/**
	 * @method
	 *
	 * Removes all stored listeners on the page unload.
	 * @private
	 */
	_unregisterAllEvents : function() {
		var hash, e;
		for (hash in gara.EventManager._listeners) {
			e = gara.EventManager._listeners[hash];
			gara.EventManager.removeListener(e.domNode, e.type, e.listener);
		}
	},

	toString : function() {
		return "[gara.EventManager]";
	}
});
gara.eventManager = gara.EventManager.getInstance();
