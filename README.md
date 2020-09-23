# GetAssignment
授業支援から課題を自動取得して、googleカレンダーに追加

## 説明
keio.jpのloginにはseleniumを使用  
google calendar api頑張って叩く  
Line通知はGoogle Apps Scriptを使ってLINE notifyにPOST　　

**これでもう課題は忘れない！！！**

## ざっくりした使い方
1. git clone する
1. https://developers.google.com/calendar/quickstart/python からcredentials.jsonを取得してGetAssignmentのディレクトリに追加
1. login.jsonを編集して、username,password,googleカレンダーのIDを追加
1. ターミナルでpython add_calendar.pyを実行　※定期的に実行したい場合はmacならcronとか使ってね
1. https://notify-bot.line.me/ja/ でトークンを取得
1. google driveに行って新規のgoogle apps scriptを作成
1. LINEnotify.gsをコピペ
1. File > プロジェクトのプロパティー　> スクリプトのプロパティー　にさっき取得したLINEのトークン(neme:LINE_TOKEN)とgoogleカレンダーのIDを追加(name:calendarId)
1. notifyDailyやnotifyWeeklyを実行。定期実行したかったらトリガーを設定。


##### 注意
pythonのモジュールがない場合はpipとかで入れてね  
seleniumとchromedriverのインストール  
`pip install selenium chromedriver-binary`  
google calendar apiのインストール  
`pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib`


## テスト環境
|  name  |  version  |
| ---- | ---- |
|  python3.7.8  |  3.7.8  |
|  python-chromedriver-binary  |  85.0.4183.87.0  |
|  selenium  |  3.141.0  |
|  google-api-core  |  1.22.2  |
|  google-api-python-client |  1.12.1  |
|  google-auth  |  1.21.2  |
|  google-auth-httplib2  |  0.0.4  |
|  google-auth-oauthlib  |  0.4.1  |
|  googleapis-common-protos  |  1.52.0  |


## 参考
https://developers.google.com/calendar/quickstart/python  
https://notify-bot.line.me/ja/  
https://qiita.com/hajime_migi/items/d7d0a310995a99297e80  
https://qiita.com/shota-nekoneko/items/64bbd0c2f534d20e7b77  
https://qiita.com/ikei/items/8c837444dcab6c0e4629  
https://qiita.com/monoqlock/items/55bf4860003ab1405a7f  
