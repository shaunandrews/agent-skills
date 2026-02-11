/**
 * cleanup.js — Dismiss overlays and clean up the page before screenshot.
 *
 * Injected via Browserless addScriptTag after page load.
 * Clicks dismiss/accept buttons, removes leftover overlay elements,
 * and restores scroll on body/html.
 */
(function cleanupPage() {
  // ── Click common dismiss / accept buttons ──
  const dismissSelectors = [
    // Cookie consent buttons
    '[class*="cookie" i] button',
    '[class*="consent" i] button[class*="accept" i]',
    '[class*="consent" i] button[class*="agree" i]',
    '[class*="consent" i] button[class*="allow" i]',
    '[class*="cookie" i] [class*="accept" i]',
    '[class*="cookie" i] [class*="agree" i]',
    '[class*="cookie" i] [class*="close" i]',
    '[id*="cookie" i] button',
    '[id*="consent" i] button[class*="accept" i]',
    // OneTrust
    '#onetrust-accept-btn-handler',
    // CookieBot
    '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
    '#CybotCookiebotDialogBodyButtonAccept',
    // Quantcast
    '.qc-cmp2-summary-buttons button[mode="primary"]',
    // Generic close/dismiss
    '[class*="popup" i] [class*="close" i]',
    '[class*="modal" i] [class*="close" i]',
    '[class*="popup" i] button[aria-label*="close" i]',
    '[class*="modal" i] button[aria-label*="close" i]',
    '[class*="overlay" i] [class*="close" i]',
    '[class*="newsletter" i] [class*="close" i]',
    '[class*="banner" i] [class*="dismiss" i]',
    '[class*="banner" i] [class*="close" i]',
    // Complianz
    '.cmplz-accept',
    // Didomi
    '#didomi-notice-agree-button',
    // Usercentrics
    '[data-testid="uc-accept-all-button"]',
  ];

  for (const selector of dismissSelectors) {
    try {
      const buttons = document.querySelectorAll(selector);
      for (const btn of buttons) {
        if (btn.offsetParent !== null) { // visible
          btn.click();
        }
      }
    } catch (_) { /* selector may be invalid on some pages */ }
  }

  // ── Remove lingering overlay/backdrop elements ──
  const overlaySelectors = [
    '.modal-backdrop',
    '[class*="overlay-background" i]',
    '[class*="cookie" i][class*="overlay" i]',
    '[class*="consent" i][class*="overlay" i]',
  ];

  for (const selector of overlaySelectors) {
    try {
      document.querySelectorAll(selector).forEach(el => el.remove());
    } catch (_) {}
  }

  // ── Restore body/html scroll ──
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.classList.remove('modal-open', 'no-scroll', 'overflow-hidden', 'noscroll');
  document.documentElement.style.overflow = '';
  document.documentElement.classList.remove('modal-open', 'no-scroll', 'overflow-hidden', 'noscroll');
})();
