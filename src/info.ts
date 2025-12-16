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
        About comp-cli tool:
        Comp-cli will always compress the images all images from the provided directory to the given dimensions and quality value.
        comp-cli takes only a few selection of images extensions.
        Comp-cli outputs its results to 'output/' directory on your project root
        How to use comp-cli:
        > comp-cli <path-dir> <output-path[-o]> <--width[-w]> <--quality [-q]>
         output path, width and quality are optional, if not provided they default to <./output>, <1080> and <80> respectively.
        ${ACCEPTED_FORMATS}
        \n
        ${NOTE}
        `);
    console.log(howTo);
}

export { EXTENSIONS, welcome, howToUse };
