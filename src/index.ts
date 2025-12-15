import path from "node:path";
import fs from "fs";
import readline from "readline";
import sharp from "sharp";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let input: string | null = null;
rl.question("Compressor\n ", (name) => {
    input = name;
    compressImages(name);
    rl.close();
});

async function compressImages(argInput: string, argOutput?: string) {
    // Takes the images from the directory indicated in the first argument
    console.log(argInput);
    let files = fs.readdirSync(`${argInput}`, { recursive: false });
    console.log("Reading files");
    files.forEach((file) => {
        const filename = typeof file === "string" ? file : file.toString();
        const { name, ext } = path.parse(filename);
        console.log(name, ext);

        const image = sharp(path.join(argInput, filename));

        // Compresses images and converts to webp
        image
            .resize({ width: 1080 })
            .toFormat("webp", { quality: 80 })
            .toFile(path.join(argOutput ? argOutput : argInput, `${name}.webp`))
            .then(() => {
                console.log("Compressed!");
            })
            .catch((err) => console.log(err));
    });
    // Returns compressed images to either the directory destination indicated on the output argument or the same input directory if no output is given
}
