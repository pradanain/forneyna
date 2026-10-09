import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { birthday } from '../config/birthday'

export function PhotoLightbox({ index, onChange, onClose }: { index: number; onChange: (index: number) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [closing, setClosing] = useState(false)
  const reduced = useReducedMotion()
  const touch = useRef<{ x: number; y: number } | null>(null)
  const photos = birthday.gallery.photos
  const photo = photos[index]
  const move = (direction: number) => onChange((index + direction + photos.length) % photos.length)

  useEffect(() => {
    const element = dialog.current!
    const trigger = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    return () => { element.close(); document.body.style.overflow = overflow; trigger?.focus({ preventScroll: true }) }
  }, [])

  const close = () => { if (reduced) onClose(); else setClosing(true) }
  return <dialog ref={dialog} className={`lightbox ${closing ? 'is-closing' : ''}`} aria-labelledby="lightbox-heading" aria-describedby="lightbox-note" onCancel={event => { event.preventDefault(); close() }} onClick={event => { if (event.target === event.currentTarget) close() }} onKeyDown={event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
    if (event.key === 'Tab') {
      const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'))
      const first = buttons[0]
      const last = buttons[buttons.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
  }}>
    <motion.div className="lightbox-card" initial={reduced ? false : { opacity: 0, y: 16, scale: 0.97 }} animate={closing ? { opacity: 0, y: reduced ? 0 : 10, scale: 0.98 } : { opacity: 1, y: 0, scale: 1 }} transition={{ duration: reduced ? 0 : closing ? 0.18 : 0.35, ease: [0.22, 1, 0.36, 1] }} onAnimationComplete={() => { if (closing) onClose() }}>
      <div className="lightbox-top"><span className="eyebrow">{birthday.lightbox.title}</span><button className="icon-button" aria-label={birthday.lightbox.close} onClick={close} autoFocus><X size={22} /></button></div>
      <figure onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY } }} onTouchEnd={event => {
        if (!touch.current) return
        const dx = event.changedTouches[0].clientX - touch.current.x
        const dy = event.changedTouches[0].clientY - touch.current.y
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1)
        touch.current = null
      }} onTouchCancel={() => { touch.current = null }}>
        <motion.img key={photo.src} src={photo.src} alt={photo.alt} width="480" height="600" initial={reduced ? false : { opacity: 0.35, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : 0.32 }} />
        <figcaption aria-live="polite"><motion.div key={photo.caption} initial={reduced ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.28 }}><h2 id="lightbox-heading" className="handwriting">{photo.caption}</h2><p id="lightbox-note">{photo.note}</p></motion.div></figcaption>
      </figure>
      <div className="lightbox-controls"><button className="icon-button" onClick={() => move(-1)} aria-label={birthday.lightbox.previous}><ChevronLeft /></button><span aria-live="polite">{String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span><button className="icon-button" onClick={() => move(1)} aria-label={birthday.lightbox.next}><ChevronRight /></button></div>
      <p className="lightbox-hint">{birthday.lightbox.hint}</p>
    </motion.div>
  </dialog>
}
