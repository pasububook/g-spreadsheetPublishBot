/**
 * Google Chat にメッセージを送信
 * 
 * @param {string} messageContents - メッセージの内容
 * @param {string} spreadsheetId - webhook の URL。
 */
function sendGooglechat(messageContents, webhookUrl) {
  // 変更内容
  let changesOutput = ""
  for (let i = 0; i < messageContents.changes.length; i++) {
    changesOutput += " - " + messageContents.changes[i] + "\n"
  }

  const googlechatMessage = "「" + messageContents.sheetName + "」が更新されました\n変更内容:\n" + changesOutput + "カラー版: " + messageContents.download.color + "\nモノクローム版: " + messageContents.download.mono;

  const options = {
    "method": "post",
    "headers": {"Content-Type": "application/json; charset=UTF-8"},
    "payload": JSON.stringify({"text": googlechatMessage})
  };
  const response = UrlFetchApp.fetch(webhookUrl, options);
  console.log(response);
}
