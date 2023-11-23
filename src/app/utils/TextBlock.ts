import { Block } from './Block';
import { TEXTTYPE } from './TEXTTYPE';

export class TextBlock extends Block {
  constructor(lines: string[]) {
    super(lines, TEXTTYPE.TEXT);
  }

  public override build(blockCount?: number | undefined): string[] {
    let result = new Array<string>();
    result.push(
      `<div class="paragraph">
      <p>`
    );
    for (let i = 0; i < this.lines.length; i++) {
      const element = this.lines[i];
      result.push(element);
    }
    result.push('</p></div>');
    return result;
  }
}
