gara.provide("sample.SampleApp", "gara.window.Application");

gara.use("gara.layout.ColumnLayout");
gara.use("gara.widgets.TabFolder");
gara.use("gara.widgets.Table");
gara.use("gara.widgets.TableColumn");
gara.use("gara.widgets.Tree");
gara.use("gara.widgets.List");
gara.use("gara.widgets.Button");
gara.use("gara.widgets.Label");
gara.use("gara.widgets.Text");

gara.use("gara.action.MenuManager");

gara.use("sample.actions.Options");
gara.use("sample.actions.Add");

gara.Class("sample.SampleApp", function () { return {

	$extends : gara.window.Application,

	/**
	 * @constructor
	 */
	$constructor : function (parentShell) {
		this.$super(parentShell);
	},
	
	makeActions : function () {
		this.register(new gara.action.MenuManager("File", "sample.actions.File"));
		this.register(new sample.actions.Options());
		this.register(new sample.actions.Add());
	},
	
	fillMenuBar : function (menuManager) {
		var file = this.getAction("sample.actions.File");
		
		menuManager.add(file);
		file.add(this.getAction("sample.actions.Options"));
	},
	
	fillToolBar : function (toolBarManager) {
		toolBarManager.add(this.getAction("sample.actions.Add"));
	},
	
	createWindowContents : function (parent) {
		var tree, list, table;
		parent.setLayout(new gara.layout.ColumnLayout(gara.LAYOUT_LOOSY));

		// Images
		var imgInfo = new Image();
		imgInfo.src = "../../css/themes/sand/icon_information.png";

		var imgError = new Image();
		imgError.src = '../../css/themes/sand/icon_error.png';

		var imgWarning = new Image();
		imgWarning.src = '../../css/themes/sand/icon_warning.png';
		
//		list = new gara.widgets.List(parent).addClass("w50");
//		
//		for (var i = 1; i <= 10; i++) {
//			new gara.widgets.ListItem(list).setText("List Item " + i);
//		}
		
		// left
		// Init TabFolder
		tab = new gara.widgets.TabFolder(parent, gara.DROP_DOWN).addClass("w50");

		// Tree Widget
		tree = new gara.widgets.Tree(tab, gara.CHECK | gara.FULL_SELECTION);

		var treeItem = new gara.widgets.TreeItem(tree).setText("Item 1").setImage(imgInfo);
		new gara.widgets.TreeItem(tree).setText("Item 1a");
		new gara.widgets.TreeItem(tree).setText("Item 1b");
		new gara.widgets.TreeItem(tree).setText("Item 1c");
		new gara.widgets.TreeItem(tree).setText("Item 1d");
		new gara.widgets.TreeItem(tree).setText("Item 1e");
		var i2 = new gara.widgets.TreeItem(tree).setText("Item 2");
		var i3 = new gara.widgets.TreeItem(i2).setText("Item 3");
		new gara.widgets.TreeItem(i3).setText("Item 4");
		new gara.widgets.TreeItem(i3).setText("Item 5");
		var i6 = new gara.widgets.TreeItem(i2).setText("Item 6");
		var i7 = new gara.widgets.TreeItem(i6).setText("Item 7");
		var i7a = new gara.widgets.TreeItem(i7).setText("Item 7a");
		var i7b = new gara.widgets.TreeItem(i7a).setText("Item 7b");
		new gara.widgets.TreeItem(i7b).setText("Item 7c");
		new gara.widgets.TreeItem(tree).setText("Item 8");


		// List Widget
		list = new gara.widgets.List(tab, gara.CHECK | gara.MULTI  | gara.FULL_SELECTION); //

		new gara.widgets.ListItem(list).setText("Item 1");
		new gara.widgets.ListItem(list).setText("Item 2").setImage(imgInfo);
		new gara.widgets.ListItem(list).setText("Item 3");
		new gara.widgets.ListItem(list).setText("Item 4").setImage(imgWarning);
		new gara.widgets.ListItem(list).setText("Item 5");
		new gara.widgets.ListItem(list).setText("Item 6");
		new gara.widgets.ListItem(list).setText("Item 7");
		
		// Table Widget
		table = new gara.widgets.Table(tab, gara.SINGLE | gara.FULL_SELECTION); // | gara.CHECK  
		table.setHeaderVisible(true);
		table.setLinesVisible(false);

		new gara.widgets.TableColumn(table, gara.DEFAULT).setText("col 1");
		new gara.widgets.TableColumn(table, gara.DEFAULT).setText("col 2");
		new gara.widgets.TableColumn(table, gara.DEFAULT).setText("col 3");

		new gara.widgets.TableItem(table).setText(["Item1, 1", "i1, 2", "i1, 3"]);
		new gara.widgets.TableItem(table).setText(["Item2, 1", "i2, 2", "i2, 3"]).setImage([imgInfo]);
		new gara.widgets.TableItem(table).setText(["Item3, 1", "i3, 2", "i3, 3"]);
		new gara.widgets.TableItem(table).setText(["Item4, 1", "i4, 2", "i4, 3"]).setImage([imgWarning]);
		new gara.widgets.TableItem(table).setText(["Item5, 1", "i5, 2", "i5, 3"]);
		new gara.widgets.TableItem(table).setText(["Item6, 1", "i6, 2", "i6, 3"]);

		// TabItems
		new gara.widgets.TabItem(tab).setText("List Widget").setControl(list);
		new gara.widgets.TabItem(tab).setText("Tree Widget").setControl(tree);
		new gara.widgets.TabItem(tab).setText("Table Widget").setControl(table);
		
		var controls = new gara.widgets.Composite(parent).addClass("w50");
		
		// buttons
		var buttons = new gara.widgets.Composite(controls);
		new gara.widgets.Label(buttons).setText("Buttons");
		new gara.widgets.Button(buttons).setText("Simple Button");
		new gara.widgets.Button(buttons).setText("Simple Button width Image").setImage(imgInfo);
		new gara.widgets.Button(buttons).setText("Simple disabled Button").setEnabled(false);
		new gara.widgets.Button(buttons).setText("Simple disabled Button width Image").setImage(imgInfo).setEnabled(false);
		
		// radio buttons
		var radios = new gara.widgets.Composite(controls);
		new gara.widgets.Label(radios).setText("Radio Buttons");
		new gara.widgets.Button(radios, gara.RADIO).setText("Woo (disabled)").setImage(imgWarning).setEnabled(false);
		new gara.widgets.Button(radios, gara.RADIO).setText("Hoo");
		new gara.widgets.Button(radios, gara.RADIO).setText("Foo (disabled)").setEnabled(false);
		new gara.widgets.Button(radios, gara.RADIO).setText("Boo").setImage(imgError);
		
		// checkbox buttons
		var checks = new gara.widgets.Composite(controls);
		new gara.widgets.Label(checks).setText("Checkboxes");
		new gara.widgets.Button(checks, gara.CHECK).setText("Hoo");
		new gara.widgets.Button(checks, gara.CHECK).setText("Woo (disabled)").setImage(imgInfo).setEnabled(false);
		new gara.widgets.Button(checks, gara.CHECK).setText("Foo (disabled)").setEnabled(false).setSelection(true);
		new gara.widgets.Button(checks, gara.CHECK).setText("Boo").setImage(imgWarning);
		
		var verts = new gara.widgets.Composite(controls).setLayout(new gara.layout.ColumnLayout());
		
		// radio buttons (vertical)
		var radioVerts = new gara.widgets.Composite(verts).addClass("w50");
		new gara.widgets.Label(radioVerts).setText("Radio Buttons (Vertical Layout)");
		new gara.widgets.Button(radioVerts, gara.RADIO | gara.VERTICAL).setText("Hoo").setEnabled(true);
		new gara.widgets.Button(radioVerts, gara.RADIO | gara.VERTICAL).setText("Foo (disabled)").setEnabled(false);
		new gara.widgets.Button(radioVerts, gara.RADIO | gara.VERTICAL).setText("Boo").setImage(imgError);
		new gara.widgets.Button(radioVerts, gara.RADIO | gara.VERTICAL).setText("Woo (disabled)").setImage(imgWarning).setEnabled(false);

		// checkbox buttons (vertical)
		var checksVerts = new gara.widgets.Composite(verts).addClass("w50");
		new gara.widgets.Label(checksVerts).setText("Radio Buttons (Vertical Layout)");
		new gara.widgets.Button(checksVerts, gara.CHECK | gara.VERTICAL).setText("Hoo");
		new gara.widgets.Button(checksVerts, gara.CHECK | gara.VERTICAL).setText("Woo (disabled)").setImage(imgInfo).setEnabled(false);
		new gara.widgets.Button(checksVerts, gara.CHECK | gara.VERTICAL).setText("Foo (disabled)").setEnabled(false).setSelection(true);
		new gara.widgets.Button(checksVerts, gara.CHECK | gara.VERTICAL).setText("Boo").setImage(imgWarning);

		new gara.widgets.Label(controls).setText("Input Texts").addClass("w100");
		var texts = new gara.widgets.Composite(controls).setLayout(new gara.layout.ColumnLayout());

		new gara.widgets.Label(texts).setText("Simple Text:").addClass("w50");
		new gara.widgets.Text(texts).addClass("w50");

		new gara.widgets.Label(texts).setText("Password:").addClass("w50");
		new gara.widgets.Text(texts, gara.PASSWORD).addClass("w50");
		
		new gara.widgets.Label(texts).setText("Multiline:").addClass("w50");
		new gara.widgets.Text(texts).addClass("w50", gara.MULTI).setText("Here we have a multiline text container with width 350px and height 80px.").addClass("w50").setHeight(100);
	},
	
	preWindowOpen : function () {
		this.setShowMenuBar(true);
		this.setShowToolBar(true);
	}
};});