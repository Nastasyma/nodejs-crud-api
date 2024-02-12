const reset = "\x1b[0m";

export const ConsoleMessage = {
  green: (text: string) => console.log("\x1b[32m" + text + reset),
  red: (text: string) => console.log("\x1b[31m" + text + reset),
  blue: (text: string) => console.log("\x1b[34m" + text + reset),
  yellow: (text: string) => console.log("\x1b[33m" + text + reset),
  cyan: (text: string) => console.log("\x1b[36m" + text + reset),
  magenta: (text: string) => console.log("\x1b[35m" + text + reset),
  white: (text: string) => console.log("\x1b[37m" + text + reset),
  gray: (text: string) => console.log("\x1b[90m" + text + reset),
  black: (text: string) => console.log("\x1b[30m" + text + reset),
};