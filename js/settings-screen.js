function SettingsScreen() {
	
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
	this.cityField;
	this.clearRecentSearchesButton;
	this.clearFavoritesButton;
	this.settingsForm;
	this.searchTitlesRadio;
	this.searchEntirePostRadio;
	this.hasImagesToggle;
	
	//-----------------------------------------------------------------------------------------------
	// initialize
	//-----------------------------------------------------------------------------------------------
	
	this.init();
	
	//-----------------------------------------------------------------------------------------------
	// superclass constructor
	//-----------------------------------------------------------------------------------------------
	
	SettingsScreen.superclass.constructor.call(this, this.getConfigObj());
	
}

//-----------------------------------------------------------------------------------------------
// extend superclass
//-----------------------------------------------------------------------------------------------

var overrideObj = {
	
	//-----------------------------------------------------------------------------------------------
	// event handlers
	//-----------------------------------------------------------------------------------------------
	
	onChangeCityTapHandler: function() {
		
		this.fireEvent('onChangeCityTap');
		
	},
	
	onCityChangedHandler: function() {
		
		this.setCity(this.model.getCity());
		
	},
	
	onSearchTitlesChanged: function( target ) {
		
		var titleOnly = (target.getValue() == 'titles');
		this.model.setSearchTitleOnly(titleOnly);
		
	},
	
	onImageOnlyChanged: function() {
		
		this.model.setHasImage(this.hasImagesToggle.getValue());
		
	},
	
	onClearRecentSearches: function() {
		
		this.model.clearRecentSearches();
		
	},
	
	onClearFavorites: function() {
		
		this.model.clearFavorites();
		
	},
	
	//-----------------------------------------------------------------------------------------------
	// private methods
	//-----------------------------------------------------------------------------------------------
	
	init: function() {
		
		this.model = new CraigslistModel();
		this.model.addListener('onCityChanged', this.onCityChangedHandler, this);
		
		this.arrange();
		
	},
	
	arrange: function() {
		
		this.titleToolbar = new Ext.Toolbar({
			dock : 'top',
			ui: 'light',
			title: 'Settings'
		});
		
		this.cityField = new Ext.form.Field({
			labelWidth: '20%',
			disabled: true,
			name: 'city',
			label: 'City',
			value: 'SF bay area'
		});
		
		this.clearRecentSearchesButton = new Ext.Button({
			ui: 'small',
			name: 'clearRecentSearches',
			text: 'Clear Recent Searches'
		});
		this.clearRecentSearchesButton.addListener('tap', this.onClearRecentSearches, this);
		
		this.clearFavoritesButton = new Ext.Button({
			ui: 'small',
			name: 'clearFavorites',
			text: 'Clear Favorites'
		});
		this.clearFavoritesButton.addListener('tap', this.onClearFavorites, this);
		
		this.searchTitlesRadio = new Ext.form.Radio({
			name: 'searchTitles',
			value: 'titles',
			label: 'Search titles only'
		});
		this.searchTitlesRadio.addListener('check', this.onSearchTitlesChanged, this);
		
		this.searchEntirePostRadio = new Ext.form.Radio({
			name: 'searchTitles',
			value: 'post',
			label: 'Entire post',
			checked: true
		});
		this.searchEntirePostRadio.addListener('check', this.onSearchTitlesChanged, this);
		
		this.hasImagesToggle = new Ext.form.Toggle({
			label: 'Has images',
			value: true
		});
		this.hasImagesToggle.addListener('change', this.onImageOnlyChanged, this);
		
		this.settingsForm = new Ext.form.FormPanel({
			fullscreen: true,
			flex: 1,
			items: [
				{
					xtype: 'fieldset',
					title: 'Account Settings',
					items: [
						this.cityField
					]
				},
				{
					layout: 'vbox',
					items: [{
						xtype: 'button',
						ui: 'small',
						width: '80',
						text: 'Change',
						handler: this.onChangeCityTapHandler,
						scope: this
					}]
				},
				{
					xtype: 'fieldset',
					title: 'Search Settings',
					defaults: {
						labelWidth: '65%'
					},
					items: [
						this.searchTitlesRadio,
						this.searchEntirePostRadio,
						this.hasImagesToggle
					]
				},
				{
					layout: 'vbox',
					items: [
						this.clearRecentSearchesButton
					]
				},
				{
					layout: 'vbox',
					items: [
						this.clearFavoritesButton
					]
				}
			]
		});
		
	},
	
	setCity: function( c ) {
		
		this.cityField.setValue(c);
		
	},
	
	getConfigObj: function() {
		
		var configObj = {
			title: 'Settings',
			iconCls: 'settings',
			fullscreen: true,
			layout: 'vbox',
			scroll: 'vertical',
			dockedItems: [
				this.titleToolbar
			],
			items: [
				this.settingsForm
			]
		};
		
		return configObj;
		
	}
	
};

Ext.extend(SettingsScreen, Ext.Panel, overrideObj);