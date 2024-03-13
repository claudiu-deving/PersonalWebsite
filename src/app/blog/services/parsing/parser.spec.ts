import { TestBed } from '@angular/core/testing';
import { Parser } from './parser';
import { BlockType } from './blocks/BlockType';

describe('Parser', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser();
  });

  it('return the unescaped string', () => {
    expect(parser.unescapeString('\\n')).toEqual('\n');
  });


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
    expect(parser.determineLineType('<code>')).toEqual(BlockType.CODE);
  });

  it('should determine it is a code line when already flagged as code', () => {
    parser.currentTypeFlag = BlockType.CODE;
    expect(parser.determineLineType('test')).toEqual(BlockType.CODE);
  });

  it('should determine it is a code line when already flagged as code and is end of code block', () => {
    expect(parser.determineLineType('</code>')).toEqual(BlockType.CODE);
  });

  it('should determine it is whitespace', () => {
    expect(parser.determineLineType('')).toEqual(BlockType.WHITESPACE);
  });

  it('should determine it is Image', () => {
    expect(parser.determineLineType('<3Image3>')).toEqual(BlockType.IMAGE);
  });

  it('should determine it is unordered list', () => {
    expect(parser.determineLineType('-')).toEqual(BlockType.UNORDERED_LIST);
  });

  it('should determine it is ordered list', () => {
    expect(parser.determineLineType('1. sada')).toEqual(BlockType.ORDERED_LIST);
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
    let expected = new Map<number, BlockType>();
    expected.set(0, BlockType.CODE);
    expected.set(1, BlockType.CODE);
    expected.set(2, BlockType.CODE);
    expected.set(3, BlockType.TEXT);
    expected.set(4, BlockType.TEXT);
    expected.set(5, BlockType.WHITESPACE);
    expected.set(6, BlockType.WHITESPACE);
    expected.set(7, BlockType.IMAGE);
    expected.set(8, BlockType.CODE);
    expected.set(9, BlockType.CODE);
    expected.set(10, BlockType.CODE);

    let result = parser.mapTextTypesWithIndices(lines);

    expect(result).toEqual(expected);
  });

  it('should map correctly each index with the type 2', () => {
    let lines = ['-', '1. sada', '2. test', '-3. '];
    let expected = new Map<number, BlockType>();
    expected.set(0, BlockType.UNORDERED_LIST);
    expected.set(1, BlockType.ORDERED_LIST);
    expected.set(2, BlockType.ORDERED_LIST);
    expected.set(3, BlockType.UNORDERED_LIST);

    let result = parser.mapTextTypesWithIndices(lines);

    expect(result).toEqual(expected);
  });

  it('should corectly parse the content', () => {
    let content =
      '\n\n\n<code>\n\nusing System; \n\nnamespace ParsingTestApplication\n{\n    public class Program\n    {\n        // Main method - entry point of the application\n        static void Main(string[] args)\n        {\n            Console.WriteLine("Testing various C# syntax elements...");\n\n            // Variable declarations\n            int number = 10;\n            string text = "Hello World";\n\n            // Conditional statement\n            if(number>5)\n            {\n                Console.WriteLine("Number is greater than 5.");\n            }\n            else\n            {\n                Console.WriteLine("Number is less than or equal to 5.");\n            }\n\n            // Loop example\n            for(int i = 0; i<number; i++)\n            {\n                Console.WriteLine($"Loop iteration: {i}");\n            }\n\n            // Method call\n            PrintMessage(text);\n\n            // Exception handling\n            try\n            {\n                int zero = 0;\n                int result = 10/zero;\n            }\n            catch(DivideByZeroException ex)\n            {\n                Console.WriteLine($"Exception caught: {ex.Message}");\n            }\n\n            // Working with a custom class\n            MyClass myClass = new MyClass();\n            myClass.DisplayMessage();\n        }\n\n        // Method declaration\n        static void PrintMessage(string message)\n        {\n            Console.WriteLine($"Message: {message}");\n        }\n    }\n\n    // Class declaration\n    class MyClass\n    {\n        public void DisplayMessage()\n        {\n            Console.WriteLine("Message from MyClass.");\n        }\n    }\n}\n\n</code>';

    let result = parser.parse(content);
    var first = 549804;
    var second = stringToBytes(result);
    expect(first).toEqual(second);
  });


  it('should corectly parse the content2', () => {
    let content =
      '### A state of the art simple To Do app\n\n\nSince I started learning to code, everywhere I see the same ideas of how to learn and what type of projects to make in order to showcase the things I know.\nThe issue is that I find it hard to do so, to just start smashing at the keyboard for the sake of it, I need something more, I need a challenge.\nWhile watching Zoran Horvat (www.youtube.com/@zoran-horvat) talking about domain modeling in Domain Driven Design I had the idea to listen to the advice given by everyone and write a simple To Do app but I wanted to try a different approach, even though, most likely it will be an overkill.\nSo, I will try to come up with the best possible design for a To Do app where I take a principle to the extremes of what C# is capable of and that is:\n\n\n                              *_\"Make illegal states unrepresentable\" - Yaron Minsky_*\n\n\nFirst, in this entry I will define the business requirements so that It is clear what my intentions are, in the next I will discuss the start of the modeling of the domain layer.\n\n- The user should be able to add, update, read and delete tasks from a list of tasks;\n- The user should be able to see their tasks from either a WPF desktop application or from a webpage, with the possibility of adding a mobile solution later;\n- The storage for the WPF solution will be ONLY local with the possibility of sending the info to a remote storage solution;\n';
    let content2 = '\n\n\n\n';
    let result = parser.parse(content2);
    var first = 549804;
    var second = stringToBytes(result);
    expect(first).toEqual(second);
  });
});
function stringToBytes(str: any) {
  var bytes = [];
  let total = 0;
  for (var i = 0; i < str.length; i++) {
    var charCode = str.charCodeAt(i);
    total += charCode;
    bytes.push(charCode);
  }
  return total;
}
function bytesToConcatenatedString(bytes: any) {
  return bytes.join('');
}
