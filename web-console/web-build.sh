#!/bin/bash

# Exit when any command fails
set -e

# Keep track of the last executed command
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
# echo an error message before exiting
trap 'echo "\"${last_command}\" command failed with exit code $?."' EXIT

# Install Dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt

# Build Application
docker build .
echo "Build successful without errors"
exit 0

# At this point, the commands ran successfully. Therefore, the last exit status is clean trap Exit.
trap EXIT