import { UnorderedListBlock } from './UnorderedListBlock';

describe('Unordered List locks tests', () => {
  let block: UnorderedListBlock;

  beforeEach(() => {
    block = new UnorderedListBlock(['- Item 1', '- Item 2', '- Item 3']);
  });

  it('should build an unordered list', () => {
    const expected = [
      '<ul>',
      '<li>Item 1</li>',
      '<li>Item 2</li>',
      '<li>Item 3</li>',
      '</ul>',
    ];
    const result = block.build();
    expect(result).toEqual(expected);
  });
});
