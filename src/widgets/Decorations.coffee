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

define 'gara/widgets/Decorations', ['require', 'exports', 'gara/widgets/Composite'], (require, exports) ->

	#gara.use("gara.widgets.Menu")
	#gara.use("gara.widgets.Display")
	Composite = require('gara/widgets/Decorations')

	class Decorations extends Composite
		###
		Represents a Decoration
		###
		
		image : null
		text : ""
		menuBar : null
		stub : null
		title : null
		titleRight : null
		titleTextNode : null
		titleImage : null
		titleButtons : null
		titleCloseButton : null
		titleMinButton : null
		titleMaxButton : null
		@minis: {}
	
		
		constructor: (parent, config = {}) ->
			###
			@constructs
			@extends gara.widgets.Scrollable
			###
			@image = null
			@text = ""
			@menuBar = null
			@box = null
			@dX = 0
			@dY = 0
			@offsetX = 0
			@offsetY = 0
			@overflow = null
			@stub = null
			@title = null
			@titleRight = null
			@titleTextNode = null
			@titleImage = null
			@titleButtons = null
			@titleCloseButton = null
			@titleMinButton = null
			@titleMaxButton = null
	
			@enabled = false
			@maximized = false
			@minimized = false
			@defaultButton = null
	
			@resizeNNW = null
			@resizeWNW = null
			@resizeN = null
			@resizeNNE = null
			@resizeENE = null
			@resizeE = null
			@resizeW = null
			@resizeSSW = null
			@resizeWSW = null
			@resizeS = null
			@resizeSSE = null
			@resizeESE = null
			
			@adjustedHeight = false
			@adjustedWidth = false
			@restoreWidth = null
			@restoreHeight = null
			
			@menuBarResizeListener = 
				controlResized: (e) =>
					if @height > 0
						@clientArea.style.height = (@handle.clientHeight - (if @title then @title.offsetHeight else 0) - @menuBarNode.offsetHeight) + "px"
	
			config.style = gara.widgets.Decorations.checkStyle(config.style)
	
			super(parent, config)
			@addFocusListener(this)
	
	
		adjustHeight: (height) ->
			if @minimized || @maximized
				@restoreHeight = height
				return
			
			super(height)
			
			if height > 1
				@clientArea.style.height = (height - (if @title then @title.offsetHeight else 0) - @menuBarNode.offsetHeight) + "px"
	
	
		adjustWidth: (width) ->
			if @minimized || @maximized
				@restoreWidth = width
				return
				
			super(width)
			
			@clientArea.style.width = width + "px" if width > 1
		
		
		bindListener: (eventType, listener) ->
			###
			Register listeners for this widget. Implementation for gara.widgets.Widget
			
			@private
			@return {void}
			###
			gara.addEventListener(@handle, eventType, listener)

	
		destroyWidget: ->
			@resizeNNW = null
			@resizeWNW = null
			@resizeN = null
			@resizeNNE = null
			@resizeENE = null
			@resizeE = null
			@resizeW = null
			@resizeSSW = null
			@resizeWSW = null
			@resizeS = null
			@resizeSSE = null
			@resizeESE = null
			
			@menuBarNode = null
			@clientArea = null
			@defaultButton = null
			
			if @stub isnt null
				@handle.parentNode.removeChild(@stub)
				@stub = null
			
			super()
	
		@checkStyle: (style) ->
			if (style & gara.NO_TRIM) isnt 0
				style &= ~(gara.CLOSE | gara.TITLE | gara.MIN | gara.MAX | gara.RESIZE | gara.BORDER)
			
			if (style & (gara.MIN | gara.MAX | gara.CLOSE)) isnt 0
				style |= gara.TITLE
	
			# if (style & gara.CLOSE) isnt 0
				# style |= gara.TITLE

			style
	
		
		createWidget: ->
			###
			@private
			###
			@createHandle("div")
	
			# aria
			@handle.setAttribute("role", "group")
			
			# add css classes
			@addClass("garaDecorations")
			@setClass("garaBorder", (@style & gara.BORDER) isnt 0)
			@moveParent = if @getParent() instanceof gara.widgets.Widget
			then @getParent().handle
			else (if @getParent() instanceof gara.widgets.Display
			then @getParent().getClientArea()
			else @getParent())
	
			# title
			if (@style & gara.TITLE) isnt 0
				@title = window.document.createElement("div")
				@title.className = "garaDecorationsTitle"
				@title.widget = this
	
				# title left, a node for sliding doors css-technic to apply styles
				@titleRight = window.document.createElement("div")
				@titleRight.className = "garaDecorationsTitleRight"
				@titleRight.widget = this
	
				@title.appendChild(@titleRight)
	
				# buttons
				if (@style & (gara.MIN | gara.MAX | gara.CLOSE)) isnt 0
					@titleButtons = window.document.createElement("div")
					@titleButtons.className = "garaDecorationsTitleButtons"
					@titleButtons.widget = this
	
	#				var clearer = window.document.createElement("div")
	#				clearer.className = "garaDialogBarClearer"
	
					@titleCloseButton = window.document.createElement("span")
					@titleCloseButton.className = "garaDecorationsCloseButton" + (if (@style & gara.CLOSE) isnt 0 then " garaDecorationsCloseButtonActive" else " garaDecorationsCloseButtonDeactive")
					@titleButtons.appendChild(@titleCloseButton)
					@title.appendChild(@titleButtons)
	
					if (@style & (gara.MIN | gara.MAX)) isnt 0
						@titleMinButton = window.document.createElement("span")
						@titleMinButton.className = "garaDecorationsMinButton" + (if (@style & gara.MIN) isnt 0 then " garaDecorationsMinButtonActive" else " garaDecorationsMinButtonDeactive")
						@titleMinButton.widget = this
						@titleButtons.appendChild(@titleMinButton)
	
						@titleMaxButton = window.document.createElement("span")
						@titleMaxButton.className = "garaDecorationsMaxButton" + (((@style & gara.MAX) isnt 0) ? " garaDecorationsMaxButtonActive" : " garaDecorationsMaxButtonDeactive")
						@titleMaxButton.widget = this
						@titleButtons.appendChild(@titleMaxButton)
	
					gara.addEventListener(@titleButtons, "click", this)
	
				@titleTextNode = window.document.createElement("div")
				@titleTextNode.className = "garaDecorationsTitleText"
				@titleTextNode.id = @getId() + "-label"
				@titleTextNode.widget = this
				@titleImage = window.document.createElement("img")
				@titleImage.widget = this
				@titleText = window.document.createTextNode(@text)
	
				if @image
				then @titleImage.src = @image.src
				else @titleImage.style.display = "none"

				@titleTextNode.appendChild(@titleImage)
				@titleTextNode.appendChild(@titleText)
				@title.appendChild(@titleTextNode)
	
				@handle.appendChild(@title)
				@handle.setAttribute("aria-labelledby", @getId() + "-label")
	
	#			gara.addEventListener(@title, "mousedown", this)
	
			# resize
			if (@style & gara.RESIZE) isnt 0
				@resizeNNW = window.document.createElement("div")
				@resizeWNW = window.document.createElement("div")
				@resizeN = window.document.createElement("div")
				@resizeNNE = window.document.createElement("div")
				@resizeENE = window.document.createElement("div")
				@resizeE = window.document.createElement("div")
				@resizeW = window.document.createElement("div")
				@resizeSSW = window.document.createElement("div")
				@resizeWSW = window.document.createElement("div")
				@resizeS = window.document.createElement("div")
				@resizeSSE = window.document.createElement("div")
				@resizeESE = window.document.createElement("div")
	
				@resizeNNW.className = "garaResize garaResizeNNW"
				@resizeWNW.className = "garaResize garaResizeWNW"
				@resizeN.className = "garaResize garaResizeN"
				@resizeNNE.className = "garaResize garaResizeNNE"
				@resizeENE.className = "garaResize garaResizeENE"
				@resizeE.className = "garaResize garaResizeE"
				@resizeW.className = "garaResize garaResizeW"
				@resizeSSW.className = "garaResize garaResizeSSW"
				@resizeWSW.className = "garaResize garaResizeWSW"
				@resizeS.className = "garaResize garaResizeS"
				@resizeSSE.className = "garaResize garaResizeSSE"
				@resizeESE.className = "garaResize garaResizeESE"
	
				@handle.appendChild(@resizeNNW)
				@handle.appendChild(@resizeWNW)
				@handle.appendChild(@resizeN)
				@handle.appendChild(@resizeNNE)
				@handle.appendChild(@resizeENE)
				@handle.appendChild(@resizeE)
				@handle.appendChild(@resizeW)
				@handle.appendChild(@resizeSSW)
				@handle.appendChild(@resizeWSW)
				@handle.appendChild(@resizeS)
				@handle.appendChild(@resizeSSE)
				@handle.appendChild(@resizeESE)

	
			# menubar
			@menuBarNode = window.document.createElement("div")
			@menuBarNode.className = "garaDecorationsMenuBar"
			@menuBarNode.style.display = "none"
			@handle.appendChild(@menuBarNode)
	
			# content
			@clientArea = window.document.createElement("div")
			@clientArea.className = "garaClientArea garaDecorationsClientArea"
			@handle.appendChild(@clientArea)
	
			@addListener("mousedown", this)
			
			if (@style & gara.RESIZE) isnt 0 || (@style & gara.TITLE) isnt 0
				@stub = window.document.createElement("div")
				@stub.className = "garaStub"
				@stub.style.display = "none"
				@handle.parentNode.insertBefore(@stub, @handle)

		
		focusGained: (e) ->
			@defaultButton.setFocus() if @defaultButton isnt null
			
			
		getDefaultButton: ->
			@defaultButton

	
		getImage: ->
			@image

		
		getMaximized: ->
			@maximized

	
		getMenuBar: ->
			@menuBar

		
		getMinimized: ->
			@minimized

	
		getText: ->
			@text

	
		
		handleEvent: (e) ->
			###
		
			@private
			### 
			getOffset = (elem) ->
				currentLeft = 0
				currentTop = 0
				if elem.offsetParent
					loop
						currentLeft += elem.offsetLeft
						currentTop += elem.offsetTop
						break unless (elem = elem.offsetParent)

				return [currentLeft, currentTop]
			
			#}, resizeN, resizeE, resizeS, resizeW
	
			e.widget = this
			@event = e
	
			switch (e.type) 
				when "click"
					switch (e.target) 
						when @titleCloseButton then @setVisible(false)
						when @titleMaxButton then @setMaximized(!@maximized)
						when @titleMinButton
							@setMinimized(!@minimized)
							e.stopPropagation()
							
				when "mousedown"
					# move
					if (e.target is @title or
					e.target is @titleRight or
					e.target is @titleButtons or
					e.target is @titleTextNode) and
					!@maximized and !@minimized
						
						@makeAbsolute()
		
						gara.addEventListener(@moveParent, "mousemove", this)
						gara.addEventListener(@title, "mouseup", this)
		
						@doX = e.clientX - @handle.offsetLeft
						@doY = e.clientY - @handle.offsetTop
		
						@overflow = @moveParent.style.overflow
						@moveParent.style.overflow = "hidden"
		
						[@offsetX, @offsetY] = getOffset(@moveParent)
		
						@moving = true
	
					# resize
					if (e.target is @resizeNNW || e.target is @resizeWNW ||
					e.target is @resizeNNE || e.target is @resizeENE ||
					e.target is @resizeN || e.target is @resizeS) ||
					e.target is @resizeW || e.target is @resizeE ||
					e.target is @resizeSSW || e.target is @resizeWSW ||
					e.target is @resizeSSE || e.target is @resizeESE &&
					!@maximized && !@minimized
		
						@makeAbsolute()
						
						gara.addEventListener(@moveParent, "mousemove", this)
						gara.addEventListener(gara.widgets.Display.getDefault().getClientArea(), "mouseup", this)
		
						@dX = e.clientX
						@dY = e.clientY
						@doX = e.clientX - @handle.offsetLeft
						@doY = e.clientY - @handle.offsetTop
		
						offset = getOffset(@moveParent)
						@offsetX = offset[0]
						@offsetY = offset[1]
						@offsetTop = @handle.offsetTop
						@offsetLeft = @handle.offsetLeft
						@offsetWidth = @handle.offsetWidth
						@offsetHeight = @handle.offsetHeight
						@minHeight = if @title then @title.offsetHeight else 1
						@minWidth = 1 + (if @titleRight then @titleRight.offsetWidth * 2 else 0) + (if @titleButtons then @titleButtons.offsetWidth else 0)
		
						@resizing = true
		
						switch (e.target) 
							when @resizeNNW, @resizeWNW then @resizeMethod = "NW"
							when @resizeN then @resizeMethod = "N"
							when @resizeNNE, @resizeENE then @resizeMethod = "NE"
							when @resizeW then @resizeMethod = "W"
							when @resizeE then @resizeMethod = "E"
							when @resizeSSW, @resizeWSW then @resizeMethod = "SW"
							when @resizeS then @resizeMethod = "S"
							when @resizeSSE, @resizeESE then @resizeMethod = "SE"
	
				when "mousemove"
					if @moving
						if e.clientX > @offsetX && e.clientY > @offsetY &&
						e.clientX < (@offsetX + @moveParent.clientWidth) &&
						e.clientY < (@offsetY + @moveParent.clientHeight)
							@x = e.clientX - @doX
							@y = e.clientY - @doY
							
							if @handle isnt null
								@handle.style.left = (@x - @positionOffsetX) + "px"
								@handle.style.top = (@y - @positionOffsetY) + "px"

		
					if @resizing
						if e.clientX > @offsetX && e.clientY > @offsetY &&
						e.clientX < (@offsetX + @moveParent.clientWidth) &&
						e.clientY < (@offsetY + @moveParent.clientHeight)
		
							resizeN = =>
								if @offsetHeight + (@offsetTop - (e.clientY - @doY)) > @minHeight
									@handle.style.top = (e.clientY - @doY) + "px"
									@setHeight(@offsetHeight + (@offsetTop - (e.clientY - @doY)))

							resizeW = =>
								if @offsetWidth + (@offsetLeft - (e.clientX - @doX)) > @minWidth
									@handle.style.left = (e.clientX - @doX) + "px"
									@setWidth(@offsetWidth + (@offsetLeft - (e.clientX - @doX)))

							resizeE = =>
								if (@offsetWidth  + e.clientX - @dX) > @minWidth
									@setWidth(@offsetWidth  + e.clientX - @dX)
								
							resizeS = =>
								if (@offsetHeight  + e.clientY - @dY) > @minHeight
									@setHeight(@offsetHeight  + e.clientY - @dY)
		
							switch (@resizeMethod)
								when "NW"
									resizeW()
									resizeN()

								when "N" then resizeN()

								when "NE"
									resizeN()
									resizeE()

								when "E" then resizeE()

								when "SE"
									resizeE()
									resizeS()
									
								when "S" then resizeS()

								when "SW"
									resizeS()
									resizeW()

								when "W" then resizeW()
		

							@layout()
	
				when "mouseup"
					if @moving
						@moveParent.style.overflow = @overflow
						gara.removeEventListener(@moveParent, "mousemove", this)
						gara.removeEventListener(@title, "mouseup", this)
						@moving = false
		
					if @resizing
						gara.removeEventListener(@moveParent, "mousemove", this)
						gara.removeEventListener(gara.widgets.Display.getDefault().getClientArea(), "mouseup", this)
						@resizing = false	
		
		
		makeAbsolute: ->
			###
			@private
			###
			if @handle.style.position isnt "absolute"
				@positionOffsetX = @positionOffsetY = 0
	#			@setLocation(@handle.offsetLeft, @handle.offsetTop)
				@setLocation(@handle.offsetLeft - 1, @handle.offsetTop - 1) # -1 is experimental but seems to work
				@handle.style.position = "absolute"
				
				@stub.style.display = "block" if @stub isnt null
					
		
		menuShell: ->
			this
		
		
		releaseChildren: ->
			if @menu isnt null
				@menu.release()
				@menu = null
			
			super()

	
		scrolledHandle: ->
			###
			@private
			###
			@clientArea

		
		setDefaultButton: (button) ->
			@checkWidget()
			if !button instanceof gara.widgets.Button
				throw new TypeError("button not instanceof gara.widgets.Button")
			
			if (button isnt null &&  
			(button.isDisposed() || 
			button.menuShell() isnt this || 
			(button.getStyle() & gara.PUSH) is 0 ||
			button is @defaultButton))
				return
			
			@defaultButton.removeClass("garaButtonDefault") if @defaultButton isnt null
			@defaultButton = button
			@defaultButton.addClass("garaButtonDefault")

		
		setHeight: (height) ->
			super(height)
			
			if !@adjustedHeight && height isnt null && @stub isnt null
				@stub.style.height = height + "px"
				@adjustedHeight = true

			this
	
	
		setImage: (@image) ->
			if @titleImage
				if @image
					@titleImage.src = @image.src
					@titleImage.style.display = "inline"
				else
					@titleImage.style.display = "none"
				
			this
	
		
		setMaximized: (maximized) ->
			###
			Sets the maximized state of the receiver.
			
			@description
			Sets the maximized state of the receiver. If the argument is <code>true</code> causes the receiver 
			to switch to the maximized state, and if the argument is <code>false</code> and the receiver was 
			previously maximized, causes the receiver to switch back to either the minimized or normal states. 
			
			@see gara.widgets.Decorations#setMinimized
			@param {boolean} maximized the new maximized state
			@returns {gara.widgets.Decorations} this
			###
			parent = if @getParent().getClientArea then @getParent().getClientArea() else @getParent()
			id = if @getParent().getId then @getParent().getId() else @getParent().id
	
			if maximized
				if @minimized
					gara.widgets.Decorations.minis[id][gara.widgets.Decorations.minis[id].indexOf(this)] = undefined

	#			else {
	#				@x = @handle.offsetLeft
	#				@y = @handle.offsetTop
	#			}
				
				
				@restoreWidth = @handle.offsetWidth if @restoreWidth is null
				@restoreHeight = @handle.offsetHeight if @restoreHeight is null

				
				# body
				if parent is gara.widgets.Display.getDefault().getClientArea()
					parent = window.document.window.documentElement
				
				@makeAbsolute()
				@handle.style.left = 0
				@handle.style.top = 0
				@handle.style.width = parent.clientWidth + "px"
				@handle.style.height = parent.clientHeight + "px"
				@clientArea.style.width = parent.clientWidth + "px"
				@clientArea.style.height = (parent.clientHeight - (if @title then @title.clientHeight else 0) - @menuBarNode.offsetHeight) + "px"
			
			@maximized = maximized
			@minimized = false
			@setClass("garaDecorationsMinimized", @minimized)
			@setClass("garaDecorationsMaximized", @maximized)
			
			if !maximized
				@handle.style.left = @x + "px"
				@handle.style.top = @y + "px"
				@adjustWidth(@restoreWidth)
				@adjustHeight(@restoreHeight)
				@restoreWidth = null
				@restoreHeight = null

			@layout()
			this
	
	
		setMenuBar: (menu) ->
			return this if @menuBar is menu
			
			if @menuBar isnt null
				@menuBar.removeControlListener(@menuBarResizeListener)
				@menuBarNode.removeChild(@menuBar.handle)
				@menuBarNode.style.display = "none"
	
			if menu
				if !menu instanceof gara.widgets.Menu and (menu.getStyle() & gara.BAR) is 0
					throw new TypeError("menu not instance of gara.widgets.Menu and not of BAR style")
	
				menu.setVisible(true)
				menu.addControlListener(@menuBarResizeListener)
				@menuBarNode.appendChild(menu.handle)
				@menuBarNode.style.display = "block"

			@menuBar = menu
	
			# recalculate widget height
			if @height > 0
				@clientArea.style.height = (@handle.clientHeight - (if @title then @title.offsetHeight else 0) - @menuBarNode.offsetHeight) + "px"
				@layout()
	
			this
	
		
		setMinimized: (minimized) ->
			###
			Sets the minimized stated of the receiver.
			
			@description
			Sets the minimized stated of the receiver. If the argument is <code>true</code> causes the 
			receiver to switch to the minimized state, and if the argument is <code>false</code> and the 
			receiver was previously minimized, causes the receiver to switch back to either the maximized 
			or normal states. 
			
			@see gara.widgets.Decorations#setMaximized
			@param {boolean} minimized the new minimized state
			@returns {gara.widgets.Decorations} this
			###
			parent = if @getParent().getClientArea then @getParent().getClientArea() else @getParent()
			id = if @getParent().getId then @getParent().getId() else @getParent().id
			
			@minimized = minimized
			@maximized = false
			@setClass("garaDecorationsMinimized", @minimized)
			@setClass("garaDecorationsMaximized", @maximized)
	
			if minimized
				@restoreWidth = @handle.offsetWidth if @restoreWidth is null
				@restoreHeight = @handle.offsetHeight if @restoreHeight is null
				
				@makeAbsolute()
				@handle.style.top = ""
				@handle.style.bottom = 0
				@handle.style.width = ""
				@handle.style.height = ""
				@menuBarNode.style.display = "none" if @menuBar
				
				# finding left
				if !Object.prototype.hasOwnProperty.call(gara.widgets.Decorations.minis, id)
					gara.widgets.Decorations.minis[id] = [this]
					left = 0
				else
					# trim array
					len = gara.widgets.Decorations.minis[id].length
					i = len - 1
					while i >= 0 && gara.widgets.Decorations.minis[id][i] is undefined
						gara.widgets.Decorations.minis[id].splice(i, 1)
						i--
						len--
	
					# find first empty offset
					for i in len
						if gara.widgets.Decorations.minis[id][i] is undefined
							left = i
	
					if left is false
						left = len
						gara.widgets.Decorations.minis[id][gara.widgets.Decorations.minis[id].length] = this
					else
						gara.widgets.Decorations.minis[id][left] = this
					
	
				@handle.style.left = ((left190) + 10) + "px"
			else
				if @menuBar
					@menuBarNode.style.display = "block"

				@handle.style.left = @x + "px"
				@handle.style.top = @y + "px"
				@handle.style.bottom = ""
				@adjustWidth(@restoreWidth)
				@adjustHeight(@restoreHeight)
				@restoreWidth = null
				@restoreHeight = null
				gara.widgets.Decorations.minis[id][gara.widgets.Decorations.minis[id].indexOf(this)] = undefined
				@layout()

			this
			
	
		setText: (text) ->
			@text = text
			@titleText.nodeValue = text if @titleText
			this

	
		setWidth: (width) ->
			super(width)
			
			if !@adjustedWidth && width isnt null && @stub isnt null
				@stub.style.width = width + "px"
				@adjustedWidth = true

			this
	
		
		unbindListener: (eventType, listener) ->
			###
			@private
			###
			gara.removeEventListener(@handle, eventType, listener)

		
		update: ->
			@clientArea.style.height = "auto"
			@clientArea.style.width = "auto"
			@handle.style.height = "auto"
			@handle.style.width = "auto"
			
			@clientArea.style.height = (@handle.clientHeight - (if @title then @title.offsetHeight else 0) - @menuBarNode.offsetHeight) + "px"
			@clientArea.style.width = @handle.clientWidth + "px"
			
	gara.namespace('gara.widgets')
	gara.widgets.Decorations = Decorations
	exports.Decorations = Decorations