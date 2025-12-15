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

// ? is there a better way to wait out for input and results?
const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const welcomeMessage = chalk.bgBlack.italic(
    `Image.* to Image.webp Compressor. \n`
);
const OUTPUT: string = "./output";
let input: string = "";

async function welcome() {
    const intro = chalk.blue.bold(welcomeMessage);
    console.log(intro);
}

async function howToUse() {
    const note = chalk.red.italic(`If output source does't exist. Create one.`);
    const howTo = chalk.green(`
        Usage > 
        run comp-cli
        source of image/s
        output to output/ directory
        \n
        ${note}
        `);
    console.log(howTo);
}
// TODO: Validate user input
async function inputSource() {
    rl.question("Source of Images\n ", (inputDir) => {
        if (!inputDir) {
            console.log(chalk.bgRed("Must provide a source directory path"));
            rl.close();
            return;
        }
        input = inputDir.trim();
        compressImages(input);
        rl.close();
    });
}

async function compressImages(argInput: string) {
    // Takes the images from the directory indicated in the first argument
    if (!fs.existsSync(argInput)) {
        console.log(chalk.bgYellowBright.black(`Cannot find path provided`));
        return;
    }

    let files = fs.readdirSync(`${argInput}`, { recursive: false });
    console.log("Reading files");
    files.forEach((file) => {
        const filename = typeof file === "string" ? file : file.toString();
        const { name, ext } = path.parse(filename);
        const image = sharp(path.join(argInput, filename));

        // Compresses images and converts to webp
        image.resize({ width: 1080 }).toFormat("webp", { quality: 80 });

        if (!fs.existsSync(OUTPUT)) {
            fs.mkdirSync(OUTPUT);
        }
        image
            .toFile(path.join(OUTPUT, `${name}.webp`))
            .then(() => {
                console.log("Compressed!");
            })
            .catch((err) => console.log(err));
    });
    // Returns compressed images to either the directory destination indicated on the output argument or the same input directory if no output is given
}

console.clear();
await welcome();
await howToUse();
await sleep();
await inputSource();
