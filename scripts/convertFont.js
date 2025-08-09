const THREE = require('three');
const TTFLoader = require('three/examples/jsm/loaders/TTFLoader').TTFLoader;
const FontLoader = require('three/examples/jsm/loaders/FontLoader').FontLoader;
const fs = require('fs');

// Load and convert the font
const loader = new TTFLoader();
loader.load('path/to/your/font.ttf', function(json) {
    const font = new FontLoader().parse(json);
    const fontJson = JSON.stringify(font.data);
    fs.writeFileSync('public/fonts/Inter_Regular.json', fontJson);
}); 