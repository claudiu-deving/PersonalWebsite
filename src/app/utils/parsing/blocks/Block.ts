import { BlockType } from '../blocks/BlockType';

export abstract class Block {
  public lines: string[];
  public type: BlockType;
  constructor(lines: string[], type: BlockType) {
    this.type = type;
    this.lines = lines;
  }
  public abstract build(blockCount?: number): string[];
}
