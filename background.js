// background.js - MV3 service worker
// Adds or updates a bookmark in the Bookmarks Bar by title.

function promisifyChromeApi(fn, ...args) {
  return new Promise((resolve) => fn(...args, (res) => resolve(res)));
}

async function getBookmarksTree() {
  return await promisifyChromeApi(chrome.bookmarks.getTree);
}

async function findBookmarksBar() {
  const tree = await getBookmarksTree();
  const roots = (tree && tree[0] && tree[0].children) || [];
  // Try common English title, then a fallback to first root
  let bar = roots.find(r => /bookmarks\s*bar/i.test(r.title));
  if (!bar) bar = roots[0] || null;
  return bar;
}

async function searchBookmarksByTitleInParent(title, parentId) {
  const results = await promisifyChromeApi(chrome.bookmarks.search, { title });
  if (!results) return [];
  return results.filter(r => String(r.parentId) === String(parentId));
}

async function upsertBookmarkInBar(title, url) {
  const bar = await findBookmarksBar();
  if (!bar) throw new Error('Bookmarks Bar not found');
  const matches = await searchBookmarksByTitleInParent(title, bar.id);
  if (matches.length > 0) {
    // Replace the first matching bookmark
    const existing = matches[0];
    return await promisifyChromeApi(chrome.bookmarks.update, existing.id, { title, url });
  } else {
    return await promisifyChromeApi(chrome.bookmarks.create, { parentId: String(bar.id), title, url });
  }
}

async function upsertActiveTabBookmark(tab) {
  try {
    const t = tab || (await promisifyChromeApi(chrome.tabs.query, { active: true, currentWindow: true })).shift();
    if (!t || !t.url) {
      console.warn('No active tab URL to bookmark.');
      return;
    }
    const title = t.title && t.title.trim() ? t.title : t.url;
    const result = await upsertBookmarkInBar(title, t.url);
    console.log('Upserted bookmark:', result);
  } catch (err) {
    console.error('Failed to upsert bookmark:', err);
  }
}

chrome.action.onClicked.addListener((tab) => {
  upsertActiveTabBookmark(tab);
});

// Optional: ensure clean shutdown of worker (no-op, but keeps linter happy)
self.addEventListener('install', () => {});
