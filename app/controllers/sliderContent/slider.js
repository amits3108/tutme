// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;

var utils = require("utils");
var map = require('Map');
var TiDrawerLayout = require('com.tripvi.drawerlayout');
var leftMenuView = Alloy.createController('sliderContent/leftMenuView').getView();
var centralView = Alloy.createController('sliderContent/centerWindowView').createCenterView();


Alloy.Globals.currentWindow = $.mainWindow;
Alloy.Globals.slider = TiDrawerLayout.createDrawer({
	leftView : leftMenuView,
	centerView : centralView,
	leftDrawerWidth : '240dp',
	width : Ti.UI.FILL,
});
$.mainWindow.add(Alloy.Globals.slider);
Alloy.Globals.slider.addEventListener('click', function(e) {
	Alloy.Globals.slider && Alloy.Globals.slider.toggleLeftWindow();
});
// add some listeners
Alloy.Globals.slider.addEventListener('draweropen', function(e) {
	// drawer is open
});

Alloy.Globals.slider.addEventListener('drawerclose', function(e) {
	// drawer is closed
});

Alloy.Globals.slider.addEventListener('drawerslide', function(e) {
	// drawer is sliding
	// slide offset: e.offset
});

Alloy.Globals.actionBar = $.mainWindow.activity.actionBar;
function onMainWinOpen(evt) {
	//var self = this;
	//this.removeEventListener('open', onNavDrawerWinOpen);
	var activity = this.getActivity();
	Alloy.Globals.activity = activity;
	Alloy.Globals.actionBar = activity.actionBar;
	if (activity) {
		//Everytime when launch the app.
		var actionBar = activity.getActionBar();
		Alloy.Globals.actionBar = actionBar;
		if (actionBar) {
			//var _title = Alloy.Globals.getData(_notify_keys.KEYS.LOGINSTATUS) ? moment().format("dddd, MMM DD, YYYY") : "";
			//actionBar.setTitle(_title);
			//When app is launch than its notifiaction home page will contain the date title
			//actionBar.icon = "/images/actionbarappicon.png";
			actionBar.setOnHomeIconItemSelected(function() {
				Alloy.Globals.slider && Alloy.Globals.slider.toggleLeftWindow();
				Ti.API.info("  defined in window open function ");
				//self.fireEvent('focus');
			});
		}
	}
	
	setTimeout(function(){
		args.closeLoginScreen && args.closeLoginScreen();
	},1500);
}

function doToggle(e) {
	map.showMap();
}

/*$.mainWindow.addEventListener('androidback', function() {
	Ti.API.info("back button has been pressed of slider window");
	var logoutDailog = Ti.UI.createAlertDialog ({
		cancel : 1,
		buttonNames : ['Yes', 'No'],
		message : 'Are you sure you want to Exit the app ?',
		title : 'Tutme'
	});
	logoutDailog.show ();
	logoutDailog.addEventListener ('click', function (e) {
		if (e.index === e.source.cancel) {
			Ti.API.info ('The cancel button was clicked');
		}
		else {
			$.mainWindow.close();
		}
	});
});*/