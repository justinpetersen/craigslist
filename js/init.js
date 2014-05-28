Ext.setup({
    tabletStartupScreen: 'images/tablet_startup.png',
    phoneStartupScreen: 'images/phone_startup.png',
    icon: 'images/icon.png',
    glossOnIcon: false,
	useLoadMask: true,
    onReady : init
});

function init() {
	
	var app = new CraigslistApp();
	
}