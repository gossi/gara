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


define 'gara/widgets/CheckboxItem', ['require', 'exports'], (require, exports) ->

	###
	A trait for checkbox items

	@require checkWidget
	@require handle
	@require config
	###
	class CheckboxItem


		initCheckbox: (config = {}) ->
			@checkbox = null
			@config.checked = config.checked || false
			@config.grayed = config.grayed || false

		###
		Internal creation process of this item
		
		@private
		@returns {void}
		###
		createCheckbox: ->
			@checkbox = gara.global.document.createElement('span')
			@checkbox.id = @getId() + '-checkbox'
			@checkbox.widget = this
			@checkbox.control = @parent
			@checkbox.setAttribute('role', 'presentation')

			@setCheckboxClass()

			@handle.appendChild(@checkbox)
			@handle.setAttribute('aria-checked', @config.checked)

			# register events
			handleCheckbox = (e) =>
				@checkWidget()
				if ((e.target is @checkbox and e.type is 'mousedown') or
				(e.target is @checkbox and e.type is 'mouseup') or
				(e.type is 'keydown' and e.keyCode is gara.SPACE)) and
				!@config.grayed
					@fireEvent('selection', gara.CHECK)
					@setChecked(!@checked)

			@addListener('mousedown', handleCheckbox)
			@addListener('mouseup', handleCheckbox)
			@addListener('keydown', handleCheckbox)


		###
		Returns the receiver's checked state.
		
		@see gara.widgets.ListItem#setChecked
		@returns {boolean} <code>true</code> for checked and <code>false</code> otherwise
		###
		getChecked: ->
			@checkWidget()
			@config.checked


		###
		Returns the receiver's grayed state.
		
		@see gara.widgets.ListItem#setGrayed
		@returns {boolean} <code>true</code> for grayed and <code>false</code> otherwise
		###
		getGrayed: ->
			@checkWidget()
			@config.grayed
	
		
		###
		@private
		###
		setCheckboxClass: ->
			if !@checkbox
				return
	
			@checkbox.className = 'gara-checkbox'
			if @config.checked and @config.grayed
				@checkbox.className += ' gara-checkbox-grayed-checked'
			else if @config.grayed
				@checkbox.className += ' gara-checkbox-grayed'
			else if @config.checked
				@checkbox.className += ' gara-checkbox-checked'
			
		
		###
		Sets the receiver's checked state.
		
		@see gara.widgets.ListItem#getChecked
		@param {boolean} checked <code>true</code> for checked and <code>false</code> otherwise
		@returns {void}
		###
		setChecked: (checked) ->
			@checkWidget()
			if !@config.grayed
				@config.checked = checked
				@handle.setAttribute('aria-checked', checked)
				@setCheckboxClass()
				
			this
			
		
		###
		Sets the receiver's grayed state.
		
		@see gara.widgets.ListItem#getGrayed
		@param {boolean} grayed <code>true</code> for grayed and <code>false</code> otherwise
		@returns {void}
		###
		setGrayed: (grayed) ->
			@checkWidget()
			@config.grayed = grayed
			if @checkbox
				@checkbox.setAttribute('aria-disabled', grayed)
				@setCheckboxClass()
			
			this
			
			
	gara.namespace('gara.widgets')
	gara.widgets.CheckboxItem = CheckboxItem
	exports.CheckboxItem = CheckboxItem