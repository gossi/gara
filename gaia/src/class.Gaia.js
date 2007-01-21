gaia = {
	xmlDoc : null,
	baseUrl : null,
	bDependsDocLoaded : false,
	sMainScriptUrl : null,
	bUseBaseUrl : false,

	init : function() {
		this.getBaseUrl();
		this.interfaceTester = new InterfaceTester();
		this.console = new Console();
		this.log = new Log();
		this.exceptionHandler = new ExceptionHandler();
		this.exceptionHandler.setLog(this.log);
		this.log.addWriter(this.console);
		this.exceptionHandler.setErrorReporting(this.exceptionHandler.ER_LOG);
		this.eventManager = new EventManager();
	},

	toString : function() {
		return "[object Gaia]";
	},

	setBaseUrl : function(sBaseUrl) {
		this.baseUrl = sBaseUrl;
	},

	getBaseUrl : function() {
		if (this.baseUrl != null) {
			return this.baseUrl;
		}
		
		var elements = document.getElementsByTagName('script');
	
		for (var i = 0; i < elements.length; ++i) {
			if( elements[i].src && (elements[i].src.indexOf("gaia.js") != -1) ) {
				var src = elements[i].src;
				src = src.substring(0, src.lastIndexOf('/'));

				this.baseUrl = src;
				break;
			}
		}
		
		// Get document base path
		var documentBasePath = document.location.href;
		if (documentBasePath.indexOf('?') != -1) {
			documentBasePath = documentBasePath.substring(0, documentBasePath.indexOf('?'));
		}
		var documentURL = documentBasePath;
		var documentBasePath = documentBasePath.substring(0, documentBasePath.lastIndexOf('/'));
		
		// If not HTTP absolute
		if (this.baseUrl.indexOf('://') == -1 && this.baseUrl.charAt(0) != '/') {
			// If site absolute
			this.baseUrl = documentBasePath + "/" + this.baseUrl;
		}
		
		return this.baseUrl;
	},
	
	getExceptionHandler : function() {
		return this.exceptionHandler;	
	},
	
	getInterfaceTester : function() {
		return this.interfaceTester;
	},
	
	getEventManager : function() {
		return this.eventManager;
	},
	
	getLog : function() {
		return this.log;
	},
	
//	this.getConsole = function() {
//		return this.console;
//	}
	
	setMainScriptUrl : function(sScriptUrl, bUseBaseUrl) {
		this.sMainScriptUrl = sScriptUrl;
		
		if (typeof(bUseBaseUrl) == "undefined")	{
			this.bUseBaseUrl = false;
		}
	},

}
gaia.init();