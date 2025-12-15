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
        Usage > ./directory_path
        Comp-cli will always compress the images from your project public directory 
        Comp-cli outputs its results to 'output/' directory on your project root
        ${ACCEPTED_FORMATS}
        \n
        ${NOTE}
        `);
    console.log(howTo);
}

export { EXTENSIONS, welcome, howToUse };
