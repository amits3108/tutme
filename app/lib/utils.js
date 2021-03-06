var appKey = require("appKey");
var map = require('Map');
var social = require("social");
var network = require("network");

exports.replaceCentralView = function(params) {
	//var slider = Alloy.Globals.slider;
	var mainView = Alloy.Globals.centralView;
	var replacedView = params.view;

	if (mainView && mainView.windowView && mainView.children[0]) {
		mainView.remove(mainView.windowView);
		mainView.removeAllChildren();
		mainView.windowView = null;
	}
	if (Alloy.Globals.actionBar) {
		var _title = params.title || "";
		Alloy.Globals.actionBar.setTitle(_title);
	}
	mainView.height = Ti.UI.FILL;
	mainView.add(replacedView);
	mainView.windowView = replacedView;
	//slider.toggleLeftWindow();
	//slider = null;
	mainView = null;
	replacedView = null;
};

// function to accept option and return dialog

exports.createDailog = function(opts) {
	return Ti.UI.createOptionDialog(opts);
};

//   Floating Button

exports.addFloatingButton = function(params) {
	var parentView = params.view;
	var floatingView = Titanium.UI.createView({
		backgroundImage : '/images/gps.png',
		width : 50,
		height : 50,
		right : 50,
		bottom : 50,
		borderRadius : 35,
		viewShadowRadius : 4,
		viewShadowColor : 'gray',
		zIndex : '999'
	});
	parentView.add(floatingView);
	floatingView.addEventListener('click', function(e) {
		parentView.removeAllChildren();
		map.showMap();
	});
};

exports.setLoginStatus = function() {
	if (!Alloy.Globals.getData(appKey.KEYS.LOGINSTATUS)) {
		Alloy.Globals.setData(appKey.KEYS.LOGINSTATUS, true);
	}
};

exports.setRegistrationStatus = function() {
	if (!Alloy.Globals.getData(appKey.KEYS.REGISTRATIONCOMPLETE)) {
		Alloy.Globals.setData(appKey.KEYS.REGISTRATIONCOMPLETE, true);
	}
};
var setPropertiesNull = function() {
	var appKeys = require("appKey").KEYS;
	var keyArray = [appKeys.LOGINSTATUS, appKeys.TUTORPROFILEUPDATE, appKeys.USERTYPE, appKeys.REGISTRATIONCOMPLETE, appKeys.USER, appKeys.IMAGES_NATIVE_PATH_ARRAY];

	_.each(keyArray, function(key, index) {
		Ti.API.error(" index " + index + "   key  " + key);
		Alloy.Globals.setData(key, null);
	});

	//TODO: Convert these keys into the Alloy.Globals.setData keys
	/*Ti.App.Properties.setObject ('courseList', null);
	 Ti.App.Properties.setObject ('coursesList', null);
	 Ti.App.Properties.setObject ('subjectList', null);
	 Ti.App.Properties.setObject ('subjectsArrayList', null);
	 Ti.App.Properties.setObject ('timeSlots', null);
	 Ti.App.Properties.setObject ('classTime', null); */

};
exports.setPropertiesNull = setPropertiesNull;

exports.logout = function(e) {
	var logoutDailog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Logout', 'Cancel'],
		message : 'Are you sure you want to Logout ?',
		title : 'Tutme'
	});
	logoutDailog.show();
	logoutDailog.addEventListener('click', function(e) {
		if (e.index === e.source.cancel) {
			Ti.API.info('The cancel button was clicked');
		} else {
			var win = Alloy.createController("authentication/login").getView();
			win.open();
			Alloy.Globals.currentWindow.close();
			setPropertiesNull();
		}
	});
};

// Open Calender
exports.openCalender = function() {
	var dob;
	var picker = Ti.UI.createPicker({
	});
	picker.showDatePickerDialog({
		value : new Date(), // some date
		callback : function(e) {
			if (e.cancel) {
				Ti.API.info('user canceled dialog');
			} else {
				Ti.API.info('value is: ' + e.value);
				Ti.API.info('lets see what this object is' + JSON.stringify(e));
				selectedDate = e.value;
				dob = String.formatDate(selectedDate, 'medium');
				Ti.API.info(dob);
			}
		}
	});
	return dob;
};

exports.Loading = function() {
	this.Loading = Alloy.createController("Widgets/Loading");
};

// Linked In Profile URL
var linkedin = social.create({
	consumerSecret : "s7ZV7hViil2DaqPp",
	consumerKey : "75c5prnmkejwoe",
	site : 'linkedin'
});

var accessLinkedInProfileDailog = Ti.UI.createAlertDialog({
	cancel : 1,
	buttonNames : ['Confirm', 'Cancel'],
	message : 'Tutme would like access your LinkedIn profile.',
	title : 'Tutme'
});

exports.accessLinkedInProfile = function(e) {
	accessLinkedInProfileDailog.show();
	accessLinkedInProfileDailog.addEventListener('click', function(e) {
		if (e.index === e.source.cancel) {
			Ti.API.info('The cancel button was clicked');
			return false;
		} else {
			linkedin.getProfileLinkedin({
				message : "messageContent",
				success : function(e) {
					response = JSON.stringify(e);
					Ti.API.info(response.siteStandardProfileRequest + "****" + e.firstName + "response" + JSON.stringify(e));
				},
				error : function(e) {
					Ti.API.info("Error while posting" + JSON.stringify(e));
				}
			});
		}
	});
};

var activityIndicatorLoading = function() {
	var activityIndicator = null;
	var win = null;

	this.showLoading = function(params) {
		var params = params || {};
		win = Ti.UI.createWindow({
			backgroundColor : 'transparent'
		});
		activityIndicator = Ti.UI.createActivityIndicator({
			//color : 'green',
			font : {
				fontFamily : 'Helvetica Neue',
				fontSize : 26,
				fontWeight : 'bold'
			},
			message : 'Loading...',
			style : Ti.UI.ActivityIndicatorStyle.DARK,
			top : 10,
			left : 10,
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE
		});
		//params && params.win && params.win.add (activityIndicator);
		win.add(activityIndicator);
		win.open();
		activityIndicator && activityIndicator.show();
	};
	this.hideLoading = function(params) {
		activityIndicator && activityIndicator.hide();
		//params && params.win && params.win.close();
		win.close();
	};
};
exports.activityIndicatorLoading = activityIndicatorLoading;

var getCourses = function(params) {
	var params = params || {};

	if (Titanium.Network.online) {
		network.postRequest({
			type : "GET",
			url : Alloy.CFG.URL.getCourses,
			requestData : {},
			requestHeaders : {
				"public-key" : "c8a1ad1332716aa15752422360e739a5",
				"token" : "72dd0dbc65b5e19d4b086c6f89b16203_123",//"79c74e91e49b623f6ea02435e2725"
			},
			callBack : function(e) {
				var courses = [];
				//Ti.API.error(" ddd " + e + " getCourses " + JSON.stringify(e));
				var response = e;
				//Ti.API.error(response.data[0]+" ddd " + e + " getCourses ****");
				if (response && response.data) {
					for (var i = 0; i < response.data.length; i++) {
						if (response.data[i]) {
							Ti.API.error(response.data[i].title + " ddd " + e + " getCourses ****" + response.data[i].id);
							var res = {
								title : response.data[i].title,
								id : response.data[i].id
							};
							courses.push(res);
							res = {};
						}
					}
				}
				Ti.API.info("Courses are :" + JSON.stringify(courses));
				Ti.App.Properties.setObject('courseList', courses);
				var parsedArrayCourses = parseDictionary({
					dictionary : courses
				});
				Ti.App.Properties.setObject('coursesList', parsedArrayCourses);
			},//params.callBack,
		});

	} else {
		alert("Internet is not available");
	}
};
exports.getCourses = getCourses;

var getSubjects = function(params) {
	var params = params || {};
	if (Titanium.Network.online) {
		network.postRequest({
			type : "GET",
			url : Alloy.CFG.URL.getSubjects,
			requestData : {},
			requestHeaders : {
				"public-key" : "c8a1ad1332716aa15752422360e739a5",
				"token" : "72dd0dbc65b5e19d4b086c6f89b16203_123",//"79c74e91e49b623f6ea02435e2725"
			},
			callBack : function(e) {
				//Ti.API.error(" ddd " + e + " getSubjects " + JSON.stringify(e));
				var subjects = [];
				//Ti.API.error(" ddd " + e + " getCourses " + JSON.stringify(e));
				var response = e;
				//Ti.API.error(response.data[0]+" ddd " + e + " getCourses ****");
				if (response && response.data) {
					for (var i = 0; i < response.data.length; i++) {
						if (response.data[i]) {
							Ti.API.error(response.data[i].name + " ddd " + e + " getCourses ****" + response.data[i].id);
							var res = {
								title : response.data[i].name,
								id : response.data[i].id
							};
							subjects.push(res);
							res = {};
						}
					}
				}
				Ti.API.info("subjects are :" + JSON.stringify(subjects));
				Ti.App.Properties.setObject('subjectList', subjects);
				var parsedArraySubjects = parseDictionary({
					dictionary : subjects
				});
				Ti.App.Properties.setObject('subjectsArrayList', parsedArraySubjects);
				Ti.API.error(JSON.stringify(Ti.App.Properties.getObject('subjectsArrayList')));
			},//params.callBack,
		});

	} else {
		alert("Internet is not available");
	}
};
exports.getSubjects = getSubjects;

var getTimings = function(params) {
	var params = params || {};

	if (Titanium.Network.online) {
		network.postRequest({
			type : "GET",
			url : Alloy.CFG.URL.getTimings,
			requestData : {},
			requestHeaders : {
				"public-key" : "c8a1ad1332716aa15752422360e739a5",
				"token" : "72dd0dbc65b5e19d4b086c6f89b16203_123",//"79c74e91e49b623f6ea02435e2725"
			},
			callBack : function(e) {
				//Ti.API.error(" ddd " + e + " getSubjects " + JSON.stringify(e));
				var timeSlots = [];
				//Ti.API.error(" ddd " + e + " getCourses " + JSON.stringify(e));
				var response = e;
				//Ti.API.error(response.data[0]+" ddd " + e + " getCourses ****");
				if (response && response.data) {
					for (var i = 0; i < response.data.length; i++) {
						if (response.data[i]) {
							Ti.API.error(response.data[i].time_slot + " ddd " + e + " getCourses ****" + response.data[i].id);
							var res = {
								title : response.data[i].time_slot,
								id : response.data[i].id
							};
							timeSlots.push(res);
							res = {};
						}
					}
				}
				Ti.API.info("timeSlots are :" + JSON.stringify(timeSlots));
				Ti.App.Properties.setObject('timeSlots', timeSlots);
				var parsedArrayTime = parseDictionary({
					dictionary : timeSlots
				});
				Ti.App.Properties.setObject('classTime', parsedArrayTime);
			},//params.callBack,
		});

	} else {
		alert("Internet is not available");
	}
};
exports.getTimings = getTimings;

function parseDictionary(params) {
	var arrayParsed = [];
	var params = params || {};
	var dictionary = params.dictionary;
	Ti.API.info(JSON.stringify(dictionary.length));
	var len = dictionary.length;
	for (var i = 0; i < len; i++) {
		arrayParsed.push(dictionary[i].title);
	}
	Ti.API.info(arrayParsed + "arrayParsed");
	return arrayParsed;
}

function showLoading() {
	Alloy.Globals.loading.show('Loading...', false);
}

function hideLoading() {
	Alloy.Globals.loading.hide();
}

exports.showLoading = showLoading;
exports.hideLoading = hideLoading;

// Dailog to show the ratings

function showRatingDailog(params) {
	var params = params || {};
	var ratingValuetoReturn;
	var mainWindow = Titanium.UI.createWindow({
		modal : true,
		navBarHidden : true,
		backgroundColor : 'grey'
	});
	var alertView = Ti.UI.createView({
		width : 300,
		height : 200,
		borderColor : "grey",
		borderWidth : 1,
		backgroundColor : "white",
	});

	var buttonsWrapper = Ti.UI.createView({
		top : 440,
		height : 60,
		widht : Ti.UI.FILL,
		backgroundColor : "#848684"
	});

	alertView.add(buttonsWrapper);

	var submitBtn = Ti.UI.createButton({
		title : 'Submit',
		bottom : 5,
		width : 140,
		height : 50,
	});
	alertView.add(submitBtn);
	var ratingbar = require('titutorial.ratingbar');

	/*
	 * Dynamic rating bar
	 */
	var ratingBar1 = ratingbar.createRatingBar({
		//top : '30dp',
		//left : 15,
		rating : 0,
		stars : 5,
		stepSize : 1,
		isIndicator : false
	});
	alertView.add(ratingBar1);
	var ratingValue = Ti.UI.createLabel({
		text : 'Your Rating : ' + ratingBar1.getRating(),
		color : '#000',
		font : {
			fontSize : '20dp'
		},
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		top : '30dp',
		textAlign : 'center'
	});
	alertView.add(ratingValue);

	ratingBar1.addEventListener('change', function(e) {
		ratingValue.text = "Rating Value : " + e.rating.toString();
		ratingValuetoReturn = e.rating.toString();
	});
	submitBtn.addEventListener('click', function(e) {
		alert('Rating Submitted Successfully');
		params.callback && params.callback(ratingValuetoReturn);
		mainWindow.close();	
	});
	mainWindow.add(alertView);
	//mainWindow.open();
	return mainWindow;
}

exports.showRatingDailog = showRatingDailog;
