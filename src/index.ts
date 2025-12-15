#!/usr/bin/env node

import path from "node:path";
import fs from "fs";
import readline from "readline";
import sharp from "sharp";
import chalk from "chalk";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const EXTENSIONS = [".jpeg", ".jpg", ".png"];
const ACCEPTED_FORMATS = chalk.bgRed(`Accepted formats: JPEG, JPG, PNG`);
const WELCOME_MESSAGE = chalk.bgBlack.italic(
    `Image.* to Image.webp Compressor. \n`
);
const OUTPUT: string = "./output";

async function welcome() {
    const intro = chalk.blue.bold(WELCOME_MESSAGE);
    console.log(intro);
}

async function howToUse() {
    const note = chalk.red.italic(`If output source does't exist. Create one.`);
    const howTo = chalk.green(`
        Usage > ./directory_path 
        outputs to 'output/' directory
        \n
        ${note}
        `);
    console.log(howTo);
}
// TODO: Validate user input
async function inputSource() {
    rl.question("Source of Images\n ", (inputDir) => {
        const input = inputDir.trim();
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
    } catch (error) {
        console.error(chalk.red(`Sorry, something went wrong ${error}`));
        process.exit(1);
    } finally {
        console.log(chalk.green(`Your file have been compressed.`));
        rl.close();
    }
    // Returns compressed images to either the directory destination indicated on the output argument or the same input directory if no output is given
}

console.clear();
await welcome();
await howToUse();
await inputSource();
