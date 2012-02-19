#!/bin/bash

if [ ! -d ./bin ]; then
    mkdir -p ./bin
fi

coffee --compile --output ./bin ./src

echo "... Done"
