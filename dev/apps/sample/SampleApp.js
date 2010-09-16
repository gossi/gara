gara.provide("sample.SampleApp", "gara.jsface.window.Application");

gara.use("gara.jswt.layout.ColumnLayout");
gara.use("gara.jswt.widgets.TabFolder");
gara.use("gara.jswt.widgets.Table");
gara.use("gara.jswt.widgets.TableColumn");
gara.use("gara.jswt.widgets.Tree");
gara.use("gara.jswt.widgets.List");

gara.Class("sample.SampleApp", function () { return {

	$extends : gara.jsface.window.Application,

	/**
	 * @constructor
	 */
	$constructor : function (parentShell) {
		this.$super(parentShell);
	},
	
	createAppContents : function (parent) {
		var tab, tree, list, table;
		parent.setLayout(new gara.jswt.layout.ColumnLayout(gara.jswt.JSWT.LAYOUT_LOOSY));

		// Images
		var imgInfo = new Image();
		imgInfo.src = "../../css/themes/sand/icon_information.png";

		var imgError = new Image();
		imgError.src = '../../css/themes/sand/icon_error.png';

		var imgWarning = new Image();
		imgWarning.src = '../../css/themes/sand/icon_warning.png';
		
		// left
		// Init TabFolder
		tab = new gara.jswt.widgets.TabFolder(parent, gara.jswt.JSWT.DROP_DOWN).addClass("w50");

		// Tree Widget
		tree = new gara.jswt.widgets.Tree(tab, gara.jswt.JSWT.CHECK | gara.jswt.JSWT.FULL_SELECTION);

		var treeItem = new gara.jswt.widgets.TreeItem(tree).setText("Item 1").setImage(imgInfo);
		new gara.jswt.widgets.TreeItem(tree).setText("Item 1a");
		new gara.jswt.widgets.TreeItem(tree).setText("Item 1b");
		new gara.jswt.widgets.TreeItem(tree).setText("Item 1c");
		new gara.jswt.widgets.TreeItem(tree).setText("Item 1d");
		new gara.jswt.widgets.TreeItem(tree).setText("Item 1e");
		var i2 = new gara.jswt.widgets.TreeItem(tree).setText("Item 2");
		var i3 = new gara.jswt.widgets.TreeItem(i2).setText("Item 3");
		new gara.jswt.widgets.TreeItem(i3).setText("Item 4");
		new gara.jswt.widgets.TreeItem(i3).setText("Item 5");
		var i6 = new gara.jswt.widgets.TreeItem(i2).setText("Item 6");
		var i7 = new gara.jswt.widgets.TreeItem(i6).setText("Item 7");
		var i7a = new gara.jswt.widgets.TreeItem(i7).setText("Item 7a");
		var i7b = new gara.jswt.widgets.TreeItem(i7a).setText("Item 7b");
		new gara.jswt.widgets.TreeItem(i7b).setText("Item 7c");
		new gara.jswt.widgets.TreeItem(tree).setText("Item 8");


		// List Widget
		list = new gara.jswt.widgets.List(tab, gara.jswt.JSWT.CHECK | gara.jswt.JSWT.MULTI  | gara.jswt.JSWT.FULL_SELECTION); //

		new gara.jswt.widgets.ListItem(list).setText("Item 1");
		new gara.jswt.widgets.ListItem(list).setText("Item 2").setImage(imgInfo);
		new gara.jswt.widgets.ListItem(list).setText("Item 3");
		new gara.jswt.widgets.ListItem(list).setText("Item 4").setImage(imgWarning);
		new gara.jswt.widgets.ListItem(list).setText("Item 5");
		new gara.jswt.widgets.ListItem(list).setText("Item 6");
		new gara.jswt.widgets.ListItem(list).setText("Item 7");
		
		// Table Widget
		table = new gara.jswt.widgets.Table(tab, gara.jswt.JSWT.SINGLE | gara.jswt.JSWT.FULL_SELECTION); // | gara.jswt.JSWT.CHECK  
		table.setHeaderVisible(true);
		table.setLinesVisible(false);

		new gara.jswt.widgets.TableColumn(table, gara.jswt.JSWT.DEFAULT).setText("col 1");
		new gara.jswt.widgets.TableColumn(table, gara.jswt.JSWT.DEFAULT).setText("col 2");
		new gara.jswt.widgets.TableColumn(table, gara.jswt.JSWT.DEFAULT).setText("col 3");

		new gara.jswt.widgets.TableItem(table).setText(["Item1, 1", "i1, 2", "i1, 3"]);
		new gara.jswt.widgets.TableItem(table).setText(["Item2, 1", "i2, 2", "i2, 3"]).setImage([imgInfo]);
		new gara.jswt.widgets.TableItem(table).setText(["Item3, 1", "i3, 2", "i3, 3"]);
		new gara.jswt.widgets.TableItem(table).setText(["Item4, 1", "i4, 2", "i4, 3"]).setImage([imgWarning]);
		new gara.jswt.widgets.TableItem(table).setText(["Item5, 1", "i5, 2", "i5, 3"]);
		new gara.jswt.widgets.TableItem(table).setText(["Item6, 1", "i6, 2", "i6, 3"]);

		// TabItems
		new gara.jswt.widgets.TabItem(tab).setText("List Widget").setControl(list);
		new gara.jswt.widgets.TabItem(tab).setText("Tree Widget").setControl(tree);
		new gara.jswt.widgets.TabItem(tab).setText("Table Widget").setControl(table);
	}
};});