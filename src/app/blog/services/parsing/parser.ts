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
    // console.log(JSON.stringify(content));
    var lines = content.split(content.includes('\r\n') ? '\r\n' : '\n');

    var mapped = this.mapTextTypesWithIndices(lines);

    //Form as: Map<BlockType, indices> e.g. <TEXTBLOCK,[0,1,3,5,6,8]
    var reversed = this.reverseDictionary(mapped);

    let blocks = this.createBlocks(lines, reversed, mapped);
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

  /** 
  * Maps the lines of the text with the type of block that they represent
  * @param lines The lines of the text
  * @returns A map with the index of the line as the key and the type of block as the value
  */
  public mapTextTypesWithIndices(lines: string[]): Map<number, BlockType> {
    let types = new Map<number, BlockType>();
    for (let index = 0; index < lines.length; index++) {
      const element = lines[index];
      let type = this.determineLineType(element);
      types.set(index, type);
    }
    return types;

  }

  /**
  * Reverses the dictionary so that the type of block is the key and the indices are the values
  * @param dictionary The dictionary to reverse
  * @returns A map with the type of block as the key and the indices as the values
  */
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

  /**
   * Creates the blocks from the lines of the text
   * @param lines The lines of the text
   * @param reversed The map with the type of block as the key and the indices as the values of form:
   * <TEXTBLOCK,[0,1,2,3,5,6], CODEBLOCK,[4,7,8,9]>
   * @returns An array of blocks
  */
  private createBlocks(
    lines: string[], reversed: Map<BlockType, Array<number>>, mapped: Map<number, BlockType>): Array<Block> {
    let blocks = new Array<Block>();

    let ordered = this.orderBlocks(reversed, mapped);

    for (let entry of ordered) {
      let type = entry[0];
      let indices = entry[1];
      switch (type) {
        case BlockType.CODE: {
          blocks.push(
            BlockFactory.createBlock(
              indices,
              BlockType.CODE,
              lines));
        }
          break;

        case BlockType.TEXT: {
          blocks.push(
            BlockFactory.createBlock(
              indices,
              BlockType.TEXT,
              lines)
          );
          break;
        }
        case BlockType.WHITESPACE: {
          for (let index of indices) {
            blocks.push(
              BlockFactory.createBlock(
                [index],
                BlockType.WHITESPACE,
                lines)
            );
          }
          break;
        }
        case BlockType.IMAGE: {
          blocks.push(
            BlockFactory.createBlock(
              indices,
              BlockType.IMAGE,
              lines)
          );
          break;
        }
        case BlockType.ORDERED_LIST: {
          blocks.push(
            BlockFactory.createBlock(
              indices,
              BlockType.ORDERED_LIST,
              lines
            )
          );
          break;
        }
        case BlockType.UNORDERED_LIST: {
          blocks.push(
            BlockFactory.createBlock(
              indices,
              BlockType.UNORDERED_LIST,
              lines
            )
          );
          break;
        }

        default:
          break;
      }
    }
    return blocks;
  }

  /**
   * Orders the blocks in the correct order while still maintaining reference to its type
   * From: <TEXTBLOCK,[0,1,2,3,5,6], CODEBLOCK,[4,7,8,9]>
   * To: [[[TEXTBLOCK,[0,1,2,3]], [CODEBLOCK,[4]], [TEXTBLOCK,[5,6]], [CODEBLOCK,[7,8,9]]]
   */
  orderBlocks(reversed: Map<BlockType, number[]>, mapped: Map<number, BlockType>) {

    let keys = Array.from(mapped.keys());
    let ordered = keys.sort((a, b) => a - b);
    let result = new Array<[BlockType, number[]]>();
    let lastType = undefined as BlockType | undefined;
    let innerIndices = new Array<number>();
    for (let key of ordered) {
      let type = mapped.get(key) as BlockType;

      //First iteration
      if (lastType === undefined) {
        lastType = type;
        innerIndices.push(key);
        continue;
      }

      if (type !== lastType) {
        result.push([lastType, innerIndices]);
        innerIndices = new Array<number>();
      }

      if (key === ordered[ordered.length - 1]) {
        innerIndices.push(key);
        result.push([type, innerIndices]);
        break;
      }
      innerIndices.push(key);
      lastType = type;
    }

    return result;
  }



  /**
   * Groups the consecutive values of an array
   * @param indices The array of indices
   * @returns A map with the group number as the key and the indices as the values
   */
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
