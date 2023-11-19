export class RegexHelper {
  public static getMatch(input: string, pattern: RegExp): string[] {
    const result: string[] = [];
    let resultMatch = input.match(pattern);
    let groups = resultMatch?.groups;
    if (resultMatch != null && resultMatch.length > 0) {
      for (let i = 0; i < resultMatch.length; i++) {
        result.push(resultMatch[i].toString());
      }
    }
    return result;
  }
}
