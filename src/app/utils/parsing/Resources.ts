import { FunctionGuards } from './FunctionGuards';
import {
  ParsingRule,
  RegExpWithKey,
  SimpleParsingRule,
  KeywordParsingRule,
} from './ParsingRule';
import { SpecificClassParsingRule } from './SpecificClassParsingRule';

export class Resources {
  static readonly preSpanPattern = '<span class="{class}">';
  static readonly replacementPlaceholder = '{word.Value}';

  static readonly quotes: SimpleParsingRule = new SimpleParsingRule(
    new RegExpWithKey('__qts', new RegExp('(?<=")(.*)(?=")', 'g')),
    'string',
    (line: string) => FunctionGuards.checkForQuotes(line),
    ['"', '"'],
    '"'
  );

  static readonly staticClass: SimpleParsingRule = new SimpleParsingRule(
    new RegExpWithKey('__stc', new RegExp('(\\b[A-Z]\\w+)(?=\\.)', 'g')),
    'class',
    (line: string) => FunctionGuards.checkForStaticClass(line)
  );

  static readonly method: SimpleParsingRule = new SimpleParsingRule(
    new RegExpWithKey('__mtd', new RegExp('(?<=[\\.]?)[A-Z]\\w+(?=\\()', 'g')),
    'method',
    (line: string) => FunctionGuards.checkForMethods(line)
  );

  static readonly specificClass: SpecificClassParsingRule =
    new SpecificClassParsingRule(
      [
        new RegExpWithKey(
          '__spc',
          new RegExp('(?<=\\<3)(.*?[a-z])(?=3\\>)', 'g')
        ),
        new RegExpWithKey('__spc_a', new RegExp('((?<=3\\>)\\w+)', 'g')),
      ],
      'class',
      (line: string) => FunctionGuards.checkForSpecificClasses(line),
      ['<3', '3>']
    );

  static readonly keyword: KeywordParsingRule = new KeywordParsingRule(
    new RegExpWithKey('__kwd', new RegExp('\\w+', 'g')),
    'keyword',
    (line: string) => FunctionGuards.checkForKeywords(line)
  );

  static readonly classDeclaration: SimpleParsingRule = new SimpleParsingRule(
    new RegExpWithKey('__cld', new RegExp('\\b[A-Z]\\w+', 'g')),
    'class',
    (line: string) => true
  );

  static rules: ParsingRule[] = [
    this.quotes,
    this.specificClass,
    this.method,
    this.staticClass,
    this.keyword,
    this.classDeclaration,
  ];
}
