import { error } from "node:console";
import { inspect } from "node:util";

type LogLevels = 'debug' | 'log' | 'warn' | 'error';

type FreeTypes = string | number | symbol;
type BasicTypes = FreeTypes | boolean | bigint | undefined | null;
type TextType = BasicTypes | TextType[] | { [key: FreeTypes]: TextType };

class ConsoleLogger {
  constructor(
    private readonly markup = '[Logger]',
  ) {
    process.stdout.write('\n');
  }

  public debug(context: string, ...data: TextType[]): void {
    this.print(context, 'debug', ...data);
  }
  public log(context: string, ...data: TextType[]): void {
    this.print(context, 'log', ...data);
  }
  public warn(context: string, ...data: TextType[]): void {
    this.print(context, 'warn', ...data);
  }
  public error(context: string, ...data: TextType[]): void {
    this.print(context, 'error', ...data);
  }

  private strictLength(factoryLength: number, text: string | number, reverse = false) {
    text = text.toString();
    return (reverse ? text : '') + ' '.repeat(factoryLength - text.length) + (reverse ? '' : text);
  }

  private getTime() {
    const date = new Date();
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}.${this.strictLength(3, date.getMilliseconds())}`;
  }

  private maxContextLength = 0;
  private formatContext(context: string) {
    const toBrackets = (text: string) => `[${text}]`;
    if (context.length >= this.maxContextLength) {
      this.maxContextLength = context.length;
      return toBrackets(context);
    } else {
      return toBrackets(this.strictLength(this.maxContextLength, context, true));
    }
  }

  protected print(context: string, level: LogLevels, ...data: TextType[]): void {
    const levelColor = this.colorize.level(level);

    const i = (text: TextType) => inspect(text, { maxArrayLength: 5, breakLength: Infinity, compact: true, maxStringLength: 200, numericSeparator: true });
    const textIsBasic = (text: TextType): text is string => typeof text == 'string' || typeof text == 'number';

    data.forEach(text => {
      process.stdout.write(
        [
          levelColor(`[${this.markup}]`),
          // levelColor(this.strictLength(6, process.pid)),
          levelColor('-'),
          this.getTime(),
          levelColor('-'),
          levelColor(this.strictLength(5, level.toUpperCase())),
          this.colorize.yellow(this.formatContext(context)),
          this.colorize.bold(levelColor(textIsBasic(text) ? text : i(text))),
        ].join(' ') + '\n'
      );
    });
  }

  private get colorize() {
    const colorIfAllowed = (colorFn: (text: string) => string) => (text: string) => true ? colorFn(text) : text;
    return {
      bold: colorIfAllowed(text => `\x1B[1m${text}\x1B[0m`),
      green: colorIfAllowed(text => `\x1B[32m${text}\x1B[39m`),
      yellow: colorIfAllowed(text => `\x1B[33m${text}\x1B[39m`),
      red: colorIfAllowed(text => `\x1B[31m${text}\x1B[39m`),
      magentaBright: colorIfAllowed(text => `\x1B[95m${text}\x1B[39m`),
      cyanBright: colorIfAllowed(text => `\x1B[96m${text}\x1B[39m`),

      level: (level: LogLevels) => {
        switch (level) {
          case 'debug':
              return this.colorize.cyanBright;
          case 'warn':
              return this.colorize.yellow;
          case 'error':
              return this.colorize.red;
          default:
              return this.colorize.green;
        }
      },
    };
  }
}

export const logger = new ConsoleLogger('EnchaldBot');

export type ContextLogger = { [key in LogLevels]: (...data: TextType[]) => void }
export const getContextLogger = (context: string): ContextLogger => {
  context = context.charAt(0).toUpperCase() + context.slice(1);
  return {
    debug: logger.debug.bind(logger, context),
    log: logger.log.bind(logger, context),
    warn: logger.warn.bind(logger, context),
    error: logger.error.bind(logger, context),
  };
};