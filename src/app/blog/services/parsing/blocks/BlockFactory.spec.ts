import { Block } from './Block';
import { CodeBlock } from './CodeBlock';
import { BlockType } from '../blocks/BlockType';
import { TextBlock } from './TextBlock';
import { BlockFactory } from './BlockFactory';
import { WhitespaceBlock } from './WhitespaceBlock';

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
    const consecutiveEntry: number[] = [0, 1, 2];
    const type = BlockType.CODE;

    const result: Block = BlockFactory.createBlock(
      consecutiveEntry,
      type,
      lines
    );

    expect(result).toBeInstanceOf(CodeBlock);
    expect(result.lines).toEqual(['<code>', 'test', '</code>']);
  });

  it('should create a TextBlock when type is TEXT', () => {
    const consecutiveEntry: number[] = [3, 4];
    const type = BlockType.TEXT;

    const result: Block = BlockFactory.createBlock(
      consecutiveEntry,
      type,
      lines
    );

    expect(result).toBeInstanceOf(TextBlock);
    expect(result.lines).toEqual(['test', 'test']);
  });

  it('should create a WhiteSpace by default', () => {
    const consecutiveEntry: number[] = [5];
    const type = BlockType.WHITESPACE;

    const result: Block = BlockFactory.createBlock(
      consecutiveEntry,
      type,
      lines
    );

    expect(result).toBeInstanceOf(WhitespaceBlock);
    expect(result.lines).toEqual(['']);
  });
});
