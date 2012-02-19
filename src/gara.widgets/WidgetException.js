/*

		gara - Javascript Toolkit
	===========================================================================

		Copyright (c) 2007 Thomas Gossmann

		Homepage:
			http://garathekit.org

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

"use strict";

gara.provide("gara.widgets.WidgetException");

/**
 * @class gara.widgets.WidgetException
 * @extends gara.Exception
 */
gara.widgets.WidgetException = gara.Class(gara.Exception, /** @lends gara.widgets.WidgetException# */ {
	/**
	 * @private
	 * Contains the error code, one of JSWT.ERROR_*
	 */
	code : null,

	/**
	 * Creates a widget exception
	 * 
	 * @constructs
	 * @param {mixed} codeOrMessage Pass either a code or a message
	 * @param {String} message Wether code is passed place your message as second
	 */
	constructor : function(codeOrMessage, message) {
		var code;
		if (typeof(message) === "undefined") {
			message = codeOrMessage;
		} else {
			code = codeOrMessage;
		}
		this.code = code;
		this.message = String(message);
	}
});