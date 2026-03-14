/**
 * 定義済みデータ
 */
export const TAG_CATEGORIES = {
  "教科書": { color: "#2E86C1", bg: "#D6EAF8" },
  "資料集": { color: "#27AE60", bg: "#D5F5E3" },
  "ワーク": { color: "#E67E22", bg: "#FAE5D3" },
  "プリント": { color: "#884EA0", bg: "#E8DAEF" },
  "その他": { color: "#7F8C8D", bg: "#F2F4F4" }
};

/**
 * SUBJECT_LIST
 * 利用可能な教科の正式名称リスト (テスト用)
 */
export const SUBJECT_LIST = [
  "国語/現代文α",
  "国語/古文漢文β",
  "数学/数学III演習",
  "理科/生物基礎",
  "社会/世界史探求",
  "英語/リーディングIII",
  "英語/ライティング入門"
];

/**
 * SUGGEST_DB
 * タグ入力時のサジェスト候補、および教科情報の自動入力用データベース (テスト用)
 */
export const SUGGEST_DB = [
  // ==========================================
  // 国語/現代文α
  // ==========================================
  {
    name: "1",
    type: "教科書",
    subject: "国語/現代文α",
    keywords: [
      "seisen", "gendai", "kaiteiban",
      "s", "g",
      "せいせん", "げんだい", "かいていばん", "いちもじ"
    ]
  },
  {
    name: "ステップアップ現代文",
    type: "ワーク",
    subject: "国語/現代文α",
    keywords: [
      "stepup", "step", "gendai",
      "s", "g",
      "すてっぷ", "げんだい"
    ]
  },
  {
    name: "読解力養成プリント",
    type: "プリント",
    subject: "国語/現代文α",
    keywords: [
      "dokkai", "yousei", "print",
      "d", "y", "p",
      "どっかい", "ようせい", "ぷりんと"
    ]
  },

  // ==========================================
  // 国語/古文漢文β
  // ==========================================
  {
    name: "新訂 古典文学選",
    type: "教科書",
    subject: "国語/古文漢文β",
    keywords: [
      "shintei", "koten", "bungaku",
      "s", "k", "b",
      "しんてい", "こてん", "ぶんがく"
    ]
  },
  {
    name: "漢文句法ドリル",
    type: "ワーク",
    subject: "国語/古文漢文β",
    keywords: [
      "kanbun", "kubou", "drill",
      "k", "d",
      "かんぶん", "くほう", "どりる"
    ]
  },

  // ==========================================
  // 数学/数学III演習
  // ==========================================
  {
    name: "体系数学 解析編",
    type: "教科書",
    subject: "数学/数学III演習",
    keywords: [
      "taikei", "kaiseki", "math",
      "t", "k", "m",
      "たいけい", "かいせき", "すうがく"
    ]
  },
  {
    name: "NEW ACTION LEGEND 数III",
    type: "ワーク",
    subject: "数学/数学III演習",
    keywords: [
      "new", "action", "legend", "nal",
      "n", "a", "l",
      "にゅーあくしょん", "れじぇんど"
    ]
  },
  {
    name: "微積分特訓プリント",
    type: "プリント",
    subject: "数学/数学III演習",
    keywords: [
      "biseki", "tokkun", "print",
      "b", "t", "p",
      "びせきぶん", "とっくん", "ぷりんと"
    ]
  },

  // ==========================================
  // 理科/生物基礎
  // ==========================================
  {
    name: "改訂版 生物基礎",
    type: "教科書",
    subject: "理科/生物基礎",
    keywords: [
      "seibutsu", "kiso", "biology",
      "s", "k", "b",
      "せいぶつ", "きそ", "ばいおろじー"
    ]
  },
  {
    name: "生物基礎図説ニューステージ",
    type: "資料集",
    subject: "理科/生物基礎",
    keywords: [
      "zusetu", "newstage", "new",
      "z", "n",
      "ずせつ", "にゅーすてーじ"
    ]
  },
  {
    name: "センター対策生物問題集",
    type: "ワーク",
    subject: "理科/生物基礎",
    keywords: [
      "center", "mondai", "biology",
      "c", "m", "b",
      "せんたー", "もんだい", "せいぶつ"
    ]
  },

  // ==========================================
  // 社会/世界史探求
  // ==========================================
  {
    name: "詳説世界史 B",
    type: "教科書",
    subject: "社会/世界史探求",
    keywords: [
      "shousetu", "sekaishi", "b",
      "s", "b",
      "しょうせつ", "せかいし"
    ]
  },
  {
    name: "世界史図録ヴィジュアルワイド",
    type: "資料集",
    subject: "社会/世界史探求",
    keywords: [
      "zuroku", "visual", "wide",
      "z", "v", "w",
      "ずろく", "びじゅある", "わいど"
    ]
  },
  {
    name: "一問一答 世界史ターゲット",
    type: "ワーク",
    subject: "社会/世界史探求",
    keywords: [
      "ichimon", "ichitou", "target",
      "i", "t",
      "いちもん", "いちとう", "たーげっと"
    ]
  },

  // ==========================================
  // 英語/リーディングIII
  // ==========================================
  {
    name: "CROWN English Reading III",
    type: "教科書",
    subject: "英語/リーディングIII",
    keywords: [
      "crown", "english", "reading",
      "c", "e", "r",
      "くらうん", "りーでぃんぐ"
    ]
  },
  {
    name: "速読英熟語",
    type: "ワーク",
    subject: "英語/リーディングIII",
    keywords: [
      "sokudoku", "jukugo", "reading",
      "s", "j",
      "そくどく", "えいじゅくご"
    ]
  },

  // ==========================================
  // 英語/ライティング入門
  // ==========================================
  {
    name: "POLESTAR Writing",
    type: "教科書",
    subject: "英語/ライティング入門",
    keywords: [
      "polestar", "writing", "pole",
      "p", "w",
      "ぽーるすたー", "らいてぃんぐ"
    ]
  },
  {
    name: "英作文トレーニング Basic",
    type: "ワーク",
    subject: "英語/ライティング入門",
    keywords: [
      "eisakubun", "training", "basic",
      "e", "t", "b",
      "えいさくぶん", "とれーにんぐ", "べーしっく"
    ]
  },
  {
    name: "英語表現 補助プリント集 すごくすごくすごくすごく長い",
    type: "プリント",
    subject: "英語/ライティング入門",
    keywords: [
      "hojo", "print", "hyogen",
      "h", "p",
      "ほじょ", "えいごひょうげん", "ぷりんと"
    ]
  }
];

export function getCategory(name, explicitType) {
  if (explicitType && TAG_CATEGORIES[explicitType]) return explicitType;
  const hit = SUGGEST_DB.find(d => d.name === name);
  if (hit && TAG_CATEGORIES[hit.type]) return hit.type;
  return "その他";
}

export function getSubject(name) {
  const hit = SUGGEST_DB.find(d => d.name === name);
  return hit ? hit.subject : null;
}

/**
 * アプリケーション状態管理
 */
