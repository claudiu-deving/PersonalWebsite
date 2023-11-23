import { TEXTTYPE } from './TEXTTYPE';
import { Block } from './Block';
import { CodeBlock } from './CodeBlock';
import { TextBlock } from './TextBlock';

export class BlockFactory {
  public static createBlock(
    consecutiveEntry: [number, number[]],
    type: TEXTTYPE,
    lines: string[]
  ): Block {
    let subSection = this.determineSubSection(consecutiveEntry, lines);

    switch (type) {
      case TEXTTYPE.CODE:
        return new CodeBlock(subSection);
      case TEXTTYPE.TEXT:
        return new TextBlock(subSection);
      default:
        return new TextBlock(subSection);
    }
  }

  private static determineSubSection(
    consecutiveEntry: [number, number[]],
    lines: string[]
  ): string[] {
    let indices = consecutiveEntry[1];
    let startIndex = indices[0];
    let endIndex = indices[indices.length - 1];
    let subSection: string[] = [];
    if (indices.length == 1) {
      subSection = [lines[startIndex]];
    } else {
      subSection = lines.slice(startIndex, endIndex + 1);
    }
    return subSection;
  }
}
