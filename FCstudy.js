//在即将离开当前页面(刷新或关闭)时执行222
window.onbeforeunload = function(e) {
	commitStudy();
}

var duration = 0;
var a = 0;
var b = 0;
var initV = 0;
var second = 0;
var autoFlag = 0;
var commitFlag = 0;
var prelocation = 0;
var isPause = false;
var returnStr = '';
function checkFocus() {
	var docum = window.document;
	var myPlayer = videojs('example_video_1');
	if (myPlayer.paused) {
		isPause =false;
	}
	if (myPlayer.play) {
		isPause = false;
	}
	// 失焦停播
	if (!docum.hasFocus()) {
		myPlayer.pause();
		isPause = false;
	}
}
function closeme() {
	window.top.opener.location.reload();
	window.top.opener = null;
	window.top.open("", "_self");
	window.top.close();
}
// 初始化
function initAPI() {
	var docum = window.document;
	var lessonStatus = docum.getElementById("lessonStatus").value;
	var launch = docum.getElementById("launch").value;
	var chapterhours = docum.getElementById("chapterhours").value;
	prelocation = chapterhours;
	var interactionTime = docum.getElementById("interactionTime").value;
	var interactionContent = docum.getElementById("interactionContent").value;
	var isFocus = docum.getElementById("isFocus").value;
	interactionContent = interactionContent.replace("minute", interactionTime);
	docum.getElementById("interactionContent").value = interactionContent;
	var myPlayer = videojs('example_video_1');

	myPlayer.ready(function() {
		myPlayer.currentTime(chapterhours);
	});
	if (lessonStatus != 'completed') {
		setInterval("checkSession()", 1000);
	}

	if (isFocus == '02') {
		setInterval("checkFocus()", 1000);// 检查是否是焦点
	}

}
// 回调函数
function callBackFun() {
	var docum = window.document;
	lessonStatus = "completed";
	docum.getElementById("lessonStatus").value = "completed";
	location.reload();
}
// 记录学时
function checkSession() {
	var myPlayer = videojs('example_video_1');
	if (autoFlag == '0') {
		var docum = window.document;

		var lessonStatus = docum.getElementById("lessonStatus").value;
		var courseid = docum.getElementById("courseid").value;
		var orderId = docum.getElementById("orderId").value;
		var goodsid = docum.getElementById("goodsid").value;
		var coursewareid = docum.getElementById("coursewareid").value;
		var chapterid = docum.getElementById("chapterid").value;
		var username = docum.getElementById("username").value;
		var userid = docum.getElementById("userid").value;

		var position = 0;
		var mediaduration = docum.getElementById("mediaduration").value;

		var myPlayer = videojs('example_video_1');
		var whereYouAt = myPlayer.currentTime();

		// 防止拖动
		if (!isPause) {
			prelocation = parseInt(prelocation) + 1;
		}
		if (parseInt(whereYouAt) > parseInt(prelocation) + 3) {
			myPlayer.currentTime(prelocation);
			return;
		}
		// 定时弹窗
		if (parseInt(duration) == parseInt(interactionTime * 60)) {
			if (whereYouAt > 0 && !isPause) {
				learnSecond = whereYouAt;
			}
			if (confirm(interactionContent)) {
				setTimeout("closeme()", 1000);
			} else {
				duration = 0;
			}
		}
		if (parseInt(whereYouAt) > 0 && parseInt(whereYouAt) + 40 >= parseInt(mediaduration) && parseInt(mediaduration) > 0 && lessonStatus != "completed") {
			dwr.engine.setAsync(false);
			checkTime.recordHours(whereYouAt, userid, courseid, coursewareid, chapterid, orderId, goodsid, callBackFun());
			dwr.engine.setAsync(true);
		}
		// 每隔30秒计时一次
		if (!isPause) {
			second = second + 1;
		}
		if (second == 30) {
			second = 0;
			duration = duration + 2;
			if (whereYouAt > 0 && !isPause && lessonStatus != "completed") {
				dwr.engine.setAsync(false);
				checkTime.recordHours(whereYouAt, userid, courseid, coursewareid, chapterid, orderId, goodsid);
				dwr.engine.setAsync(true);
			}
		}
	}
}
function databack(data) {
	var myPlayer = videojs('example_video_1');
	var docum = window.document;
	var courseid = docum.getElementById("courseid").value;
	var coursewareid = docum.getElementById("coursewareid").value;
	if (data) {
		var lessonStatus = docum.getElementById("lessonStatus").value;
		if (lessonStatus == "completed") {
			if (confirm("已完成本课件的学习!")) {
				closeme();
			} else {
				closeme();
			}
		}
	} else {

	}
}
function commitStudy() {
	var docum = window.document;

	var lessonStatus = docum.getElementById("lessonStatus").value;
	var lessonLocation = docum.getElementById("lessonLocation").value;
	var courseid = docum.getElementById("courseid").value;
	var orderId = docum.getElementById("orderId").value;
	var goodsid = docum.getElementById("goodsid").value;
	var coursewareid = docum.getElementById("coursewareid").value;
	var chapterid = docum.getElementById("chapterid").value;
	var userid = docum.getElementById("userid").value;

	var mediaduration = docum.getElementById("mediaduration").value;
	var myPlayer = videojs('example_video_1');
	var whereYouAt = myPlayer.currentTime();

	if (parseInt(whereYouAt) > 0 && parseInt(whereYouAt) + 40 >= parseInt(mediaduration) && parseInt(mediaduration) > 0 && lessonStatus != "completed") {
		dwr.engine.setAsync(false);
		checkTime.recordHours(whereYouAt, userid, courseid, coursewareid, chapterid, orderId, goodsid, callBackFun());
		dwr.engine.setAsync(true);
	}
	if (lessonStatus != "completed") {
		dwr.engine.setAsync(false);
		checkTime.recordHours(whereYouAt, userid, courseid, coursewareid, chapterid, orderId, goodsid);
		dwr.engine.setAsync(true);
	}

}
