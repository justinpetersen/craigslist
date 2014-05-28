function ItemDetailsPanel() {
	
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
	this.currentContentPanel = 0;
	this.record;
	
	//-----------------------------------------------------------------------------------------------
	// private view properties
	//-----------------------------------------------------------------------------------------------
	
	this.backButton;
	this.backBackButton;
	this.backToolbar;
	this.prevButton;
	this.favoriteButton;
	this.emailButton;
	this.mapButton;
	this.linkButton;
	this.nextButton;
	this.itemContextToolbar;
	this.contentPanel0;
	this.contentPanel1;
	this.contentPanelHolder;
	
	//-----------------------------------------------------------------------------------------------
	// initialize
	//-----------------------------------------------------------------------------------------------
	
	this.init();
	
	//-----------------------------------------------------------------------------------------------
	// superclass constructor
	//-----------------------------------------------------------------------------------------------
	
	ItemDetailsPanel.superclass.constructor.call(this, this.getConfigObj());
	
}

//-----------------------------------------------------------------------------------------------
// extend superclass
//-----------------------------------------------------------------------------------------------

var overrideObj = {
	
	//-----------------------------------------------------------------------------------------------
	// event handlers
	//-----------------------------------------------------------------------------------------------
	
	onBackTapHandler: function() {
		
		// if this is a search result item
		if (this.backBackButton.isVisible()) {
			
			// then go back to search results
			this.fireEvent('onBackTap');
			
		// if this is a favorite item
		} else {
			
			// then go back to favorites
			this.fireEvent('onBackBackTap');
		}
	},
	
	onBackBackTapHandler: function() {
		
		this.fireEvent('onBackBackTap');
		
	},
	
	onPrevTapHandler: function() {
		
		this.fireEvent('onPrevNextItemTap', -1);
		
	},
	
	onFavoriteTapHandler: function() {
		
		if (!this.model.isFavorite(this.record)) {
			this.model.addFavorite(this.record);
		} else {
			this.model.removeFavorite(this.record);
		}
		
		this.updateFavoriteButton();
		
	},
	
	onEmailTapHandler: function() {
		
		alert('email');
		
	},
	
	onMapTapHandler: function() {
		
		alert('map');
		
	},
	
	onLinkTapHandler: function() {
		
		window.location.href = this.link;
		
	},
	
	onNextTapHandler: function() {
		
		this.fireEvent('onPrevNextItemTap', 1);
		
	},
	
	//-----------------------------------------------------------------------------------------------
	// public methods
	//-----------------------------------------------------------------------------------------------
	
	setRecord: function( record, direction ) {
		
		this.record = record;
		
		var panel = this['contentPanel' + this.currentContentPanel];
		panel.update(this.record.get('description'));
		
		var cardSwitchAnimation = false;
		if (direction != undefined) {
			var cardDirection = (direction < 1 ? 'right' : 'left');
			cardSwitchAnimation= {
				type: 'slide',
				direction: cardDirection,
				cover: false
			};
		}
		
		this.contentPanelHolder.setActiveItem(
			this.currentContentPanel,
			cardSwitchAnimation
		);
		
		this.currentContentPanel = (this.currentContentPanel + 1) % 2;
		
		this.updateFavoriteButton();
		
	},
	
	setPrevNextEnabled: function( prev, next ) {
		
		this.prevButton.setDisabled(!prev);
		this.nextButton.setDisabled(!next);
		
	},
	
	setBackBackVisible: function( visible ) {
		
		this.backBackButton.setVisible(visible);
		
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
			ui: 'back',
			text: 'Back',
			handler: this.onBackTapHandler,
			scope: this
		});
		
		this.backBackButton = new Ext.Button({
			text: 'Change Category',
			handler: this.onBackBackTapHandler,
			scope: this
		});

		this.backToolbar = new Ext.Toolbar({
			dock: 'top',
			layout: 'hbox',
			ui: 'light',
			items: [
				this.backButton,
				this.backBackButton
			]
		});
		
		// context menu
		
		this.prevButton = new Ext.Button({
			iconCls: 'arrow_left',
			handler: this.onPrevTapHandler,
			scope: this
		});
		
		this.favoriteButton = new Ext.Button({
			iconCls: 'star',
			handler: this.onFavoriteTapHandler,
			scope: this
		});
		
		this.emailButton = new Ext.Button({
			iconCls: 'compose',
			handler: this.onEmailTapHandler,
			scope: this
		});
		
		this.mapButton = new Ext.Button({
			iconCls: 'locate',
			handler: this.onMapTapHandler,
			scope: this
		});
		
		this.linkButton = new Ext.Button({
			iconCls: 'action',
			handler: this.onLinkTapHandler,
			scope: this
		});
		
		this.nextButton = new Ext.Button({
			iconCls: 'arrow_right',
			handler: this.onNextTapHandler,
			scope: this
		});
		
		this.itemContextToolbar = new Ext.Toolbar({
			dock: 'bottom',
			layout: {
				pack: 'center'
			},
			ui: 'light',
			defaults: {
				iconMask: true,
				ui: 'plain'
			},
			items: [
				this.prevButton,
				new Ext.Spacer(),
				this.favoriteButton,
				new Ext.Spacer(),
				this.emailButton,
				new Ext.Spacer(),
				this.mapButton,
				new Ext.Spacer(),
				this.linkButton,
				new Ext.Spacer(),
				this.nextButton
			]
		});
		
		this.contentPanel0 = new Ext.Panel({
			fullscreen: true,
			flex: 1,
			padding: '0 10 0 10',
			scroll: 'vertical'
		});
		
		this.contentPanel1 = new Ext.Panel({
			fullscreen: true,
			flex: 1,
			padding: '0 10 0 10',
			scroll: 'vertical'
		});
		
		this.contentPanelHolder = new Ext.Panel({
			fullscreen: true,
			layout: 'card',
			flex: 1,
			items: [
				this.contentPanel0,
				this.contentPanel1
			]
		});
		
	},
	
	updateFavoriteButton: function() {
		
		var icon = 'star';
		if (this.model.isFavorite(this.record)) {
			icon = 'delete';
		}
		this.favoriteButton.setIconClass(icon);
		
	},
	
	getConfigObj: function() {
		
		var configObj = {
			fullscreen: true,
			layout: 'vbox',
			dockedItems: [
				this.backToolbar,
				this.itemContextToolbar
			],
			items: [
				this.contentPanelHolder
			]
		};
		
		return configObj;
		
	}
	
};

Ext.extend(ItemDetailsPanel, Ext.Panel, overrideObj);