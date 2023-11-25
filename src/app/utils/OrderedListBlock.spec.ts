import { OrderedListBlock } from './OrderedListBlock';

describe('OrderedListBlock', () => {
  let block: OrderedListBlock;

  beforeEach(() => {
    block = new OrderedListBlock([
      '1. First item',
      '2. Second item',
      '3. Third item',
    ]);
  });

  it('should build an ordered list', () => {
    const expected = [
      '<ol>',
      '<li>First item</li>',
      '<li>Second item</li>',
      '<li>Third item</li>',
      '</ol>',
    ];
    const result = block.build();
    expect(result).toEqual(expected);
  });

  it('should remove the numbering,point and space from each item', () => {
    const expected = [
      '<ol>',
      '<li>First item</li>',
      '<li>Second item</li>',
      '<li>Third item</li>',
      '</ol>',
    ];
    const result = block.build();
    expect(result).toEqual(expected);
  });
});
