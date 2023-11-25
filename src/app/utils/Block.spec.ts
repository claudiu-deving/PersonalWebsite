import { Block } from './Block';
import { CodeBlock } from './CodeBlock';
import { Resources } from './parsing/Resources';
import { TEXTTYPE } from './TEXTTYPE';
import { TestBed } from '@angular/core/testing';

// Add tests for processCodeLine
describe('Code blocks tests', () => {
  let block: CodeBlock;

  beforeEach(() => {
    block = new CodeBlock([
      'public static class Program',
      '{',
      'public static void Main(string[] args)',
      '{',
      'Console.WriteLine("Hello World!");',
      '}',
      '}',
    ]);
  });

  it('should process code line with multiple quoted words', () => {
    Resources.rules = [Resources.quotes];

    const line = 'Some line with ("quoted words" and "another quote"';
    const processedLine = block.processCodeLine(line);
    expect(processedLine).toEqual('Some line with (__qts0 and __qts1');
  });

  it('should process code line with quoted words', () => {
    Resources.rules = [Resources.quotes];

    const line = 'Some line with "quoted words"';
    const processedLine = block.processCodeLine(line);
    let value = block.keysWithReplacers.get('__qts0');
    expect(processedLine).toEqual('Some line with __qts0');
    expect(value).toEqual('<span class="string">"quoted words"</span>');
  });

  it('should not modify code line without quoted words', () => {
    Resources.rules = [Resources.quotes];
    const line = 'Some line without quoted words';
    const processedLine = block.processCodeLine(line);
    expect(block.keysWithReplacers.size).toEqual(0);
    expect(processedLine).toEqual(line);
  });

  it('should find the static class', () => {
    Resources.rules = [Resources.staticClass];

    const line = 'Console.WriteLine;';
    const processedLine = block.processCodeLine(line);
    expect(block.keysWithReplacers.size).toEqual(1);
    expect(processedLine).toEqual('__stc0.WriteLine;');
  });

  it('should find the method', () => {
    Resources.rules = [Resources.staticClass, Resources.method];

    const line = 'Console.WriteLine();';
    const processedLine = block.processCodeLine(line);
    expect(block.keysWithReplacers.size).toEqual(2);
    expect(processedLine).toEqual('__stc0.__mtd0();');
  });

  it('should find the specific class', () => {
    Resources.rules = [Resources.specificClass, Resources.method];

    const line = '<3some3>Console.WriteLine();';
    const processedLine = block.processCodeLine(line);
    expect(block.keysWithReplacers.size).toEqual(2);
    expect(block.keysWithReplacers.get('__spc0')).toEqual(
      '<span class="some">Console</span>'
    );
    expect(processedLine).toEqual('__spc0.__mtd0();');
  });

  /**
   * This is for when there is no specific class for the <3{class}3> tag
   */
  it('should return line intact', () => {
    Resources.rules = [
      Resources.specificClass,
      Resources.method,
      Resources.staticClass,
    ];

    const line = '<3some3>Console.WriteLine()<3some3>;';
    const processedLine = block.processCodeLine(line);
    expect(block.keysWithReplacers.size).toEqual(2);
    expect(block.keysWithReplacers.get('__spc0')).toEqual(undefined);
    expect(processedLine).toEqual('<3some3>__stc0.__mtd0()<3some3>;');
  });

  it('should  find both specified classes', () => {
    Resources.rules = [Resources.specificClass, Resources.method];
    const line = '<3class3>Console.<3method3>WriteLine();';
    const processedLine = block.processCodeLine(line);
    expect(block.keysWithReplacers.size).toEqual(2);
    expect(block.keysWithReplacers.get('__spc0')).toEqual(
      '<span class="class">Console</span>'
    );
    expect(block.keysWithReplacers.get('__spc1')).toEqual(
      '<span class="method">WriteLine</span>'
    );
    expect(processedLine).toEqual('__spc0.__spc1();');
  });

  it('should  find the keyword', () => {
    Resources.rules = [
      Resources.keyword,
      Resources.specificClass,
      Resources.method,
    ];
    const line = '<3class3>Console.<3method3>WriteLine() void;';
    const processedLine = block.processCodeLine(line);
    expect(block.keysWithReplacers.size).toEqual(3);
    expect(block.keysWithReplacers.get('__spc0')).toEqual(
      '<span class="class">Console</span>'
    );
    expect(block.keysWithReplacers.get('__spc1')).toEqual(
      '<span class="method">WriteLine</span>'
    );

    expect(processedLine).toEqual('__spc0.__spc1() __kwd4;');
  });

  it('should  correctly parse the content', () => {
    const line = 'public static void Main(string <3variable3>args[])';
    const processedLine = block.processCodeLine(line);
    expect(block.keysWithReplacers.size).toEqual(10);

    expect(block.keysWithReplacers.get('__kwd0')).toEqual(
      '<span class="keyword">public</span>'
    );
    expect(block.keysWithReplacers.get('__kwd1')).toEqual(
      '<span class="keyword">static</span>'
    );
    expect(block.keysWithReplacers.get('__kwd2')).toEqual(
      '<span class="keyword">void</span>'
    );
    expect(block.keysWithReplacers.get('__kwd4')).toEqual(
      '<span class="keyword">string</span>'
    );
    expect(block.keysWithReplacers.get('__mtd0')).toEqual(
      '<span class="method">Main</span>'
    );
    expect(block.keysWithReplacers.get('__spc0')).toEqual(
      '<span class="variable">args</span>'
    );
    expect(processedLine).toEqual(
      '__kwd0 __kwd1 __kwd2 __mtd0__brk0__kwd4 __spc0__brk1__brk2__brk3'
    );
  });

  it('should corectly build the block', () => {
    let blockCount = 0;
    const builtBlock = block.build(blockCount);
    expect(builtBlock.length).toEqual(9);
  });
});
