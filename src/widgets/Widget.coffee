###
gara - Javascript Toolkit

Copyright (c) 2007 Thomas Gossmann

Homepage:
	http:#garajs.org

This library is free software;  you  can  redistribute  it  and/or
modify  it  under  the  terms  of  the   GNU Lesser General Public
License  as  published  by  the  Free Software Foundation;  either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in  the hope  that it  will be useful,
but WITHOUT ANY WARRANTY; without  even  the  implied  warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See  the  GNU
Lesser General Public License for more details.
###

#define 'gara/widgets/Widget', ->
#define 'gara/widgets/Widget', ['gara/widgets/Display', 'gara/widgets/WidgetException'], ->
	# gara.use('gara.widgets.Display');
	# gara.use('gara.widgets.WidgetException');
define 'gara/widgets/Widget', ['require','exports', 'gara/widgets/Display', 'gara/widgets/WidgetException'], (require, exports) -> 

	# require('gara/widgets/Display')
	# require('gara/widgets/WidgetException')

	class Widget
		###
		 Widget Super Hero!
		###

		###
		@private
		@type Array
		###
		#@classes: []

		###
		@private
		@type Object
		 ###
		#@data: null

		###
		@private
		@type Object
		###
		#@dataMap: null

		###
		@private
		@type gara.widgets.Display
		###
		#@display: null
	
		###
		Contains the disposed state
		@private
		@type boolean
		###
		#@disposed: false
		
		###
		@private
		@type Array
		###
		#@disposeListeners: []
	
		###
		@private
		@type Object
		###
		#@event: null
	
		###
		Contains the DOM handle of the widget
		
		@type HTMLElement
		###
		#@handle: null
	
		###
		@private
		@type String
		###
		#@id: ''
	
		###
		@private
		@type Object
		###
		#@listeners: null
	
		###
		@type HTMLElement|gara.widgets.Composite
		@private
		###
		#@parent: null
	
		###
		@type HTMLElement|gara.widgets.Composite
		@private
		###
		#@parentNode: null
	
		###
		@private
		@type int
		###
		#@style: null
		
		###
		Widget base constructor
		
		@param {gara.widgets.Widget|HTMLElement} parent the parent for this widget
		@param {int} style the style codec for this widget
		###	
		constructor: (@parent, config = {}) ->
			@classes = ['gara']
			@data = null
			@dataMap = new WeakMap
			@display = null
			@disposed = false
			@disposeListeners = []
			@event = null
			@handle = null
			@id = ''
			@listeners = {}
			@parentNode = null
			#@config = config;
			@style = config?.style || gara.DEFAULT
			@display = parent and if parent.getDisplay then parent.getDisplay() else gara.widgets.Display.getDefault();
				

		###
		Adds a CSS class to the item
		
		@param {String} className new class
		@returns {gara.widgets.Widget}
		###
		addClass: (className) ->
			if !@classes.contains(className)
				@classes.add(className);
				@handle.className = @classes.join(' ') if @handle?
			this
	
	
		###
		Adds multiple CSS classes to the <code>Widget</code>
		
		@param {String[]} classNames new classes in an array
		@returns {gara.widgets.Widget}
		###
		addClasses: (classNames) ->
			classNames.forEach (className) =>
				@addClass(className);
			this
	
	
		###
		Adds a dispose listener to the widget
		
		@param {gara.events.DisposeListener} listener the listener which gets notified about the disposal
		@returns {void}
		###
		addDisposeListener: (listener) ->
			@disposeListeners.add(listener) if !@disposeListeners.contains(listener)
			this
	
	
		###
		Adds an event listener to the widget
		
		@param {String} eventType the type of the event
		@param {Object} listener the listener
		@returns {void}
		###		
		addListener: (eventType, listener) ->
			@listeners[eventType] = [] if !Object::hasOwnProperty.call(@listeners, eventType)
			@listeners[eventType].add(listener) if !@listeners[eventType].contains(listener)
			this
	
		
#		bindListener: (eventType, listener) ->
			###
			Binds the listener to the widgets html nodes. Should be implemented
			by the widget authors!
			
			@private
			@param {String} eventType the type of the event
			@param {Object} listener the listener
			@see unbindListener
			@returns {void}
			###
	#		alert('Trying to bind listener on ' + this + '. Method not implemented.\n' +
	#				'    Type: ' + eventType + '\n' +
	#				'    Listener: ' + listener);
	
		
		# @checkBits: (styles...) ->
			# ###
			# Returns a style with exactly one style bit set out of
			# the specified set of exclusive style bits. All other
			# possible bits are cleared when the first matching bit
			# is found. Bits that are not part of the possible set
			# are untouched.
# 			
			# @static
			# @function
			# @author SWT-Team
# 			
			# @param style the original style bits
			# @param n the nth possible style bit (n is unlimited, pass as much as you want)
# 			
			# @returns {int} the new style bits
			# ###
			# mask = 0
			# for style in styles
				# mask |= style
# 				
			# style = styles[0]
# 			
			# if styles.length > 1
				# style |= styles[1] if (style & mask) is 0
# 				
				# for s in styles[1...]
					# style = (style & ~mask) | s if (style & s) isnt 0
# 
			# style
	

		###
		Checks wether the widget is disposed or not
		
		@throws gara.WidgetException <ul>
		 <li>gara.gara.ERROR_WIDGET_DISPOSED - If widget is disposed</li>
		</ul>
		
		@returns {void}
		###		
		checkWidget: ->
			throw new gara.widgets.WidgetException(gara.ERROR_WIDGET_DISPOSED) if @isDisposed()
	

		###
		Disposes the widget
		
		@returns {void}
		###		
		dispose: ->
			this.release() if @disposed
		
		
		###
		Destroys the widget
		
		@private
		###		
		destroyWidget: ->
			this.handle = null
			this.classes = null
			this.parent = null
			this.display = null
			this.parentNode = null
			this.listeners = null
			this.disposeListeners = null
			this.data = null
			this.dataMap = null

		dispatchEvent: (e) ->
			if @listeners.hasOwnProperty(e.type)
				@listeners[e.type].forEach (listener) ->
					if listener.handleEvent
						listener.handleEvent(e)
					else if typeof(listener) is 'function'
						listener.call(gara.global, e)


		fireEvent: (type, detail = null) ->
			event = gara.global.document.createEvent('CustomEvent')
			event.initCustomEvent(type, true, true, detail)
			@handle.dispatchEvent(event)


		getConfig: ->
			@config
		
		
		###
		Returns application based data for this widget, or <code>null</code> if it has not been set
		
		@returns {Object} application based data
		###		
		getData: (key) ->

			if key? && @dataMap.has(key)
				return @dataMap.get(key)
			else
				return @data
		
		###
		Returns the Display, the receiver is attached to
		
		@returns {gara.widgets.Display} the display
		###
		getDisplay: ->
			@display
	
		
		###
		Returns the ID for this widget. This ID is also used in the DOM handle.
		
		@return {String} the ID
		###
		getId: ->
			@id = gara.generateUID() if @id is ''
			@id
			

		###
		Returns an array of listeners who will be notified when an event of the given type occurs.

		@param {String} eventType the type of event to listen for 			
		@return {Array} an array of listeners that will be notified when the event occurs 
		###
		getListeners: (eventType) ->
			return @listeners[eventType] if Object::hasOwnProperty.call(@listeners, eventType)
			[]
		
		###
		Returns the receiver's parent. 
		
		@returns {gara.widgets.Widget|HTMLElement} the receiver's parent
		###
		getParent: ->
			@parent
	
		###
		Returns the style for this widget
		
		@returns {int} the style
		###
		getStyle: ->
			@style
	
	
		###
		Tests if there is a specified class available
		
		@param {String} className the class name to look for
		@returns {boolean} true if the class is available and false if not
		###
		hasClass: (className) ->
			@classes.contains(className)
	
	
		###
		Tells wether this widget is disposed or not
		
		@returns {boolean} true for disposed status otherwise false
		###
		isDisposed: ->
			@disposed
	
	
		###
		Returns <code>true</code> if there are any listeners for the specified event 
		type associated with the receiver, and <code>false</code> otherwise.
		
		@param {String} eventType the type of event to		
		@return {boolean} true if the event is hooked 
		###
		isListening: (eventType) ->
			Object::hasOwnProperty.call(@listeners, eventType)
	
		
		###
		Removes a CSS class name from this item.
		
		@param {String} className the class name that should be removed
		@returns {void}
		###
		removeClass: (className) ->
			@classes.remove(className)
			@handle.className = @classes.join(' ') if @handle?
			this
	
	
		###
		Removes a dispose listener from the widget
		
		@param {gara.events.DisposeListener} listener the listener which should be removed
		@returns {void}
		###
		removeDisposeListener: (listener) ->
			@disposeListeners.remove(listener)
			this
	
		
		###
		Removes a listener from this item
		
		@param {String} eventType the type of the event
		@param {Object} listener the listener
		@returns {void}
		###
		removeListener: (eventType, listener) ->
			if Object::hasOwnProperty.call(@listeners, eventType) and @listeners[eventType].contains(listener)
				@listeners[eventType].remove(listener)
			
			this
		
		release: ->
			@disposed = true
			
			# notify dispose listeners
			@fireEvent('dispose')
			@disposeListeners.forEach (listener) =>
				listener.widgetDisposed(this) if listener.widgetDisposed
			
			# remove attached listeners
			Object.keys(@listeners).forEach (eventType) =>
				@listeners[eventType].forEach (listener) =>
					@listeners[eventType].remove(listener)

			@releaseChildren()
			@destroyWidget()
		
		
		###
		Releases all children from the receiver
		
		@private
		@returns {void}
		###
		releaseChildren: ->
			
		
		###
		Sets a class on or off
		
		@param {String} className the class to set
		@param {boolean} on true for setting the class and false for removing
		@returns {void}
		###
		setClass: (className, active) ->
			if !active 
				@removeClass(className)
			else 
				@addClass(className)

			this
	
		
		###
		Sets application based data for this widget
		
		@param {Object} data your data for this widget
		@returns {void}
		###
		setData: (key, data) ->
			if key?
				@dataMap.set(key, data)
			else
				@data = key
			this
	
		
		###
		Sets the ID for this widget. Even sets the ID in the DOM handle wether
		the widget is created
		
		@param {String} id the ID
		@returns {void}
		###
		setId: (@id) ->
			this
	
		
		###
		Toggles a class
		
		@param {String} className the class to toggle
		@returns {void}
		###
		toggleClass: (className) ->
			if @classes.contains(className)
				@classes.remove(className)
			else
				@classes.push(className)
					
			@handle.className = @classes.join(' ') if @handle?
	
	
		toString: ->
			'[gara.widgets.Widget]'
			
		###
			unbindListener: (eventType, listener) ->
		
			Unbinds listener from the widgets elements. Should be implemented
			by the widget authors!
 			
			@private
			@param {String} eventType the type of the event
			@param {Object} listener the listener
			@see unbindListener
			@returns {void}
			
			alert('Trying to unbind listener on ' + this + '. Method not implemented.\n' +
				'    Type: ' + eventType + '\n' +
				'    Listener: ' + listener);
				###

	gara.namespace 'gara.widgets'
	gara.widgets.Widget = Widget
	exports.Widget = Widget