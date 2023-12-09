import SuperExpresive from 'super-expressive';
import { BlockType } from './blocks/BlockType';
import { Block } from './blocks/Block';
import { Injectable } from '@angular/core';
import { BlockFactory } from './blocks/BlockFactory';

@Injectable({
  providedIn: 'root',
})
export class Parser {
  currentTypeFlag: BlockType = BlockType.TEXT;

  public parse(content: string): string {
    var result: string = '';
    this.currentTypeFlag = BlockType.TEXT;
    content = this.unescapeString(content);
    var lines = content.split(content.includes('\r\n') ? '\r\n' : '\n');
    var reversed = this.reverseDictionary(this.mapTextTypesWithIndices(lines));
    let blocks = this.createBlocks(lines, reversed);
    let blockCount = 0;
    for (let block of blocks) {
      if (block.type === BlockType.CODE) {
        result += block.build(blockCount).join('\n');
        blockCount++;
      } else {
        result += block.build().join('\n');
      }
    }
    return result;
  }

  //TODO: Move this to a separate class
  public unescapeString(str: string): string {
    var result = decodeURI(str)
      .replace(/\\\\/g, '\\') // Unescape backslashes
      .replace(/\\n/g, '\n') // Unescape newlines
      .replace(/\\r/g, '\r') // Unescape carriage returns
      .replace(/\\t/g, '\t'); // Unescape tabs

    return result;
  }

  public determineLineType(line: string): BlockType {
    var matchForOrderedList = line.match('\\d(?=\\.)');

    if (line.startsWith('<code>')) {
      this.currentTypeFlag = BlockType.CODE;
      return BlockType.CODE;
    }
    if (line.startsWith('</code>')) {
      this.currentTypeFlag = BlockType.TEXT;
      return BlockType.CODE;
    }
    if (this.currentTypeFlag === BlockType.CODE) {
      return BlockType.CODE;
    }
    if ((line.length == 1 && line == ' ') || line.length == 0) {
      return BlockType.WHITESPACE;
    }
    if (line.startsWith('<3Image3>')) {
      return BlockType.IMAGE;
    }
    if (line.startsWith('-')) {
      return BlockType.UNORDERED_LIST;
    }
    if (matchForOrderedList != null) {
      return BlockType.ORDERED_LIST;
    }
    return BlockType.TEXT;
  }

  public mapTextTypesWithIndices(lines: string[]): Map<number, BlockType> {
    let types = new Map<number, BlockType>();
    for (let index = 0; index < lines.length; index++) {
      const element = lines[index];
      let type = this.determineLineType(element);
      types.set(index, type);
    }
    return types;
  }

  private reverseDictionary(
    dictionary: Map<number, BlockType>
  ): Map<BlockType, Array<number>> {
    let types = new Map<BlockType, Array<number>>();
    if (dictionary == null) return types;
    if (dictionary.values().next() == null) return types;
    let distinctValues = new Array<BlockType>();
    for (let value of dictionary.values()) {
      if (!distinctValues.includes(value)) {
        distinctValues.push(value);
      }
    }

    for (let value of distinctValues) {
      let keys = new Array<number>();
      for (let entry of dictionary.entries()) {
        if (entry[1] === value) {
          keys.push(entry[0]);
        }
      }
      types.set(value, keys);
    }

    return types;
  }

  private createBlocks(
    lines: string[],
    reversed: Map<BlockType, Array<number>>
  ): Array<Block> {
    let blocks = new Array<Block>();
    for (let entry of reversed) {
      switch (entry[0]) {
        case BlockType.CODE: {
          let consecutive = this.groupConsecutiveValues(entry[1]);
          for (let consecutiveEntry of consecutive) {
            blocks.push(
              BlockFactory.createBlock(consecutiveEntry, BlockType.CODE, lines)
            );
          }
          break;
        }
        case BlockType.TEXT: {
          let consecutive = this.groupConsecutiveValues(entry[1]);
          for (let consecutiveEntry of consecutive) {
            blocks.push(
              BlockFactory.createBlock(consecutiveEntry, BlockType.TEXT, lines)
            );
          }
          break;
        }
        case BlockType.WHITESPACE: {
          let consecutive = this.groupConsecutiveValues(entry[1]);
          for (let consecutiveEntry of consecutive) {
            blocks.push(
              BlockFactory.createBlock(
                consecutiveEntry,
                BlockType.WHITESPACE,
                lines
              )
            );
          }
          break;
        }
        case BlockType.IMAGE: {
          let consecutive = this.groupConsecutiveValues(entry[1]);
          for (let consecutiveEntry of consecutive) {
            blocks.push(
              BlockFactory.createBlock(consecutiveEntry, BlockType.IMAGE, lines)
            );
          }
          break;
        }
        case BlockType.ORDERED_LIST: {
          let consecutive = this.groupConsecutiveValues(entry[1]);
          for (let consecutiveEntry of consecutive) {
            blocks.push(
              BlockFactory.createBlock(
                consecutiveEntry,
                BlockType.ORDERED_LIST,
                lines
              )
            );
          }
          break;
        }
        case BlockType.UNORDERED_LIST: {
          let consecutive = this.groupConsecutiveValues(entry[1]);
          for (let consecutiveEntry of consecutive) {
            blocks.push(
              BlockFactory.createBlock(
                consecutiveEntry,
                BlockType.UNORDERED_LIST,
                lines
              )
            );
          }
          break;
        }

        default:
          break;
      }
    }
    return blocks;
  }

  public groupConsecutiveValues(
    indices: Array<number>
  ): Map<number, Array<number>> {
    let result = new Map<number, Array<number>>();
    let values = new Array<number>();
    let last: number = 0;
    let j: number = 1;

    for (let i = 0; i < indices.length; i++) {
      let currentValue = indices[i];
      if (i === 0) {
        values.push(currentValue);
        last = currentValue;
        if (i === indices.length - 1) {
          this.sortAndAddToDictionary(values, result, j);
        }
        continue;
      }
      if (currentValue === last + 1) {
        values.push(currentValue);
        if (i === indices.length - 1) {
          this.sortAndAddToDictionary(values, result, j);
        }
      } else {
        //A new group has started

        //Add the previous group to the dictionary
        this.sortAndAddToDictionary(values, result, j);

        //Reset the values array
        j++;
        values = new Array<number>();

        //Add the current value to the new group
        values.push(currentValue);

        if (i === indices.length - 1) {
          this.sortAndAddToDictionary(values, result, j);
        }
      }
      last = currentValue;
    }
    return result;
  }

  //TODO: Move this to a separate class
  private sortAndAddToDictionary(
    values: Array<number>,
    result: Map<number, Array<number>>,
    j: number
  ) {
    values.sort((a, b) => a - b);
    result.set(j, values);
  }
}
