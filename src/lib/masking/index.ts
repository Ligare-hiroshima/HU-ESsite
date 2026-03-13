export interface MaskCandidate {
  id: string;
  type: string;
  label: string;
  value: string;
  start: number;
  end: number;
  masked: boolean;
}

const PATTERNS: Array<{ type: string; label: string; regex: RegExp }> = [
  { type: 'email', label: 'メールアドレス', regex: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g },
  { type: 'phone', label: '電話番号', regex: /0\d{1,4}[-\s]?\d{1,4}[-\s]?\d{4}/g },
  { type: 'url', label: 'URL', regex: /https?:\/\/[^\s\u3000-\u9fff]+/g },
  { type: 'student_id', label: '学籍番号', regex: /[A-Z]\d{7,10}/g },
  { type: 'honorific', label: '人名（敬称）', regex: /[ぁ-んァ-ン一-龥]{2,5}(さん|先生|教授|氏|君)/g },
  { type: 'lab', label: '研究室・ゼミ名', regex: /[ぁ-んァ-ン一-龥a-zA-Z]{2,6}(研究室|ゼミ|ラボ|実験室)/g },
  { type: 'club', label: 'サークル・部活', regex: /[ぁ-んァ-ン一-龥a-zA-Z]{2,10}(サークル|部|クラブ|団体)/g },
  { type: 'date', label: '日付', regex: /\d{4}[年\/\-]\d{1,2}[月\/\-]\d{1,2}日?/g },
  { type: 'time', label: '時刻', regex: /\d{1,2}:\d{2}(:\d{2})?/g },
];

export function detectMaskCandidates(text: string): MaskCandidate[] {
  const candidates: MaskCandidate[] = [];
  let idCounter = 0;

  for (const pattern of PATTERNS) {
    pattern.regex.lastIndex = 0;
    let match;
    while ((match = pattern.regex.exec(text)) !== null) {
      candidates.push({
        id: `mask_${idCounter++}`,
        type: pattern.type,
        label: pattern.label,
        value: match[0],
        start: match.index,
        end: match.index + match[0].length,
        masked: false,
      });
    }
  }

  return candidates.sort((a, b) => a.start - b.start);
}

export function applyMask(text: string, candidates: MaskCandidate[]): string {
  let result = text;
  const toMask = candidates.filter((c) => c.masked).sort((a, b) => b.start - a.start);
  for (const c of toMask) {
    result = result.substring(0, c.start) + '[MASK]' + result.substring(c.end);
  }
  return result;
}
