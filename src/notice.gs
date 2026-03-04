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
    return '「<b><font color="' + catColor + '">' + name + '</font></b>」';
  });
}

/** 教科の表示順 */
const SUBJECT_SORT_ORDER = ["国語", "数学", "理科", "社会", "英語"];

/**
 * Google Chat にメッセージを送信
 *
 * @param {Object} messageContents - メッセージの内容
 *   - changes: Array<[subject: string, commitMessage: string]> 教科と変更内容の2次元配列
 * @param {string} webhookUrl - Webhook の URL。
 */
function sendGooglechat(messageContents, webhookUrl) {
  // changes を教科ごとにグループ化
  const subjectMap = {};
  for (let i = 0; i < messageContents.changes.length; i++) {
    const rawSubject = (messageContents.changes[i][0] || '').toString().trim();
    // "国語/現代文α" → "国語" のように大カテゴリを抽出して順序判定に使う
    const majorSubject = rawSubject.split('/')[0].trim() || 'その他';
    const subject = rawSubject || 'その他';
    const message = (messageContents.changes[i][1] || '').toString();
    if (!subjectMap[subject]) {
      subjectMap[subject] = { major: majorSubject, messages: [] };
    }
    subjectMap[subject].messages.push(message);
  }

  // 教科を定義順で並び替え (未定義の教科はその他として末尾)
  const sortedSubjects = Object.keys(subjectMap).sort(function(a, b) {
    const ia = SUBJECT_SORT_ORDER.indexOf(subjectMap[a].major);
    const ib = SUBJECT_SORT_ORDER.indexOf(subjectMap[b].major);
    const ra = ia === -1 ? SUBJECT_SORT_ORDER.length : ia;
    const rb = ib === -1 ? SUBJECT_SORT_ORDER.length : ib;
    if (ra !== rb) return ra - rb;
    // 同じ大カテゴリ内ではサブジェクト名でソート
    return a < b ? -1 : a > b ? 1 : 0;
  });

  // 教科ごとに textParagraph を分けて生成
  const changeWidgets = sortedSubjects.map(function(subject) {
    const lines = ["<b>" + subject + "</b>"];
    subjectMap[subject].messages.forEach(function(msg) {
      lines.push("• " + renderTagsForChat(msg));
    });
    return {
      "textParagraph": {
        "text": lines.join("<br>")
      }
    };
  });

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
    "sections": [
      {
        "collapsible": false,
        "widgets": changeWidgets
      },
      downloadSection
    ]
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