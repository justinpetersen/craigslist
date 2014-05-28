function FavoritesScreen() {
	
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
	
	this.titleToolbar;
	this.favoritesList;
	
	//-----------------------------------------------------------------------------------------------
	// initialize
	//-----------------------------------------------------------------------------------------------
	
	this.init();
	
	//-----------------------------------------------------------------------------------------------
	// superclass constructor
	//-----------------------------------------------------------------------------------------------
	
	FavoritesScreen.superclass.constructor.call(this, this.getConfigObj());
	
}

//-----------------------------------------------------------------------------------------------
// extend superclass
//-----------------------------------------------------------------------------------------------

var overrideObj = {
	
	//-----------------------------------------------------------------------------------------------
	// event handlers
	//-----------------------------------------------------------------------------------------------
	
	onItemTapHandler: function( dataView, index, item, e ) {
		
		// TODO: move logic to detect no favorites to CraigslistModel class
		if (this.model.getFavoritesStore().getAt(0).get('link') != '') {
			this.fireEvent('onFavoriteTap', index);
		}
		
	},
	
	onSelectionChangeHandler: function( model, records ) {
		
		// unhighlight the selected item
		if (records.length > 0) {
			this.favoritesList.deselect(this.favoritesList.getSelectedRecords());
		}
		
	},
	
	onFavoritesDataChangedHandler: function( store ) {
		
		// TODO: move logic to detect no favorites to CraigslistModel class
		if (this.model.getFavoritesStore().getCount() > 0) {
			
			// if there are no favorites
			if (this.model.getFavoritesStore().getAt(0).get('path') == '') {
				
				// then just display 'No favorites'
				this.favoritesList.itemTpl = '{title}';
				
			} else {
				
				// otherwise display image thumbnail + title
				this.favoritesList.itemTpl = CraigslistModel.ITEM_TEMPLATE;
			}
			
			// 
			this.favoritesList.initComponent();
			this.favoritesList.refresh();
		}
		
	},
	
	//-----------------------------------------------------------------------------------------------
	// private methods
	//-----------------------------------------------------------------------------------------------
	
	init: function() {
		
		this.model = new CraigslistModel();
		
		this.arrange();
		
	},
	
	arrange: function() {
		
		this.titleToolbar = new Ext.Toolbar({
			dock : 'top',
			ui: 'light',
			title: 'Favorites'
		});
		
		var favoritesStore = this.model.getFavoritesStore();
		favoritesStore.addListener('datachanged', this.onFavoritesDataChangedHandler, this);
		
		this.favoritesList = new Ext.List({
			fullscreen: true,
			flex: 1,
			itemTpl: '{title}',
			grouped : true,
			store: favoritesStore
		});
		this.favoritesList.addListener('itemtap', this.onItemTapHandler, this);
		this.favoritesList.addListener('selectionchange', this.onSelectionChangeHandler, this);
		
		// KLUDGE: force the item template to update on first load
		this.onFavoritesDataChangedHandler();
		
	},
	
	getConfigObj: function() {
		
		var configObj = {
			title: 'Favorites',
			iconCls: 'favorites',
			fullscreen: true,
			layout: 'vbox',
			dockedItems: [
				this.titleToolbar
			],
			items: [
				this.favoritesList
			]
		};
		
		return configObj;
		
	}
	
};

Ext.extend(FavoritesScreen, Ext.Panel, overrideObj);