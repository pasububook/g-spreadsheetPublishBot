function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('出版');
  menu.addItem('Google Chat に送信', 'publish_and_send_google_chat');
  menu.addToUi();
}

function publish_and_send_google_chat(){
  console.log("good")
}
