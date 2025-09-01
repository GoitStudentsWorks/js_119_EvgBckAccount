// Define a FontFace
const font = new FontFace("my-font", 'url("my-font.woff")', {
  weight: "400 500 600 700",
  stretch: "condensed",
});

// Add to the document.fonts (FontFaceSet)
document.fonts.add(font);

import './js/artists.js';