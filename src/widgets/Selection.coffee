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

define 'gara/widgets/Selection', ['require', 'exports'], (require, exports) ->

	class Selection
		
		initSelection: (config) ->
			@selection = []
			@selectionListeners = []


		addSelectionListener: (listener) ->
			###
			Adds the listener to the collection of listeners who will be notified 
			when the user changes the receiver's selection, by sending it one of 
			the messages defined in the <code>SelectionListener</code> interface. 
			
			@param {gara.events.SelectionListener} listener the listener which should be notified when the user changes the receiver's selection 
			@returns {gara.widgets.List} this
			###
			@checkWidget()
			@selectionListeners.add(listener) if !@selectionListeners.contains(listener)
			this
		
		deselect: (index) ->
			###
			Deselects an item.
			
			@param {int} index item at zero-related index that should be deselected
			@throws {RangeError} when there is no item at the given index
			@returns {void}
			###
			@checkWidget()
	
			# return if index are out of bounds
			if typeof(@items.indexOf(index)) is "undefined"
				throw new RangeError("There is no item for the given index")
	
			item = @items[index]
			if @selection.contains(item)
				item.setSelected(false)
				@selection.remove(item)
				@shiftItem = item
				@notifySelectionListener()
	
		
		deselectAll: ->
			###
			Deselects all items of the receiver.
			
			@returns {void}
			###
			@checkWidget()
			if @selection.length
				while @selection.length
					item = @selection.pop()
					item.setSelected(false)
				
				@notifySelectionListener()
	
		
		deselectArray: (indices) ->
			###
			Deselects items which indices passed as an array.
			
			@param {int[]} indices an array with zero-related indices
			@returns {void}
			###
			if @selection.length
				indices.forEach((index) ->
					if index < 0 or index >= @items.length
						return
					@items[index].setSelected(false)
				, this)
				@notifySelectionListener()
			
		
		deselectRange: (from, to) ->
			###
			Deselects a range of items.
			
			@param {int} from
			@param {int} to
			@returns {void}
			###
			for i in [from..to]
				@items[i].setSelected(false)
		
			@notifySelectionListener()
		
				getSelection: ->
			###
			Returns an array with the items which are currently selected in the list
			
			@returns {gara.widgets.ListItem[]} an array with items
			###
			@checkWidget()
			@selection

		
		getSelectionCount: ->
			###
			Returns the amount of the selected items in the tree
			
			@returns {int} the amount
			###
			@checkWidget()
			@selection.length
			
			
		notifySelectionListener: ->
			###
			Notifies selection listener about the changed selection within the receiver.
			
			@private
			@returns {void}
			###
			@selectionListeners.forEach (listener) ->
				listener.widgetSelected(@event) if listener.widgetSelected
				
				
		removeSelectionListener: (listener) ->
			###
			Removes the listener from the collection of listeners who will no longer be notified 
			when the user changes the receiver's selection. 
			
			@param {gara.widgets.SelectionListener} listener the listener which should no longer be notified 
			@returns {gara.widgets.List} this
			###
			@checkWidget()
			@selectionListeners.remove(listener)
			this
	
		
		select: (index) ->
			###
			Selects an item.
			
			@see gara.widgets.List#selectAll
			@see gara.widgets.List#selectArray
			@see gara.widgets.List#selectRange
			@see gara.widgets.List#setSelection
			@param {int} item the item that should be selected
			@throws {RangeError} if the index is out of bounds
			@returns {void}
			###
			@checkWidget()
	
			# return if index are out of bounds
			if index < 0 or index >= @items.length
				throw new RangeError("index out of bounds")
	
			item = @items[index]
			if !@selection.contains(item)
				item.setSelected(true)
				@selection.push(item)
				@shiftItem = item
				@notifySelectionListener()
	
		
		selectAdd: (item, add) ->
			###
			@private
			###
			@checkWidget();
			
			if !item instanceof gara.widgets.Item
				throw new TypeError("item not instance of gara.widgets.Item")
	
			if !add or @config.multi
				while @selection.length
					i = @selection.pop()
					i.setSelected(false)
				
			@select(@indexOf(item))
	
	
		selectAll: ->
			###
			Select all items in the receiver.
			
			@description
			Select all items in the receiver. If the receiver is single-select, do nothing. 
			
			@returns {void}
			###
			@checkWidget()
			if @config.multi
				@items.forEach (item) =>
					if !@selection.contains(item)
						item.setSelected(true)
						@selection.push(item)
				@notifySelectionListener()
	
	
		selectArray: (indices) ->
			###
			Selects items passed by an array with zero-related indices.

			@param {int[]} indices an array with zero-related indices
			@returns {void}
			###
			if !indices.length
				return
	
			@checkWidget()
	
			if indices.length > 1 and @config.multi
				indices.forEach (index) =>
					if !@selection.contains(@items[index])
						@items[index].setSelected(true)
						@selection.push(@items[index])
				@notifySelectionListener()
			else
				@select(indices[indices.length - 1])
	
	
		selectRange: (from, to) ->
			###
			Selects items within a specified range.
			
			@see gara.widgets.List#select
			@see gara.widgets.List#selectAll
			@see gara.widgets.List#selectArray
			@see gara.widgets.List#setSelection
			@param {int} from range start
			@param {int} to range end
			@returns {void}
			###
			@checkWidget();
			
			if (to - from) > 1 and @config.multi
				for i in [from..to]
					if !@selection.contains(@items[i])
						@items[i].setSelected(true)
						@selection.push(@items[i])
					
				@notifySelectionListener()
			else
				@select(to)
	
		
		selectShift: (item, add) ->
			###
			Selects a range. From the item with shift-lock to the passed item.
			
			@private
			@param {gara.widgets.ListItem} item the item that should be selected
			@throws {TypeError} if the item is not a gara.widgets.ListItem
			@returns {void}
			###
			@checkWidget()
	
			if !item instanceof gara.widgets.ListItem
				throw new TypeError("item not instance of gara.widgets.ListItem")
	
			# remove others selection
			if !add
				while @selection.length
					@selection.pop().setSelected(false)
	
			# only, when selection mode is MULTI
			if @config.multi
				indexShift = @indexOf(@shiftItem)
				indexItem = @indexOf(item)
				from = if indexShift > indexItem then indexItem else indexShift
				to = if indexShift < indexItem then indexItem else indexShift
	
				for i in [from..to]
					@selection.push(@items[i])
					@items[i].setSelected(true)
	
				@notifySelectionListener()
			else
				@select(@indexOf(item))


		setSelection: (items) ->
			###
			Sets the selection on the receiver.
			
			@see gara.widgets.List#deselectAll
			@param {gara.widgets.ListItem[]|gara.widgets.ListItem} items the array with the <code>ListItem</code> items
			@returns {gara.widgets.List} this
			###
			@checkWidget()
			@deselectAll()
	
			if items instanceof Array
				if items.length > 1 and @config.multi
					items.forEach (item) =>
						if !@selection.contains(item)
							item.setSelected(true)
							@selection.push(item)
					@notifySelectionListener()
				else if items.length
					@select(@items.indexOf(items[items.length - 1]))
	
			else if items instanceof gara.widgets.Item
				@select(@indexOf(items))

			this
			

	gara.namespace('gara.widgets')
	gara.widgets.Selection = Selection
	exports.Selection = Selection
