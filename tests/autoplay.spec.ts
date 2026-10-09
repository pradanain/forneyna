import { test, expect } from '@playwright/test'
import { birthday } from '../src/config/birthday'
import { visitForAutoplay } from './media-policy'

// Keep tracing from granting user activation before the load attempt.
test.use({ trace: 'off', launchOptions: { args: ['--autoplay-policy=no-user-gesture-required'] } })
test('plays the real MP3 on page load before any interaction', async ({ page }) => {
  await visitForAutoplay(page)
  await expect(page.getByRole('button', { name: birthday.music.pause, exact: true })).toBeVisible()
  await expect.poll(() => page.locator('audio').evaluate((el: HTMLAudioElement) => el.currentTime)).toBeGreaterThan(0.2)
  expect(await page.locator('audio').evaluate((el: HTMLAudioElement) => ({ paused: el.paused, muted: el.muted, volume: el.volume, error: el.error })))
    .toEqual({ paused: false, muted: false, volume: birthday.music.volume, error: null })
  await expect(page.locator('#birthday')).toHaveCount(0)
  await expect(page.locator('.music-player').getByRole('status')).toHaveCount(0)
  await page.getByRole('button', { name: birthday.music.pause, exact: true }).click()
  await page.getByRole('heading').click()
  expect(await page.locator('audio').evaluate((el: HTMLAudioElement) => el.paused)).toBe(true)
})
