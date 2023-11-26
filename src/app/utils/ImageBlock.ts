import { Block } from './Block';
import { TEXTTYPE } from './TEXTTYPE';

export class ImageBlock extends Block {
  constructor(lines: string[]) {
    super(lines, TEXTTYPE.IMAGE);
  }
  public override build(blockCount?: number | undefined): string[] {
    let result = new Array<string>();
    result.push('<div class="image">');
    const regEx = RegExp('(?<=<3Image3>\\().+(?=\\))');
    let match = regEx.exec(this.lines[0]);
    result.push(`<img src="${match}" alt="image" />`);
    result.push('</div>');
    return result;
  }
}
