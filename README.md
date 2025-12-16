# comp-cli

A fast CLI tool for batch compressing and converting images to WebP format.

## Features

- ✅ Converts JPEG, JPG, and PNG images to WebP
- ✅ Automatic compression and resizing
- ✅ Interactive and command-line modes
- ✅ Configurable quality and dimensions
- ✅ Custom output directory support
- ✅ Progress tracking during compression
- ✅ Comprehensive input validation

## Installation

### Global Installation
```bash
npm install -g compressor-cli
```

### Development
```bash
git clone <repo-url>
cd compressor-cli
npm install
npm run build
npm link
```

## Usage

### Command Line Mode
```bash
comp-cli <input-directory> [options]
```

**Example:**
```bash
# Basic usage (default: quality 80, width 1080px, output ./output)
comp-cli ./images

# Custom quality and width
comp-cli ./images -q 90 -w 1920

# Custom output directory
comp-cli ./images -o ./compressed

# All options combined
comp-cli ./images -q 70 -w 800 -o ./dist/images
```

### Interactive Mode
If no arguments are provided, comp-cli starts in interactive mode:
```bash
comp-cli
# Follow the prompts to enter your source directory
```
### Interactive Options
Right now interactive mode only accepts the path directory to the images to be compressed.
All other values fallback to default values. See below.

## Options

| Flag | Long Form | Description | Default |
|------|-----------|-------------|---------|
| `-q` | `--quality` | WebP quality (1-100) | 80 |
| `-w` | `--width` | Target width in pixels | 1080 |
| `-o` | `--output` | Output directory path | ./output |
| `-h` | `--help` | Show help information | - |
| `-v` | `--version` | Show current version | - |

## Supported Formats

**Input:** `.jpeg`, `.jpg`, `.png`  
**Output:** `.webp`

## How It Works

1. Validates the input directory exists and contains supported images
2. Creates the output directory if it doesn't exist
3. Compresses each image to WebP format with specified settings
4. Resizes images to the target width (maintains aspect ratio)
5. Reports progress and completion status

## Examples

### Compress for web thumbnails
```bash
comp-cli ./photos -w 400 -q 70 -o ./thumbnails
```

### High-quality conversion
```bash
comp-cli ./originals -q 95 -w 2560 -o ./webp
```

### Quick compression with defaults
```bash
comp-cli ./images
```

## Development

### Scripts
```bash
npm run dev        # Run with tsx (development)
npm run build      # Compile TypeScript
npm run link       # Build and link globally
npm run unlink     # Unlink from global
```

### Project Structure
```
src/
├── index.ts        # Main entry point
├── validation.ts   # Input validation and argument parsing
├── logger.ts       # Logging utilities
└── info.ts         # Help text and constants
tests/
└── compression.tests.ts    # Vitest testing
```

## Roadmap

- [ ] Add support for additional formats (GIF, BMP, TIFF)
- [ ] Implement percentage-based resizing
- [ ] Add concurrency control for large batches
- [ ] Support for multiple output formats
- [ ] Dry-run mode to preview operations
- [ ] Configuration file support
- [ ] Unit tests

## License

ISC

## Author

Dielan Garve