import { Block } from './Block';
import { BlockType } from '../blocks/BlockType';

export class TextBlock extends Block {
  constructor(lines: string[]) {
    super(lines, BlockType.TEXT);
  }

  public override build(_blockCount?: number | undefined): string[] {
    let result = new Array<string>();
    let elementType = 'p' || 'h1' || 'h2' || 'h3' || 'h4' || 'h5' || 'h6';
    let center = false;
    if (this.lines[0].startsWith('[center]')) {
      center = true;
      this.lines[0] = this.lines[0].replace('[center]', '');
    }
    let numberOfheadings = this.getNumberOfHeadings(this.lines[0]);
    switch (numberOfheadings.numberOfHeadings) {
      case 1:
        elementType = 'h1';
        break;
      case 2:
        elementType = 'h2';
        break;
      case 3:
        elementType = 'h3';
        break;
      case 4:
        elementType = 'h4';
        break;
      case 5:
        elementType = 'h5';
        break;
      case 6:
        elementType = 'h6';
        break;
      default:
        elementType = 'p';
    }

    if (center) {
      let line = `<div class="paragraph"><${elementType}  style="margin:auto">`;
      result.push(line);
    } else {
      result.push(`<div class="paragraph"><${elementType}>`);
    }
    this.lines[0] = numberOfheadings.line;
    for (let i = 0; i < this.lines.length; i++) {
      let element = this.lines[i];
      element = this.processLine(element);
      result.push(element);
    }
    result.push(`</${elementType}></div>`);
    return result;
  }

  processLine(line: string): string {
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
    let numberOfHeadings;
    ({ numberOfHeadings, line } = this.getNumberOfHeadings(line));
    line = line.substring(1); //subsract the space
    line = `<h${numberOfHeadings}>${line}</h${numberOfHeadings}>`;
    return line;
  }

  private getNumberOfHeadings(line: string) {
    let numberOfHeadings = 0;
    while (line.startsWith('#')) {
      numberOfHeadings++;
      line = line.substring(1);
    }
    return { numberOfHeadings, line };
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
