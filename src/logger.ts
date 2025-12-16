import chalk from "chalk";

export function loggerSuccess(arg: string) {
    console.log(chalk.bgYellow.black(arg));
}
export function loggerError(arg: string) {
    console.log(chalk.bgRed.black(arg));
}
