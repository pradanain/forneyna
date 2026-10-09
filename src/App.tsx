import { useEffect, useRef, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { ArrowUp, Heart } from 'lucide-react'
import { birthday } from './config/birthday'
import { GiftBox } from './components/GiftBox'
import { BirthdayHero } from './components/BirthdayHero'
import { PolaroidGallery } from './components/PolaroidGallery'
import { LetterEnvelope } from './components/LetterEnvelope'
import { BirthdayCake } from './components/BirthdayCake'
import { MusicPlayer } from './components/MusicPlayer'
import type { MusicPlayerHandle } from './components/MusicPlayer'

export default function App() {
  const [opened, setOpened] = useState(false)
  const [round, setRound] = useState(0)
  const music = useRef<MusicPlayerHandle>(null)
  useEffect(() => {
    document.title = birthday.siteTitle
    document.querySelector('meta[name="description"]')?.setAttribute('content', birthday.description)
  }, [])
  useEffect(() => {
    if (!opened) return
    const heading = document.getElementById('birthday-heading')
    heading?.focus({ preventScroll: true })
    document.getElementById('birthday')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }, [opened])
  function replay() {
    setOpened(false)
    setRound(value => value + 1)
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
    window.scrollTo({ top: 0, behavior: 'instant' })
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('.gift-button')?.focus({ preventScroll: true }))
  }
  return <MotionConfig reducedMotion="user">
    <a href="#main" className="skip-link">{birthday.accessibility.skip}</a>
    <header className="site-header">
      <a href="#surprise" className="brand" aria-label={birthday.siteTitle}><Heart size={21} strokeWidth={1.1} /><span>{birthday.brand}<small>{birthday.fullName.toUpperCase()}</small></span></a>
      {opened ? <nav aria-label={birthday.navigation.label}><a href="#birthday">{birthday.navigation.birthday}</a><a href="#little-things">{birthday.navigation.gallery}</a><a href="#letter">{birthday.navigation.letter}</a><a href="#wish">{birthday.navigation.wish}</a></nav> : <span className="header-note handwriting">{birthday.madeWithLove} ♡</span>}
    </header>
    <main id="main" tabIndex={-1}>
      <GiftBox key={round} opened={opened} onUnwrap={() => music.current?.startOnOpen()} onOpen={() => setOpened(true)} />
      {opened && <><BirthdayHero /><div className="heart-divider" aria-hidden="true"><span />♡<span /></div><PolaroidGallery /><LetterEnvelope /><BirthdayCake onReplay={replay} />
        <footer className="site-footer"><Heart size={20} strokeWidth={1} /><p className="handwriting">{birthday.footer.text}</p><p>{birthday.footer.signature}</p><a className="icon-button" href="#surprise" aria-label={birthday.footer.backToTop}><ArrowUp size={18} /></a></footer>
      </>}
    </main>
    <MusicPlayer ref={music} />
  </MotionConfig>
}
