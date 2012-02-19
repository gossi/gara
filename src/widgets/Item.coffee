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

define 'gara/widgets/Item', ['require', 'exports', 'gara/widgets/Widget'], (require, exports) ->

	Widget = require('gara/widgets/Widget')

	class Item extends Widget
		###
		'Abstract' Item class
		@class gara.widgets.Item
		@extends gara.widgets.Widget
		###
		

		# ###
		# Holds the active state.
# 		
		# @private
		# ###
		# active: false
# 	
		# ###
		# The <code>Item</code>'s image.
# 		
		# @private
		# ###
		# image: null
# 	
		# ###
# 		
		# The <code>Item</code>'s text.
# 		
		# @private
		# ###
		# text: ""
	
		constructor: (parent, config) ->
			###
			Creates a new Item.
			
			@constructs
			@extends gara.widgets.Widget
			@param {gara.widgets.List} parent the parent <code>Control</code> widget
			@param {int} style information for this <code>Item</code>
			###
			
			@active = false
			
			#parse config
			@config.image = config.image || null if !@config.image?
			@config.text = config.text || "" if !@config.text? 
			
			super(parent, config)
			
		
		destroyWidget: ->
			@config.image = null
			@config.text = null
			
	#		if (@parentNode !== null) {
	#			@parentNode.removeChild(@handle);
	#		}
			super

	
		getImage: ->
			###
			Returns the items image.
			
			@author Thomas Gossmann
			@return {Image} the items image
			###
			@config.image
	
	
		getText: ->
			###
			Returns the items text.
			
			@return {String} the text for this item
			###
			@config.text
	
		
		setActive: (@active) ->
			###
			Sets the item active state.
			
			@private
			@param {boolean} active <code>true</code> for active and <code>false</code> for inactive
			@returns {gara.widgets.Item} this
			###
			@setClass("gara-item-active", @active)
			this


		setImage: (image) ->
			###
			Sets the image for the item.
			
			@param {Image} image the new image
			@returns {gara.widgets.Item} this
			###
			@config.image = image
			this
	
		
		setText: (text) ->
			###
			Sets the text for the item.
			
			@param {String} text the new text
			@returns {gara.widgets.Item} this
			###
			@config.text = text
			this
			
		
		toString: ->
			return '[gara.widgets.Item]'
		
	gara.namespace('gara.widgets')
	gara.widgets.Item = Item
	exports.Item = Item