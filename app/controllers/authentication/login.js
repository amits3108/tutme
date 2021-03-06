var utils = require("utils");
var validation = require("validation");
var network = require("network");
var appKey = require("appKey");

$.registerNow.addEventListener('click', function(e) {
	Ti.API.info("**************");
	openRegisterAsScreen();
});

function openRegisterAsScreen(params) {
	var win = Alloy.createController("authentication/registerAs", {
		params : params,
		closeLoginScreen : closeLoginScreen
	}).getView();
	win.open();
}

function closeLoginScreen() {
	$.loginScreen.close();
}

function onLoginClick() {
	var user = {};
	var email = ($.emailAddress.value).trim();
	var password = $.password.value;
	/*var emailValid = validation.validateEmail({
	 email : email
	 });*/
	if (email.length > 1 /*&& emailValid*/) {
		user.email = email.toLowerCase();
		if (password.length > 1) {
			/*var win = Alloy.createController("sliderContent/slider").getView();
			 win.open();
			 utils.setLoginStatus();
			 closeLoginScreen();*/
			if (Titanium.Network.online) {
				utils.showLoading();
				var requestData = {// email, password
					username : email,
					password : password
				};
				network.postRequest({
					type : "POST",
					url : Alloy.CFG.URL.login,
					requestData : requestData,
					requestHeaders : {
						"public-key" : "c8a1ad1332716aa15752422360e739a5",
						"token" : "72dd0dbc65b5e19d4b086c6f89b16203_123",//"79c74e91e49b623f6ea02435e2725"
					},
					callBack : callBack,
				});

			} else {
				alert("Internet is not available");
			}
		} else {
			alert("Please enter password");
		}
	} else {
		alert("Please enter valid email address");
		return false;
	}
}

function callBack(json) {
	Ti.API.info("login callback : \n " + JSON.stringify(json));
	utils.hideLoading();
	if (json && (parseInt(json.status_code) == 200) && (!json.error)) {
		utils.setLoginStatus();
		if (json.data) {
			if (json.data && json.data.user_type && json.data.user_type == "1") {
				Ti.API.info("student login");
				Alloy.Globals.setData(appKey.KEYS.USERTYPE, "student");
			} else if(json.data.user_type && json.data.user_type == "2") {
				Ti.API.info("tutor login");
				Alloy.Globals.setData(appKey.KEYS.USERTYPE, "tutor");
			}else if(json.data.user_type && json.data.user_type == "3"){
				Ti.API.info("tutor login");
				Alloy.Globals.setData(appKey.KEYS.USERTYPE, "organisation");
			}

			setUserValues({
				full_name : json.data.full_name,
				email : json.data.email,
				user_type : json.data.user_type,
				phone : (json.data.phone) ? json.data.phone : "",
				user_id : json.data.id,
			});
		}
		if (!Alloy.Globals.getData(appKey.FIRST_TIME_PROFILE_NAVIGATOR_OPEN)){
        	Alloy.Globals.setData(appKey.FIRST_TIME_PROFILE_NAVIGATOR_OPEN,true);
            Alloy.createController("authentication/profileNavigator").getView().open();
        }else{
        	var win = Alloy.createController("sliderContent/slider", {
				closeLoginScreen : closeLoginScreen
			}).getView();
			win.open();
			Ti.API.info("Login successfully");
        }
		
         //Alloy.createController("authentication/profileNavigator").getView().open(); 
        /*var win = Alloy.createController("sliderContent/slider", {
			closeLoginScreen : closeLoginScreen
		}).getView();*/
		//win.open();
		//Ti.API.info("Register successfully");
	} else {
		//json && !(_.isEmpty(json)) && alert(json.message);
		_.isEmpty(json) && alert("Unable to connect. Please try again later.");
		if (json && json.error) {
			if (json.message) {
				alert(json.message + "");
			} else {
				alert("Something went wrong, Please try again");
			}
		}
		Ti.API.error("error found");
	}
}

function setUserValues(params) {
	var user = {
		name : params.full_name,
		email : params.email,
		phone : params.phone,
		user_id : params.user_id,
		user_type : params.user_type,
	};
	Alloy.Globals.setData(appKey.USER, user);
}

function openForgetPasswordScreen() {
	Alloy.createController("authentication/forgetPassword").getView().open();
}
