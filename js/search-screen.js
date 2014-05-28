function SearchScreen() {
	
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
	this.searchField;
	this.searchButton;
	this.searchToolbar;
	this.categorySelectField;
	this.categoryToolbar;
	this.recentSearchesList;
	
	//-----------------------------------------------------------------------------------------------
	// initialize
	//-----------------------------------------------------------------------------------------------
	
	this.init();
	
	//-----------------------------------------------------------------------------------------------
	// superclass constructor
	//-----------------------------------------------------------------------------------------------
	
	SearchScreen.superclass.constructor.call(this, this.getConfigObj());
	
}

//-----------------------------------------------------------------------------------------------
// extend superclass
//-----------------------------------------------------------------------------------------------

var overrideObj = {
	
	//-----------------------------------------------------------------------------------------------
	// event handlers
	//-----------------------------------------------------------------------------------------------
	
	onSearchTapHandler: function() {
		
		this.fireEvent('onSearch', this.searchField.getValue(), this.categorySelectField.getValue());
		
	},
	
	onRecentSearchTapHandler: function(model, records) {
		
		// unhighlight the selected item
		this.recentSearchesList.deselect(this.recentSearchesList.getSelectedRecords());
		
		// if this is not a click on 'No recent searches'
		if (records.length > 0 && records[0].get('path') != '') {
			this.fireEvent('onSearch', records[0].get('value'), records[0].get('path'));
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
			title: 'Search'
		});
		
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
			dock : 'top',
			layout: 'hbox',
			ui: 'light',
			items: [
				this.searchField,
				this.searchButton
			]
		});
		
		this.categorySelectField = new Ext.form.Select({
			name: 'category',
			options: this.model.getSearchCategoryOptions(),
			value: CraigslistModel.DEFAULT_SEARCH_PATH
		});
		
		this.categoryToolbar = new Ext.Toolbar({
			dock: 'top',
			items: [
				this.categorySelectField
			]
		});
		
		this.recentSearchesList = new Ext.List({
			fullscreen: true,
			flex: 1,
			itemTpl : '{value}',
			grouped : true,
			store: this.model.getRecentSearchesStore()
		});
		this.recentSearchesList.addListener('selectionchange', this.onRecentSearchTapHandler, this);
		
	},
	
	getConfigObj: function() {
		
		var configObj = {
			title: 'Search',
			iconCls: 'search',
			fullscreen: true,
			layout: 'vbox',
			dockedItems: [
				this.titleToolbar,
				this.searchToolbar,
				this.categoryToolbar
			],
			items: [
				this.recentSearchesList
			]
		};
		
		return configObj;
		
	}
	
};

Ext.extend(SearchScreen, Ext.Panel, overrideObj);