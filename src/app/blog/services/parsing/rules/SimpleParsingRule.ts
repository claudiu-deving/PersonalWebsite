import { Guard } from '../FunctionGuards';
import { RegexHelper } from '../resources/RegexHelper';
import { Resources } from '../resources/Resources';
import { ParsingRule } from './ParsingRule';
import { RegExpWithKey } from '../resources/RegExpWithKey';

export class SimpleParsingRule extends ParsingRule {
  public override processLine(line: string): string {
    if (this.guard(line) == false) return line;
    line = this.matches(line);

    line = this.trimIfNecessary(line);
    return line;
  }
  constructor(
    public readonly patternWithKey: RegExpWithKey,
    public readonly className: string,
    public readonly guard: Guard,
    public readonly trimmer?: string[],
    public readonly sorround?: string
  ) {
    super();
  }

  public override keysWithReplacers: Map<string, string> = new Map<
    string,
    string
  >();

  private matches(line: string): string {
    let matches = RegexHelper.getMatch(line, this.patternWithKey.pattern);
    if (matches.length == 0) return line;
    for (let i = 0; i < matches.length; i++) {
      const element = matches[i];
      let indexedKey = `${this.patternWithKey.key}${i}`;
      line = line.replace(element, indexedKey);
      this.setReplacement(element);
      this.introduceIntoDictionary(
        indexedKey,
        this.sorroundIfNecessary(element)
      );
    }
    return line;
  }
  private sorroundIfNecessary(line: string): string {
    if (this.sorround == undefined) return line;
    return this.sorround + line + this.sorround;
  }

  public introduceIntoDictionary(indexedKey: string, element: string) {
    this.keysWithReplacers.set(
      indexedKey,
      this.replacement!.replace(Resources.replacementPlaceholder, element) +
        '</span>'
    );
  }

  public setReplacement(element: string): void {
    this.replacement = `${Resources.preSpanPattern.replace(
      '{class}',
      this.className
    )}${this.sorroundIfNecessary(element)}`;
  }

  trimIfNecessary(line: string): string {
    if (this.trimmer == undefined) return line;
    for (let i = 0; i < this.trimmer.length; i++) {
      const element = this.trimmer[i];
      line = line.replace(element, '');
    }
    return line;
  }
}
