export type Guard = (line: string) => boolean;
export class FunctionGuards {
  public static checkForKeywords(line: string): boolean {
    return (
      this.cSharpKeywords.includes(line) ||
      this.cSharpPrimitiveTypes.includes(line)
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
  static readonly cSharpKeywords: string[] = [
    'abstract',
    'as',
    'base',
    'bool',
    'break',
    'byte',
    'case',
    'catch',
    'char',
    'checked',
    'class',
    'const',
    'continue',
    'decimal',
    'default',
    'delegate',
    'do',
    'double',
    'else',
    'enum',
    'event',
    'explicit',
    'extern',
    'false',
    'finally',
    'fixed',
    'float',
    'for',
    'foreach',
    'goto',
    'if',
    'implicit',
    'in',
    'int',
    'interface',
    'internal',
    'is',
    'lock',
    'long',
    'namespace',
    'new',
    'null',
    'object',
    'operator',
    'out',
    'override',
    'params',
    'private',
    'protected',
    'public',
    'readonly',
    'ref',
    'return',
    'sbyte',
    'sealed',
    'short',
    'sizeof',
    'stackalloc',
    'static',
    'string',
    'struct',
    'switch',
    'this',
    'throw',
    'true',
    'try',
    'typeof',
    'uint',
    'ulong',
    'unchecked',
    'unsafe',
    'ushort',
    'using',
    'using static',
    'virtual',
    'void',
    'volatile',
    'while',
    'get',
    'set',
  ];

  static readonly cSharpPrimitiveTypes: string[] = [
    'bool',
    'byte',
    'char',
    'decimal',
    'double',
    'float',
    'int',
    'long',
    'object',
    'sbyte',
    'short',
    'string',
    'uint',
    'ulong',
    'ushort',
  ];
}
