###
gara - Javascript Toolkit

Copyright (c) 2007 Thomas Gossmann

Homepage:
	http://garajs.org

This library is free software;  you  can  redistribute  it  and/or
modify  it  under  the  terms  of  the   GNU Lesser General Public
License  as  published  by  the  Free Software Foundation;  either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in  the hope  that it  will be useful,
but WITHOUT ANY WARRANTY; without  even  the  implied  warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See  the  GNU
Lesser General Public License for more details.
###

define 'gara/widgets/Control', ['require', 'exports', 'gara/widgets/Widget'], (require, exports) ->

	#gara.namespace 'gara.widgets'
	#gara.use('gara.widgets.Item');
	#gara.use('gara.widgets.Composite');
	#gara.use('gara.widgets.Menu');
	#gara.use('gara.widgets.Display');
	Widget = require('gara/widgets/Widget')

	###	
	Control class
	###
	class Control extends Widget
		# ###
		# Holds the focus state.
# 		
		# @private
		# @type {boolean}
		# ###
		# hasFocus: false
# 	
		# ###
		# Contains the context menu.
# 		
		# @private
		# @type {gara.widgets.Menu}
		# ###
		# menu: null
# 	
		# ###
		# Holds the enabled state.
# 		
		# @private
		# @type {boolean}
		# ###
		# enabled: true
# 	
		# ###
		# Holds the visible state.
# 			
		# @private
		# @type {boolean}
		# ###
		# visible: true
# 	
		# ###
		# X coordinate relative to the Control's parent
# 		
		# @private
		# @type {int}
		# ###
		# x: null
# 	
		# ###
		# Y coordinate relative to the Control's parent
# 		
		# @private
		# @type {int}
		# ###
		# y: null
# 	
		# ###
		# X Mouse Coordinate. Mouse Coords are used to show the context menu at this position.
# 		
		# @private
		# @type {int}
		# ###
		# mouseX: 0
# 	
		# ###
		# Y Mouse Coordinate. Mouse Coords are used to show the context menu at this position.
# 		
		# @private
		# @type {int}
		# ###
		# mouseY: 0
# 	
		# ###
		# Contains the Control's width. Null is auto.
# 		
		# @private
		# @type {int}
		# ###
		# width: 0
# 	
		# ###
		# Contains the Control's height. Null is auto.
# 		
		# @private
		# @type {int}
		# ###
		# height: 0

		constructor: (parent, config) ->
			# init
			@controlListeners = []
			@focusListeners = []
			@keyListeners = []
			@mouseListeners = []
			@mouseMoveListeners = []
			@mouseTrackListeners = []
			@mouseWheelListeners = []
	
			@width = null
			@height = null
	
			@hasFocus = false
			@menu = null
			@enabled = true
			@visible = true
			@hovering = false
	
			@mouseX = 0
			@mouseY = 0
			@x = null
			@y = null

			@positionOffsetX = null
			@positionOffsetY = null

			# parse config
			@config.border = config.border || false

			super(parent, config)
			@addClass('gara-control')
			@setClass('gara-border', @config.border)

			# parent node
			if @parent isnt null and @parent.getClientArea
				@parentNode = @parent.getClientArea()
			else
				@parentNode = @parent

			@shell = if parent.getShell then parent.getShell() else null
			@createWidget(config)
			@display.addWidget(this)
			
			@addListener('contextmenu', this)

			# register config passed events
			if config.events
				Object.keys(config.events).forEach (key) =>
					@addListener(key, config.events[key])

		###
		Adds the listener to the collection of listeners who will be notified when the control 
		is moved or resized, by sending it one of the messages defined in the 
		<code>ControlListener</code> interface. 
		 
		@param {gara.events.ControlListener} listener the listener which should be notified
		@returns {gara.widgets.Control} this
		###
		addControlListener: (listener) ->
			@checkWidget()
			@controlListeners.add(listener) if !@controlListeners.contains(listener)
			this
		
		
		###
		Adds the listener to the collection of listeners who will be notified
		when the control gains or loses focus, by sending it one of the messages
		defined in the <code>FocusListener</code> interface.
		 
		@param {gara.events.FocusListener} listener the listener which should be notified
		@returns {gara.widgets.Control} this
		###
		addFocusListener: (listener) ->
			@checkWidget();
			@focusListeners.add(listener) if !@focusListeners.contains(listener)
			this
	
		###
		Adds the listener to the collection of listeners who will be notified
		when keys are pressed and released on the system keyboard, by sending
		it one of the messages defined in the <code>KeyListener</code> interface.
		 
		@param {gara.events.KeyListener} listener the listener which should be notified
		@returns {gara.widgets.Control} this
		###
		addKeyListener: ( ->
			registered = false	
			(listener) ->
				@checkWidget()
				@keyListeners.add(listener) if !@keyListeners.contains(listener)

				if !registered
					@addListener('keydown', this)
					@addListener('keyup', this)
					registered = true

				this
		)()
	
	
		###
		Adds the listener to the collection of listeners who will be notified
		when mouse buttons are pressed and released, by sending it one of the
		messages defined in the <code>MouseListener</code> interface.

		@param {gara.events.MouseListener} listener the listener which should be notified
		@returns {gara.widgets.Control} this
		###
		addMouseListener: ( ->
			registered = false	
			(listener) ->
				@checkWidget()
				@mouseListeners.add(listener) if !@mouseListeners.contains(listener)

				if !registered
					@addListener('mousedown', this)
					@addListener('mouseup', this)
					@addListener('dblclick', this)
					registered = true

				this
		)()

			
		
		###
		Adds the listener to the collection of listeners who will be notified 
		when the mouse moves, by sending it one of the messages defined in the 
		<code>MouseMoveListener</code> interface. 

		@param {gara.events.MouseMoveListener} listener the listener which should be notified
		@returns {gara.widgets.Control} this
		###
		addMouseMoveListener: ( ->
			registered = false
			(listener) ->
				@checkWidget()
				@mouseMoveListeners.add(listener) if !@mouseMoveListeners.contains(listener)
	
				if !registered
					@addListener('mousemove', this)
					registered = true
					
				this
		)()


		###
		Adds the listener to the collection of listeners who will be notified
		when the mouse passes or hovers over controls, by sending it one of the
		messages defined in the <code>MouseTrackListener</code> interface. 
		 
		@param {gara.events.MouseTrackListener} listener the listener which should be notified
		@returns {gara.widgets.Control} this
		###
		addMouseTrackListener: (() ->
			registered = false
			(listener) ->
				@checkWidget()
				@mouseTrackListeners.add(listener) if !@mouseTrackListeners.contains(listener)
						
				if !registered
					@addListener('mouseover', this)
					@addListener('mouseout', this)
					registered = true

				this
		)()
		
	
		###
		Adds the listener to the collection of listeners who will be notified 
		when the mouse wheel is scrolled, by sending it one of the 
		messages defined in the <code>MouseWheelListener</code> interface. 

		@param {gara.events.MouseWheelListener} listener the listener which should be notified
		@returns {gara.widgets.Control} this
		###
		addMouseWheelListener: (() ->
			registered = false
			(listener) -> 
				@checkWidget()
				@mouseWheelListeners.add(listener) if !@mouseWheelListeners.contains(listener)
						
				if !registered
					@addListener('mousewheel', this)
					registered = true
					
				this
		)()

		###
		Adjust the height of the receiver. For internal usage only.
		
		@private
		@param {int} height the new height
		@returns {void}
		###	
		adjustHeight: (height) ->
			# absolute value
			if height > 1
				@handle.style.height = window.parseInt(height, 10) + 'px'
	
			# null => auto
			else if height is null
				@handle.style.height = 'auto'
			
			# percentage
			else if height >= 0 and height <= 1
				@handle.style.height = height * 100 + '%'
			
	
		###
		Adjust the width of the receiver. For internal usage only.
		
		@private
		@param {int} width the new width
		@returns {void}
		###		
		adjustWidth: (width) ->
			# absolute value
			if width > 1
				@handle.style.width = parseInt(width, 10) + 'px'
	
			# null => auto
			else if width is null
				@handle.style.width = 'auto'
			
			# percentage
			else if width >= 0 and width <= 1
				@handle.style.width = width * 100 + '%'
	
	
		
		# ###
		# Internal method for creating a node representing an item. This is used for
		# creating a new item or put updated content to an existing node of an earlier
		# painted item. Registers user defined events. Should be overridden by subclasses.
		# 		 
		# @private
		# ###
		#createWidget: ->
			
		###
		Creates the dom node for the handle. Should be called by subclasses in createWidget.
		 
		@private
		@param {String} element node name for the handle element
		@param {boolean} preventAppending when <code>true</code> the handles isn't appended to the parent
		@returns {void}
		###
		createHandle: (element, preventAppending = false) ->
			@handle = gara.global.document.createElement(element)
			@handle.id = @getId()
			@handle.widget = this
			@handle.control = this
			@handle.tabIndex = if @enabled then 0 else -1
			@handle.className = @classes.join(' ')
			@addHandleToDOM() if !preventAppending
	
	
		addHandleToDOM: ->
			if @parentNode isnt null
				@parentNode.appendChild(@handle)
	
				@x = @handle.offsetLeft
				@y = @handle.offsetTop
				@positionOffsetX = @handle.offsetLeft
				@positionOffsetY = @handle.offsetTop
	
	
		destroyWidget: ->
			@display.removeWidget(this)
			
			if @parentNode isnt null
				try
					@parentNode.removeChild(@handle)
				catch e 
	
			@controlListeners = []
			@focusListeners = []
			@keyListeners = []
			@mouseListeners = []
			@mouseMoveListeners = []
			@mouseTrackListeners = []
			@mouseWheelListeners = []
	
			@shell = null
			@parentNode = null
			
			super
	
		
		###
		Forces the receiver to gain focus.
		 
		@returns {void}
		###
		forceFocus: ->
			@handle.setAttribute('data-gara-forcefocus', true)
			@handle.focus()
	
	
		###
		Returns <code>true</code> if the receiver is enabled, and <code>false</code> otherwise.
		 
		@returns {boolean} the receiver's enabled state
		###
		getEnabled: ->
			@enabled
	
	
		###
		Returns the receiver's height.
		 
		@returns {int} the receivers height in pixels
		###
		getHeight: ->
			@height
	
			
		###
		Returns the receiver's location.
		
		@returns {Object} obj.x contains the left offset and obj.y the top offset
		###
		getLocation: ->
			{
				x: @x,
				y: @y
			}
		
		
		###
		Returns the receiver's shell.
		
		@returns {gara.widgets.Shell}
		###
		getShell: ->
			@shell
			
			
		###
		Returns the receiver's width.
		 
		@returns {int} the <code>Control</code>'s width in pixels
		###
		getWidth: ->
			@width
	
		###
		Returns the receiver's visibility.
		
		@returns {boolean} true if visible
		###
		getVisible: ->
			@visible
	
		###
		Handles <code>Control</code> related events.
		 
		@private
		@param {Event} e
		@returns {void}
		###
		handleEvent: (e) ->
			if @isDisposed()
				return

			console.log 'Control.handleEvent: ' + e.type

			switch e.type
				when 'keydown'
					@keyListeners.forEach (listener) ->
						listener.keyPressed(e) if listener.keyPressed

				when 'keyup'
					@keyListeners.forEach (listener) ->
						listener.keyReleased(e) if listener.keyReleased
	
				when 'dblclick'
					@mouseListeners.forEach (listener) ->
						listener.mouseDoubleClick(e) if listener.mouseDoubleClick
	
				when 'mousedown'
					@mouseListeners.forEach (listener) ->
						listener.mouseDown(e) if listener.mouseDown
	
				when 'mouseup'
					@mouseListeners.forEach (listener) ->
						listener.mouseUp(e) if listener.mouseUp
	
				when 'mousemove'
					@mouseX = (e.pageX || e.clientX + document.documentElement.scrollLeft) + 1;
					@mouseY = (e.pageY || e.clientY + document.documentElement.scrollTop) + 1;
					
					@mouseMoveListeners.forEach (listener) ->
						listener.mouseMove(e) if listener.mouseMove
	
				when 'mouseover'
					if e.widget is this or
					(e.widget instanceof gara.widgets.Item and e.control is this)
						if !@hovering
							@mouseTrackListeners.forEach (listener) ->
								listener.mouseEnter(e) if listener.mouseEnter
							@hovering = true
		
						@mouseTrackListeners.forEach (listener) ->
							listener.mouseHover(e) if listener.mouseHover
	
				when 'mouseout'
					if !e.relatedTarget or typeof e.relatedTarget.widget is 'undefined' or
					(e.relatedTarget.widget isnt this and 
					e.relatedTarget.widget instanceof gara.widgets.Item and
					e.relatedTarget.control isnt this)
					
						@mouseTrackListeners.forEach (listener) ->
							listener.mouseExit(e) if listener.mouseExit
						@hovering = false;
	
				when 'mousewheel'
					@mouseWheelListeners.forEach (listener) ->
						listener.mouseScrolled(e) if listener.mouseScrolled
						
			e.preventDefault()
	
		###
		Handles the receiver's <code>Menu</code>.
		 
		@private
		@param {Event} e the user-event
		@returns {void}
		###
		handleMenu: (e) ->
			switch e.type
				when 'keydown'
					# context menu on shift + F10
					if @menu isnt null and e.shiftKey and e.keyCode is gara.F10
						@menu.update()
						@menu.setLocation(@mouseX, @mouseY)
						@menu.setVisible(true, e)
						e.preventDefault()
	
				when 'contextmenu'
					if @menu isnt null
						@menu.update()
						@menu.setLocation(@mouseX, @mouseY)
						@menu.setVisible(true, e)
						e.preventDefault(); # hide browser context menu
	
		###
		Returns true if the receiver has <i>keyboard-focus</i>, and false otherwise.
		 
		@returns {boolean} the receiver's focus state
		###
		isFocusControl: ->
			@display.getFocusControl() is this
	
		
		menuShell: ->
			return @parent.menuShell() if @parent.menuShell
			null
	
		
		###
		@summary
		Moves the receiver above the specified control in the drawing order.
		
		@description
		Moves the receiver above the specified control in the drawing order. If no argument, 
		then the receiver is moved to the top of the drawing order. The control at the top of the 
		drawing order will not be covered by other controls even if they occupy intersecting areas. 
		 
		@param {gara.widgets.Control} control the sibling control (optional)
		@returns {void}
		###
		moveAbove: (control) ->
			if @getParent().getChildren
				layers = @getParent().getChildren()
				layers.remove(this)
				layers.insertAt((control and if layers.contains(control) then layers.indexOf(control) else 0), this)
				layers.forEach (widget, index, layers) ->
					widget.handle.style.zIndex = 1 + (layers.length - index)
	
		
		###
		@summary
		Moves the receiver below the specified control in the drawing order.
		
		@description
		Moves the receiver below the specified control in the drawing order. If no argument, 
		then the receiver is moved to the bottom of the drawing order. The control at the bottom of 
		the drawing order will be covered by all other controls which occupy intersecting areas. 
		 
		@param {gara.widgets.Control} control the sibling control (optional)
		@returns {void}
		###
		moveBelow: (control) ->
			if @getParent().getChildren
				layers = @getParent().getChildren()
				layers.remove(this)
				layers.insertAt((control and if layers.contains(control) then layers.indexOf(control) + 1 else layers.length), this)
				layers.forEach (widget, index, layers) ->
					widget.handle.style.zIndex = 1 + (layers.length - index)
	
		
		###
		@private
		@param eventType
		@returns {boolean} true if the operation is permitted
		###
		notifyFocusListener: (eventType) ->
			ret = true
			e = @event or window.event or {}
			e.widget = this
			e.control = this
	
			@focusListeners.forEach (listener) ->
				if listener[eventType]
					answer = listener[eventType](e)
					ret = answer if answer?
					
			ret
	
	
		###
		@private
		@param eventType
		@returns {boolean} true if the operation is permitted
		###
		notifyResizeListener: ->
			ret = true 
			e = @event or window.event or {}
			e.widget = this
			e.control = this
	
			@controlListeners.forEach (listener) ->
				if listener.controlResized
					answer = listener.controlResized(e);
					ret = answer if answer?
					
			ret
			
			
		###
		Prevents the browser from scrolling the window. Prevents the default when
		the either one of the following keys is pressed:
		<ul>
		 <li>Arrow Keys</li>
		 <li>Page up and down keys</li>
		 <li>Home Key</li>
		 <li>End Key</li>
		 <li>Spacebar</li>
		</ul>
		 
		@private
		###
		preventScrolling: (e) ->
			if e.keyCode is gara.ARROW_UP or e.keyCode is gara.ARROW_DOWN or
			e.keyCode is gara.ARROW_LEFT or e.keyCode is gara.ARROW_RIGHT or
			e.keyCode is gara.PAGE_UP or e.keyCode is gara.PAGE_DOWN or
			e.keyCode is gara.HOME or e.keyCode is gara.END or
			e.keyCode is gara.SPACE
			#  or (e.keyCode is 65 and e.ctrlKey) ctrl + a
				e.preventDefault()
	
		
		###
		Removes the listener from the collection of listeners who will be notified
		when the control is moved or resized.
		 
		@param {gara.events.ControlListener} listener the listener which should no longer be notified
		@returns {gara.widgets.Control} this
		###
		removeControlListener: (listener) ->
			@checkWidget()
			@controlListeners.remove(listener)
			this
		
		
		###
		Removes the listener from the collection of listeners who will be notified 
		when the control gains or loses focus.
		 
		@param {gara.events.FocusListener} listener the listener which should no longer be notified
		@returns {gara.widgets.Control} this
		###
		removeFocusListener: (listener) ->
			@checkWidget()
			@focusListeners.remove(listener)
			this
	
		
		###
		Removes the listener from the collection of listeners who will be notified 
		when keys are pressed and released on the system keyboard. 
		 
		@param {gara.events.KeyListener} listener the listener which should be notified
		@returns {gara.widgets.Control} this
		###
		removeKeyListener: (listener) ->
			@checkWidget()
			@keyListeners.remove(listener)
			this
	
		
		###
		Removes the listener from the collection of listeners who will be notified 
		when mouse buttons are pressed and released. 
		 
		@param {gara.events.MouseListener} listener the listener which should be notified
		@returns {gara.widgets.Control} this
		###
		removeMouseListener: (listener) ->
			@checkWidget()
			@mouseListeners.remove(listener)
			this
		
		
		###
		Removes the listener from the collection of listeners who will be notified
		when the mouse moves. 
		 
		@param {gara.events.MouseMoveListener} listener the listener which should be notified
		@returns {gara.widgets.Control} this
		###
		removeMouseMoveListener: (listener) ->
			@checkWidget()
			@mouseMoveListeners.remove(listener)
			this
			
		
		###
		Removes the listener from the collection of listeners who will be notified 
		when the mouse passes or hovers over controls. 
		 
		@param {gara.events.MouseTrackListener} listener the listener which should be notified
		@returns {gara.widgets.Control} this
		###
		removeMouseTrackListener: (listener) ->
			@checkWidget()
			@mouseTrackListeners.remove(listener)
			this
		
			
		###
		Removes the listener from the collection of listeners who will be notified 
		when the mouse wheel is scrolled. 
		 
		@param {gara.events.MouseWheelListener} listener the listener which should be notified
		@returns {gara.widgets.Control} this
		###
		removeMouseWheelListener: (listener) ->
			@checkWidget()
			@mouseWheelListeners.remove(listener)
			this
	
	
		###
		Sets the receiver's enabled state.
		 
		@param {boolean} enabled true for enabled and false for disabled state
		@returns {gara.widgets.Control} this
		###
		setEnabled: (@enabled) ->
			@handle.setAttribute('aria-disabled', !@enabled);
			@handle.tabIndex = if @enabled then 0 else -1
			this
			
		
		###
		Tries to set focus on the receiver.
		
		@returns {gara.widgets.Control} this
		###
		setFocus: ->
			@handle.focus()
			this
	
	
		###
		Sets the receiver's height.
		 
		@param {mixed} height the new height <ul>
		 <li>height > 1: height in pixels</li>
		 <li>height = [0; 1]: height in percent</li>
		 <li>height = null: height is auto</li>
		</ul>
		@returns {gara.widgets.Control} this
		###
		setHeight: (@height) ->
			@adjustHeight(@height)
			@parent.layout() if height is null and @parent instanceof gara.widgets.Composite
			@controlListeners.forEach((listener) ->
				listener.controlResized({widget:this}) if listener.controlResized
			, this)
	
			this
	
		
		###
		Sets the receiver's location.
		
		@param {int} x the new left offset
		@param {int} y the new top offset
		@returns {gara.widgets.Control} this
		###
		setLocation: (x, y) ->
			if x >= 0
				@x = x;
				@handle.style.left = (x - @positionOffsetX) + 'px'
	
			if y >= 0
				@y = y;
				@handle.style.top = (y - @positionOffsetY) + 'px'
			
			@controlListeners.forEach((listener) ->
				listener.controlMoved({widget:this}) if listener.controlMoved
			, this)
	
			this
	
	
		###
		Set a <code>Menu</code> for the receiver.
		 
		@param {gara.widget.Menu} menu the new <code>Menu</code>
		@throws {TypeError} if the menu is not instance of <code>gara.widgets.Menu</code>
		@returns {gara.widgets.Control} this
		###
		setMenu: (menu) ->
			if menu isnt null and !menu instanceof gara.widgets.Menu
				throw new TypeError('menu is not a gara.widgets.Menu')
	
			# remove menu
			if @menu and menu is null
				@removeListener('contextmenu', this)
				@removeListener('mousedown', this)
				gara.removeEventListener(document, 'mousemove', this)
	
				@handle.setAttribute('aria-haspopup', false)
				@handle.removeAttribute('aria-owns')
	
	
			# set menu
			else
				@addListener('contextmenu', this)
				@addListener('mousedown', this)
				gara.addEventListener(document, 'mousemove', this)
	
				@handle.setAttribute('aria-haspopup', true)
				@handle.setAttribute('aria-owns', menu.getId())
	
			@menu = menu
			this
		
		
		###
		Sets the receiver's size. Either the x and y parameters or the object is passed.
		
		@param {int} x the new width
		@param {int} y the new height
		@param {Object} obj an object containing the new size obj.x and obj.y
		@returns {gara.widgets.Control} this
		###
		setSize: (args...)->
			if args.length is 2
				@setWidth(args[0])
				@setHeight(args[1])
			else
				@setWidth(arguments[0].x)
				@setHeight(arguments[0].y)
			
			this
		
	
		###
		Sets the receiver's visibility.
		
		@param {boolean} visible <code>true</code> for visible or <code>false</code> for invisible
		@returns {gara.widgets.Control} this
		###
		setVisible: (@visible) ->
			@handle.style.display = if @visible then 'block' else 'none'
			this
	
		
		###
		Sets the receiver's width.
		 
		@param {mixed} width the new width <ul>
		 <li>width > 1: width in pixels</li>
		 <li>width = [0; 1]: width in percent</li>
		 <li>else: width is auto</li>
		</ul>
		@returns {gara.widgets.Control} this
		###
		setWidth: (@width) ->
			@adjustWidth(width)
			@parent.layout() if width is null and @parent instanceof gara.widgets.Composite
			@controlListeners.forEach((listener) ->
				listener.controlResized({widget:this}) if listener.controlResized
			, this)
	
			this
	
		
		topHandle: ->
			###
			Returns the top handle.
			 
			@private
			@returns {HTMLElement}
			###
			@handle
			
		toString: ->
			'[gara.widgets.Control]'
	
		update: ->
			###
			Updates outstanding changes in the receiver. E.g. Does some outstanding paint processes or
			remeasures the boundaries
			 
			@returns {void}
			###
			# alert('Control.update() invoked on ' + this + '. Method not implemented');

	gara.namespace('gara.widgets')
	gara.widgets.Control = Control
	exports.Control = Control