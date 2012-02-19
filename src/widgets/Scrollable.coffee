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

define 'gara/widgets/Scrollable', ['require', 'exports', 'gara/widgets/Control'], (require, exports) ->

	#gara.use("gara.widgets.Composite");
	
	Control = require 'gara/widgets/Control'

	class Scrollable extends Control
	
		constructor: (parent, config) ->
			super(parent, config)
			parent.layout() if parent instanceof gara.widgets.Composite
	
		
		getClientArea: ->
			###
			Returns the receiver's client area.
			
			@returns {HTMLElement} the scrolled HTMLElement
			###
			@scrolledHandle()
	
		
		getHorizontalScrollbar: ->
			###
			Returns true when the receiver has a horizontal scrollbar, false otherwise
			
			@returns {boolean} true wether there is a horizontal scrollbar otherwise false 
			###
			@scrolledHandle().clientWidth < @scrolledHandle().scrollWidth and @scrolledHandle().style.overflowX isnt "hidden"
	
		
		getVerticalScrollbar: ->
			###
			Returns true when the receiver has a vertical scrollbar, false otherwise
			
			@returns {boolean} true wether there is a vertical scrollbar otherwise false 
			###
			@scrolledHandle().clientHeight < @scrolledHandle().scrollHeight and @scrolledHandle().style.overflowY isnt "hidden"
	
		
		scrolledHandle: ->
			###
			Returns the scrolled handle of the receiver
			
			@private
			@returns {HTMLElement}
			###
			@handle
			
			
	gara.namespace('gara.widgets')
	gara.widgets.Scrollable = Scrollable
	exports.Scrollable = Scrollable