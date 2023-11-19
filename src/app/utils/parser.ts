import SuperExpresive from 'super-expressive';
import { TEXTTYPE } from './TEXTTYPE';
import { Block } from './Block';
import { CodeBlock } from './CodeBlock';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Parser {
  public orderedList: RegExp = SuperExpresive()
    .allowMultipleMatches.lineByLine.startOfInput.anyOf.digit.char('.')
    .end()
    .toRegex();

  public unescapeString(str: string): string {
    var result = decodeURI(str)
      .replace(/\\\\/g, '\\') // Unescape backslashes
      .replace(/\\n/g, '\n') // Unescape newlines
      .replace(/\\r/g, '\r') // Unescape carriage returns
      .replace(/\\t/g, '\t'); // Unescape tabs

    return result;
    // ... add more as needed
  }
  public determineLineType(line: string, currentTypeFlag: TEXTTYPE): TEXTTYPE {
    if (line.startsWith('<code>')) {
      currentTypeFlag = TEXTTYPE.CODE;
      return TEXTTYPE.CODE;
    }
    if (line.startsWith('</code>')) {
      currentTypeFlag = TEXTTYPE.TEXT;
      return TEXTTYPE.CODE;
    }
    if (line.length == 0 && currentTypeFlag != TEXTTYPE.CODE) {
      return TEXTTYPE.WHITESPACE;
    }
    if (currentTypeFlag == TEXTTYPE.CODE) {
      return TEXTTYPE.CODE;
    }
    if (line.startsWith('<3Image3>')) {
      return TEXTTYPE.IMAGE;
    }
    if (line.startsWith('-')) {
      return TEXTTYPE.UNORDERED_LIST;
    }
    if (this.orderedList.exec(line)?.length != 0) {
      return TEXTTYPE.ORDERED_LIST;
    }
    return TEXTTYPE.TEXT;
  }

  private mapTextTypesWithIndices(lines: string[]): Map<number, TEXTTYPE> {
    let types = new Map<number, TEXTTYPE>();
    let currentTypeFlag = TEXTTYPE.TEXT;
    for (let index = 0; index < lines.length; index++) {
      const element = lines[index];
      let type = this.determineLineType(element, currentTypeFlag);
      types.set(index, type);
    }
    return types;
  }

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
      if (entry[0] === TEXTTYPE.CODE) {
        let consecutive = this.groupConsecutiveValues(entry[1]);
        for (let consecutiveEntry of consecutive) {
          let numbers = consecutiveEntry[1];
          var subSection = lines.slice(numbers[0], numbers[numbers.length]);
          let block = new CodeBlock(
            numbers[0],
            numbers[numbers.length],
            subSection
          );
          blocks.push(block);
        }
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
        continue;
      }
      if (currentValue === last + 1) {
        values.push(currentValue);
        if (i === indices.length - 1) {
          this.sortAndAddToDictionary(values, result, j);
        }
      } else {
        this.sortAndAddToDictionary(values, result, j);
        j++;
        values = new Array<number>();
        values.push(currentValue);
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
    values.sort();
    result.set(j, values);
  }
}
