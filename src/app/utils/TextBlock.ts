import { Block } from './Block';
import { TEXTTYPE } from './TEXTTYPE';

export class TextBlock extends Block {
  constructor(lines: string[]) {
    super(lines, TEXTTYPE.TEXT);
  }

  public override build(_blockCount?: number | undefined): string[] {
    let result = new Array<string>();
    result.push(`<pre><div class="paragraph">`);
    for (let i = 0; i < this.lines.length; i++) {
      const element = this.lines[i];
      result.push('<p>' + element + '</p>');
    }
    result.push('</div></pre>');
    return result;
  }
}
