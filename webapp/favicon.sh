#!/bin/sh

convert $1 -scale 64x64 favicon-64.png
convert favicon-64.png -resize 16x16 favicon-16.png
convert favicon-64.png -resize 32x32 favicon-32.png
convert favicon-16.png favicon-32.png favicon-64.png ${2-favicon.ico}
rm favicon-*.png
