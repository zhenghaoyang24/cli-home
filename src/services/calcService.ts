class CalcError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "CalcError";
  }
}

class Lexer {
  private pos = 0;
  constructor(private input: string) {}

  private peek(): string {
    while (this.pos < this.input.length && this.input[this.pos] === " ") this.pos++;
    return this.pos < this.input.length ? this.input[this.pos] : "\0";
  }

  private consume(): string {
    const ch = this.peek();
    if (ch !== "\0") this.pos++;
    return ch;
  }

  parseNumber(): number {
    const ch = this.peek();
    if (ch === "\0") throw new CalcError("Unexpected end of expression");
    if (ch === "(") return this.parseParen();
    if (!/[0-9.]/.test(ch)) throw new CalcError(`Unexpected character: '${ch}'`);

    let raw = "";
    while (/[0-9.]/.test(this.peek())) raw += this.consume();
    const num = Number(raw);
    if (isNaN(num)) throw new CalcError(`Invalid number: '${raw}'`);
    return num;
  }

  parseParen(): number {
    this.consume();
    const val = this.parseExpr();
    if (this.peek() !== ")") throw new CalcError("Missing closing parenthesis");
    this.consume();
    return val;
  }

  parseFactor(): number {
    const ch = this.peek();
    if (ch === "-") {
      this.consume();
      return -this.parseFactor();
    }
    if (ch === "+") {
      this.consume();
      return this.parseFactor();
    }
    return this.parseNumber();
  }

  parseTerm(): number {
    let val = this.parseFactor();
    while (true) {
      const op = this.peek();
      if (op === "*") {
        this.consume();
        val *= this.parseFactor();
      } else if (op === "/") {
        this.consume();
        const divisor = this.parseFactor();
        if (divisor === 0) throw new CalcError("Division by zero");
        val /= divisor;
      } else {
        break;
      }
    }
    return val;
  }

  parseExpr(): number {
    let val = this.parseTerm();
    while (true) {
      const op = this.peek();
      if (op === "+") {
        this.consume();
        val += this.parseTerm();
      } else if (op === "-") {
        this.consume();
        val -= this.parseTerm();
      } else {
        break;
      }
    }
    return val;
  }

  parseAll(): number {
    const result = this.parseExpr();
    const remaining = this.peek();
    if (remaining !== "\0")
      throw new CalcError(`Unexpected character after expression: '${remaining}'`);
    return result;
  }
}

export function calc(expression: string): number {
  const trimmed = expression.trim();
  if (!trimmed) throw new CalcError("Empty expression");
  const lexer = new Lexer(trimmed);
  return lexer.parseAll();
}
