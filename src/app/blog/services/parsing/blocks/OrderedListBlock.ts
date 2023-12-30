import { Block } from './Block';
import { BlockType } from '../blocks/BlockType';


export class OrderedListBlock extends Block {
  constructor(lines: string[]) {
    super(lines, BlockType.ORDERED_LIST);
  }

  public override build(blockCount?: number | undefined): string[] {
    let result = new Array<string>();
    result.push('<ol>');
    for (let i = 0; i < this.lines.length; i++) {
      let element = this.lines[i];
      const regEx = RegExp('^[0-9. ]+');
      result.push('<li>' + element.replace(regEx, '') + '</li>');
    }
    result.push('</ol>');
    return result;
  }
}
