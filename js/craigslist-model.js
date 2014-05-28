function CraigslistModel() {
	
	//-----------------------------------------------------------------------------------------------
	// Singleton
	//-----------------------------------------------------------------------------------------------
	
	if ( arguments.callee._singletonInstance )
		return arguments.callee._singletonInstance;
	arguments.callee._singletonInstance = this;
	
	//-----------------------------------------------------------------------------------------------
	// public static properties
	//-----------------------------------------------------------------------------------------------
	
	CraigslistModel.CLEAR_LOCAL_STORAGE = false;
	CraigslistModel.CITIES_FEED_URL = 'graph/craigslist-cities.json';
	CraigslistModel.CATEGORIES_FEED_URL = 'graph/craigslist-categories.json';
	CraigslistModel.CRAIGSLIST_SEARCH_URL = 'graph/craigslist-search.php';
	CraigslistModel.DEFAULT_SEARCH_PATH = 'sss';
	//CraigslistModel.ITEM_TEMPLATE = '<img src="{imageSource}" width="70" height="70" align="left" class="polaroid" /><span id="item-title">{title}</span>';
	CraigslistModel.ITEM_TEMPLATE = '<div id="scale-down" style="width: 70px"><img src="{imageSource}" class="polaroid" align="left" /></div><span id="item-title">{title}</span>';
	CraigslistModel.SEARCH_CATEGORY_OPTIONS = [
		{text: 'community',  value: 'ccc'},
		{text: 'events', value: 'cal'},
		{text: 'housing',  value: 'hhh'},
		{text: 'jobs',  value: 'jjj'},
		{text: 'personals',  value: 'ppp'},
		{text: 'resumes',  value: 'res'},
		{text: 'for sale',  value: 'sss'},
		{text: 'services',  value: 'bbb'}
	];
	CraigslistModel.NO_RECENT_SEARCHES_RECORD = {
		value: 'No recent searches',
		path: ''
	};
	CraigslistModel.NO_FAVORITES_RECORD = {
		id: '',
		title: 'No favorites',
		link: '',
		description: '',
		imageSource: '',
		category: 'Favorites',
		path: ''
	};
	
	//-----------------------------------------------------------------------------------------------
	// private model properties
	//-----------------------------------------------------------------------------------------------
	
	this.recentSearchesStore;
	this.favoritesStore;
	this.searchStore;
	
	// local members of public getter/setter methods
	var citiesStore;
	var categoriesStore;
	var city = 'SF bay area';
	var category = 'for sale';
	var subdomain = 'sfbay';
	var path = CraigslistModel.DEFAULT_SEARCH_PATH;
	var searchTitleOnly = false;
	var hasImage = true;
	var itemIndex = -1;
	var favoritesIndex = -1;
	
	//-----------------------------------------------------------------------------------------------
	// public getter/setter methods
	//-----------------------------------------------------------------------------------------------

	this.getCitiesStore = function() {
		
		return citiesStore;
		
	}

	this.setCitiesStore = function( s ) {
		
		citiesStore = s;
		
	}

	this.getCategoriesStore = function() {
		
		return categoriesStore;
		
	}

	this.setCategoriesStore = function( s ) {
		
		categoriesStore = s;
		
	}

	this.getCity = function() {
		
		return city;
		
	}

	this.setCity = function( c ) {
		
		city = c;
		
		this.fireEvent('onCityChanged');
		
	}

	this.getCategory = function() {
		
		return category;
		
	}

	this.setCategory = function( c ) {
		
		category = c;
		
		this.fireEvent('onCategoryChanged');
		
	}

	this.getSubdomain = function() {
		
		return subdomain;
		
	}

	this.setSubdomain = function( s ) {
		
		subdomain = s;
		
		this.fireEvent('onSubdomainChanged');
		
	}

	this.getPath = function() {
		
		return path;
		
	}

	this.setPath = function( p ) {
		
		path = p;
		
		this.fireEvent('onPathChanged');
		
	}

	this.getSearchTitleOnly = function() {
		
		return searchTitleOnly;
		
	}

	this.setSearchTitleOnly = function( t ) {
		
		searchTitleOnly = t;
		
	}

	this.getHasImage = function() {
		
		return hasImage;
		
	}

	this.setHasImage = function( i ) {
		
		hasImage = i;
		
	}

	this.getItemIndex = function() {
		
		return itemIndex;
		
	}

	this.setItemIndex = function( i ) {
		
		itemIndex = i;
		
		this.fireEvent('onItemIndexChanged');
		
	}

	this.getFavoritesIndex = function() {
		
		return favoritesIndex;
		
	}

	this.setFavoritesIndex = function( i ) {
		
		favoritesIndex = i;
		
		this.fireEvent('onFavoritesIndexChanged');
		
	}
	
	//-----------------------------------------------------------------------------------------------
	// initialize
	//-----------------------------------------------------------------------------------------------
	
	this.init();
	
	//-----------------------------------------------------------------------------------------------
	// superclass constructor
	//-----------------------------------------------------------------------------------------------
	
	CraigslistModel.superclass.constructor.call(this);
	
}

var overrideObj = {
	
	//-----------------------------------------------------------------------------------------------
	// public methods
	//-----------------------------------------------------------------------------------------------
	
	getSearchStore: function( searchStr ) {
		
		this.searchStore = new Ext.data.Store({
			autoLoad: true,
			model: 'CraigslistItem',
			emptyText: 'No results',
			deferEmptyText: false,
			pageSize: 10,
			clearOnPageLoad: false,
			
			getGroupString : function(record) {
				return record.get('title')[0];
			},
			
			proxy: {
				type: 'ajax',
				url: this.getSearchRssUrl(searchStr),
				reader: {
					type: 'json',
					root: 'items'
				}
			}
		});
		
		return this.searchStore;
		
	},
	
	getSearchResultRecordAt: function( index ) {
		
		if ((index < 0) || (index > this.searchStore.getCount() - 1)) {
			return false;
		}
		
		return this.searchStore.getAt(index);
		
	},
	
	getEmptySearchStore: function() {
		
		var store = new Ext.data.Store({
			model: 'CraigslistItem',
			data: []
		});
		
		return store;
		
	},
	
	getSearchCategoryOptions: function() {
		
		return CraigslistModel.SEARCH_CATEGORY_OPTIONS;
		
	},

	getRecentSearchesStore: function() {
		
		return this.recentSearchesStore;
		
	},

	getFavoritesStore: function() {
		
		return this.favoritesStore;
		
	},
	
	getFavoritesRecordAt: function( index ) {
		
		if ((index < 0) || (index > this.favoritesStore.getCount() - 1)) {
			return false;
		}
		
		return this.favoritesStore.getAt(index);
		
	},
	
	addRecentSearch: function( searchStr, pathStr ) {
		
		if (this.recentSearchesStore.getCount() > 0) {
			// if this is the first search
			if (this.recentSearchesStore.getAt(0).get('path') == '') {
				
				// then remove 'No recent searches' message
				this.recentSearchesStore.removeAt(0);
				
			}
		}
		
		// if this search is not already logged
		if (this.recentSearchesStore.findExact('value', searchStr) == -1) {
			
			// then add this search query to the store
			this.recentSearchesStore.add({
				value: searchStr,
				path: pathStr
			});
			
		}
		
		this.recentSearchesStore.sync();
		
	},
	
	addFavorite: function( record ) {
		
		if (this.favoritesStore.getCount() > 0) {
			// if this is the first favorite
			if (this.favoritesStore.getAt(0).get('path') == '') {
				
				// then remove 'No favorites' message
				this.favoritesStore.removeAt(0);
				
			}
		}
		
		// if this item is not already logged
		if (this.favoritesStore.findExact('link', record.get('link')) == -1) {
			
			// then add this item to the store
			record.set('category', this.getCategory());
			record.set('path', this.getPath());
			// each record stored in local storage needs an ID to sync properly
			record.set('id', record.get('link'));
			this.favoritesStore.add(record);
			
		}
		
		this.favoritesStore.sync();
		
	},
	
	removeFavorite: function( record ) {
		
		this.favoritesStore.remove(record);
		if (this.favoritesStore.getCount() == 0) {
			this.favoritesStore.add(CraigslistModel.NO_FAVORITES_RECORD);
		}
		
		this.favoritesStore.sync();
		
	},
	
	isFavorite: function( record ) {
		
		var match = (this.favoritesStore.findExact('link', record.get('link')) != -1);
		return match;
		
	},
	
	clearRecentSearches: function() {
		
		this.recentSearchesStore.proxy.clear();
		this.initRecentSearchesStore();
		
	},
	
	clearFavorites: function() {
		
		this.favoritesStore.proxy.clear();
		this.initFavoritesStore();
	},
	
	//-----------------------------------------------------------------------------------------------
	// private methods
	//-----------------------------------------------------------------------------------------------
	
	init: function() {
		
		this.registerModels();
		this.createCitiesStore();
		this.createCategoriesStore();
		this.createRecentSearchesStore();
		this.createFavoritesStore();
		this.initStoresFromLocalStorage();
		
	},
	
	initStoresFromLocalStorage: function() {
		
		if (CraigslistModel.CLEAR_LOCAL_STORAGE) {
			this.clearLocalStorage();
		}
		
		this.initRecentSearchesStore();
		this.initFavoritesStore();
		
	},
	
	initRecentSearchesStore: function() {
		
		this.recentSearchesStore.load();
		
		if (this.recentSearchesStore.getCount() == 0) {
			this.recentSearchesStore.add(CraigslistModel.NO_RECENT_SEARCHES_RECORD);
		}
		
	},
	
	initFavoritesStore: function() {
		
		this.favoritesStore.load();
		
		if (this.favoritesStore.getCount() == 0) {
			this.favoritesStore.add(CraigslistModel.NO_FAVORITES_RECORD);
		}
		
	},
	
	clearLocalStorage: function() {
		
		this.clearRecentSearches();
		this.clearFavorites();
		
	},
	
	registerModels: function() {
		
		Ext.regModel('CityItem', {
			fields: ['text', 'subdomain']
		});
		
		Ext.regModel('CategoryItem', {
			fields: ['text', 'path']
		});
		
		Ext.regModel('CraigslistItem', {
			fields: ['title', 'link', 'description', 'imageSource']
		});
		
		Ext.regModel('RecentSearchesItem', {
			fields: ['value', 'path']
		});
		
		Ext.regModel('FavoritesItem', {
			fields: ['id', 'title', 'link', 'description', 'imageSource', 'category', 'path']
		});
		
	},

	createCitiesStore: function() {
		
		var citiesStore = new Ext.data.TreeStore({
			model: 'CityItem',
			proxy: {
				type: 'ajax',
				url: CraigslistModel.CITIES_FEED_URL,
				reader: {
					type: 'tree',
					root: 'items'
				}
			}
		});
		
		this.setCitiesStore(citiesStore);
		
	},
	
	createCategoriesStore: function() {
		
		var categoriesStore = new Ext.data.TreeStore({
			model: 'CategoryItem',
			proxy: {
				type: 'ajax',
				url: CraigslistModel.CATEGORIES_FEED_URL,
				reader: {
					type: 'tree',
					root: 'items'
				}
			}
		});
		
		this.setCategoriesStore(categoriesStore);
		
	},
	
	createRecentSearchesStore: function() {
		
		this.recentSearchesStore = new Ext.data.Store({
			model  : 'RecentSearchesItem',
			
			getGroupString : function(record) {
				return 'Recent Searches';
			},
			
			proxy: {
				type: 'localstorage',
				id: 'recent-searches'
			}
		});
		
	},
	
	createFavoritesStore: function() {
		
		this.favoritesStore = new Ext.data.Store({
			model  : 'FavoritesItem',
			
			getGroupString : function(record) {
				return record.get('category');
			},
			
			proxy: {
				type: 'localstorage',
				id: 'favorites'
			}
		});
		
	},
	
	getSearchRssUrl: function( searchStr ) {
		
		if (!searchStr) {
			searchStr = '';
		}
		
		var rssUrl = 'http://' + this.getSubdomain() + '.craigslist.org/' + this.getPath() + '/index.rss';
		
		if (searchStr.length > 0) {
			rssUrl = 'http://' + this.getSubdomain() + '.craigslist.org/search/' + this.getPath();
			
			rssUrl = rssUrl + '?format=rss&query=' + searchStr;
			if (this.getSearchTitleOnly()) {
				rssUrl = rssUrl + '&srchType=T';
			} else {
				rssUrl = rssUrl + '&srchType=A';
			}
			if (this.getHasImage()) {
				rssUrl = rssUrl + '&hasPic=1';
			} else {
				rssUrl = rssUrl + '&hasPic=0';
			}
		}
		
		// default to all results under the selected city + category
		/*var url = CraigslistModel.CRAIGSLIST_SEARCH_URL + '?rss=http%3A%2F%2F' + this.getSubdomain() + '.craigslist.org%2F' + this.getPath() + '%2Findex.rss';
		
		// if there is a search string, then search for the specific item
		if (searchStr) {
			url = CraigslistModel.CRAIGSLIST_SEARCH_URL + '?rss=http%3A%2F%2F' + this.getSubdomain() + '.craigslist.org%2Fsearch%2F' + this.getPath()+ '%3Fquery%3D' + searchStr + '%26format%3Drss';
		}*/
		var url = CraigslistModel.CRAIGSLIST_SEARCH_URL + '?rss=' + encodeURIComponent(rssUrl);
		
		return url;
		
	}
	
};

Ext.extend(CraigslistModel, Ext.util.Observable, overrideObj);