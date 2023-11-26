import { Block } from './Block';
import { TEXTTYPE } from './TEXTTYPE';

export class UnorderedListBlock extends Block {
  constructor(lines: string[]) {
    super(lines, TEXTTYPE.UNORDERED_LIST);
  }

  public override build(blockCount?: number | undefined): string[] {
    let result = new Array<string>();
    result.push('<ul>');
    for (let i = 0; i < this.lines.length; i++) {
      let element = this.lines[i];
      result.push('<li>' + element.replace('- ', '') + '</li>');
    }
    result.push('</ul>');
    return result;
  }
}
