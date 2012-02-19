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


define 'gara/widgets/SelectItem', ['require', 'exports'], (require, exports) ->

	class SelectItem
		###
		A trait for checkbox items

		@require checkWidget
		@require handle
		@require config
		@class gara.widgets.ListItem
		@extends gara.widgets.Item
		###

		initSelect: (config) ->
			@selected = false


		setSelected: (selected) ->
			###
			Sets the receiver's selected state.
			
			@private
			@param {boolean} selected <code>true</code> for selected and <code>false</code> otherwise
			###
			@checkWidget()
			@selected = selected
			@handle.setAttribute('aria-selected', selected)
			this
			
			
	gara.namespace('gara.widgets')
	gara.widgets.SelectItem = SelectItem
	exports.SelectItem = SelectItem