import { useState } from 'react'
import { birthday } from '../config/birthday'

export function BirthdayCat() {
  const [greeting, setGreeting] = useState(false)
  const c = birthday.cat
  return <div className={`birthday-cat ${greeting ? 'is-petted' : ''}`}>
    <button className="cat-button" aria-label={c.label} aria-expanded={greeting} aria-controls="cat-greeting" onClick={() => setGreeting(!greeting)}>
      <svg viewBox="0 0 180 150" fill="none" aria-hidden="true">
        <ellipse cx="90" cy="137" rx="59" ry="7" fill="#ddc7b8" opacity=".4" />
        <path className="cat-tail" d="M119 123C158 130 168 96 149 90C137 87 136 100 146 101" stroke="#c6aa93" strokeWidth="14" strokeLinecap="round" />
        <path d="M58 87C46 104 49 133 68 135H111C129 128 124 100 112 87" fill="#e8d5bd" stroke="#aa8c76" strokeWidth="1.6" />
        <ellipse cx="88" cy="117" rx="22" ry="18" fill="#fff4e4" />
        <path d="M50 58L49 18Q51 12 72 34C83 30 99 31 108 35Q129 13 132 20L128 62" fill="#e8d5bd" stroke="#aa8c76" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M55 40L55 26L67 38M113 39L126 27L123 45" fill="#dba5ad" />
        <ellipse cx="89" cy="65" rx="43" ry="34" fill="#e8d5bd" stroke="#aa8c76" strokeWidth="1.6" />
        <path d="M78 33L82 44M91 32V43M104 35L100 45" stroke="#c6aa93" strokeWidth="4" strokeLinecap="round" />
        <g className="cat-eyes" fill="#72594b"><ellipse cx="72" cy="63" rx="3.6" ry="5" /><ellipse cx="106" cy="63" rx="3.6" ry="5" /></g>
        <ellipse cx="62" cy="74" rx="8" ry="4" fill="#e5afb6" opacity=".7" /><ellipse cx="116" cy="74" rx="8" ry="4" fill="#e5afb6" opacity=".7" />
        <path d="M85 72Q89 69 93 72L89 76Z" fill="#b97982" />
        <path d="M89 76C88 82 81 81 81 78M89 76C90 82 97 81 97 78M60 74L37 70M60 79L38 83M118 74L141 70M118 79L140 83" stroke="#997767" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M88 99C64 82 64 113 87 104C110 120 117 85 91 99" fill="#d69aa9" stroke="#b77989" />
        <circle cx="89" cy="102" r="4" fill="#f0c6cf" />
        <path d="M64 123V134M73 126V135M104 126V135M113 123V134" stroke="#aa8c76" strokeWidth="1.4" strokeLinecap="round" />
        {greeting && <path className="cat-love" d="M151 57C127 43 139 30 151 40C163 30 175 43 151 57Z" fill="#d69aa9" />}
      </svg>
    </button>
    <p id="cat-greeting" className="handwriting cat-greeting" aria-live="polite">{greeting ? c.message : c.hint}</p>
  </div>
}
