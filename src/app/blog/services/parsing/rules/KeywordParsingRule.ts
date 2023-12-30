import { RegexHelper } from '../resources/RegexHelper';
import { SimpleParsingRule } from './SimpleParsingRule';

export class KeywordParsingRule extends SimpleParsingRule {
  public override processLine(line: string): string {
    line = this.findKeywords(line);
    return line;
  }

  private findKeywords(line: string): string {
    let matches = RegexHelper.getMatch(line, this.patternWithKey.pattern);
    if (matches.length == 0) return line;
    for (let i = 0; i < matches.length; i++) {
      const element = matches[i];
      if (this.guard(element) == false) continue;
      let indexedKey = `${this.patternWithKey.key}${i}`;
      line = line.replace(element, indexedKey);
      this.setReplacement(element);
      this.introduceIntoDictionary(indexedKey, element);
    }
    return line;
  }
}
