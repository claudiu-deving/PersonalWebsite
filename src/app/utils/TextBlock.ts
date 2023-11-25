import { Block } from './Block';
import { TEXTTYPE } from './TEXTTYPE';

export class TextBlock extends Block {
  constructor(lines: string[]) {
    super(lines, TEXTTYPE.TEXT);
  }

  public override build(_blockCount?: number | undefined): string[] {
    let result = new Array<string>();
    result.push(`<pre><div class="paragraph"><p>`);
    for (let i = 0; i < this.lines.length; i++) {
      let element = this.lines[i];
      element = this.processLine(element);
      result.push(element);
    }
    result.push('</p></div></pre>');
    return result;
  }

  processLine(line: string): string {
    if (line.startsWith('#')) {
      line = this.processHeading(line);
    }
    line = this.processHiperLinks(line);
    line = this.processBold(line);
    line = this.processItalic(line);
    return line;
  }
  processItalic(line: string): string {
    const regEx = RegExp('(?<=_).+(?=_)');
    let match = regEx.exec(line);
    if (match) {
      line = line.replace(`_${match}_`, `<em>${match}</em>`);
    }
    return line;
  }
  processBold(line: string): string {
    const regEx = RegExp('(?<=\\*).+(?=\\*)');
    let match = regEx.exec(line);
    if (match) {
      line = line.replace(`*${match}*`, `<strong>${match}</strong>`);
    }
    return line;
  }
  processHeading(line: string): string {
    let numberOfHeadings = 0;
    while (line.startsWith('#')) {
      numberOfHeadings++;
      line = line.substring(1);
    }
    line = line.substring(1); //subsract the space
    line = `<h${numberOfHeadings}>${line}</h${numberOfHeadings}>`;
    return line;
  }

  processHiperLinks(line: string): string {
    const nameRegEx = RegExp('(?<=\\[).+(?=\\])');
    const addressRegEx = RegExp('(?<=\\().+(?=\\))');
    let name = nameRegEx.exec(line);
    let address = addressRegEx.exec(line);
    if (name && address) {
      line = line.replace(
        `[${name}](${address})`,
        `<a href="${address}">${name}</a>`
      );
    }
    return line;
  }
}
