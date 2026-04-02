// We can extract SUBJECT_LIST and SUGGEST_DB by evaluating the rawConfig text.
let SUBJECT_LIST = [];
let SUGGEST_DB = [];

try {
  let rawConfig = "";
  // Check if Vite injected the raw config during build
  if (typeof __CONFIG_GS_RAW__ !== 'undefined') {
    rawConfig = __CONFIG_GS_RAW__;
  } else {
    // When previewed via local Live Server, fetch the file over HTTP.
    const res = await fetch('../config.gs');
    rawConfig = await res.text();
  }

  // Extracting variables using new Function
  // Ensure we define dummy constants for stuff in config.gs to avoid reference errors
  const extractFn = new Function(`
    ${rawConfig}
    return { SUBJECT_LIST, SUGGEST_DB };
  `);
  const configParams = extractFn();
  SUBJECT_LIST = configParams.SUBJECT_LIST || [];
  SUGGEST_DB = configParams.SUGGEST_DB || [];
} catch (e) {
  console.error("Failed to parse config.gs", e);
}

export { SUBJECT_LIST, SUGGEST_DB };

// We also no longer need TAG_CATEGORIES color mappings in JS because they are handled by CSS.
// But we might need the list of types if used to validate.
export const KNOWN_TYPES = ["教科書", "資料集", "ワーク", "プリント", "その他"];

export function getCategory(name, explicitType) {
  if (explicitType && KNOWN_TYPES.includes(explicitType)) return explicitType;
  const hit = SUGGEST_DB.find(d => d.name === name);
  if (hit && KNOWN_TYPES.includes(hit.type)) return hit.type;
  return "その他";
}

export function getSubject(name) {
  const hit = SUGGEST_DB.find(d => d.name === name);
  return hit ? hit.subject : null;
}
