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

define 'gara/widgets/Composite', ['require', 'exports', 'gara/widgets/Scrollable'], (require, exports) ->

#gara.use("gara.widgets.Control");
	Scrollable = require('gara/widgets/Scrollable')

	class Composite extends Scrollable
		###
		A specific Layout of the receiver
		
		@private
		@type {gara.layout.Layout}
		###
		layoutInformation: null
	
		constructor: (parent, config) ->
			@layoutInformation = null
			
			super(parent, config)
			#@resize();

		createHandle: (element) ->
			super(element);
			@addClass("gara-composite")

	
		createWidget: ->
			@createHandle("div")
			@handle.tabIndex = -1

	
		getChildren: ->
			###
			@summary
			Returns a (possibly empty) array containing the receiver's children.
			
			@description
			Returns a (possibly empty) array containing the receiver's children. Children are returned 
			in the order that they are drawn. The topmost control appears at the beginning of the array. 
			Subsequent controls draw beneath this control and appear later in the array. 
			
			@returns {gara.widgets.Control[]} an array of children
			###
			temp = {}
			layers = {}
			max = 0
			controls = []
			childs = @getClientArea().childNodes
			addControl = (widget) -> controls[controls.length] = widget
			
			# SELECT childNodes FROM @getClientArea() WHERE childNode[widget] 
			#        ORDER BY childNode.style.zIndex DESC
			for child in childs
				if child.widget and child.widget isnt this and 
				child.widget instanceof gara.widgets.Control
					z = if child.widget.handle.style.zIndex is "" then 0 else child.widget.handle.style.zIndex
					layers[z] = [] if !layers[z]
					layers[z][layers[z].length] = child.widget
					max = Math.max(max, z)
			
			for i in [max..0]
				layers[i].forEach(addControl, this) if layers[i]
			
			controls
		
		
		
		getLayout: ->
			###
			Returns layout which is associated with the receiver, or null if one has not been set. 
			
			@see gara.widgets.Composite#setLayout
			@returns {gara.layout.Layout} the receiver's layout or null
			###
			@layoutInformation
	
		
		layout: ->
			###
			If the receiver has a layout, asks the layout to <em>lay out</em> (that is, set the size and 
			location of) the receiver's children. If the receiver does not have a layout, do nothing.  
			
			@see gara.widgets.Composite#setLayout
			@returns {void}
			###
			# var resizeable = [], lastHeight, ratio, widgetHeight,
				# autoHeight = [], percentHeight = [], cssHeight = [],
				# heights = ["h25", "h50", "h75", "h33", "h66"],
				# widths = ["w25", "w50", "w75", "w33", "w66"],
				# ratios = [0.25, 0.5, 0.75, 0.3333, 0.6666],
				# width, height,
				# overflowX = gara.getStyle(@getClientArea(), "overflow-x"),
				# overflowY = gara.getStyle(@getClientArea(), "overflow-y");
# 			
			# console.log("Composite ("+this+").layout");
# 			
			# @update();
# 			
			# @getClientArea().style.overflowX = "hidden";
			# @getClientArea().style.overflowY = "hidden";
# 			
			# height = @getClientArea().clientHeight;
			# width = @getClientArea().clientWidth;
# 	
			# if (width === 0 || height === 0) {
				# return;
			# }
# 	
			# if (@layoutInformation !== null) {
				# @layoutInformation.layout(this);
				# @getClientArea().style.overflowY = overflowY;
				# @getClientArea().style.overflowX = overflowX;
				# return;
			# }
# 	
			# @getChildren().forEach(function (widget) {
	# #			console.log("Composite.layout: " + widget + " " + widget.getHeight());
				# if (widget instanceof gara.widgets.Scrollable) {
	# #				if (!(widget.hasClass("h25") || widget.hasClass("h50" || widget.hasClass("h75") || widget.hasClass("h100") || widget.hasClass("h33") || widget.hasClass("h66") || widget.getHeight() >= 0 && widget.getHeight() <= 1))) {
	# #					console.log(this + ".setHeight push changeable");
	# #					changeable.push(widget);
	# #				} else {
	# #					if (widget.getHeight() === null) {
	# #						widgetHeight = widget.handle.clientHeight - gara.getNumStyle(widget.handle, "padding-top") - gara.getNumStyle(widget.handle, "padding-bottom") - gara.getNumStyle(widget.handle, "border-top") - gara.getNumStyle(widget.handle, "border-bottom");
	# #	#					console.log("Composite.setHeight, widgetHeight: " + widgetHeight);
	# #						widget.setHeight(widgetHeight);
	# #						widget.setHeight(null);
	# #						newHeight -= widgetHeight;
	# #					}
	# #				}
# 	
					# # css width
	# #				if (widget.hasClass("w25") || widget.hasClass("w50") || widget.hasClass("w75") || widget.hasClass("w33") || widget.hasClass("w66")) {
	# #					widths.forEach(function (cssHeightClass, j) {
	# #						if (widget.hasClass(cssHeightClass)) {
	# #							ratio = ratios[j];
	# #							return;
	# #						}
	# #					}, this);
	# #					widget.adjustWidth(Math.floor(ratiowidth));
	# #				} 
# 					
					# # no width
					# if (widget.getWidth() === null) {
						# widget.adjustWidth(width);
					# }
# 	
					# # height
					# if (widget.getHeight() > 1) {
						# height -= widget.getHeight();
					# } else if (widget.hasClass("h25") || widget.hasClass("h50") || widget.hasClass("h75") || widget.hasClass("h33") || widget.hasClass("h66")) {
	# #					console.log(this + ".layout push cssHeight of " + widget);
						# cssHeight.push(widget);
					# } else if (widget.getHeight() === null) {
	# #					console.log(this + ".setHeight push autoHeight");
		# #				resizeable.push(widget);
						# autoHeight.push(widget);
					# } else if (widget.getHeight() >= 0 && widget.getHeight() <= 1) {
		# #				resizeable.push(widget);
						# percentHeight.push(widget);
					# }
				# }
			# }, this);
# 	
			# lastHeight = height;
# 	
	# #		widths.forEach(function (widget) {
	# #
	# #		});
# 	
			# autoHeight.forEach(function (widget, i, arr) {
	# #			console.log("Composite.layout auto height");
				# if (i === arr.length - 1) {
	# #				console.log("Layout.setHeight last-autoHeight("+lastHeight+")");
		# #			widget.setHeight(newHeight);
		# #			widget.setHeight(null);
	# #				console.log("Composite.layout(autoHeight) " + widget + " " + lastHeight);
	# #				widget.handle.style.height = lastHeight + "px";
					# widget.adjustHeight(lastHeight);
				# } else {
					# widgetHeight = Math.floor(lastHeight / autoHeight.length);
	# #				console.log("Layout.setHeight autoHeight("+widgetHeight+")");
		# #			widget.setHeight(widgetHeight);
		# #			widget.setHeight(null);
	# #				console.log("Composite.layout(autoHeight) " + widget + " " + widgetHeight);
	# #				widget.handle.style.height = widgetHeight + "px";
					# widget.adjustHeight(widgetHeight);
					# lastHeight -= widgetHeight;
				# }
			# }, this);
# 	
			# percentHeight.forEach(function (widget, i, arr) {
				# if (i === arr.length - 1) {
	# #				console.log("Layout.setHeight last-percentHeight("+lastHeight+")");
		# #			widget.setHeight(newHeight);
		# #			widget.setHeight(null);
	# #				widget.handle.style.height = lastHeight + "px";
					# widget.adjustHeight(lastHeight);
				# } else {
					# widgetHeight = Math.floor(widget.getHeight()height);
	# #				console.log("Layout.setHeight percentHeight("+widgetHeight+")");
		# #			widget.setHeight(widgetHeight);
		# #			widget.setHeight(null);
					# widget.adjustHeight(widgetHeight);
	# #				widget.handle.style.height = widgetHeight + "px";
					# lastHeight -= widgetHeight;
				# }
			# }, this);
# 	
			# cssHeight.forEach(function (widget, i, arr) {
				# if (i === arr.length - 1) {
	# #				console.log("Layout.setHeight last-cssHeight("+lastHeight+")");
					# widget.adjustHeight(lastHeight);
	# #				widget.handle.style.height = lastHeight + "px";
				# } else {
					# heights.forEach(function (cssHeightClass, j) {
						# if (widget.hasClass(cssHeightClass)) {
							# ratio = ratios[j];
							# return;
						# }
					# }, this);
					# widgetHeight = Math.floor(ratioheight);
	# #				console.log("Layout.setHeight cssHeight("+widgetHeight+")");
		# #			widget.setHeight(widgetHeight);
		# #			widget.setHeight(null);
					# widget.adjustHeight(widgetHeight);
	# #				widget.handle.style.height = widgetHeight + "px";
					# lastHeight -= widgetHeight;
				# }
			# }, this);
# 			
			# @getChildren().forEach(function (widget) {
				# if (widget instanceof gara.widgets.Composite) {
					# widget.layout();
				# } else if (widget.update) {
					# widget.update();
				# }
			# });
# 			
			# @getClientArea().style.overflowY = overflowY;
			# @getClientArea().style.overflowX = overflowX;

		
		
		releaseChildren: ->
			###
			Releases all children from the receiver
			
			@private
			@returns {void}
			###
			@getChildren().forEach (control) ->
				control.release()
			
		
		setLayout: (layout) ->
			###
			Sets the layout which is associated with the receiver to be the argument which may be null. 
			
			@see gara.widgets.Composite#getLayout
			@see gara.widgets.Composite#layout
			@param {gara.layout.Layout} layout the receiver's new layout or null 
			@returns {gara.widgets.Composite} this
			###
			if !layout instanceof gara.layout.Layout
				throw new TypeError("layout not instance of gara.layout.Layout")
			
			@layoutInformation.deconstruct(this) if @layoutInformation isnt null
			@layoutInformation = layout
			@layoutInformation.construct(this)
			this
		
	#	setHeight : function (height) {
	#		@$super(height);
	##		@layout();
	#		return this;
	#	},
	#	
	#	setWidth : function (width) {
	#		@$super(width);
	##		@layout();
	#		return this;
	#	},
	
		toString: ->
			'[gara.widgets.Composite]'
			

	gara.namespace('gara.widgets')
	gara.widgets.Composite = Composite
	exports.Composite = Composite
