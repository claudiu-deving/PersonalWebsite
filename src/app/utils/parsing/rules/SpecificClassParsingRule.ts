import { Guard } from '../FunctionGuards';
import { Resources } from '../resources/Resources';
import { ParsingRule } from './ParsingRule';
import { RegExpWithKey } from '../resources/RegExpWithKey';

export class SpecificClassParsingRule extends ParsingRule {
  constructor(
    public readonly patternsWithKey: RegExpWithKey[],
    public readonly className: string,
    public readonly guard: Guard,
    public readonly trimmer?: string[]
  ) {
    super();
  }
  public override processLine(line: string): string {
    if (this.guard(line) == false) return line;
    line = this.process(line);

    //line = this.trimIfNecessary(line);
    return line;
  }
  public setReplacement(element: string, className: string): void {
    this.replacement = `${Resources.preSpanPattern.replace(
      '{class}',
      className.replace('<3', '').replace('3>', '')
    )}${element}</span>`;
  }
  private process(line: string): string {
    let key = this.patternsWithKey[0].key;

    let classNameMatches: string[] = [];
    let classNameRegExMatches = line.match(this.patternsWithKey[0].pattern);
    if (classNameRegExMatches == null) return line;
    for (let i = 0; i < classNameRegExMatches.length; i++) {
      if (classNameRegExMatches == null) continue;
      classNameMatches.push(`<3${classNameRegExMatches[i]}3>`);
    }

    if (classNameMatches.length == 0) return line;
    let secondMatches: string[] = [];
    let secondMatch = line.match(this.patternsWithKey[1].pattern);
    if (secondMatch == null) return line;
    for (let i = 0; i < secondMatch.length; i++) {
      secondMatches.push(`${secondMatch[i]}`);
    }
    if (secondMatches.length == 0) return line;
    if (classNameMatches.length != secondMatches.length) return line;

    for (let i = 0; i < classNameMatches.length; i++) {
      const first = classNameMatches[i];
      const second = secondMatch[i];
      let indexedKey = `${key}${i}`;
      line = line.replace(first + second, indexedKey);
      this.setReplacement(second, first);
      this.introduceIntoDictionary(indexedKey);
    }
    return line;
  }
  introduceIntoDictionary(indexedKey: string) {
    this.keysWithReplacers.set(indexedKey, this.replacement!);
  }
}
