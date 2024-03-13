import { BlockType } from '../blocks/BlockType';

import { Block } from './Block';
import { CodeBlock } from './CodeBlock';
import { WhitespaceBlock } from './WhitespaceBlock';
import { TextBlock } from './TextBlock';
import { ImageBlock } from './ImageBlock';
import { OrderedListBlock } from './OrderedListBlock';
import { UnorderedListBlock } from './UnorderedListBlock';

export class BlockFactory {
  public static createBlock(
    consecutiveEntry: number[],
    type: BlockType,
    lines: string[]
  ): Block {
    let subSection = this.determineSubSection(consecutiveEntry, lines);

    switch (type) {
      case BlockType.CODE:
        return new CodeBlock(subSection);
      case BlockType.TEXT:
        return new TextBlock(subSection);
      case BlockType.WHITESPACE:
        return new WhitespaceBlock(subSection);
      case BlockType.IMAGE:
        return new ImageBlock(subSection);
      case BlockType.ORDERED_LIST:
        return new OrderedListBlock(subSection);
      case BlockType.UNORDERED_LIST:
        return new UnorderedListBlock(subSection);
      default:
        return new WhitespaceBlock(subSection);
    }
  }

  private static determineSubSection(
    consecutiveEntry: number[],
    lines: string[]
  ): string[] {
    let indices = consecutiveEntry[1];
    let startIndex = consecutiveEntry[0];
    let endIndex = consecutiveEntry[consecutiveEntry.length - 1];
    let subSection: string[] = [];
    if (consecutiveEntry.length == 1) {
      subSection = [lines[startIndex]];
    } else {
      subSection = lines.slice(startIndex, endIndex + 1);
    }
    return subSection;
  }
}
