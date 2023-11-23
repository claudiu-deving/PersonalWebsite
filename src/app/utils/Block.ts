import { TEXTTYPE } from './TEXTTYPE';

export abstract class Block {
  public lines: string[];
  public type: TEXTTYPE;
  constructor(lines: string[], type: TEXTTYPE) {
    this.type = type;
    this.lines = lines;
  }
  public abstract build(blockCount?: number): string[];
}
