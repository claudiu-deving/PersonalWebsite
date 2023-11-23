import { Block } from './Block';
import { CodeBlock } from './CodeBlock';
import { TEXTTYPE } from './TEXTTYPE';
import { TextBlock } from './TextBlock';
import { BlockFactory } from './BlockFactory';

describe('BlockFactory', () => {
  let lines: string[];

  beforeEach(() => {
    lines = [
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
  });

  it('should create a CodeBlock when type is CODE', () => {
    const consecutiveEntry: [number, number[]] = [0, [0, 1, 2]];
    const type = TEXTTYPE.CODE;

    const result: Block = BlockFactory.createBlock(
      consecutiveEntry,
      type,
      lines
    );

    expect(result).toBeInstanceOf(CodeBlock);
    expect(result.lines).toEqual(['<code>', 'test', '</code>']);
  });

  it('should create a TextBlock when type is TEXT', () => {
    const consecutiveEntry: [number, number[]] = [3, [3, 4]];
    const type = TEXTTYPE.TEXT;

    const result: Block = BlockFactory.createBlock(
      consecutiveEntry,
      type,
      lines
    );

    expect(result).toBeInstanceOf(TextBlock);
    expect(result.lines).toEqual(['test', 'test']);
  });

  it('should create a TextBlock by default', () => {
    const consecutiveEntry: [number, number[]] = [5, [5]];
    const type = TEXTTYPE.WHITESPACE;

    const result: Block = BlockFactory.createBlock(
      consecutiveEntry,
      type,
      lines
    );

    expect(result).toBeInstanceOf(TextBlock);
    expect(result.lines).toEqual(['']);
  });
});
