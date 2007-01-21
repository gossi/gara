//gaia = new Gaia('gaia');
//alert(gaia);
gaia.setBaseUrl(baseUrl);
if (console) {
	gaia.getLog().addWriter(new Firebug());
}

scriptLoader = new ScriptLoader();
scriptLoader.setBaseUrl(baseUrl);
scriptLoader.setLog(gaia.getLog());


gaia.setScriptLoader(scriptLoader);
gaia.loadDependsDoc();

//jsRIA.setEventManager(new EventManager());