// Раскладка клавиатуры: пользователь не переключил язык (напр. "ntcnth"=тестер, "gj;fhrf"=пожарка,
// "вфргф"=dahua). flipLayout переводит строку в противоположную раскладку по позициям клавиш.
const EN_KEYS = "`qwertyuiop[]asdfghjkl;'zxcvbnm,./";
const RU_KEYS = "ёйцукенгшщзхъфывапролджэячсмитьбю.";
const FLIP = new Map<string, string>();
for (let i = 0; i < EN_KEYS.length; i++) {
  FLIP.set(EN_KEYS[i], RU_KEYS[i]);
  FLIP.set(RU_KEYS[i], EN_KEYS[i]);
  FLIP.set(EN_KEYS[i].toUpperCase(), RU_KEYS[i].toUpperCase());
  FLIP.set(RU_KEYS[i].toUpperCase(), EN_KEYS[i].toUpperCase());
}

/** Строка в противоположной раскладке. "" если менять нечего (чтобы не искать дубль оригинала). */
export function flipLayout(s: string): string {
  let out = "";
  let changed = false;
  for (const ch of s) {
    const f = FLIP.get(ch);
    if (f) { out += f; changed = true; } else out += ch;
  }
  return changed ? out : "";
}
