/**
 * TAG_CATEGORIES: タグカテゴリのカラー定義
 */
const TAG_CATEGORIES_NOTICE = {
  "教科書": { color: "#2E86C1", bg: "#D6EAF8" },
  "資料集": { color: "#27AE60", bg: "#D5F5E3" },
  "ワーク": { color: "#E67E22", bg: "#FAE5D3" },
  "プリント": { color: "#884EA0", bg: "#E8DAEF" },
  "その他": { color: "#7F8C8D", bg: "#F2F4F4" }
};

/**
 * 変更内容テキスト中の <name;type> 形式タグを
 * Google Chat の <font color="...">name</font> 形式に変換する。
 * @param {string} text
 * @return {string}
 */
function renderTagsForChat(text) {
  return text.replace(/<([^;>]+);([^>]*)>/g, function(match, name, type) {
    const trimmedType = type.trim();
    const catColor = (TAG_CATEGORIES_NOTICE[trimmedType] || TAG_CATEGORIES_NOTICE["その他"]).color;
    return '<font color="' + catColor + '">' + name + '</font>';
  });
}

/**
 * Google Chat にメッセージを送信
 *
 * @param {Object} messageContents - メッセージの内容
 *   - changes: Array<[subject: string, commitMessage: string]> 教科と変更内容の2次元配列
 * @param {string} webhookUrl - Webhook の URL。
 */
function sendGooglechat(messageContents, webhookUrl) {
  // changes を教科ごとにグループ化 (登録順を保持)
  const subjectOrder = [];
  const subjectMap = {};
  for (let i = 0; i < messageContents.changes.length; i++) {
    const subject = (messageContents.changes[i][0] || '').toString().trim() || 'その他';
    const message = (messageContents.changes[i][1] || '').toString();
    if (!subjectMap[subject]) {
      subjectMap[subject] = [];
      subjectOrder.push(subject);
    }
    subjectMap[subject].push(message);
  }

  // 送信するテキストメッセージ
  const textMessage = "「" + messageContents.sheetName + "」が更新されました。";

  // 貢献者の情報
  let contributor = messageContents.editor.slice();
  contributor.push(messageContents.publisher.email);
  contributor = Array.from(new Set(contributor));

  var contributorMessage;
  if (contributor.length - 1 > 0) {
    contributorMessage = messageContents.publisher.name + " と他" + Number(contributor.length - 1) + "人の編集者";
  } else {
    contributorMessage = messageContents.publisher.name + "によって出版";
  }

  // 教科ごとのセクションを生成
  const changeSections = subjectOrder.map(function(subject) {
    const widgets = subjectMap[subject].map(function(msg) {
      return {
        "decoratedText": {
          "text": renderTagsForChat(msg)
        }
      };
    });
    return {
      "header": "<b>" + subject + "</b>",
      "collapsible": false,
      "widgets": widgets
    };
  });

  // 入手セクション
  const downloadSection = {
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
  };

  // 送信するカードのJSON
  const cardMessage = {
    "header": {
      "title": messageContents.sheetName,
      "subtitle": contributorMessage
    },
    "sections": changeSections.concat([downloadSection])
  };

  const options = {
    "method": "post",
    "headers": {"Content-Type": "application/json; charset=UTF-8"},
    "payload": JSON.stringify({
      "text": textMessage,
      "cardsV2": [{
        "cardId": Utilities.getUuid(),
        "card": cardMessage
      }]
    })
  };

  const response = UrlFetchApp.fetch(webhookUrl, options);
  console.log(response.getContentText());
}