###
gara - Javascript Toolkit

Copyright (c) 2007 Thomas Gossmann

Homepage:
	http://garajs.org

This library is free software  you  can  redistribute  it  and/or
modify  it  under  the  terms  of  the   GNU Lesser General Public
License  as  published  by  the  Free Software Foundation  either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in  the hope  that it  will be useful,
but WITHOUT ANY WARRANTY without  even  the  implied  warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See  the  GNU
Lesser General Public License for more details.
###

define 'gara/widgets/Shell', ['require', 'exports', 'gara/widgets/Decorations'], (require, exports) ->
	#gara.use("gara.widgets.Display")
	
	Decorations = require 'gara/widgets/Decorations'

	class Shell extends Decorations
		###
		Represents a Shell
		###
		
		###
		Contains the alpha value of this shell
		
		@private
		@type {int} 
		###
		alpha: 100
		
		###
		Contains the shell listeners
		
		@private
		@type {gara.events.ShellListener[]}
		###
		shellListeners: null
		
		
		constructor: (parent, config = {}) ->
			###
			@param {gara.widgets.Shell|gara.widgets.Display} parent the parent container for the new shell (optinal)
			@param {void} style the style for the new shell (optional)
			###
			if !parent instanceof gara.widgets.Shell and !parent instanceof gara.widgets.Display
				config.style = config?.style | gara.SHELL_TRIM
				parent = gara.widgets.Display.getDefault()
			else
				config.style |= gara.DIALOG_TRIM

	
			self = this
			@enabled = false
			@maximized = false
			@minimized = false
			@fullScreen = false
			@shellListeners = []
			@alpha = 100
			@resizeListener = 
				handleEvent: =>
					@adjustWidth(window.document.documentElement.clientWidth)
					@adjustHeight(window.document.documentElement.clientHeight)
					@layout()

	#		@tabIndexes = []
	#		@tabIndexElements = []
	#		@tabbableTags = ["A","BUTTON","TEXTAREA","INPUT","IFRAME","DIV","UL","SPAN"]
	
			config.style = gara.widgets.Shell.checkStyle(config.style)
	
			super(parent, config)
		
		
		addShellListener: (listener) ->
			###
			Adds the listener to the collection of listeners who will be notified when operations are 
			performed on the receiver, by sending the listener one of the messages defined in the 
			<code>ShellListener</code> interface.
			
			@param listener {gara.events.ShellListener} the listener which should be notified
			@returns {gara.widgets.Shell} this 
			###
			@shellListeners.add(listener) if !@shellListeners.contains(listener)
			this
		
		
		adjustHeight: (height) ->
			# jsdoc in gara.widgets.Control
			if @fullScreen
				@restoreHeight = height
				return
			
			super(height)


		adjustWidth: (width) ->
			# jsdoc in gara.widgets.Control
			if @fullScreen
				@restoreWidth = width
				return
			
			super(width)
	
	
		@checkStyle: (style) ->
			###
			Checks the consistency of the shell's style.
			
			@static
			@function
			@param {int} style the style
			@returns {int} the consistent style
			###
			style = gara.widgets.Decorations.checkStyle(style)
	
			return style
		
		
		close: ->
			###
			Closes the shell.
			
			@returns {void}
			###
			if @notifyShellListener("shellClosed")
				@handle.blur()
				@setVisible(false)
				@getDisplay().setActiveShell(null)

		
		createWidget: ->
			###
			Creates the HTML.
			@private
			###
			super()
			@addClass("garaShell")
	
			@positionOffsetX = 0
			@positionOffsetY = 0
			@x = @y = null
	
			@setVisible(false)
			
			if (@style & gara.TITLE) isnt 0
				@handle.setAttribute("role", "dialog")
	
	#		@addListener("keydown", this)
			gara.addEventListener(window.document, "keydown", this)
	
			if @stub
				@handle.parentNode.removeChild(@stub)
				delete @stub
				@stub = null
			
		
		destroyWidget: ->
			###
			Destroys the shell.
			
			@private
			@returns {void}
			###
			@shellListeners = []
			super()
	
	#	###
	#	Focus the shell and disables tab indexes
	#	
	#	Code below taken from subModal {@link http:#gabrito.com/files/subModal/}
	#	
	#	@private
	#	###
	#	focusGained : function (e) {
	#		if (@notifyShellListener("shellActivated")) {
	#			# store tab indexes
	#			var i = 0, j, k, tagElements
	#			for (j = 0 j < @tabbableTags.length j++) {
	#				tagElements = document.getElementsByTagName(@tabbableTags[j])
	#				for (k = 0  k < tagElements.length k++) {
	#					@tabIndexes[i] = tagElements[k].tabIndex
	#					@tabIndexElements[i] = tagElements[k]
	#					tagElements[k].tabIndex = "-1"
	#					i++
	#				}
	#			}
	#	
	#			@$super(e)
	#		}
	#	},
	#	
	#	###
	#	@method
	#	Focus of the shell gets lost and tab indexes get restored
	#	
	#	Code below taken from subModal {@link http:#gabrito.com/files/subModal/}
	#	
	#	@private
	#	###
	#	focusLost : function (e) {
	#		if (@notifyShellListener("shellDeactivated")) {
	#			# restore tab indexes
	#			for (var i = 0, len = @tabIndexElements.length i < len ++i) {
	#				@tabIndexElements[i].tabIndex = @tabIndexes[i]
	#			}
	#	
	#			@tabIndexes = []
	#			@tabIndexElements = []
	#	
	#			@$super(e)
	#		}
	#	},
		
		
		forceActive: ->
			###
			Forces the receiver to be the active control.
			
			@returns {void}
			###
			@handle.setAttribute("data-gara-forceactive", true)
			@setActivate()

	
		getAlpha: ->
			###
			Returns the receiver's opacity
			
			@see gara.widgets.Shell#setAlpha
			@returns {int} the alpha value
			###
			return @alpha

		
		getFullScreen: ->
			###
			Returns <code>true</code> when the receiver is in fullscreen else <code>false</code>
			
			@see gara.widgets.Shell#setFullScreen
			@returns {boolean} <code>true</code> for fullscreen and <code>false</code> otherwise
			###
			return @fullScreen

		
		getShell: ->
			###
			Returns this
			
			@returns {gara.widgets.Shell} this
			###
			return this

		
		handleEvent: (e) ->
			###
			Internal event handler
			
			@private
			@param {Eventl} e
			@returns {void}
			###
			propagate = true
			switch e.type
				when "click"
					if e.target is  @titleCloseButton
						@close()
						propagate = false
				
				when "keydown"
					if e.keyCode is gara.ESC and !e.preventShellClose
						@close()
						propagate = false
			
			super(e) if propagate
		
		
		moveAbove: (control) ->
			###
			Moves the receiver above the specified control in the drawing order.
			
			@description
			Moves the receiver above the specified control in the drawing order. If no argument, 
			then the receiver is moved to the top of the drawing order. The control at the top of the 
			drawing order will not be covered by other controls even if they occupy intersecting areas. 
			
			@param {gara.widgets.Control} control the sibling control (optional)
			###
			shells = @getDisplay().getShells()
			shells.remove(this)
			shells.insertAt((control and if shells.contains(control) then shells.indexOf(control) else 0), this)
			shells.forEach (shell, index, shells) ->
				shell.handle.style.zIndex = 1 + (shells.length - index)
		
		
		moveBelow: (control) ->
			###
			Moves the receiver below the specified control in the drawing order.
			
			@description
			Moves the receiver below the specified control in the drawing order. If no argument, 
			then the receiver is moved to the bottom of the drawing order. The control at the bottom of 
			the drawing order will be covered by all other controls which occupy intersecting areas. 
			
			@param {gara.widgets.Control} control the sibling control (optional)
			###
			shells = @getDisplay().getShells()
			shells.remove(this)
			shells.insertAt((control and if shells.contains(control) then shells.indexOf(control) + 1 else shells.length), this)
			shells.forEach (shell, index, shells) ->
				shell.handle.style.zIndex = 1 + (shells.length - index)
	
		
		notifyShellListener: (eventType) ->
			###
			Notifies shell listener, that a specific event happens.
			
			@private
			@param {String} eventType
			@returns {boolean} true if the operation is permitted
			###
			ret = true 
			e = @event || window.event || {}
			e.widget = this
			e.control = this
				
			@shellListeners.forEach (listener) ->
				if listener[eventType]
					answer = listener[eventType](e)
					ret = answer if answer?
			ret
		
		
		open: ->
			###
			Opens the receiver.
			
			@returns {void}
			###
			x = if @parent instanceof gara.widgets.Display then document.documentElement.clientWidth else @parent.getClientArea().clientWidth
			y = if @parent instanceof gara.widgets.Display then document.documentElement.clientHeight else @parent.getClientArea().clientHeight
	#		@setWidth(Math.floor(x / 2))
	#		@setHeight(Math.floor(y / 2))
			
			@setVisible(true)
			@setFocus()
			
			@x = Math.floor(x / 2) - @handle.offsetWidth / 2 if @x is null
			@y = Math.floor(y / 2) - @handle.offsetHeight / 2 if @y is null
			
			@setLocation(@x, @y)
			
			@adjustWidth(@getWidth())
			@adjustHeight(@getHeight())
		
		
		removeShellListener: (listener) ->
			###
			Removes the listener from the collection of listeners who will be notified when 
			operations are performed on the receiver.
			
			@param {gara.events.ShellListener} listener the listener which should no longer be notified 
			@returns {gara.widgets.Shell} this
			###
			@shellListeners.remove(listener)
			this
		
		
		setActive: ->
			###
			Sets the receiver to be the active shell.
			
			@returns {boolean} <code>true</code> when setting the shell active or <code>false</code> if not
			###
			if @getMinimized()
				return false

	
			activeShell = @getDisplay().getActiveShell()
	
			# return false, if activeShell can't be deactivated and true if the active shell is this
			return true if activeShell is this
			return false if activeShell isnt null && !activeShell.notifyShellListener("shellDeactivated")
						
			activate = @notifyShellListener("shellActivated")
			
			@getDisplay().setActiveShell(this) if @handle.hasAttribute("data-gara-forceactive") || activate
			@handle.removeAttribute("data-gara-forceactive")
			
			activate

		
		setAlpha: (@alpha) ->
			###
			Sets the shell's transparency value, which must be between 0 (transparent) and 100 (opaque).
			
			@see gara.widgets.Shell#getAlpha
			@param {int} alpha the alpha value
			@returns {gara.widgets.Shell} this
			###
			@handle.style.opacity = alpha / 100
	
			this

		
		setFullScreen: (fullScreen) ->
			###
			Sets the receiver's fullscreen
			
			@see gara.widgets.Shell#getFullScreen
			@param {boolean} fullScreen <code>true</code> for fullscreen otherwise <code>false</code>
			@returns
			###
			id = if @getParent().getId then @getParent().getId() else @getParent().id
	
			if fullScreen
				if @minimized
					gara.widgets.Decorations.minis[id][gara.widgets.Decorations.minis[id].indexOf(this)] = undefined
				
				@restoreWidth = @handle.offsetWidth if @restoreWidth is null
				@restoreHeight = @handle.offsetHeight if @restoreHeight is null
				
				# hide elements from DIALOG_TRIM:
				# title
				if (@style & gara.TITLE) isnt 0
					@title.style.display = "none"
				
				# resize
				if (@style & gara.RESIZE) isnt 0
					@resizeNNW.style.display = "none"
					@resizeWNW.style.display = "none"
					@resizeN.style.display = "none"
					@resizeNNE.style.display = "none"
					@resizeENE.style.display = "none"
					@resizeE.style.display = "none"
					@resizeW.style.display = "none"
					@resizeSSW.style.display = "none"
					@resizeWSW.style.display = "none"
					@resizeS.style.display = "none"
					@resizeSSE.style.display = "none"
					@resizeESE.style.display = "none"
				
				# border
				@setClass("garaBorder", false)
				
				# do measuring
				@handle.style.left = 0
				@handle.style.top = 0
				@handle.style.width = parent.clientWidth + "px"
				@handle.style.height = parent.clientHeight + "px"
				@clientArea.style.width = parent.clientWidth + "px"
				@clientArea.style.height = (parent.clientHeight - (if @title then @title.clientHeight else 0) - @menuBarNode.offsetHeight) + "px"
				
				# add listener to keep the fullscreen shell full screen
				gara.addEventListener(window, "resize", @resizeListener)
	
			@fullScreen = fullScreen
			
			if !fullScreen
				# show elements from DIALOG_TRIM:
				# title
				if (@style & gara.TITLE) isnt 0
					@title.style.display = "block"
				
				# resize
				if (@style & gara.RESIZE) isnt 0
					@resizeNNW.style.display = "block"
					@resizeWNW.style.display = "block"
					@resizeN.style.display = "block"
					@resizeNNE.style.display = "block"
					@resizeENE.style.display = "block"
					@resizeE.style.display = "block"
					@resizeW.style.display = "block"
					@resizeSSW.style.display = "block"
					@resizeWSW.style.display = "block"
					@resizeS.style.display = "block"
					@resizeSSE.style.display = "block"
					@resizeESE.style.display = "block"
				
				# border
				@setClass("garaBorder", (@style & gara.BORDER) isnt 0)
				
				# do measuring
				@handle.style.left = @x + "px"
				@handle.style.top = @y + "px"
				@adjustWidth(@restoreWidth)
				@adjustHeight(@restoreHeight)
				@restoreWidth = null
				@restoreHeight = null
				
				gara.removeEventListener(window, "resize", @resizeListener)

			@layout()
		
		 
		setHeight: (height) ->
			# jsdoc in gara.widgets.Control
			if @maximized || @minimized || @fullScreen
				@height = height
			else
				super(height)
			
			this

		
		setLocation: (x, y) ->
			# jsdoc in gara.widgets.Control
			if @maximized || @minimized || @fullScreen		
				@x = x if x > 0
				@y = y if y > 0
			else
				super(x, y)
	
			this

	
		setWidth: (width) ->
			# jsdoc in gara.widgets.Control
			if @maximized || @minimized || @fullScreen
				@width = width
			else
				super(width)	
	
			this
		

		setMaximized: (maximized) ->
			# jsdoc in gara.widgets.Decorations
			return this if @minimized && !@notifyShellListener("shellDeiconified")
			super(maximized)

		
		setMinimized: (minimized) ->
			# jsdoc in gara.widgets.Decorations
			return this if (!minimized && !@notifyShellListener("shellDeiconified")) or
			(minimized && !@notifyShellListener("shellIconified"))
					
			if minimized 
			then @getDisplay().setActiveShell(null) 
			else @getDisplay().setActiveShell(this)

			super(minimized)
		
		update: ->

	gara.namespace('gara.widgets')
	gara.widgets.Shell = Shell
	exports.Shell = Shell