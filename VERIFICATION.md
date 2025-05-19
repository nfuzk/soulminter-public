# Source Map Verification

We enable production source maps for transparency. Here's how you can verify our deployed frontend matches our public code:

1. Open [https://soulminter.io] in your browser.
2. Open DevTools → Network tab, filter by "JS", and reload the page.
3. Find a file like `_app-xxxx.js` and its source map `_app-xxxx.js.map`.
4. Download the `.js.map` file and open it in a text editor.
5. Check the `"sources"` and `"sourcesContent"` fields.
6. Compare the code to our public repo at [https://github.com/nfuzk/soulminter-public].
7. (Or, in DevTools → Sources tab, browse the original source files and compare.)

If the code matches, you can trust that our deployed frontend was built from the public code.

For questions, contact main@soulminter.io. 