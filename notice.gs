/**
 * Google Chat にメッセージを送信
 */
function google_chat_webhook(message_content, webhookUrl) {
  const google_chat_message = "「" + message_content.sheetName + "」が更新されました\n変更内容:\n" + message_content.changes + "\nカラー版: " + message_content.download.color + "\nモノクローム版: " + message_content.download.mono;

  const options = {
    "method": "post",
    "headers": {"Content-Type": "application/json; charset=UTF-8"},
    "payload": JSON.stringify({"text": google_chat_message})
  };
  const response = UrlFetchApp.fetch(webhookUrl, options);
  console.log(response);
}
