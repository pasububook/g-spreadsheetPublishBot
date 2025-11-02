/**
 * Google Chat にメッセージを送信
 * 
 * @param {string} messageContents - メッセージの内容
 * @param {string} webhookUrl - Webhook の URL。
 */
function sendGooglechat(messageContents, webhookUrl) {
  // 変更内容
  let changesOutput = ""
  for (let i = 0; i < messageContents.changes.length; i++) {
    changesOutput += " - " + messageContents.changes[i] + "<br>"
  }

  // 送信するテキストメッセージ
  const textMessage = "「" + messageContents.sheetName + "」が更新されました。";

  // 貢献者の情報
  const contributor = messageContents.publisher.name + "と他" + messageContents.editor + "人の編集者"
  
  // 送信するカードのJSON
  const cardMessage = 
  {
    "header": {
      "title": messageContents.sheetName,
      "subtitle": contributor
    },
    "sections": [
      {
        "header": "変更内容",
        "collapsible": true,
        "uncollapsibleWidgetsCount": 2,
        "widgets": [
          {
            "textParagraph": {
              "text": changesOutput
            }
          }
        ]
      },
      {
        "header": "入手",
        "collapsible": false,
        "uncollapsibleWidgetsCount": 1,
        "widgets": [
          {
            "buttonList": {
              "buttons": [
                {
                  "text": "カラー版",
                  "icon": {
                    "materialIcon": {
                      "name": "file_open"
                    }
                  },
                  "type": "FILLED",
                  "onClick": {
                    "openLink": {
                      "url": messageContents.download.color
                    }
                  }
                },
                {
                  "text": "モノクロ版",
                  "icon": {
                    "materialIcon": {
                      "name": "file_open"
                    }
                  },
                  "type": "OUTLINED",
                  "onClick": {
                    "openLink": {
                      "url": messageContents.download.mono
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ]
  };

  const options = {
    "method": "post",
    "headers": {"Content-Type": "application/json; charset=UTF-8"},
    "payload": JSON.stringify({
      "text": textMessage,
      "cardsV2": [{
        "cardId": Utilities.getUuid(), // Todo: 各カードに一意のIDを設定する
        "card": cardMessage
      }]
    })
  };

  const response = UrlFetchApp.fetch(webhookUrl, options);
  console.log(response.getContentText());
}