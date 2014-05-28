function BrowseScreen() {
	
	//-----------------------------------------------------------------------------------------------
	// Singleton
	//-----------------------------------------------------------------------------------------------
	
	if ( arguments.callee._singletonInstance )
		return arguments.callee._singletonInstance;
	arguments.callee._singletonInstance = this;
	
	//-----------------------------------------------------------------------------------------------
	// private model properties
	//-----------------------------------------------------------------------------------------------
	
	this.model;
	
	//-----------------------------------------------------------------------------------------------
	// private view properties
	//-----------------------------------------------------------------------------------------------
	
	this.categoriesList;
	
	//-----------------------------------------------------------------------------------------------
	// initialize
	//-----------------------------------------------------------------------------------------------
	
	this.init();
	
	//-----------------------------------------------------------------------------------------------
	// superclass constructor
	//-----------------------------------------------------------------------------------------------
	
	BrowseScreen.superclass.constructor.call(this, this.getConfigObj());
	
}

//-----------------------------------------------------------------------------------------------
// extend superclass
//-----------------------------------------------------------------------------------------------

var overrideObj = {
	
	//-----------------------------------------------------------------------------------------------
	// event handlers
	//-----------------------------------------------------------------------------------------------
	
	onCategoryTapHandler: function(subList, subIdx, el, e, detailCard) {
		
		var ds = subList.getStore();
		var r = ds.getAt(subIdx);
		
		this.model.setCategory(r.get('text'));
		this.model.setPath(r.get('path'));
		
		this.fireEvent('onCategoryTap');
		
	},
	
	//-----------------------------------------------------------------------------------------------
	// private methods
	//-----------------------------------------------------------------------------------------------
	
	init: function() {
		
		this.model = new CraigslistModel();
		
		this.arrange();
		
	},
	
	arrange: function() {
		
		this.categoriesList = new Ext.NestedList({
			fullscreen: true,
			flex: 1,
			title: 'Category',
			displayField: 'text',
			store: this.model.getCategoriesStore()
		});
		
		this.categoriesList.on('leafitemtap', this.onCategoryTapHandler, this);
		
	},
	
	getConfigObj: function() {
		
		var configObj = {
			title: 'Browse',
			iconCls: 'bookmarks',
			fullscreen: true,
			layout: 'vbox',
			items: [
				this.categoriesList
			]
		};
		
		return configObj;
		
	}
	
};

Ext.extend(BrowseScreen, Ext.Panel, overrideObj);