/**
 * @name JsTestrun
 * @file Yet another unit testing tool for JavaScript.
 * @version 0.2
 * @author Michael Mathews, micmath@gmail.com
 * @license LGPL version 2, http://www.gnu.org/licenses/lgpl.html
 */
 
/**
	@function Runs tests and prints out report.
	@param {object} testCases Properties are testcase names, values are functions to execute as tests.
*/
function testrun(testCases) {
	var ran = 0;
	for (t in testCases) {
		testrun.current = t;
		
		var result = testCases[t]();
		ran++;
	}
	
	testrun.summary = "Tested: "+testrun.count+"<br> Passed: "+testrun.passes;
	
	document.write('<h2>Report</h2>');
	document.write('<div style="font: 11px monospace; border: 1px solid gray; padding: 4px; width: 660px;">');
	document.write(testrun.summary+"<hr>"+testrun.reportOut);
	document.write('</div>');
	
	document.write('<h2>Log</h2>');
	document.write('<textarea cols="80" rows="40">');
	document.write(testrun.logOut);
	document.write('</textarea>');
}

testrun.summary = "";
testrun.count = 0;
testrun.current = null;
testrun.passes = 0;
testrun.fails = 0;
testrun.reportOut = "";
testrun.logOut = "";

testrun.report = function(text) {
	testrun.reportOut += text;
}

/**
	@function Add message to the log area.
	@param {string} message
*/
log = function(message) {
	testrun.logOut += message
}

/**
	@function Check if test evaluates to true.
	@param {string} test To be evaluated.
	@param {string} message Optional. To be displayed in the report.
	@return {boolean} True if the string test evaluates to true.
*/
ok = function(test, message) {
	testrun.count++;
	
	var result;
	try {
		result = eval(test);
		
		if (result) {
			testrun.passes++
			testrun.report("<span style='color:#0C0'><b>ok</b></span> "+testrun.count+" - "+testrun.current+((message != null)?": "+message : "")+"<br>");
		}
		else {
			testrun.fails++
			testrun.report("<span style='color:#F03'><b>not ok</b></span> "+testrun.count+" - "+testrun.current+((message != null)?": "+message : "")+"<br>");
		}
	}
	catch(e) {
		testrun.fails++
		testrun.report("<span style='color:#F03'><b>not ok</b></span> "+testrun.count+" - "+testrun.current+((message != null)?": "+message : "")+" "+e+"<br>");

	}
}

/**
	@function Check if test is same as expected.
	@param {string} test To be evaluated.
	@param {string} expected
	@param {string} message Optional. To be displayed in the report. 
	@return {boolean} True if (test == expected). Note that the comparison is not a strict equality check.
*/
is = function(test, expected, message) {
	testrun.count++;
	
	var result;
	try {
		result = eval(test);
		
		if (result == expected) {
			testrun.passes++
			testrun.report("<span style='color:#0C0'><b>ok</b></span> "+testrun.count+" - "+testrun.current+((message != null)?": "+message : "")+"<br>");
		}
		else {
			testrun.fails++
			testrun.report("<span style='color:#F03'><b>not ok</b></span> "+testrun.count+" - "+testrun.current+((message != null)?": "+message : "")+"<br>");
			testrun.report("&nbsp;&gt;&nbsp;expected:&nbsp;&#x201C;"+_escapeHtml(expected)+"&#x201D;<br>");
			testrun.report("&nbsp;&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;got:&nbsp;&#x201C;"+_escapeHtml(result)+"&#x201D;<br>");
		}
	}
	catch(e) {
		testrun.fails++
		testrun.report("<span style='color:#F03'><b>not ok</b></span> "+testrun.count+" - "+testrun.current+((message != null)?": "+message : "")+" "+e+"<br>");

	}
}

/**
	@function Check if test matches pattern.
	@param {string} test To be evaluated.
	@param {string} pattern Used to create a RegExp.
	@param {string} message Optional. To be displayed in the report.
	@return {boolean} True if test matches pattern.
*/
like = function(test, pattern, message) {
	testrun.count++;

	var result;
	try {
		result = eval(test);
		var rgx = new RegExp(pattern);
		
		if (rgx.test(result)) {
			testrun.passes++
			testrun.report("<span style='color:#0C0'><b>ok</b></span> "+testrun.count+" - "+testrun.current+((message != null)?": "+message : "")+"<br>");
		}
		else {
		
			testrun.fails++
			testrun.report("<span style='color:#F03'><b>not ok</b></span> "+testrun.count+" - "+testrun.current+((message != null)?": "+message : "")+"<br>");
			testrun.report("&nbsp;&gt;&nbsp;this:&nbsp;&#x201C;"+_escapeHtml(result)+"&#x201D;<br>");
			testrun.report("&nbsp;&gt;&nbsp;is not like:&nbsp;&#x201C;"+_escapeHtml(pattern)+"&#x201D;<br>");
		}
	}
	catch(e) {
		testrun.fails++
		testrun.report("<span style='color:#F03'><b>not ok</b></span> "+testrun.count+" - "+testrun.current+((message != null)?": "+message : "")+" "+e+"<br>");
	}
}

/**
	@private
	@function Make string safe for display in web page.
	@param {string} html To be escaped.
	@return {string} The escaped html.
*/
function _escapeHtml(html) {
	if (html != null) return html.toString().replace(/</g,"&lt;");
	else return "";
} 
