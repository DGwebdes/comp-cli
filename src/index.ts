#!/usr/bin/env node

import path from "node:path";
import fs from "fs";
import readline from "readline";
import sharp from "sharp";
import chalk from "chalk";
import { createSpinner } from "nanospinner";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const spinner = createSpinner("Compressing");

const EXTENSIONS = [".jpeg", ".jpg", ".png"];
const ACCEPTED_FORMATS = chalk.bgBlue(`Accepted formats: JPEG, JPG, PNG`);
const WELCOME_MESSAGE = chalk.bgBlack.italic(
    `Image.* to Image.webp Compressor. \n`
);
const OUTPUT: string = "./output";

function welcome() {
    const intro = chalk.blue.bold(WELCOME_MESSAGE);
    console.log(intro);
}

function howToUse() {
    const note = chalk.red.italic(`If output source does't exist. Create one.`);
    const howTo = chalk.green(`
        Usage > ./directory_path
        Comp-cli will always compress the images from your project public directory 
        Comp-cli outputs its results to 'output/' directory on your project root
        ${ACCEPTED_FORMATS}
        \n
        ${note}
        `);
    console.log(howTo);
}
// TODO: Validate user input
async function inputSource() {
    rl.question("Source of Images\n ", (inputDir) => {
        const input = path.resolve(process.cwd(), inputDir.trim());
        console.log(chalk.red(input));
        compressImages(input);
    });
}

async function compressImages(argInput: string) {
    // Takes the images from the directory indicated in the first argument
    try {
        /**
         * ! Checks if input is valid
         */
        if (!fs.existsSync(argInput)) {
            console.log(
                chalk.bgYellowBright.black(`Cannot find path provided`)
            );
            return;
        }
        if (!fs.statSync(argInput).isDirectory()) {
            console.log(chalk.bgRed("Path provided is not a directory"));
            return;
        }
        /**
         * * Initialized files array and checks if output exists
         */

        let files = fs.readdirSync(`${argInput}`);
        if (!fs.existsSync(OUTPUT)) {
            fs.mkdirSync(OUTPUT);
        }
        spinner.start();
        const jobs = files
            .filter((extensions) =>
                EXTENSIONS.includes(path.extname(extensions))
            )
            .map((file) => {
                const filename = file;
                const { name, ext } = path.parse(filename);

                // Compresses images and converts to webp
                const image = sharp(path.join(argInput, filename));

                return image
                    .resize({ width: 1080 })
                    .toFormat("webp", { quality: 80 })
                    .toFile(path.join(OUTPUT, `${name}.webp`));
            });

        await Promise.all(jobs);
        spinner.success();
        console.log(chalk.green(`Your files have been compressed.`));
    } catch (error) {
        spinner.error();
        console.error(chalk.red(`Sorry, something went wrong ${error}`));
        process.exit(1);
    } finally {
        rl.close();
    }
    // Returns compressed images to either the directory destination indicated on the output argument or the same input directory if no output is given
}

console.clear();
welcome();
howToUse();
await inputSource();
