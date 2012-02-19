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

define 'gara/widgets/Display', ['require', 'exports', 'gara/widgets/Shell'], (require, exports) ->
	#gara.use('gara.widgets.Widget');
	#gara.use('gara.widgets.Control');
	#gara.use('gara.widgets.Shell');
	
	
	class Display
	
		###
		Holds the current focus control.
		
		@private
		@type gara.wigets.Control
		###
		#focusControl: null
	
		###
		@private
		@type Object
		###
		#disposeListener: null
	
		###
		Contains the widgets attached to this display
		
		@private
		@type gara.wigets.Widget[]
		###
		#widgets: []
	
		###
		Contains the shells attached to this display
		
		@private
		@type gara.wigets.Shell[]
		###
		#shells: []
	
		###
		@private
		@type {gara.widgets.Shell}
		###
		#activeShell: null
		
		###
		@private
		@static	
		@type {gara.widgets.Display}
		###
		@defaultDisplay: null
		
		constructor: ->
			gara.addEventListener(document, 'keydown', this);
			gara.addEventListener(document, 'keypress', this);
			gara.addEventListener(document, 'keyup', this);
			gara.addEventListener(document, 'mousedown', this);
			gara.addEventListener(document, 'mouseup', this);
			gara.addEventListener(document, 'dblclick', this);
			gara.addEventListener(document, 'contextmenu', this);

			@shells = []
			@widgets = []
			@activeShell = null
			@focusControl = null
			@clientArea = window.document.getElementsByTagName('body')[0]
			@disposeListener = 
				widgetDisposed: (widget) =>
					@removeWidget(widget)


		###
		Adds a widget to the Display.
		
		@private
		@param {gara.widgets.Widget} widget the widget
		@returns {void}
		###
		addWidget: (widget) ->
			if !widget instanceof gara.widgets.Widget
				throw new TypeError('widget is not a gara.widgets.Widget');
	
			if !@widgets.contains(widget)
				@widgets[@widgets.length] = widget;
				widget.addDisposeListener(@disposeListener);
				if widget instanceof gara.widgets.Control
					gara.addEventListener(widget.handle, 'focusin', this)
					gara.addEventListener(widget.handle, 'focus', this)
					#gara.addEventListener(widget.handle, 'focusout', this)
					gara.addEventListener(widget.handle, 'blur', this)
					

	#
	#				if (widget.getParent() instanceof gara.widgets.Widget) {
	#					id = widget.getParent().getId();
	#				}
	#
	#				# html node
	#				else {
	#					if (widget.getParent().id) {
	#						id = widget.getParent().id;
	#					} else {
	#						id = gara.generateUID();
	#						widget.getParent().id = id;
	#					}
	#				}
	#
	#
	#				if (!this.layers[id]) {
	#					this.layers[id] = [];
	#				}
	#
	#				if (!this.layers[id].contains(widget)) {
	#					this.layers[id].push(widget);
	#				}
	
					@shells[@shells.length] = widget if widget instanceof gara.widgets.Shell and !@shells.contains(widget)
	
	
		getActiveShell: ->
			@activeShell
	
		
		###
		Returns a HTMLElement describes the area which is capable of displaying data.
		The &lt;body&gt; element.
		
		@returns {HTMLElement}
		###
		getClientArea: ->
			@clientArea
	
	
		###
		@static
		###
		@getDefault: ->		
			if !gara.widgets.Display.defaultDisplay?
				gara.widgets.Display.defaultDisplay = new gara.widgets.Display() 
			gara.widgets.Display.defaultDisplay
	
	
		###
		Returns the control which currently has keyboard focus, or null if
		keyboard events are not currently going to any of the controls built by
		the currently running application.
		
		@returns {gara.widgets.Control}
		###
		getFocusControl: ->
			@focusControl
		
		###
		Returns a (possibly empty) array containing the receiver's shells.
		
		@description
		Returns a (possibly empty) array containing the receiver's shells. Shells are returned 
		in the order that they are drawn. The topmost shell appears at the beginning of the array. 
		Subsequent shells draw beneath this shell and appear later in the array. 
		
		@returns {gara.widgets.Shell[]} an array of children
		###
		getShells: ->
			shells = []
			addShell = (shell) ->
				shells[shells.length] = shell
		
			@shells.forEach (shell) ->
				if !shell.isDisposed()
					z = if shell.handle.style.zIndex is '' then 0 else shell.handle.style.zIndex
					layers[z] = [] if !layers[z]
					layers[z][layers[z].length] = shell
					max = Math.max(max, z)
			
			for i in [max..0]
				layers[i].forEach(addShell, this) if layers[i]
			
			
				
			# for (i = max; i >= 0; i--) {
				# if (layers[i]) {
					# layers[i].forEach(addShell, this);
				# }
			# }
			
			shells
	
	
		###
		@private
		###
		getSiblingControls: (control) ->
			if control.getParent and control.getParent().getId
				id = control.getParent().getId()
			else if control.getParent().id
				id = control.getParent().id
	
			if @layers[id]
				return @layers[id]
	
			[]
		
			
		###
		Internal event handler to pass keyboard events and focussing the active widget

		@private
		@param {Event} e the event
		@returns {void}
		###
		handleEvent: (e) ->
	

			console.log 'Display.handleEvent ' + e.type + ' on ' + e.target + ', widget: ' + e.target.widget + ', control: ' + e.target.control

			if e.target.widget? && e.target.widget instanceof gara.widgets.Widget
				e.widget = e.target.widget
				e.item = e.widget if e.widget instanceof gara.widgets.Item
				control = e.widget if e.widget instanceof gara.widgets.Control
				control = e.target.control if e.target.control? && !control?
				e.control = control if control?

			switch e.type
				when 'focus'
					if control?
						success = true
						layers = {}
		
						if control is @focusControl
							return
						
						# get shell
						shell = control.getShell()
						
						# handle layers
						# save layers
						@widgets.forEach (widget) ->
							layers[widget.handle.id] = widget.handle.style.zIndex
						
						# move every layer in the control hierarchy from control to the shell on top
						control.moveAbove();
						parent = control;
						while shell isnt null and parent isnt shell and parent.getParent
							parent.moveAbove()
							parent = parent.getParent()
						
						# if parent is a shell and cannot be activated -> exit
						if shell instanceof gara.widgets.Shell and 
						!control.handle.dataset.garaSuppressFocusNotify and 
						!shell.setActive()
							# restore layers, focus active shell and exit
							for own id in layers
								window.document.getElementById(id).style.zIndex = layers[id]
								
							@activeShell.setFocus()
							return false
						
						# notifyFocusListener
						@focusControl = control
						if !control.handle.dataset.garaSuppressFocusNotify
							notifyResult = control.notifyFocusListener('focusGained')
							success = success and 
								if control.handle.dataset.garaForcefocus then true else notifyResult
						
						# remove obsolete data-gara-* attributes
						control.handle.dataset.garaSuppressFocusNotify = null
						control.handle.dataset.garaForcefocus = null
						
						# restore layers, if something wasn't allowed
						if !success
							for own id in layers
								gara.global.document.getElementById(id).style.zIndex = layers[id]
		
							@focusControl = null
							control.handle.dataset.garaSuppressBlurNotify = true
							control.handle.blur()

				when 'blur'
					if control? and !e.target.dataset.garaSuppressBlurNotify
						if e.widget.notifyFocusListener('focusLost')
							@focusControl = null
						else
							# workaround for re-focus
							# bug in FF, see: https://bugzilla.mozilla.org/show_bug.cgi?id=53579
							e.target.dataset.garaSuppressFocusNotify = true
							window.setTimeout (-> 
								e.target.focus()
							), 0

					e.target.dataset.garaSuppressBlurNotify = null


			if control? || (@focusControl isnt null && e.type of ['keydown', 'keyup'])
				e.control ||= @focusControl
				e.control.dispatchEvent(e)

				if e.item? and e.item.isListening(e.type)
					e.item.dispatchEvent(e)
					
				#e.stopPropagation()

			if e.type is 'contextmenu'
				e.preventDefault()
		
		
		###
		Removes a widget from the Dialog. The Dialog removes the
		previous registered when added with addWidget.
		
		@private
		@param {gara.widgets.Widget} widget the widget
		@returns {void}
		###
		removeWidget: (widget) ->
			if !widget instanceof gara.widgets.Widget
				throw new TypeError('widget is not a gara.widgets.Widget');
	
			if @widgets.contains(widget)
				@focusControl = null if @focusControl is widget
				widget.removeDisposeListener(@disposeListener)
	
				if widget instanceof gara.widgets.Control
					# widget.removeListener('focus', this)
					# widget.removeListener('blur', this)
					gara.removeEventListener(widget.handle, 'focus', this)
					gara.removeEventListener(widget.handle, 'blur', this)
									
					@shells.remove(widget) if widget instanceof gara.widgets.Shell
	
				@widgets.remove(widget)
	
		
		###
		@private
		@param {gara.widgets.Shell} shell
		@returns {void}
		###
		setActiveShell: (shell) ->
			if shell isnt null and !shell instanceof gara.widgets.Shell
				throw new TypeError('shell is not a gara.widgets.Shell')
				
			@activeShell = shell
	
		###
		@private
		@param {gara.widgets.Control} control
		@returns {void}
		###
		setFocusControl: (control) ->
			if control isnt null and !control instanceof gara.widgets.Control
				throw new TypeError('shell is not a gara.widgets.Control')
			
			@focusControl = control
			
		toString: ->
			'[gara.widgets.Display]'

	gara.namespace('gara.widgets')
	gara.widgets.Display = Display
	exports.Display = Display