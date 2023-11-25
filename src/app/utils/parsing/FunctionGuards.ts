import { KeywordsAndPrimitives } from './resources/KeywordsAndPrimitives';

export type Guard = (line: string) => boolean;
export class FunctionGuards {
  public static checkForKeywords(line: string): boolean {
    return (
      KeywordsAndPrimitives.cSharpKeywords.includes(line) ||
      KeywordsAndPrimitives.cSharpPrimitiveTypes.includes(line)
    );
  }
  public static checkForQuotes(line: string): boolean {
    return line.includes('"');
  }
  public static checkForStaticClass(line: string): boolean {
    return line.includes('.');
  }
  public static checkForMethods(line: string): boolean {
    return line.includes('(') || line.includes(')');
  }

  public static checkForSpecificClasses(line: string): boolean {
    return line.includes('<3') || line.includes('3>');
  }
}
