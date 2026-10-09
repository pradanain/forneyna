import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { Ref } from 'react'
import { ExternalLink, Music2, Pause, Play, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { birthday } from '../config/birthday'

export interface MusicPlayerHandle { startOnOpen: () => void }

export function MusicPlayer({ ref }: { ref?: Ref<MusicPlayerHandle> }) {
  if (!birthday.music.enabled) return null
  return birthday.music.provider === 'spotify' ? <SpotifyMusicPlayer /> : <LocalMusicPlayer ref={ref} />
}

function SpotifyMusicPlayer() {
  const c = birthday.music.spotify
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const reduced = useReducedMotion()
  const close = () => { setOpen(false); trigger.current?.focus() }
  if (!/^[A-Za-z0-9]{22}$/.test(c.trackId)) return null
  return <div className="music-player" onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); close() } }}>
    <AnimatePresence>
      {open && <motion.section id="birthday-music-panel" className="music-panel" aria-label={c.heading} initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : 8 }} transition={{ duration: reduced ? 0 : 0.22 }}>
        <div className="music-panel-top"><span className="eyebrow">{c.heading}</span><button className="icon-button" onClick={close} aria-label={c.close}><X size={18} /></button></div>
        <p className="music-track-title">{c.title}</p><p className="music-artist">{c.artist}</p>
        <p className="music-panel-hint">{c.hint}</p>
        <iframe src={`https://open.spotify.com/embed/track/${c.trackId}?utm_source=generator`} title={c.frameTitle} width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
        <a className="text-link" href={`https://open.spotify.com/track/${c.trackId}`} target="_blank" rel="noopener noreferrer">{c.external}<ExternalLink size={13} /></a>
        <p className="music-fallback">{c.fallback}</p>
      </motion.section>}
    </AnimatePresence>
    <button ref={trigger} className="music-button" onClick={() => setOpen(!open)} aria-label={c.open} aria-expanded={open} aria-controls="birthday-music-panel"><Music2 size={17} /><span>{c.open}</span>{open ? <X size={15} /> : <Play size={15} />}</button>
  </div>
}

function LocalMusicPlayer({ ref }: { ref?: Ref<MusicPlayerHandle> }) {
  const c = birthday.music
  const audio = useRef<HTMLAudioElement>(null)
  const [available, setAvailable] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [notice, setNotice] = useState('')
  const userPaused = useRef(false)
  const isPlaying = useRef(false)
  const pending = useRef(false)
  const attempt = useRef(0)
  const unavailable = useRef(false)

  const play = useCallback(async (automatic = false) => {
    const element = audio.current
    if (!element || unavailable.current || pending.current || isPlaying.current || (automatic && userPaused.current)) return
    const currentAttempt = ++attempt.current
    pending.current = true
    element.volume = Math.min(1, Math.max(0, c.volume))
    try {
      await element.play()
      if (audio.current === element && currentAttempt === attempt.current) setNotice('')
    } catch (error) {
      if (audio.current !== element || currentAttempt !== attempt.current) return
      const policyBlocked = error instanceof DOMException && error.name === 'NotAllowedError'
      setNotice(automatic && policyBlocked ? c.autoplayHint : c.blocked)
      isPlaying.current = false
      setPlaying(false)
    } finally {
      if (currentAttempt === attempt.current) pending.current = false
    }
  }, [c.volume, c.autoplayHint, c.blocked])

  useEffect(() => {
    if (!c.enabled || !c.src) return
    const controller = new AbortController()
    // Verify MIME too: a SPA fallback can return index.html with status 200.
    fetch(c.src, { method: 'HEAD', signal: controller.signal }).then(response => {
      if (controller.signal.aborted) return
      const valid = response.ok && (response.headers.get('content-type') ?? '').startsWith('audio/')
      unavailable.current = !valid
      setAvailable(valid)
      if (!valid && audio.current && !audio.current.paused) audio.current.pause()
      if (valid && c.autoPlayOnLoad) void play(true)
    }).catch(() => { if (!controller.signal.aborted) unavailable.current = true })
    return () => controller.abort()
  }, [c.enabled, c.src, c.autoPlayOnLoad, play])

  useEffect(() => {
    if (!c.autoPlayOnLoad) return
    const retry = (event: Event) => {
      // The player's own button handles play/pause. Never undo an explicit pause.
      if (event.target instanceof Element && event.target.closest('.music-player')) return
      if (event instanceof KeyboardEvent && (event.ctrlKey || event.altKey || event.metaKey || ['Escape', 'Shift', 'Control', 'Alt', 'Meta'].includes(event.key))) return
      void play(true)
    }
    // Run inside the original gesture so browsers can grant audio activation.
    const events = ['pointerup', 'touchend', 'click', 'keydown'] as const
    events.forEach(name => document.addEventListener(name, retry, true))
    return () => events.forEach(name => document.removeEventListener(name, retry, true))
  }, [c.autoPlayOnLoad, play])

  useImperativeHandle(ref, () => ({
    startOnOpen() {
      if (c.autoPlayOnOpen) void play(true)
    },
  }))

  function toggle() {
    if (!audio.current) return
    if (playing) {
      userPaused.current = true
      ++attempt.current
      pending.current = false
      setNotice('')
      audio.current.pause()
      return
    }
    userPaused.current = false
    void play()
  }

  return <div className="music-player">
    <audio ref={audio} src={c.src} loop preload="none" onPlay={() => { isPlaying.current = true; setPlaying(true); setAvailable(true); setNotice('') }} onPause={() => { isPlaying.current = false; setPlaying(false) }} onError={() => { unavailable.current = true; isPlaying.current = false; setPlaying(false); setAvailable(false) }} />
    {available && notice && <p className="music-notice" role="status">{notice}</p>}
    {available && <button className="music-button" onClick={toggle} aria-label={playing ? c.pause : c.play} aria-pressed={playing}><Music2 size={17} /><span>{c.label}</span>{playing ? <Pause size={15} /> : <Play size={15} />}</button>}
  </div>
}
