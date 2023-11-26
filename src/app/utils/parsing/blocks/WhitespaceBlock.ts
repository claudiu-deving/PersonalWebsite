import { BlockType } from '../blocks/BlockType';
import { Block } from './Block';

export class WhitespaceBlock extends Block {
  constructor(lines: string[]) {
    super(lines, BlockType.WHITESPACE);
  }

  public override build(blockCount: number): string[] {
    return ['<p></p>'];
  }
}
