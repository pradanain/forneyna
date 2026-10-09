import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MusicPlayer } from '../src/components/MusicPlayer'
import { birthday } from '../src/config/birthday'
import { createRef } from 'react'
import type { MusicPlayerHandle } from '../src/components/MusicPlayer'

const initialMusic = { ...birthday.music }
beforeEach(() => {
  birthday.music.enabled = true
  birthday.music.provider = 'local'
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockRejectedValue(new DOMException('User activation required', 'NotAllowedError'))
})
afterEach(() => { cleanup(); vi.unstubAllGlobals(); Object.assign(birthday.music, initialMusic) })

async function renderWithResponse(status: number, type: string) {
  const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status, headers: { 'Content-Type': type } }))
  vi.stubGlobal('fetch', fetchMock)
  let view!: ReturnType<typeof render>
  await act(async () => { view = render(<MusicPlayer />) })
  return { view, fetchMock }
}

describe('optional music player', () => {
  it('handles blocked automatic playback and lets the user retry manually', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play')
      .mockRejectedValueOnce(new DOMException('User activation required', 'NotAllowedError'))
      .mockImplementation(function (this: HTMLMediaElement) { this.dispatchEvent(new Event('play')); return Promise.resolve() })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { headers: { 'Content-Type': 'audio/mpeg' } })))
    await act(async () => { render(<MusicPlayer />) })
    expect(play).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status').textContent).toBe(birthday.music.autoplayHint)
    expect(screen.getByRole('button', { name: birthday.music.play }).getAttribute('aria-pressed')).toBe('false')
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: birthday.music.play })) })
    expect(play).toHaveBeenCalledTimes(2)
    expect(screen.queryByRole('status')).toBeNull()
    expect(screen.getByRole('button', { name: birthday.music.pause }).getAttribute('aria-pressed')).toBe('true')
  })
  it('starts on page load when the browser allows audio, without a gesture', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (this: HTMLMediaElement) {
      this.dispatchEvent(new Event('play')); return Promise.resolve()
    })
    await renderWithResponse(200, 'audio/mpeg')
    expect(play).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: birthday.music.pause })).toBeTruthy()
    await act(async () => { fireEvent.click(document.body) })
    expect(play).toHaveBeenCalledTimes(1)
  })

  it.each(['click', 'touchend', 'keydown'])('retries blocked load playback on a page %s and respects pause afterward', async event => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play')
      .mockRejectedValueOnce(new DOMException('User activation required', 'NotAllowedError'))
      .mockImplementation(function (this: HTMLMediaElement) { this.dispatchEvent(new Event('play')); return Promise.resolve() })
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function (this: HTMLMediaElement) { this.dispatchEvent(new Event('pause')) })
    const ref = createRef<MusicPlayerHandle>()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { headers: { 'Content-Type': 'audio/mpeg' } })))
    await act(async () => { render(<MusicPlayer ref={ref} />) })
    await act(async () => { document.body.dispatchEvent(event === 'keydown' ? new KeyboardEvent(event, { key: 'Tab', bubbles: true }) : new Event(event, { bubbles: true })) })
    expect(play).toHaveBeenCalledTimes(2)
    expect(screen.queryByRole('status')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: birthday.music.pause }))
    await act(async () => { fireEvent.click(document.body); ref.current?.startOnOpen() })
    expect(play).toHaveBeenCalledTimes(2)
    expect(screen.getByRole('button', { name: birthday.music.play })).toBeTruthy()
  })

  it('cleans up page gesture listeners on unmount', async () => {
    const play = vi.mocked(HTMLMediaElement.prototype.play)
    const { view } = await renderWithResponse(200, 'audio/mpeg')
    view.unmount()
    await act(async () => { fireEvent.click(document.body) })
    expect(play).toHaveBeenCalledTimes(1)
  })
  it('makes no request when music is disabled', () => {
    birthday.music.enabled = false
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    render(<MusicPlayer />)
    expect(fetchMock).not.toHaveBeenCalled()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it.each([[404, 'text/html'], [200, 'text/html']])('hides unavailable/non-audio responses (%s, %s)', async (status, type) => {
    const { fetchMock } = await renderWithResponse(status, type)
    expect(fetchMock).toHaveBeenCalledWith(birthday.music.src, expect.objectContaining({ method: 'HEAD' }))
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('silently handles a failed availability request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network unavailable')))
    await act(async () => { render(<MusicPlayer />) })
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('starts only on a user click and supports pause', async () => {
    birthday.music.autoPlayOnLoad = false
    birthday.music.autoPlayOnOpen = false
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (this: HTMLMediaElement) {
      this.dispatchEvent(new Event('play'))
      return Promise.resolve()
    })
    const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function (this: HTMLMediaElement) {
      this.dispatchEvent(new Event('pause'))
    })
    const { view } = await renderWithResponse(200, 'audio/mpeg')
    expect(play).not.toHaveBeenCalled()
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: birthday.music.play })) })
    expect(play).toHaveBeenCalledTimes(1)
    expect(view.container.querySelector('audio')?.volume).toBe(birthday.music.volume)
    fireEvent.click(screen.getByRole('button', { name: birthday.music.pause }))
    expect(pause).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: birthday.music.play })).toBeTruthy()
  })

  it('handles autoplay-policy rejection without claiming playback', async () => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockRejectedValue(new DOMException('User activation required', 'NotAllowedError'))
    await renderWithResponse(200, 'audio/mpeg')
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: birthday.music.play })) })
    expect(screen.getByRole('status').textContent).toBe(birthday.music.blocked)
    expect(screen.getByRole('button', { name: birthday.music.play }).getAttribute('aria-pressed')).toBe('false')
  })

  it('removes the player when the media fails to decode/load', async () => {
    const { view } = await renderWithResponse(200, 'audio/mpeg')
    fireEvent.error(view.container.querySelector('audio')!)
    expect(screen.queryByRole('button')).toBeNull()
  })
})
