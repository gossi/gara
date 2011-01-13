# gara - Javascript Toolkit
Copyright (c) since 2007 Thomas Gossmann (http://gos.si)

## Homepage
http://gara.creative2.net

## License
GNU LGPL 2.1

This library is free software;  you  can  redistribute  it  and/or
modify  it  under  the  terms  of  the   GNU Lesser General Public
License  as  published  by  the  Free Software Foundation;  either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in  the hope  that it  will be useful,
but WITHOUT ANY WARRANTY; without  even  the  implied  warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See  the  GNU
Lesser General Public License for more details.
		
## Build
Building gara is done via Apache Ant. Simply run the ant command in
the gara folder:
	
	gara> ant
	
This will (re-)create the contents of gara/runtime and gara/themes. See
section usage on how to use them.

## Usage
Simply include the gara runtime and one of the themes into your html document:
	
	<style type="text/css" rel="stylesheet" href="path/to/gara-x.x.x/themes/sand/sand.css"/>
	<script src="path/to/gara-x.x.x/runtime/gara.js"></script>
	
And you are ready to use the gara namespace from your javascripts.
