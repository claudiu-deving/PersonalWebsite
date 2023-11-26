import SuperExpresive from 'super-expressive';
import { TEXTTYPE } from '../TEXTTYPE';
import { Block } from '../Block';
import { Injectable } from '@angular/core';
import { BlockFactory } from '../BlockFactory';

@Injectable({
  providedIn: 'root',
})
export class Parser {
  currentTypeFlag: TEXTTYPE = TEXTTYPE.TEXT;

  public parse(content: string): string {
    var result: string = '';
    content = this.unescapeString(content);
    var lines = content.split(content.includes('\r\n') ? '\r\n' : '\n');
    var reversed = this.reverseDictionary(this.mapTextTypesWithIndices(lines));
    let blocks = this.createBlocks(lines, reversed);
    let blockCount = 0;
    for (let block of blocks) {
      if (block.type === TEXTTYPE.CODE) {
        result += block.build(blockCount).join('\n');
        blockCount++;
      } else {
        result += block.build().join('\n');
      }
    }
    return result;
  }

  public unescapeString(str: string): string {
    var result = decodeURI(str)
      .replace(/\\\\/g, '\\') // Unescape backslashes
      .replace(/\\n/g, '\n') // Unescape newlines
      .replace(/\\r/g, '\r') // Unescape carriage returns
      .replace(/\\t/g, '\t'); // Unescape tabs

    return result;
    // ... add more as needed
  }

  public determineLineType(line: string): TEXTTYPE {
    var matchForOrderedList = line.match('\\d(?=\\.)');

    if (line.startsWith('<code>')) {
      this.currentTypeFlag = TEXTTYPE.CODE;
      return TEXTTYPE.CODE;
    }
    if (line.startsWith('</code>')) {
      this.currentTypeFlag = TEXTTYPE.TEXT;
      return TEXTTYPE.CODE;
    }
    if (this.currentTypeFlag === TEXTTYPE.CODE) {
      return TEXTTYPE.CODE;
    }
    if ((line.length == 1 && line == ' ') || line.length == 0) {
      return TEXTTYPE.WHITESPACE;
    }
    if (line.startsWith('<3Image3>')) {
      return TEXTTYPE.IMAGE;
    }
    if (line.startsWith('-')) {
      return TEXTTYPE.UNORDERED_LIST;
    }
    if (matchForOrderedList != null) {
      return TEXTTYPE.ORDERED_LIST;
    }
    return TEXTTYPE.TEXT;
  }

  public mapTextTypesWithIndices(lines: string[]): Map<number, TEXTTYPE> {
    let types = new Map<number, TEXTTYPE>();
    for (let index = 0; index < lines.length; index++) {
      const element = lines[index];
      let type = this.determineLineType(element);
      types.set(index, type);
    }
    return types;
  }

  private reverseDictionary(
    dictionary: Map<number, TEXTTYPE>
  ): Map<TEXTTYPE, Array<number>> {
    let types = new Map<TEXTTYPE, Array<number>>();
    if (dictionary == null) return types;
    if (dictionary.values().next() == null) return types;
    let distinctValues = new Array<TEXTTYPE>();
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
    reversed: Map<TEXTTYPE, Array<number>>
  ): Array<Block> {
    let blocks = new Array<Block>();
    for (let entry of reversed) {
      switch (entry[0]) {
        case TEXTTYPE.CODE: {
          let consecutive = this.groupConsecutiveValues(entry[1]);
          for (let consecutiveEntry of consecutive) {
            blocks.push(
              BlockFactory.createBlock(consecutiveEntry, TEXTTYPE.CODE, lines)
            );
          }
          break;
        }
        case TEXTTYPE.TEXT: {
          let consecutive = this.groupConsecutiveValues(entry[1]);
          for (let consecutiveEntry of consecutive) {
            blocks.push(
              BlockFactory.createBlock(consecutiveEntry, TEXTTYPE.TEXT, lines)
            );
          }
          break;
        }
        case TEXTTYPE.WHITESPACE: {
          let consecutive = this.groupConsecutiveValues(entry[1]);
          for (let consecutiveEntry of consecutive) {
            blocks.push(
              BlockFactory.createBlock(
                consecutiveEntry,
                TEXTTYPE.WHITESPACE,
                lines
              )
            );
          }
          break;
        }
        case TEXTTYPE.IMAGE: {
          let consecutive = this.groupConsecutiveValues(entry[1]);
          for (let consecutiveEntry of consecutive) {
            blocks.push(
              BlockFactory.createBlock(consecutiveEntry, TEXTTYPE.IMAGE, lines)
            );
          }
          break;
        }
        case TEXTTYPE.ORDERED_LIST: {
          let consecutive = this.groupConsecutiveValues(entry[1]);
          for (let consecutiveEntry of consecutive) {
            blocks.push(
              BlockFactory.createBlock(
                consecutiveEntry,
                TEXTTYPE.ORDERED_LIST,
                lines
              )
            );
          }
          break;
        }
        case TEXTTYPE.UNORDERED_LIST: {
          let consecutive = this.groupConsecutiveValues(entry[1]);
          for (let consecutiveEntry of consecutive) {
            blocks.push(
              BlockFactory.createBlock(
                consecutiveEntry,
                TEXTTYPE.UNORDERED_LIST,
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
  private sortAndAddToDictionary(
    values: Array<number>,
    result: Map<number, Array<number>>,
    j: number
  ) {
    values.sort((a, b) => a - b);
    result.set(j, values);
  }
}
