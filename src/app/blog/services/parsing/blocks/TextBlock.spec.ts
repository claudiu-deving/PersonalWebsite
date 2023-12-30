import { TextBlock } from './TextBlock';

describe('Text blocks tests', () => {
  let textBlock: TextBlock;

  beforeEach(() => {
    textBlock = new TextBlock([
      '# Heading 1',
      '## Heading 2',
      '### Heading 3',
      '#### Heading 4',
      '##### Heading 5',
    ]);
  });

  it('should build the text block correctly', () => {
    textBlock.lines = ['Line 1', 'Line 2', 'Line 3'];

    const result = textBlock.build();

    expect(result).toEqual([
      '<pre><div class="paragraph"><p>',
      'Line 1',
      'Line 2',
      'Line 3',
      '</p></div></pre>',
    ]);
  });

  it('should build an empty text block', () => {
    textBlock.lines = [];

    const result = textBlock.build();

    expect(result).toEqual([
      '<pre><div class="paragraph"><p>',
      '</p></div></pre>',
    ]);
  });

  it('should process a line', () => {
    const result = textBlock.processLine('# Heading 1');

    expect(result).toEqual('<h1>Heading 1</h1>');
  });

  it('should process a line with multiple headings', () => {
    const result = textBlock.build();

    expect(result).toEqual([
      '<pre><div class="paragraph"><p>',
      '<h1>Heading 1</h1>',
      '<h2>Heading 2</h2>',
      '<h3>Heading 3</h3>',
      '<h4>Heading 4</h4>',
      '<h5>Heading 5</h5>',
      '</p></div></pre>',
    ]);
  });

  it('should process a line with a link', () => {
    const result = textBlock.processHiperLinks(
      'This is a [link](https://www.google.com)'
    );

    expect(result).toEqual(
      'This is a <a href="https://www.google.com">link</a>'
    );
  });

  it('should process a line with a bold text', () => {
    const result = textBlock.processBold('This is a *bold* text');

    expect(result).toEqual('This is a <strong>bold</strong> text');
  });

  it('should process a line with a italic text', () => {
    const result = textBlock.processItalic('This is a _italic_ text');

    expect(result).toEqual('This is a <em>italic</em> text');
  });

  it('should process a line with a italic and bold text', () => {
    const result = textBlock.processLine(
      'This is a _italic_ and *bold* and [link](https://www.google.com) text'
    );

    expect(result).toEqual(
      'This is a <em>italic</em> and <strong>bold</strong> and <a href="https://www.google.com">link</a> text'
    );
  });

  it('should process a line with both italic and bold for the same word', () => {
    const result = textBlock.processLine(
      'This is a _italic and *bold* and [link](https://www.google.com) text_'
    );

    expect(result).toEqual(
      'This is a <em>italic and <strong>bold</strong> and <a href="https://www.google.com">link</a> text</em>'
    );
  });
});
