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
	_instance : null,

	$constructor : function() {
		this._listeners = [];
		base2.DOM.bind(document);
		//base2.DOM.bind(window);
		//window.addEventListener("unload", this, false);
		var eventMgr = this;
		window.onunload = function(e) {
			eventMgr.handleEvent(e);
		}
	},

	getInstance : $static(function() {
		if (this._instance == null) {
			this._instance = new EventManager();
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
	addListener : function(domNode, type, listener) {
//		console.log("EventMngr.addListener: " + domNode + " " + type + " " + listener);
		domNode.addEventListener(type, listener, false);
		
		var event = {
			domNode : domNode,
			type : type,
			listener : listener
		}
		this._listeners.push(event);
		
		return event;
	},

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
	removeListener : function(e) {
		e.domNode.removeEventListener(e.type, e.listener, false);
		
		if (this._listeners.contains(e)) {
			this._listeners.remove(e);
		}
	},

	/**
	 * @method
	 * 
	 * Removes all stored listeners on the page unload.
	 * @private
	 */
	_unregisterAllEvents : function() {
		while (this._listeners.length > 0) {
			var event = this._listeners.pop();
			this.removeListener(event);
		}
	},
	
	toString : function() {
		return "[gara.EventManager]";
	}
});