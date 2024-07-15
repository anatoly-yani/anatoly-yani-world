#!/bin/bash

# Directory to be processed
THEME_DIR="anatoly-yani-pelican/themes/yani-theme"
CONTENT_DIR="anatoly-yani-pelican/content"
CONF_FILE="anatoly-yani-pelican/pelicanconf.py"
PLUGIN_FILE="anatoly-yani-pelican/plugins/pelican_poetic.py"

# Output file
OUTPUT="pelican.txt"

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
process_files "$THEME_DIR"
process_file "$PLUGIN_FILE"
process_file "$CONF_FILE"

process_files "$CONTENT_DIR"
