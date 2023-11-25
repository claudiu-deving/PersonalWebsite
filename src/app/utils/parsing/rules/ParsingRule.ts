export abstract class ParsingRule {
  public abstract processLine(line: string): string;
  public keysWithReplacers: Map<string, string> = new Map<string, string>();
  public replacement?: string;
}
