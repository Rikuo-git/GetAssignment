// Google Apps Script

function notifyDaily() {
  // カレンダー取得
  var calId = PropertiesService.getScriptProperties().getProperty('calendarId');
  var cal = CalendarApp.getCalendarById(calId);
  //　日付の設定
  var dt = new Date();
  // LINE Notifyに送るメッセージ
  var msg = "\n~今日の課題~\n";
  // 課題をテキストとして取得
  var events = getAssignments(cal,dt);
  if(events !="なし\n"){
     sendNotification(msg+events);
  }
}

function notifyWeekly() {
  //カレンダー取得
  var calId = PropertiesService.getScriptProperties().getProperty('calendarId');
  var cal = CalendarApp.getCalendarById(calId);
  //　日付の設定
  var dt = new Date();
  var weekday = ["日", "月", "火", "水", "木", "金", "土"];
  
  // LINE Notifyに送るメッセージ
  var msg = "\n〜来週の課題〜\n";

  //　1週間の課題を取得
  for ( var i = 0;  i < 7;  i++ ) {
    dt.setDate(dt.getDate() + 1);
    msg += Utilities.formatDate(dt, 'JST', 'M/d(' + weekday[dt.getDay()] + ')');
    msg += getAssignments(cal,dt);
  }

  sendNotification(msg);
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
function getAssignments(cal,dt){
  // googleカレンダーから課題を配列で取得。
  var events = cal.getEventsForDay(dt);
  
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
    var due = Utilities.formatDate(event.getEndTime(), 'JST', 'HH:mm');
    msg += "・"+title + "\n" +"締切:" + due + "\n\n";
  });
  return msg;
}
