import chalk from "chalk";

export function loggerSuccess(arg: string) {
    const message = chalk.bgYellow.black(arg);
    console.log(message);
}
export function loggerError(arg: string) {
    const message = chalk.bgRed.black(arg);
    console.log(message);
}
