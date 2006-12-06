jsRIA = new jsRIA('jsRIA');
jsRIA.setBaseUrl(baseUrl);
if (console) {
	jsRIA.getLog().addWriter(new Firebug());
}

jsRIALoader = new ScriptLoader();
jsRIALoader.setBaseUrl(baseUrl);
jsRIALoader.setLog(jsRIA.getLog());


jsRIA.setScriptLoader(jsRIALoader);
jsRIA.loadDependsDoc();

var em = new EventManager("em");
jsRIA.setEventManager(em);