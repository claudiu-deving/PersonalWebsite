import { CodeBlock } from './CodeBlock';

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

  it('should corectly build the block', () => {
    let blockCount = 0;
    const builtBlock = block.build(blockCount);
    expect(builtBlock.length).toEqual(9);

    expect(builtBlock[0]).toEqual(
      `<div class="code"> <button class="copy-button" onclick="CopyToClipboard('codeblock0')">Copy code</button><pre id="codeblock0">`
    );
    expect(builtBlock[1]).toEqual(
      `<span class="keyword">public</span> <span class="keyword">static</span> <span class="keyword">class</span> <span class="class">Program</span>`
    );
    expect(builtBlock[2]).toEqual(`<span class="none">{</span>`);
    expect(builtBlock[3]).toEqual(
      `<span class="keyword">public</span> <span class="keyword">static</span> <span class="keyword">void</span> <span class="method">Main</span><span class="none">(</span><span class="keyword">string</span><span class="none">[</span><span class="none">]</span> <span class="variable">args</span><span class="none">)</span>`
    );
    expect(builtBlock[4]).toEqual(`<span class="none">{</span>`);
    expect(builtBlock[5]).toEqual(
      `<span class="class">Console</span><span class="none">.</span><span class="method">WriteLine</span><span class="none">(</span><span class="string">"Hello World!"</span><span class="none">)</span><span class="none">;</span>`
    );
    expect(builtBlock[6]).toEqual(`<span class="none">}</span>`);
    expect(builtBlock[7]).toEqual(`<span class="none">}</span>`);
    expect(builtBlock[8]).toEqual(`</pre></div>`);
  });
});
