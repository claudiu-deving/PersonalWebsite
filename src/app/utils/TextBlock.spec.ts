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
});
