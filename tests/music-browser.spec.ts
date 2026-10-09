import { test, expect } from '@playwright/test'
import { birthday } from '../src/config/birthday'
import { visitForAutoplay } from './media-policy'

// Trace snapshots can grant browser activation; test native autoplay policy without tracing.
test.use({ trace: 'off' })

test('blocked autoplay starts on a page tap or click without opening the gift', async ({ page }, testInfo) => {
  await visitForAutoplay(page)
  await expect(page.locator('.music-player').getByRole('status')).toHaveText(birthday.music.autoplayHint)
  expect(await page.locator('audio').evaluate((el: HTMLAudioElement) => el.paused)).toBe(true)
  const heading = page.getByRole('heading')
  if (testInfo.project.name === 'mobile') await heading.tap()
  else await heading.click()
  await expect.poll(() => page.locator('audio').evaluate((el: HTMLAudioElement) => el.currentTime)).toBeGreaterThan(0.2)
  await expect(page.locator('#birthday')).toHaveCount(0)
  await expect(page.locator('.music-player').getByRole('status')).toHaveCount(0)
  await page.getByRole('button', { name: birthday.music.pause, exact: true }).click()
  await heading.click()
  expect(await page.locator('audio').evaluate((el: HTMLAudioElement) => el.paused)).toBe(true)
})

test('local music recovers from blocked autoplay with the gift; all imagery is local', async ({ page }) => {
  const mediaRequests: string[] = []
  const remoteRequests: string[] = []
  page.on('request', request => {
    if (decodeURIComponent(new URL(request.url()).pathname) === birthday.music.src && request.method() === 'GET') mediaRequests.push(request.url())
    if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== 'http://127.0.0.1:4173') remoteRequests.push(request.url())
  })
  await visitForAutoplay(page)
  await expect(page.getByRole('button', { name: birthday.music.play, exact: true })).toBeVisible()
  await expect(page.locator('.music-player').getByRole('status')).toHaveText(birthday.music.autoplayHint)
  await page.getByRole('button', { name: birthday.intro.open, exact: true }).last().click()
  await expect(page.getByRole('button', { name: birthday.music.pause, exact: true })).toBeVisible()
  await page.locator('#wish').scrollIntoViewIfNeeded()
  await expect(page.getByRole('button', { name: birthday.music.spotify.open, exact: true })).toHaveCount(0)
  await expect(page.locator('iframe')).toHaveCount(0)
  const images = page.locator('img')
  await expect(images).toHaveCount(7)
  for (const img of await images.all()) {
    await img.scrollIntoViewIfNeeded()
    await expect.poll(() => img.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true)
  }
  expect(mediaRequests.length).toBeGreaterThan(0)
  expect(remoteRequests).toEqual([])
})

test('supplied MP3 recovers on unwrap, then supports pause, resume, and background playback', async ({ page }, testInfo) => {
  const remoteRequests: string[] = []
  page.on('request', request => {
    if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== 'http://127.0.0.1:4173') remoteRequests.push(request.url())
  })
  await visitForAutoplay(page)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  const audio = page.locator('audio')
  const trigger = page.getByRole('button', { name: birthday.music.play, exact: true })
  await expect(trigger).toBeVisible()
  await expect(audio).toHaveAttribute('src', birthday.music.src)
  await expect(audio).toHaveAttribute('preload', 'none')
  expect(await audio.evaluate((el: HTMLAudioElement) => el.paused)).toBe(true)
  await expect(page.locator('iframe')).toHaveCount(0)
  await page.getByRole('button', { name: birthday.intro.open, exact: true }).last().click()
  await expect(page.getByRole('button', { name: birthday.music.pause, exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect.poll(() => audio.evaluate((el: HTMLAudioElement) => el.currentTime)).toBeGreaterThan(0.2)
  const media = await audio.evaluate((el: HTMLAudioElement) => ({ duration: el.duration, readyState: el.readyState, volume: el.volume, loop: el.loop, error: el.error?.message ?? null }))
  expect(media.duration).toBeGreaterThan(1)
  expect(media.readyState).toBeGreaterThanOrEqual(2)
  expect(media.volume).toBe(birthday.music.volume)
  expect(media.loop).toBe(true)
  expect(media.error).toBeNull()
  await page.getByRole('button', { name: birthday.music.pause, exact: true }).click()
  await expect(trigger).toHaveAttribute('aria-pressed', 'false')
  expect(await audio.evaluate((el: HTMLAudioElement) => el.paused)).toBe(true)
  const pausedAt = await audio.evaluate((el: HTMLAudioElement) => el.currentTime)
  await trigger.click()
  await expect.poll(() => audio.evaluate((el: HTMLAudioElement) => el.currentTime)).toBeGreaterThan(pausedAt + 0.1)
  await page.locator('#letter').scrollIntoViewIfNeeded()
  expect(await audio.evaluate((el: HTMLAudioElement) => el.paused)).toBe(false)
  await page.screenshot({ path: `artifacts/${testInfo.project.name}-music.png`, animations: 'disabled' })
  await page.getByRole('button', { name: birthday.music.pause, exact: true }).click()
  await expect(page.locator('iframe')).toHaveCount(0)
  expect(remoteRequests).toEqual([])
})

test('keyboard gift activation starts music even while availability is pending; replay respects pause', async ({ page }) => {
  let releaseHead!: () => void
  const gate = new Promise<void>(resolve => { releaseHead = resolve })
  await page.route('**/*.mp3', async route => {
    if (route.request().method() === 'HEAD') await gate
    await route.continue()
  })
  await page.goto('/')
  await page.getByRole('button', { name: birthday.intro.open, exact: true }).first().press('Enter')
  try {
    await expect.poll(() => page.locator('audio').evaluate((el: HTMLAudioElement) => el.currentTime)).toBeGreaterThan(0.1)
  } finally { releaseHead() }
  await page.getByRole('button', { name: birthday.music.pause, exact: true }).click()
  await page.getByRole('button', { name: birthday.wish.replay, exact: true }).click()
  await page.getByRole('button', { name: birthday.intro.open, exact: true }).last().click()
  await expect(page.locator('#birthday')).toBeVisible()
  expect(await page.locator('audio').evaluate((el: HTMLAudioElement) => el.paused)).toBe(true)
  await expect(page.getByRole('button', { name: birthday.music.play, exact: true })).toBeVisible()
})
