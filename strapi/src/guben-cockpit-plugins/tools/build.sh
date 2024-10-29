#!/bin/bash

# Define the array of directories
directories=(
    "strapi-masterportal"
)

# Loop through each directory
for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        echo "Processing directory: $dir"

        # Change to the project directory
        cd "$dir"

        # Install npm packages
        echo "Installing npm packages in $dir..."
        npm install

        # Build the project
        echo "Building project in $dir..."
        npm run build

        # Go back to the parent directory
        cd ..
    else
        echo "Directory $dir does not exist."
    fi
done

echo "All projects have been processed."
