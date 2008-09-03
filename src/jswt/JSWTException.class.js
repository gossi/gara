/*	$Id: ItemNotExistsException.class.js 91 2007-12-09 18:58:43Z tgossmann $

		gara - Javascript Toolkit
	===========================================================================

		Copyright (c) 2007 Thomas Gossmann
	
		Homepage:
			http://gara.creative2.net

		This library is free software;  you  can  redistribute  it  and/or
		modify  it  under  the  terms  of  the   GNU Lesser General Public
		License  as  published  by  the  Free Software Foundation;  either
		version 2.1 of the License, or (at your option) any later version.

		This library is distributed in  the hope  that it  will be useful,
		but WITHOUT ANY WARRANTY; without  even  the  implied  warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See  the  GNU
		Lesser General Public License for more details.

	===========================================================================
*/

/**
 * @class JSWTException
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @extends Exception
 */
$class("JSWTException", {
	$extends : Exception,
	
	/**
	 * @field
	 * Contains the error code, one of JSWT.ERROR_* 
	 */
	code : null,
	
	/**
	 * @constructor
	 * Raises a JSWT Exception
	 * 
	 * @param {mixed} codeOrMessage Pass either a code or a message
	 * @param {String} message Wether code is passed place your message as second
	 */
	$constructor : function(codeOrMessage, message) {
		var code;
		if (typeof(message) == "undefined") {
			message = codeOrMessage;
		} else {
			code = codeOrMessage;
		}
		this.code = code;
		this.message = String(message);
		this.name = $class.typeOf(this);
	}
});