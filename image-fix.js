/* ============================================================
 * Nosh Tours — Universal Image Path Auto-Fixer v2.0
 * ------------------------------------------------------------
 * Purpose: Runtime fallback that rewrites root-relative asset
 *          paths (e.g. /images/x.jpg, /logo.png, /mobile.css)
 *          to raw.githubusercontent.com URLs so assets load on
 *          every deployment target: GitHub Pages, custom domain
 *          (noshtours.com), raw GitHub, or local preview.
 *
 * Repo:    github.com/noshtours/Noshtours (branch: main)
 * Updated: May 2026
 *
 * What v2 fixes vs v1:
 *   • Now scans CSSStyleSheet rules — catches <style> block
 *     background-image URLs that v1 missed (e.g. hero in index.html)
 *   • Does NOT touch og:image / twitter:image meta tags (those
 *     must remain on noshtours.com for SEO/social previews)
 *   • Does NOT touch canonical URLs or hreflang links
 *
 * Usage:   Drop this anywhere accessible and include in each
 *          HTML page right before </body>:
 *
 *          <script src="https://raw.githubusercontent.com/noshtours/Noshtours/main/image-fix.js"></script>
 *
 *          (Using the raw GitHub URL bootstraps correctly on
 *           GitHub Pages where /image-fix.js would 404.)
 * ============================================================ */
(function () {
  'use strict';

  var REPO_BASE = 'https://raw.githubusercontent.com/noshtours/Noshtours/main';
  var IMG_EXT   = /\.(jpe?g|png|gif|webp|svg|avif|ico|bmp)(\?.*)?$/i;
  var ASSET_EXT = /\.(jpe?g|png|gif|webp|svg|avif|ico|bmp|css|js|woff2?|ttf|otf)(\?.*)?$/i;

  function shouldRewriteImage(path) {
    if (!path || path.charAt(0) !== '/') return false;
    if (path.charAt(1) === '/') return false; // protocol-relative
    return IMG_EXT.test(path);
  }
  function shouldRewriteAsset(path) {
    if (!path || path.charAt(0) !== '/') return false;
    if (path.charAt(1) === '/') return false;
    return ASSET_EXT.test(path);
  }

  function fixImg(img) {
    var src = img.getAttribute('src');
    if (shouldRewriteImage(src)) img.setAttribute('src', REPO_BASE + src);
    var srcset = img.getAttribute('srcset');
    if (srcset) {
      var n = srcset.replace(/(^|,\s*)(\/[^\s,]+)/g, function (m, sep, p) {
        return shouldRewriteImage(p) ? sep + REPO_BASE + p : m;
      });
      if (n !== srcset) img.setAttribute('srcset', n);
    }
  }

  function fixBg(el) {
    var style = el.getAttribute('style');
    if (!style || style.indexOf('url(') === -1) return;
    var updated = style.replace(
      /url\(\s*(['"]?)(\/[^'")\s]+)\1\s*\)/g,
      function (m, q, p) {
        return shouldRewriteImage(p) ? "url('" + REPO_BASE + p + "')" : m;
      }
    );
    if (updated !== style) el.setAttribute('style', updated);
  }

  function fixSource(s) {
    var srcset = s.getAttribute('srcset');
    if (!srcset) return;
    var n = srcset.replace(/(^|,\s*)(\/[^\s,]+)/g, function (m, sep, p) {
      return shouldRewriteImage(p) ? sep + REPO_BASE + p : m;
    });
    if (n !== srcset) s.setAttribute('srcset', n);
  }

  // Patch <link> tags for icons, stylesheets, preloads — but NOT meta og:image
  function fixLink(l) {
    var rel  = (l.getAttribute('rel') || '').toLowerCase();
    var href = l.getAttribute('href');
    if (!href || href.charAt(0) !== '/' || href.charAt(1) === '/') return;
    if (rel === 'canonical' || rel === 'alternate') return; // never touch SEO links
    if (shouldRewriteAsset(href)) l.setAttribute('href', REPO_BASE + href);
  }

  // v2 NEW: Patch CSSStyleSheet rules (background-image in <style> blocks)
  function fixStylesheetRule(rule) {
    if (!rule || !rule.style) return;
    var bg = rule.style.backgroundImage || rule.style.background || '';
    if (!bg || bg.indexOf('url(') === -1) return;
    var updated = bg.replace(
      /url\(\s*(['"]?)(\/[^'")\s]+)\1\s*\)/g,
      function (m, q, p) {
        return shouldRewriteImage(p) ? "url('" + REPO_BASE + p + "')" : m;
      }
    );
    if (updated !== bg) {
      if (rule.style.backgroundImage) rule.style.backgroundImage = updated;
      else rule.style.background = updated;
    }
  }

  function fixStylesheets() {
    var sheets = document.styleSheets;
    for (var i = 0; i < sheets.length; i++) {
      var sheet;
      try { sheet = sheets[i]; } catch (e) { continue; }
      var rules;
      try { rules = sheet.cssRules || sheet.rules; } catch (e) { continue; }
      if (!rules) continue;
      for (var j = 0; j < rules.length; j++) {
        var r = rules[j];
        if (r.type === 1) fixStylesheetRule(r); // STYLE_RULE
        if (r.cssRules) { // media queries, etc.
          for (var k = 0; k < r.cssRules.length; k++) fixStylesheetRule(r.cssRules[k]);
        }
      }
    }
  }

  function patchScope(root) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('img').forEach(fixImg);
    root.querySelectorAll('source').forEach(fixSource);
    root.querySelectorAll('link').forEach(fixLink);
    root.querySelectorAll('[style*="url("]').forEach(fixBg);
  }

  function patchAll() {
    patchScope(document);
    fixStylesheets();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchAll);
  } else {
    patchAll();
  }

  if (typeof MutationObserver !== 'undefined') {
    var mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (node.nodeType !== 1) continue;
          if (node.tagName === 'IMG') fixImg(node);
          else if (node.tagName === 'SOURCE') fixSource(node);
          else if (node.tagName === 'LINK') fixLink(node);
          if (node.getAttribute && node.getAttribute('style')) fixBg(node);
          if (node.querySelectorAll) patchScope(node);
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
