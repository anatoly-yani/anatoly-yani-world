#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd $SCRIPT_DIR/..


# Output file
OUTPUT="${SCRIPT_DIR}/astro_yani.txt"

# Directories to be processed
SOURCE_DIR="./astro/src"
PUBLIC_DIR="./astro/public"
CONF_FILE="./astro/astro.config.mjs"
NETLIFY_FILE="./astro/netlify.toml"
README_FILE="./astro/README.md"

# Ensure the output file is empty
> "$OUTPUT"

# Get the directory structure using tree command and append to the output file
tree "$THEME_DIR" >> "$OUTPUT"
tree "$CONTENT_DIR" >> "$OUTPUT"

process_file() {
    local file=$1
    # Check if the file is a binary file
    if ! file "$file" | grep -qE 'binary|image|audio|video'; then
        echo -e "\n$file:\n" >> "$OUTPUT"
        cat "$file" >> "$OUTPUT"
        echo -e "\nENDFILE\n" >> "$OUTPUT"
    fi
}

# Function to recursively process files
process_files() {
    local dir=$1

    for file in "$dir"/*; do
        if [ -f "$file" ]; then
            process_file "$file"
        elif [ -d "$file" ]; then
            process_files "$file"
        fi
    done
}

# Process files in the directory
process_file "$README_FILE"
process_file "$CONF_FILE"
process_files "$SOURCE_DIR"
process_files "$PUBLIC_DIR"
process_file "$NETLIFY_FILE"

