###

		gara - Javascript Toolkit
	===========================================================================

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

	===========================================================================
###

define 'gara/widgets/WidgetException', ['require', 'exports'], (require, exports) ->
	
	class WidgetException extends gara.Exception
		###
		@private
		Contains the error code, one of JSWT.ERROR_*
		###
		code : null
		
		constructor: (codeOrMessage, message) ->
			###
			Creates a widget exception
			
			@param {mixed} codeOrMessage Pass either a code or a message
			@param {String} message Wether code is passed place your message as second
			###
	
			if message?
				message = codeOrMessage
			else
				code = codeOrMessage
	
			@code = code
			@message = message
			
	gara.namespace('gara.widgets')
	gara.widgets.WidgetException = WidgetException
	exports.WidgetException = WidgetException