const DIGITS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const SMALL_UNITS = ['', '拾', '佰', '仟'];
const BIG_UNITS = ['', '万', '亿', '万亿'];

class RmbError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'RmbError';
  }
}

function convertSection(s: string): string {
  const len = s.length;
  let result = '';
  let zeroFlag = false;

  for (let i = 0; i < len; i++) {
    const d = parseInt(s[i]);
    const unit = SMALL_UNITS[len - 1 - i];

    if (d === 0) {
      zeroFlag = true;
    } else {
      if (zeroFlag) {
        result += '零';
        zeroFlag = false;
      }
      result += DIGITS[d] + unit;
    }
  }

  return result;
}

function convertInt(numStr: string): string {
  numStr = numStr.replace(/^0+/, '');
  if (!numStr) return '零';

  const groups: string[] = [];
  let pos = numStr.length;
  while (pos > 0) {
    const start = Math.max(0, pos - 4);
    groups.unshift(numStr.substring(start, pos));
    pos = start;
  }

  const parts: string[] = [];
  let needZero = false;

  for (let gi = 0; gi < groups.length; gi++) {
    const g = groups[gi];
    const nameIdx = groups.length - 1 - gi;
    const name = BIG_UNITS[nameIdx] || '';

    const converted = convertSection(g);
    if (converted) {
      if (needZero && !converted.startsWith('零')) {
        parts.push('零');
      }
      parts.push(converted + name);
      needZero = false;
    } else {
      if (parts.length > 0) {
        needZero = true;
      }
    }
  }

  return parts.join('');
}

function convertDec(decStr: string): string {
  if (!decStr) return '整';

  const jiao = parseInt(decStr[0]);
  const fen = decStr.length > 1 ? parseInt(decStr[1]) : 0;

  if (jiao === 0 && fen === 0) return '整';

  let result = '';
  if (jiao > 0) result += DIGITS[jiao] + '角';
  if (fen > 0) {
    if (jiao === 0) result += '零';
    result += DIGITS[fen] + '分';
  }

  return result;
}

export function rmb(amount: string): string {
  const trimmed = amount.trim();
  if (!trimmed) throw new RmbError('金额不能为空');

  const normalized = trimmed.replace(/^。$/, '.').replace(',', '.');
  if (normalized.startsWith('-')) throw new RmbError('金额不能为负数');

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new RmbError('金额格式无效，请输入正数，小数点后最多两位');
  }

  const dotIdx = normalized.indexOf('.');
  const intPart = dotIdx === -1 ? normalized : normalized.substring(0, dotIdx);
  const decPart = dotIdx === -1 ? '' : normalized.substring(dotIdx + 1);

  if (intPart.length > 16) {
    throw new RmbError('金额过大，最大支持 9999999999999999.99');
  }

  const intChinese = convertInt(intPart);

  if (intPart === '0' || intChinese === '零') {
    const decChinese = convertDec(decPart);
    if (decChinese === '整') return '零圆整';
    return decChinese;
  }

  const decChinese = convertDec(decPart);

  if (decChinese === '整') {
    return intChinese + '圆整';
  }

  return intChinese + '圆' + decChinese;
}
