// Google Apps Script


function notifyDaily() {
  var cal = getCalendar();
  //　日付の設定
  var {start,end} = setDate();
  // LINE Notifyに送るメッセージ
  var msg = "\n~今日の課題~\n";
  // 課題をテキストとして取得
  var events = getAssignments(cal,start,end);
  if(events !="なし\n"){
     sendNotification(msg+events);
  }
}

function notifyWeekly() {
  var cal = getCalendar();
  // 日付の設定
  var {start,end} = setDate();
  var weekday = ["日", "月", "火", "水", "木", "金", "土"];
  
  // LINE Notifyに送るメッセージ
  var msg = "\n〜来週の課題〜\n";

  //　1週間の課題を取得
  for ( var i = 0;  i < 7;  i++ ) {
    start.setDate(start.getDate() + 1);
    end.setDate(end.getDate() + 1);
    msg += Utilities.formatDate(start, 'JST', 'M/d(' + weekday[start.getDay()] + ')');
    msg += getAssignments(cal,start,end);
  }

  sendNotification(msg);
}

// カレンダーを取得
function getCalendar(){
  // カレンダーID
  var calId = PropertiesService.getScriptProperties().getProperty('calendarId');
  var cal = CalendarApp.getCalendarById(calId);
  return cal
}

function setDate(){
 //　日付の設定
  var dt = new Date();
  var start = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(),'0','1');
  var end = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()+1,'0','1');
  return {start, end}
}

// LINEに送る
function sendNotification(msg){
  // LINE Notifyのアクセストークン
  var token = PropertiesService.getScriptProperties().getProperty('LINE_TOKEN');
  var url = "https://notify-api.line.me/api/notify";
  var options =
  {
     "method"  : "post",
     "headers" : {"Authorization" : "Bearer "+ token},
     "payload" : "message=" + msg
   };
  UrlFetchApp.fetch(url, options);
}

//　googleカレンダーから課題を取得
function getAssignments(cal,start,end){
  // googleカレンダーから課題を配列で取得。
  var events = cal.getEvents(start,end);
  
  //　課題をmsgに変換
  var msg = "";
  if(events.length === 0){
    msg += "なし\n";
  }
  if(events.length !== 0){
    msg += eventsToMsg(events);
  }
  return msg
}

// 課題の配列をテキストにして返す
function eventsToMsg(events/* array */){
  var msg = "";
  events.forEach( function(event, index){
    var title = event.getTitle();
    var due = Utilities.formatDate(event.getStartTime(), 'JST', 'HH:mm');
    msg += "・"+title + "\n" +"締切:" + due + "\n\n";
  });
  return msg;
}
