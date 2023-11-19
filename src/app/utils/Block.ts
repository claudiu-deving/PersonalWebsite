import { TEXTTYPE } from './TEXTTYPE';

export abstract class Block {
  public startIndex: number;
  public endIndex: number;
  public lines: string[];
  public type: TEXTTYPE;
  constructor(
    startIndex: number,
    endIndex: number,
    lines: string[],
    type: TEXTTYPE
  ) {
    this.type = type;
    this.startIndex = startIndex;
    this.endIndex = endIndex;
    this.lines = lines;
  }
  public abstract build(blockCount?: number): string[];
}
