var onDOMLoaded = function(f) {
	/* for Mozilla/Opera9 */
	if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", f, false);
	}
	
	/* for Internet Explorer */
	else if (window.ActiveX) {
		document.write("<scr"+"ipt id=__ie_onload defer src=javascript:void(0)><\/script>");
		var script = document.getElementById("__ie_onload");
		script.onreadystatechange = function() {
			if (this.readyState == "complete") {
				f(); // call the onload handler
			}
		};
	}
	
	/* for Safari */
	else if (/WebKit/i.test(navigator.userAgent)) { // sniff
		var _timer = setInterval(function() {
			if (/loaded|complete/.test(document.readyState)) {
				f(); // call the onload handler
			}
		}, 10);
	}

	/* for other browsers */
	else {
		window.onload = f;
	}
}