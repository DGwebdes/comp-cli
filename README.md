# Experimental CLI Tool

## Converts Images to WEBP

### Functionalities Implemented
- Takes a single parameter: the source directory path
- Only accepts images with extensions `.jpeg`, `.jpg`, and `.png`
- Validates that the path exists
- Validates that the path is a directory
- Compresses only the images inside the provided directory
- Outputs all compressed images to `./output`

### TODO
- [ ] Add proper input validation with user-friendly error messages
- [ ] Handle empty directories gracefully
- [ ] Optionally allow resizing by percentage
- [ ] Add support for additional image formats (e.g., `.gif`, `.bmp`)
- [ ] Optionally allow specifying a custom output directory
- [ ] Add progress reporting or batch completion feedback
- [ ] Improve logging for unsupported files (avoid per-file noise)
- [ ] Handle large directories efficiently (e.g., concurrency control)
- [ ] Add CLI flags for width, quality, and output path
- [ ] Add unit tests for file filtering and compression logic
