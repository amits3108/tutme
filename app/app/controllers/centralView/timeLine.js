// Arguments passed into this controller can be accessed via the `$.args` object
// directly or:
var args = $.args;

function createtimeLineRow(params) {
	var params = params || {};

	var tableViewRow = Ti.UI.createTableViewRow({
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
	});
	var viewContainer = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : Ti.UI.FILL,
		backgroundColor : "#FFF",
		borderColor : Alloy.CFG.themeColor,
		borderRadius : 4,
		borderWidth : 3,
		layout : "vertical",
		top : 15
	});
	var createdOn = Ti.UI.createLabel({
		text : "Created On: " + params.postCreationDate,
		color : "#000",
		font : {
			fontSize : 13,
		},
		left : 5,
		top : 10
	});
	viewContainer.add(createdOn);

	var start_double_quotes = Ti.UI.createImageView({
		image : "/images/start_double_quotes.png",
		height : 20,
		width : 20,
		top : 10,
		left : 5,
	});
	viewContainer.add(start_double_quotes);

	var timeLinePostLabel = Ti.UI.createLabel({
		text : params.timeLinePost,
		color : "#000",
		font : {
			fontSize : 13,
		},
		//left : 5,
		top : 10,
		textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER
	});
	viewContainer.add(timeLinePostLabel);

	var end_double_quotes = Ti.UI.createImageView({
		image : "/images/end_double_quotes.png",
		height : 20,
		width : 20,
		top : 10,
		right : 5,
		bottom : 10
	});
	viewContainer.add(end_double_quotes);
	tableViewRow.add(viewContainer);
	return tableViewRow;
}

function postButtonClick() {
	var timeLinePost = ($.timeLineField.value != "" || null) ? $.timeLineField.value : "";
	var tableRow = createtimeLineRow({
		timeLinePost : timeLinePost,
		postCreationDate : "6:20pm June 15,2016"
	});

	$.timeLineTable.appendRow(tableRow);
	//Ti.API.info(" $.timeLineTable.data.length "+ $.timeLineTable.data.length);
	//$.timeLineTable.scrollToIndex($.timeLineTable.data.length - 1);
	$.timeLineField.value = "";
}

var tableRow1 = createtimeLineRow({
	timeLinePost : "Education is the key to success in life, and teachers make a lasting impact in the lives of their students. Solomon Ortiz",
	postCreationDate : "6:20pm June 15,2016"
});
$.timeLineTable.appendRow(tableRow1);
tableRow1 = null;
