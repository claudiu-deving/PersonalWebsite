import { TestBed } from '@angular/core/testing';
import { Parser } from './parser';
import { TEXTTYPE } from '../TEXTTYPE';
import { RegexHelper } from '../RegexHelper';

describe('Parser', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser();
  });

  it('return the unescaped string', () => {
    expect(parser.unescapeString('\\n')).toEqual('\n');
  });

  // Add more tests as necessary

  it('should unescape backslashes', () => {
    expect(parser.unescapeString('\\\\')).toEqual('\\');
  });

  it('should unescape newlines', () => {
    expect(parser.unescapeString('\\n')).toEqual('\n');
  });

  it('should unescape carriage returns', () => {
    expect(parser.unescapeString('\\r')).toEqual('\r');
  });

  it('should unescape tabs', () => {
    expect(parser.unescapeString('\\t')).toEqual('\t');
  });

  it('should not modify strings without escape sequences', () => {
    expect(parser.unescapeString('hello world')).toEqual('hello world');
  });

  it('should determine it is a code line', () => {
    expect(parser.determineLineType('<code>')).toEqual(TEXTTYPE.CODE);
  });

  it('should determine it is a code line when already flagged as code', () => {
    parser.currentTypeFlag = TEXTTYPE.CODE;
    expect(parser.determineLineType('test')).toEqual(TEXTTYPE.CODE);
  });

  it('should determine it is a code line when already flagged as code and is end of code block', () => {
    expect(parser.determineLineType('</code>')).toEqual(TEXTTYPE.CODE);
  });

  it('should determine it is whitespace', () => {
    expect(parser.determineLineType('')).toEqual(TEXTTYPE.WHITESPACE);
  });

  it('should determine it is Image', () => {
    expect(parser.determineLineType('<3Image3>')).toEqual(TEXTTYPE.IMAGE);
  });

  it('should determine it is unordered list', () => {
    expect(parser.determineLineType('-')).toEqual(TEXTTYPE.UNORDERED_LIST);
  });

  it('should determine it is ordered list', () => {
    expect(parser.determineLineType('1. sada')).toEqual(TEXTTYPE.ORDERED_LIST);
  });

  it('should return consecutive values', () => {
    let numbers = [1, 2, 3, 4, 7, 8, 11, 12, 13, 14, 15, 20, 21, 22, 25, 26];

    let result = parser.groupConsecutiveValues(numbers);

    expect(result.get(1)).toEqual([1, 2, 3, 4]);
    expect(result.get(2)).toEqual([7, 8]);
    expect(result.get(3)).toEqual([11, 12, 13, 14, 15]);
    expect(result.get(4)).toEqual([20, 21, 22]);
    expect(result.get(5)).toEqual([25, 26]);
  });

  it('should map correctly each index with the type', () => {
    let lines = [
      '<code>',
      'test',
      '</code>',
      'test',
      'test',
      '',
      ' ',
      '<3Image3>',
      '<code>',
      '<3Image3>',
      '</code>',
    ];
    let expected = new Map<number, TEXTTYPE>();
    expected.set(0, TEXTTYPE.CODE);
    expected.set(1, TEXTTYPE.CODE);
    expected.set(2, TEXTTYPE.CODE);
    expected.set(3, TEXTTYPE.TEXT);
    expected.set(4, TEXTTYPE.TEXT);
    expected.set(5, TEXTTYPE.WHITESPACE);
    expected.set(6, TEXTTYPE.WHITESPACE);
    expected.set(7, TEXTTYPE.IMAGE);
    expected.set(8, TEXTTYPE.CODE);
    expected.set(9, TEXTTYPE.CODE);
    expected.set(10, TEXTTYPE.CODE);

    let result = parser.mapTextTypesWithIndices(lines);

    expect(result).toEqual(expected);
  });

  it('should map correctly each index with the type 2', () => {
    let lines = ['-', '1. sada', '2. test', '-3. '];
    let expected = new Map<number, TEXTTYPE>();
    expected.set(0, TEXTTYPE.UNORDERED_LIST);
    expected.set(1, TEXTTYPE.ORDERED_LIST);
    expected.set(2, TEXTTYPE.ORDERED_LIST);
    expected.set(3, TEXTTYPE.UNORDERED_LIST);

    let result = parser.mapTextTypesWithIndices(lines);

    expect(result).toEqual(expected);
  });
});
