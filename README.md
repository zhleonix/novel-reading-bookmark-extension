# Novel Bookmark Upsert

Quick MV3 Chrome extension that adds or replaces a bookmark in the Bookmarks Bar with the current page when you click the toolbar icon.

Install (developer):

1. Open Chrome and go to `chrome://extensions`.
2. Enable *Developer mode* (top-right).
3. Click *Load unpacked* and select this project folder.

Convert SVG icons to PNG (optional):

1. Install dependencies:

```bash
cd d:/workspace/novel-reading-bookmark-extension
npm install
```

2. Run the conversion script:

```bash
npm run convert-icons
```

This will create `icons/icon-16.png`, `icons/icon-32.png`, `icons/icon-48.png`, and `icons/icon-128.png`.

Usage:

- Visit any page (e.g., a novel chapter) and click the extension icon in the toolbar. The extension creates a bookmark in the Bookmarks Bar with the page title and URL. If a bookmark in the Bookmarks Bar already has the same title, it will be replaced with the latest URL.

Notes:

- The extension matches bookmarks by title within the Bookmarks Bar. If you prefer matching by URL instead, edit `background.js` and adjust the search strategy.
- The extension requests `bookmarks` and `activeTab` permissions; `activeTab` is used during the user click to access the current tab URL/title.
