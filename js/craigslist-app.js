function CraigslistApp() {
	
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
	
	this.citiesPanel;
	this.searchResultsPanel;
	this.itemDetailsPanel;
	this.mainTabPanel;
	this.homeScreen;
	this.searchScreen;
	this.browseScreen;
	this.favoritesScreen;
	this.settingsScreen;
	
	//-----------------------------------------------------------------------------------------------
	// initialize
	//-----------------------------------------------------------------------------------------------
	
	this.init();
	
	//-----------------------------------------------------------------------------------------------
	// superclass constructor
	//-----------------------------------------------------------------------------------------------
	
	CraigslistApp.superclass.constructor.call(this, this.getConfigObj());
	
}

//-----------------------------------------------------------------------------------------------
// extend superclass
//-----------------------------------------------------------------------------------------------

var overrideObj = {
	
	//-----------------------------------------------------------------------------------------------
	// event handlers
	//-----------------------------------------------------------------------------------------------
	
	onHomeSearchHandler: function(searchStr) {
		
		this.model.setPath(CraigslistModel.DEFAULT_SEARCH_PATH);
		this.searchResultsPanel.doSearch(searchStr);
		
		this.setActiveItem(
			2,
			{
				type: 'slide',
				direction: 'left',
				cover: true
			}
		);
		
	},
	
	onChangeCityTapHandler: function() {
		
		this.citiesPanel.reset();
		
		this.setActiveItem(
			1,
			{
				type: 'slide',
				direction: 'up',
				cover: true
			}
		);
		
	},
	
	onCityTapHandler: function() {
		
		this.setActiveItem(
			0,
			{
				type: 'slide',
				direction: 'down',
				reveal: true
			}
		);
		
	},
	
	onCancelChangeCityHandler: function() {
		
		this.setActiveItem(
			0,
			{
				type: 'slide',
				direction: 'down',
				reveal: true
			}
		);
		
	},
	
	onSearchHandler: function(searchStr, pathStr) {
		
		this.model.setPath(pathStr);
		
		this.searchResultsPanel.doSearch(searchStr);
		
		this.model.addRecentSearch(searchStr, pathStr);
		
		this.setActiveItem(
			2,
			{
				type: 'slide',
				direction: 'left',
				cover: true
			}
		);
		
	},
	
	onCategoryTapHandler: function() {
		
		this.searchResultsPanel.doSearch();
		
		this.setActiveItem(
			2,
			{
				type: 'slide',
				direction: 'left',
				cover: true
			}
		);
		
	},
	
	onSearchBackHandler: function() {
		
		this.setActiveItem(
			0,
			{
				type: 'slide',
				direction: 'right',
				cover: false
			}
		);
		
	},
	
	onShowItemDetailsHandler: function( index ) {
		
		this.model.setItemIndex(index);
		var record = this.model.getSearchResultRecordAt(index);
		this.itemDetailsPanel.setRecord( record );
		
		var prev = this.model.getSearchResultRecordAt(index - 1) != false;
		var next = this.model.getSearchResultRecordAt(index + 1) != false;
		this.itemDetailsPanel.setPrevNextEnabled( prev, next );
		this.itemDetailsPanel.setBackBackVisible(true);
		
		this.setActiveItem(
			3,
			{
				type: 'slide',
				direction: 'left',
				cover: true
			}
		);
		
	},
	
	onPrevNextItemTapHandler: function( direction ) {
		
		var record;
		var prev;
		var next;
		if (this.mainTabPanel.getActiveItem() == this.favoritesScreen) {
			this.model.setFavoritesIndex(this.model.getFavoritesIndex() + direction);
			record = this.model.getFavoritesRecordAt(this.model.getFavoritesIndex());
			prev = this.model.getFavoritesRecordAt(this.model.getFavoritesIndex() - 1) != false;
			next = this.model.getFavoritesRecordAt(this.model.getFavoritesIndex() + 1) != false;
		} else {
			this.model.setItemIndex(this.model.getItemIndex() + direction);
			record = this.model.getSearchResultRecordAt(this.model.getItemIndex());
			prev = this.model.getSearchResultRecordAt(this.model.getItemIndex() - 1) != false;
			next = this.model.getSearchResultRecordAt(this.model.getItemIndex() + 1) != false;
		}
		
		this.itemDetailsPanel.setRecord( record, direction );
		this.itemDetailsPanel.setPrevNextEnabled( prev, next );
		
	},
	
	onFavoriteTapHandler: function( index ) {
		
		this.model.setFavoritesIndex(index);
		var record = this.model.getFavoritesRecordAt(index);
		this.itemDetailsPanel.setRecord( record );
		
		var prev = this.model.getFavoritesRecordAt(this.model.getFavoritesIndex() - 1) != false;
		var next = this.model.getFavoritesRecordAt(this.model.getFavoritesIndex() + 1) != false;
		this.itemDetailsPanel.setPrevNextEnabled( prev, next );
		this.itemDetailsPanel.setBackBackVisible(false);
		
		this.setActiveItem(
			3,
			{
				type: 'slide',
				direction: 'left',
				cover: true
			}
		);
		
	},
	
	onItemDetailsBackHandler: function() {
		
		this.setActiveItem(
			2,
			{
				type: 'slide',
				direction: 'right',
				cover: false
			}
		);
		
	},
	
	onItemDetailsBackBackHandler: function() {
		
		this.setActiveItem(
			0,
			{
				type: 'slide',
				direction: 'right',
				cover: false
			}
		);
		
	},
	
	//-----------------------------------------------------------------------------------------------
	// private methods
	//-----------------------------------------------------------------------------------------------
	
	init: function() {
		
		this.model = new CraigslistModel();
		
		this.arrange();
		
	},
	
	arrange: function() {
		
		this.homeScreen = new HomeScreen();
		this.homeScreen.addListener('onHomeSearch', this.onHomeSearchHandler, this);
		this.homeScreen.addListener('onChangeCityTap', this.onChangeCityTapHandler, this);
		
		this.searchScreen = new SearchScreen();
		this.searchScreen.addListener('onSearch', this.onSearchHandler, this);
		
		this.browseScreen = new BrowseScreen();
		this.browseScreen.addListener('onCategoryTap', this.onCategoryTapHandler, this);
		
		this.favoritesScreen = new FavoritesScreen();
		this.favoritesScreen.addListener('onFavoriteTap', this.onFavoriteTapHandler, this);
		
		this.settingsScreen = new SettingsScreen();
		this.settingsScreen.addListener('onChangeCityTap', this.onChangeCityTapHandler, this);
		
		this.mainTabPanel = new Ext.TabPanel({
			tabBar: {
				dock: 'bottom',
				layout: {
					pack: 'center'
				},
				ui: 'light'
			},
			fullscreen: true,
			cardSwitchAnimation: {
				type: 'slide',
				cover: false
			},
			items: [
				this.homeScreen,
				this.searchScreen,
				this.browseScreen,
				this.favoritesScreen,
				this.settingsScreen
			]
		});
		
		this.citiesPanel = new CitiesPanel();
		this.citiesPanel.addListener('onCityTap', this.onCityTapHandler, this);
		this.citiesPanel.addListener('onCancelTap', this.onCancelChangeCityHandler, this);
		
		this.searchResultsPanel = new SearchResultsPanel();
		this.searchResultsPanel.addListener('onBackTap', this.onSearchBackHandler, this);
		this.searchResultsPanel.addListener('onShowItemDetails', this.onShowItemDetailsHandler, this);
		
		this.itemDetailsPanel = new ItemDetailsPanel();
		this.itemDetailsPanel.addListener('onBackTap', this.onItemDetailsBackHandler, this);
		this.itemDetailsPanel.addListener('onBackBackTap', this.onItemDetailsBackBackHandler, this);
		this.itemDetailsPanel.addListener('onPrevNextItemTap', this.onPrevNextItemTapHandler, this);
		
	},
	
	getConfigObj: function() {
		
		var configObj = {
			fullscreen: true,
			layout: 'card',
			items: [
				this.mainTabPanel,
				this.citiesPanel,
				this.searchResultsPanel,
				this.itemDetailsPanel
			]
		}
		
		return configObj;
		
	}
	
};

Ext.extend(CraigslistApp, Ext.Panel, overrideObj);