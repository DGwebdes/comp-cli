import chalk from "chalk";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
    readFileSync(join(__dirname, "../package.json"), "utf-8")
);

const VERSION = pkg.version ? pkg.version : "";
const EXTENSIONS = [".jpeg", ".jpg", ".png", ".avif", ".webp"];

const ACCEPTED_FORMATS = chalk.bgGray(
    `Accepted formats: JPEG, JPG, PNG, AVIF, WEBP`
);
const WELCOME_MESSAGE = chalk.italic(
    `\n\nImage.* to Image.webp Compressor. \n`
);
const NOTE = chalk.red.italic(
    `If output source does't exist. comp-cli creates one relative to where comp-cli was executed from.`
);

function welcome() {
    const intro = chalk.blue.bold(WELCOME_MESSAGE);
    process.stdout.write(intro);
}
function howToUse() {
    const howTo = chalk.green(`
        How to use:
        > comp-cli <path-dir> [--options]

        About comp-cli tool:
        Comp-cli will always compress all images from the provided directory.
        comp-cli takes only a few selection of images extensions.
        
        -h --help       Shows this help
        -o --output     Output directory where images are saved
        -w --width      Width dimensions to be resized to
        -q --quality    Lossless compression threshold
        -f --format     Format output type [png, webp, jpg]
        -v --version    Shows version

        Examples:
        comp-cli ./images
        comp-cli ./images -q 90 -w 1920
        comp-cli ./images -f jpeg -q 85
        comp-cli ./images -o ./compressed -f avif
        
        ${ACCEPTED_FORMATS}
        \n
        ${NOTE}
        `);

    process.stdout.write(howTo);
}

export { EXTENSIONS, welcome, howToUse, VERSION };
