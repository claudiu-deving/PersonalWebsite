import { ImageBlock } from './ImageBlock';

describe('ImageBlock', () => {
  let block: ImageBlock;

  beforeEach(() => {
    block = new ImageBlock(['<3Image3>(image.jpg)']);
  });

  it('should build the image block correctly', () => {
    const expected = [
      '<div class="image">',
      '<img src="image.jpg" alt="image" />',
      '</div>',
    ];
    const result = block.build();
    expect(result).toEqual(expected);
  });
});
