/**
 * @class ListItem
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @extends Item
 */
$class("ListItem", {
	$extends : Item,
	_list : null,
	_txt : null,
	_img : null,

	$constructor : function(list) {
		this.$base();
		this._list = list;
		this._list.addItem(this);
	},

	create : function() {
		this.domref = document.createElement("li");
		this.domref.className = this._className;
		this.domref.obj = this;
		this.domref.control = this._list;

		// create item nodes
		this._img = null;

		// set image
		if (this.image != null) {
			this._img = document.createElement("img");
			this._img.obj = this;
			this._img.control = this._list;
			this._img.src = this.image.src;
			this._img.alt = this._text;

			// put the image into the dom
			this.domref.appendChild(this._img);
		}

		this._txt = document.createElement("span");
		this._txt.obj = this;
		this._txt.control = this._list;
		this._txt.innerHTML = this._text;
		this.domref.appendChild(this._txt);
		
		// register listener
		for (var type in this._listener) {
			this._listener[type].forEach(function(elem, index, arr) {
				gara.eventManager.addListener(this.domref, type, elem);
			}, this);
		}

		return this.domref;
	},

	handleEvent : function(e) {
		if (this._listener.hasOwnProperty(e.type)) {
			for (listener in this._listener[e.type]) {
				listener.handleEvent(e);
			}
		}
	},
	
	registerListener : function(eventType, listener) {
		if (this._img != null) {
			gara.eventManager.addListener(this._img, eventType, listener);
		}

		gara.eventManager.addListener(this._txt, eventType, listener);
	},

	update : function() {
		// create image
		if (this.image != null && this._img == null) {
			this._img = document.createElement("img");
			this._img.obj = this;
			this._img.control = this._list;
			this._img.alt = this.sText;
			this._img.src = this.image.src;
			this.domref.insertBefore(this._img, this._txt);
			
			// event listener
			for (var eventType in this._listener) {
				this._listener[type].forEach(function(elem, index, arr) {
					gara.eventManager.addListener(this._img, type, elem);
				}, this);
			}
		}

		// simply update image information
		else if (this.image != null) {
			this._img.src = this.image.src;
			this._img.alt = this._text;
		}

		// delete image
		else if (this._img != null && this.image == null) {
			this.domref.removeChild(this._img);
			this._img = null;
			
			// event listener
			for (var eventType in this._listener) {
				this._listener[type].forEach(function(elem, index, arr) {
					gara.eventManager.removeListener({
						domNode : this._img,
						type: type, 
						listener : elem
					});
				}, this);
			}
		}


		this._txt.innerHTML = this._text;
		this.domref.className = this._className;
	}
});