function SearchResultsPanel() {
	
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
	
	this.backButton;
	this.backToolbar;
	this.searchField;
	this.searchButton;
	this.searchToolbar;
	this.searchResultsList;
	
	//-----------------------------------------------------------------------------------------------
	// initialize
	//-----------------------------------------------------------------------------------------------
	
	this.init();
	
	//-----------------------------------------------------------------------------------------------
	// superclass constructor
	//-----------------------------------------------------------------------------------------------
	
	SearchResultsPanel.superclass.constructor.call(this, this.getConfigObj());
	
}

//-----------------------------------------------------------------------------------------------
// extend superclass
//-----------------------------------------------------------------------------------------------

var overrideObj = {
	
	//-----------------------------------------------------------------------------------------------
	// event handlers
	//-----------------------------------------------------------------------------------------------
	
	onBackTapHandler: function() {
		
		this.fireEvent('onBackTap');
		
	},
	
	onSearchTapHandler: function() {
		
		this.doSearch(this.searchField.getValue());
		
	},
	
	onItemTapHandler: function( dataView, index, item, e ) {
		
		this.fireEvent('onShowItemDetails', index);
		
	},
	
	onSelectionChangeHandler: function( model, records ) {
		
		// unhighlight the selected item
		if (records.length > 0) {
			this.searchResultsList.deselect(this.searchResultsList.getSelectedRecords());
		}
		
	},
	
	//-----------------------------------------------------------------------------------------------
	// public methods
	//-----------------------------------------------------------------------------------------------
	
	doSearch: function( searchStr ) {
		
		this.searchField.setValue(searchStr);
		
		this.searchResultsList.scroller.scrollTo({
			x: 0,
			y: 0
		});
		this.searchResultsList.loadMask.enable();
		
		var store = this.model.getSearchStore(searchStr);
		this.searchResultsList.bindStore(store);
		
	},
	
	//-----------------------------------------------------------------------------------------------
	// private methods
	//-----------------------------------------------------------------------------------------------

	init: function() {
		
		this.model = new CraigslistModel();
		
		this.arrange();
		
	},
	
	arrange: function() {
		
		// back
		
		this.backButton = new Ext.Button({
			ui : 'back',
			text: 'Back',
			handler: this.onBackTapHandler,
			scope: this
		});

		this.backToolbar = new Ext.Toolbar({
			dock: 'top',
			layout: 'hbox',
			ui: 'light',
			items: [
				this.backButton
			]
		});
		
		// search
		
		this.searchField = new Ext.form.Search({
			placeHolder: 'Search',
			name: 'searchfield'
		});

		this.searchButton = new Ext.Button({
			ui: 'small',
			text: 'Go',
			handler: this.onSearchTapHandler,
			scope: this
		});
		
		this.searchToolbar = new Ext.Toolbar({
			dock: 'top',
			layout: 'hbox',
			ui: 'light',
			items: [
				this.searchField,
				this.searchButton
			]
		});
		
		// list
		
		this.searchResultsList = new Ext.List({
			fullscreen: true,
			flex: 1,
			itemTpl: CraigslistModel.ITEM_TEMPLATE,
			store: this.model.getEmptySearchStore(),
			
			plugins: [{
				ptype: 'listpaging',
				autoPaging: false
			}, {
				ptype: 'pullrefresh'
			}]
		});
		this.searchResultsList.addListener('itemtap', this.onItemTapHandler, this);
		this.searchResultsList.addListener('selectionchange', this.onSelectionChangeHandler, this);
		
	},
	
	getConfigObj: function() {
		
		var configObj = {
			fullscreen: true,
			layout: 'vbox',
			dockedItems: [
				this.backToolbar,
				this.searchToolbar
			],
			items: [
				this.searchResultsList
			]
		};
		
		return configObj;
		
	}
	
};

Ext.extend(SearchResultsPanel, Ext.Panel, overrideObj);