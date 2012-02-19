###
gara - Javascript Toolkit

Copyright (c) 2007 Thomas Gossmann

Homepage:
	http:#garajs.org

This library is free software  you  can  redistribute  it  and/or
modify  it  under  the  terms  of  the   GNU Lesser General Public
License  as  published  by  the  Free Software Foundation  either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in  the hope  that it  will be useful,
but WITHOUT ANY WARRANTY without  even  the  implied  warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See  the  GNU
Lesser General Public License for more details.
###


define 'gara/widgets/ListItem', 
['require', 'exports', 'gara/widgets/Item', 'gara/widgets/List', 'gara/widgets/CheckboxItem', 'gara/widgets/SelectItem'], 
(require, exports) ->

	Item = require('gara/widgets/Item')
	CheckboxItem = require('gara/widgets/CheckboxItem')
	SelectItem = require('gara/widgets/SelectItem')
	
	class ListItem extends Item
		###
		gara ListItem for List Widget
		
		@class gara.widgets.ListItem
		@extends gara.widgets.Item
		###

		gara.mixin @, CheckboxItem, SelectItem

		# HTML Node Reference
		#
		# @span - holds the span for the text
		# @text - holds the text
		# @image - holds the image	

		constructor: (parent, config = {}, index) ->
			###
			Creates a new ListItem
			
			@constructs
			@extends gara.widgets.Item
			@param {gara.widgets.List} parent the List Widget for this item
			@param {int} style the style for this item
			@param {int} index index to insert the item at
			@throws {TypeError} if the list is not a List widget
			###
			if !parent instanceof gara.widgets.List
				throw new TypeError("parent is not type of gara.widgets.List")
	
			# parse config
			@config = {}
			
			# init mixins
			@initCheckbox(config)
			@initSelect(config)
	
			super(parent, config)

			@parentNode = @parent.addItem(this, index)
			@createWidget()


		createWidget: ->
			###
			Internal creation process of this item
			
			@private
			@returns {void}
			###
			
			# handle
			@handle = gara.global.document.createElement("li")
			@handle.widget = this
			@handle.control = @parent
			@handle.setAttribute("id", @getId())
			@handle.setAttribute("role", "option")
			@handle.setAttribute("aria-selected", @selected)
			@handle.setAttribute("aria-labelledby", @getId()+"-label")
	
			# checkbox
			@createCheckbox() if @parent.getConfig().check
	
			# create image node
			@image = window.document.createElement("img")
			@image.id = @getId() + "-image"
			@image.className = "gara-list-item-image gara-item-image"
			@image.widget = this
			@image.control = @parent
			@image.setAttribute("role", "presentation")
	
			# set image
			if @config.image isnt null
				@image.src = @config.image.src
			else
				@image.style.display = "none"
			
			@text = window.document.createTextNode(@config.text)
			@span = window.document.createElement("span")
			@span.id = @getId()+"-label"
			@span.className = "gara-list-item-text gara-item-text"
			@span.widget = this
			@span.control = @parent
			@span.appendChild(@text)
			@span.setAttribute("role", "presentation")
	
			@handle.appendChild(@image)
			@handle.appendChild(@span)
			
			# CSS
			@addClass("gara-list-item")
	
			# append to dom
			items = @parent.getItems()
			index = items.indexOf(this)
			
			if index is items.length - 1
				@parentNode.appendChild(@handle)
			else
				nextNode = if index is 0 then @parentNode.firstChild else items[index - 1].handle.nextSibling
				@parentNode.insertBefore(@handle, nextNode)

	
		destroyWidget: ->
			###
			Destroys the <code>ListItem</code>
			
			@private
			@returns {void}
			###
			@parent.releaseItem(this)
	
			@image = null
			@span = null
			@text = null
			
			super

		
		setImage: (image) ->
			###
			Sets the receiver's image.
			
			@param {Image} image the new image
			@returns {gara.widgets.ListItem} this
			###
			super(image)
	
			# update image
			if image isnt null
				@image.src = image.src
				@image.style.display = ""
	
			# hide image
			else
				@image.src = ""
				@image.style.display = "none"
	
			this
	
		
		setText: (text) ->
			###
			Sets the receiver's text.
			
			@param {String} text the new text
			@returns {gara.widgets.ListItem} this
			###
			super(text)
			@text.nodeValue = text
			this
	
	
		toString: ->
			return '[gara.widgets.ListItem]'
			
			
	gara.namespace('gara.widgets')
	gara.widgets.ListItem = ListItem
	exports.ListItem = ListItem