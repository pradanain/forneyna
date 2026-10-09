import type { Page } from '@playwright/test'

export async function visitForAutoplay(page: Page) {
  await page.goto('/')
  // Playwright's first locator evaluation can activate the page before HEAD finishes.
  // Observe the initial audio result without granting a synthetic user gesture.
  const session = await page.context().newCDPSession(page)
  try {
    const result = await session.send('Runtime.evaluate', {
      userGesture: false, awaitPromise: true,
      expression: `new Promise((resolve, reject) => {
        const observer = new MutationObserver(check);
        const timer = setTimeout(() => { observer.disconnect(); reject(new Error('Audio did not settle')); }, 5000);
        function check() {
          if (document.querySelector('.music-notice, .music-button[aria-pressed="true"]')) {
            clearTimeout(timer); observer.disconnect(); resolve(true);
          }
        }
        observer.observe(document, { subtree: true, childList: true, attributes: true });
        check();
      })`,
    })
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text)
  } finally { await session.detach() }
}
