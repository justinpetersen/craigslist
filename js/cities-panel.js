function CitiesPanel() {
	
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
	
	this.citiesList;
	this.cancelButton;
	this.cancelToolbar;
	
	//-----------------------------------------------------------------------------------------------
	// initialize
	//-----------------------------------------------------------------------------------------------
	
	this.init();
	
	//-----------------------------------------------------------------------------------------------
	// superclass constructor
	//-----------------------------------------------------------------------------------------------
	
	CitiesPanel.superclass.constructor.call(this, this.getConfigObj());
	
}

//-----------------------------------------------------------------------------------------------
// extend superclass
//-----------------------------------------------------------------------------------------------

var overrideObj = {
	
	//-----------------------------------------------------------------------------------------------
	// event handlers
	//-----------------------------------------------------------------------------------------------
	
	onCityTapHandler: function(subList, subIdx, el, e, detailCard) {
		
		var ds = subList.getStore();
		var r = ds.getAt(subIdx);
		
		this.model.setCity(r.get('text'));
		this.model.setSubdomain(r.get('subdomain'));
		
		this.fireEvent('onCityTap');
		
	},
	
	onCancelTapHandler: function() {
		
		this.fireEvent('onCancelTap');
		
	},
	
	//-----------------------------------------------------------------------------------------------
	// public methods
	//-----------------------------------------------------------------------------------------------
	
	reset: function() {
		
		// TODO: Reset cities list. This is causing the back button to get mixed up.
		//this.citiesList.setActiveItem(0, false);
		
	},
	
	//-----------------------------------------------------------------------------------------------
	// private methods
	//-----------------------------------------------------------------------------------------------

	init: function() {
		
		this.model = new CraigslistModel();
		
		this.arrange();
		
	},
	
	arrange: function() {
		
		this.citiesList = new Ext.NestedList({
			fullscreen: true,
			flex: 1,
			title: 'Cities',
			displayField: 'text',
			store: this.model.getCitiesStore()
		});
		
		this.citiesList.on('leafitemtap', this.onCityTapHandler, this);
		
		this.cancelButton = new Ext.Button({
			ui: 'small',
			text: 'Cancel',
			handler: this.onCancelTapHandler,
			scope: this
		});
		
		this.cancelToolbar = new Ext.Toolbar({
			dock : 'bottom',
			layout: 'hbox',
			ui: 'light',
			items: [
				this.cancelButton
			]
		});
		
	},
	
	getConfigObj: function() {
		
		var configObj = {
			fullscreen: true,
			layout: 'vbox',
			dockedItems: [
				this.cancelToolbar
			],
			items: [
				this.citiesList
			]
		};
		
		return configObj;
		
	}
	
};

Ext.extend(CitiesPanel, Ext.Panel, overrideObj);