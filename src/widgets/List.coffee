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


define 'gara/widgets/List', ['require', 'exports', 'gara/widgets/Composite', 'gara/widgets/Selection'], (require, exports) ->

	#gara.use('gara.widgets.ListItem');
	Composite = require('gara/widgets/Composite')
	Selection = require('gara/widgets/Selection')

	###
	gara List Widget
	
	@description
	long description for the List Widget...
	###
	class List extends Composite
		gara.mixin @, Selection

		constructor: (parent, config = {}) ->
			
			# init
			@items = []
			@activeItem = null
			@shiftItem = null

			# parse config
			@config =
				multi: config.multi || false
				check: config.check || false
				fullSelection: config.fullSelection || false

			# init mixins
			@initSelection(config)
			
			super(parent, config)

		
		###
		Activates an item
		
		@private
		@param {gara.widgets.ListItem} item the item that should added to the List
		@throws {TypeError} if the item is not a ListItem
		@returns {void}
		###
		activateItem: (item) ->
			@checkWidget()
			if !item instanceof gara.widgets.ListItem
				throw new TypeError('item is not type of gara.widgets.ListItem')

			# set a previous active item inactive
			@activeItem.setActive(false) if @activeItem isnt null and !@activeItem.isDisposed()
			@activeItem = item
			@activeItem.setActive(true)
	
			# ARIA reference to the active item
			@handle.setAttribute('aria-activedescendant', @activeItem.getId())

	
		###
		Adds an item to the list (invoked by the constructor of ListItem)
		
		@private
		@param {gara.widgets.ListItem} item the item that should added to the List
		@throws {TypeError} if the item is not a gara.widgets.ListItem
		@returns {void}
		###
		addItem: (item, index = null) ->
			@checkWidget()
			if !item instanceof gara.widgets.ListItem
				throw new TypeError('item is not type of gara.widgets.ListItem')
	
			if index?
				@items.insertAt(index, item)
			else
				@items.push(item)

			@handle

		###
		@private
		###
		createWidget: ->
			@createHandle('ul')

			@handle.setAttribute('role', 'listbox')
			@handle.setAttribute('aria-multiselectable', @config.multi)
			@handle.setAttribute('aria-activedescendant', @getId())

			# add css classes
			@addClass('gara-list')
			@setClass('gara-list-fullselection', @config.fullSelection)
			@setClass('gara-list-checkbox', @config.check)

			# listeners
			@addFocusListener(this)
			@addMouseListener(this)
			@addKeyListener(this)

		
		##
		# jsdoc in gara.widgets.Widget
		##
		destroyWidget: ->
			@items = null
	
			@activeItem = null
			@shiftItem = null
	
			@selection = null
			@selectionListeners = null
			
			super
		
		
		###
		Removes an item from the receiver
		
		@private
		@param {gara.widgets.ListItem} item the item that should removed from the receiver
		@returns {void}
		###
		destroyItem: (item) ->
			if @items.contains(item)
				@items.remove(item)
				@handle.removeChild(item.handle)

		
		###
		Focus listener. Will be notified when the receiver gets focussed.
		
		@private
		@param {Event} e
		@returns {void}
		###
		focusGained: (e) ->
			# mark first item active
			@activateItem(@items[0]) if @activeItem is null and @items.length

	
		###
		Get a specified item with a zero-related index.
		
		@param {int} index the zero-related index
		@throws {RangeError} when there is no item at the given index
		@returns {gara.widgets.ListItem} the item
		###
		getItem: (index) ->
			@checkWidget()
			if typeof(@items.indexOf(index)) is 'undefined'
				throw new RangeError('There is no item for the given index')
	
			@items[index]
	

		###
		Returns the amount of the items in the receiver.
		
		@returns {int} the amount
		###
		getItemCount: ->
			@items.length

		
		###
		Returns the items height.
		
		@private
		@param {gara.widgets.Item} item
		@returns {int} the height
		###
		getItemHeight: (item) ->
			return item.handle.offsetHeight + gara.getNumStyle(item.handle, 'margin-top') + gara.getNumStyle(item.handle, 'margin-bottom')
	
		
		###
		Returns an array with all the items in the list
		
		@returns {gara.widgets.ListItem[]} the array with the items
		###
		getItems: ->
			@checkWidget()
			@items

	
		###
		Returns a <code>ListItem</code> which is currently at the top of the receiver. This 
		<code>ListItem</code> can change when items are scrolled or new items are added or removed.
		 
		@returns {gara.widgets.ListItem} the top item
		###
		getTopItem: ->
			@checkWidget()
			return null if !@items.length

			scrollTop = @scrolledHandle().scrollTop
			h = 0
			for item in @items
				h += @getItemHeight(item)
				return item if h > scrollTop
	
		
		# handleEvent: (e) ->
			###
			Handles events on the list. Implements DOMEvent Interface by the W3c.
			
			@private
			@param {Event} e event the users triggers
			@returns {void}
			###
			# @checkWidget()
# 	
			# # special events for the list
			# widget = e.target.widget or null
			# e.item = widget and if widget instanceof gara.widgets.ListItem then widget else @activeItem
			# e.widget = this
			# @event = e
# 	
			# @handleMouseEvents(e)
			# if @menu isnt null and @menu.isVisible()
				# @menu.handleEvent(e)
			# else
				# @handleKeyEvents(e)
				# @handleMenu(e)
# 	
			# super(e)
# 	
			# e.item.handleEvent(e) if e.item isnt null
			# e.preventDefault() if e.type is 'contextmenu'
			# e.stopPropagation()
			# # in case of ie6, it is necessary to return false while the type of
			# # the event is 'contextmenu' and the menu isn't hidden in ie6
			# false

		###
		Handling mousedown events on the receiver.
		
		@private
		@param {Event} e event the users triggers
		@returns {void}
		###
		mouseDown: (e) ->
			
			@checkWidget()
			
			if e.widget instanceof gara.widgets.ListItem
				item = e.widget
				@activateItem(item)
				if !e.ctrlKey and !e.shiftKey
					@selectAdd(item, false)
				else if e.ctrlKey and e.shiftKey
					@selectShift(item, true)
				else if e.shiftKey
					@selectShift(item, false)
				else if e.ctrlKey
					if @selection.contains(item)
						@deselect(@indexOf(item))
					else
						@select(@indexOf(item), true)
				else
					@select(@indexOf(item))
	

		###
		Handling keydown events on the receiver.
		
		@private
		@param {Event} e event the users triggers
		@returns {void}
		###
		keyPressed: (e) ->
			@checkWidget()
			console.log 'List.keyDown ' + e

			switch (e.keyCode)

				# left and up
				when gara.ARROW_LEFT, gara.ARROW_UP
	
					# determine previous item
					prev = false
					activeIndex = @indexOf(@activeItem)
		
					
					prev = @items[activeIndex - 1] if activeIndex isnt 0
					
					if prev
						# update scrolling
						h = 0
						if activeIndex > 1
							for i in [0..activeIndex - 2] 
								h += @getItemHeight(@items[i])

						viewport = @handle.clientHeight + @handle.scrollTop -
							gara.getNumStyle(@handle, 'padding-top') -
							gara.getNumStyle(@handle, 'padding-bottom')
						itemAddition = prev.handle.clientHeight -
							gara.getNumStyle(prev.handle, 'padding-top') -
							gara.getNumStyle(prev.handle, 'padding-bottom')
		
						@handle.scrollTop = if h < @handle.scrollTop then h else (if viewport < h then h - viewport + itemAddition else @handle.scrollTop)
		
						# handle select
						if !e.ctrlKey and !e.shiftKey
							@activateItem(prev)
							@selectAdd(prev, false)
						else if e.ctrlKey and e.shiftKey
							@activateItem(prev)
							@selectShift(prev, true)
						else if e.shiftKey
							@activateItem(prev)
							@selectShift(prev, false)
						else if e.ctrlKey
							@activateItem(prev)
							
				# right and down
				when gara.ARROW_RIGHT, gara.ARROW_DOWN
		
					# determine next item
					next = false
					activeIndex = @indexOf(@activeItem)
		
					# item is last
					next = @items[activeIndex + 1] if activeIndex isnt @items.length - 1
		
					if next
						# update scrolling
						h = 0
						for i in [0..activeIndex + 1]
							h += @getItemHeight(@items[i])
							
						min = h - @getItemHeight(next)
						viewport = @handle.clientHeight + @handle.scrollTop -
							gara.getNumStyle(@handle, 'padding-top') -
							gara.getNumStyle(@handle, 'padding-bottom')
						scrollRange = h - @handle.clientHeight +
							gara.getNumStyle(@handle, 'padding-top') +
							gara.getNumStyle(@handle, 'padding-bottom')
		
						@handle.scrollTop = if h > viewport then (if scrollRange < 0 then 0 else scrollRange) else (if @handle.scrollTop > min then min else @handle.scrollTop)
						
						# handle select and active item
						if !e.ctrlKey and !e.shiftKey
							@activateItem(next)
							@selectAdd(next, false)
						else if e.ctrlKey and e.shiftKey
							@activateItem(next)
							@selectShift(next, true)
						else if e.shiftKey
							@activateItem(next)
							@selectShift(next, false)
						else if e.ctrlKey
							@activateItem(next)
	
				# space
				when gara.SPACE
		
					@activeItem.setChecked(!@activeItem.getChecked()) if (@style & gara.CHECK) is gara.CHECK
						
					# handle select and active item
					if @selection.contains(@activeItem) && e.ctrlKey
						@deselect(@indexOf(@activeItem))
					else
						@selectAdd(@activeItem, true)
	
				# home
				when gara.HOME
		
					# update scrolling
					@handle.scrollTop = 0
		
					# handle select and active item
					if !e.ctrlKey and !e.shiftKey
						@activateItem(@items[0])
						@selectAdd(@items[0], false)
					else if e.shiftKey
						@activateItem(@items[0])
						@selectShift(@items[0], false)
					else if e.ctrlKey
						@activateItem(@items[0])

				# end
				when gara.END
		
					# update scrolling
					@handle.scrollTop = @handle.scrollHeight - @handle.clientHeight
		
					# handle select and active item
					lastOffset = @items.length - 1
					if !e.ctrlKey and !e.shiftKey
						@activateItem(@items[lastOffset])
						@selectAdd(@items[lastOffset], false)
					else if e.shiftKey
						@activateItem(@items[lastOffset])
						@selectShift(@items[lastOffset], false)
					else if e.ctrlKey
						@activateItem(@items[lastOffset])
					
				# ctrl+a
				when 65
					@selectAll() if e.ctrlKey
					
					
			@preventScrolling(e)
	

		###
		Looks for the index of a specified item.
		
		@param {gara.widgets.ListItem} item the item for the index
		@throws {TypeError} if the item is not a ListItem
		@returns {int} the index of the specified item
		###		
		indexOf: (item) ->
			@checkWidget()
			if !item instanceof gara.widgets.ListItem
				throw new TypeError('item not instance of gara.widgets.ListItem')
				 
			@items.indexOf(item)
		
		
		###
		Releases all children from the receiver.
		
		@private
		@returns {void}
		###
		releaseChildren: ->
			@items.forEach (item) -> item.release()
			super
		

		###
		Releases an item from the receiver.
		
		@private
		@param {gara.widgets.TableItem} item the item that should removed from the receiver
		@returns {void}
		###		
		releaseItem: (item) ->
			if @items.contains(item)
				@handle.removeChild(item.handle)
				@items.remove(item)
				@selection.remove(item)
			
	
		###
		Removes an item from the receiver.
		
		@param {int} index the index of the item
		@throw {RangeError} if the index is out of bounds
		@returns {void}
		###		
		remove: (index) ->
			@checkWidget();
			if index < 0 or index > @items.length
				throw new RangeError('index out of bounds')
				
			item = @items.removeAt(index)[0]
			@selection.remove(item)
			item.dispose()
	
		
		###
		Removes all items from the receiver.
		
		@returns {void}
		###
		removeAll: ->
			@checkWidget()
			while @items.length
				@remove(0)
		
		
		###
		Removes items which indices are passed as an array.
		
		@param {int[]} indices the array with the indices
		@returns {void}
		###
		removeArray: (indices) ->
			@checkWidget()
			indices.forEach (item, index, arr) ->
				@remove(index)
		
		
		###
		Removes items within an indices range.
		
		@param {int} start start index
		@param {int} end end index
		@returns {void}
		###
		removeRange: (start, end) ->
			@checkWidget();
			for i in [start..end]
				@remove(start)
			
	
		###
		Sets the topmost item.
		
		@see gara.widgets.List#getTopItem
		@param {gara.widgets.ListItem} item the new top item
		@returns {gara.widgets.List} this
		###
		setTopItem: (item) ->
			if !item instanceof gara.widgets.ListItem
				throw new TypeError('item not instance of gara.widgets.ListItem')
	
			index = @indexOf(item)
			h = 0
			for i in index
				h += @getItemHeight(@items[i])
	
			@scrolledHandle().scrollTop = h
			this
	
		
		###
		Scrolls the receiver that the passed item is visible.
		
		@param {gara.widgets.ListItem} item 
		@returns {void}
		###
		showItem: (item) ->
			if !item instanceof gara.widgets.ListItem
				throw new TypeError('item not instance of gara.widgets.ListItem')
	
			if @getVerticalScrollbar()
				index = @indexOf(item)
				h = 0
				for i in index
					h += @getItemHeight(@items[i])
	
				if (@scrolledHandle().scrollTop + @scrolledHandle().clientHeight) < h or
				@scrolledHandle().scrollTop > h
					newScrollTop = h - Math.round(@getItemHeight(@items[index]) / 2) - Math.round(@scrolledHandle().clientHeight / 2)
					@scrolledHandle().scrollTop = newScrollTop


		###
		Scrolls the receiver that the selection is visible.
		
		@see gara.widgets.List#showItem
		@returns {void}
		###
		showSelection: ->
			@showItem(@selection[0]) if @selection.length
	
	
		toString: ->
			'[gara.widgets.List]'


	gara.namespace('gara.widgets')
	gara.widgets.List = List
	exports.List = List