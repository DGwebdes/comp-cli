import chalk from "chalk";

const EXTENSIONS = [".jpeg", ".jpg", ".png"];
const ACCEPTED_FORMATS = chalk.bgGray(`Accepted formats: JPEG, JPG, PNG`);
const WELCOME_MESSAGE = chalk.italic(
    `\n\nImage.* to Image.webp Compressor. \n`
);
const NOTE = chalk.red.italic(
    `If output source does't exist. comp-cli creates one.`
);

function welcome() {
    const intro = chalk.blue.bold(WELCOME_MESSAGE);
    console.log(intro);
}

function howToUse() {
    const howTo = chalk.green(`
        How to use comp-cli:
        > comp-cli <path-dir> [--options]
        i.e: comp-cli ./public -w 1200 -q 75 -o ./public/compressed

        About comp-cli tool:
        Comp-cli will always compress the images all images from the provided directory to the given dimensions and quality value.
        comp-cli takes only a few selection of images extensions.
        Comp-cli outputs its results to 'output/' directory on your project root
        
        -h --help       Information and manual
        -o --output     Output directory where images are saved
        -w --width      Width dimensions to be resized to
        -q --quality    Lossless compression threshold
        
        ${ACCEPTED_FORMATS}
        \n
        ${NOTE}
        `);
    console.log(howTo);
}

export { EXTENSIONS, welcome, howToUse };
