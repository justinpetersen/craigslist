function HomeScreen() {
	
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
	this.cityField;
	this.cityForm;
	this.homePanel;
	
	//-----------------------------------------------------------------------------------------------
	// initialize
	//-----------------------------------------------------------------------------------------------
	
	this.init();
	
	//-----------------------------------------------------------------------------------------------
	// superclass constructor
	//-----------------------------------------------------------------------------------------------
	
	HomeScreen.superclass.constructor.call(this, this.getConfigObj());
	
}

//-----------------------------------------------------------------------------------------------
// extend superclass
//-----------------------------------------------------------------------------------------------

var overrideObj = {
	
	//-----------------------------------------------------------------------------------------------
	// event handlers
	//-----------------------------------------------------------------------------------------------
	
	onSearchTapHandler: function() {
		
		this.fireEvent('onHomeSearch', this.searchField.getValue());
		
	},
	
	onChangeCityTapHandler: function() {
		
		this.fireEvent('onChangeCityTap');
		
	},
	
	onCityChangedHandler: function() {
		
		this.setCity(this.model.getCity());
		
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
		
		this.createTitle();
		this.createSearch();
		this.createCities();
		this.createPanels();
		
	},
	
	createTitle: function() {
		
		this.titleToolbar = new Ext.Toolbar({
			dock : 'top',
			ui: 'dark',
			title: 'craigslist'
		});
		
	},
	
	createSearch: function() {
		
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
		
	},
	
	createCities: function() {
		
		this.cityField = new Ext.form.Field({
			labelWidth: '20%',
			disabled: true,
			name: 'city',
			label: 'City',
			value: 'SF bay area'
		});
		
		this.cityForm = new Ext.form.FormPanel({
			layout: 'vbox',
			items: [
				{
					xtype: 'fieldset',
					title: 'Welcome to craigslist',
					cls: 'center-align',
					items: [
						this.cityField
					]
				},
				{
					xtype: 'button',
					ui: 'small',
					width: '80',
					text: 'Change',
					handler: this.onChangeCityTapHandler,
					scope: this
				}
			]
		});
		
	},
	
	createPanels: function() {
		
		this.homePanel = new Ext.Panel({
			items: [
				this.searchToolbar,
				this.cityForm
			]
		});
		
	},
	
	getConfigObj: function() {
		
		var configObj = {
			title: 'Home',
			iconCls: 'home',
			fullscreen: true,
			layout: 'card',
			dockedItems: [
				this.titleToolbar
			],
			items: [
				this.homePanel
			]
		};
		
		return configObj;
		
	},
	
	setCity: function( c ) {
		
		this.cityField.setValue(c);
		
	}
	
};

Ext.extend(HomeScreen, Ext.Panel, overrideObj);