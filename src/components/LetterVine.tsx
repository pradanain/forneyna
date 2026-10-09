export function LetterVine({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 110 200" fill="none" aria-hidden="true">
    <path d="M5 190C56 157 2 104 47 74S97 38 99 5M24 127Q62 126 73 98M43 76Q18 57 27 35" stroke="#99a184" strokeWidth="1.5" />
    {[[15, 167, -30], [24, 142, 40], [23, 113, -45], [35, 92, 35], [59, 63, -30], [83, 41, 35], [94, 19, -20], [56, 117, 30]].map(([x, y, angle], i) => <path key={i} d="M0 0Q-20 -5 -12 -25Q5 -18 0 0Z" transform={`translate(${x} ${y}) rotate(${angle})`} fill={i % 2 ? '#b6bea3' : '#9fae91'} />)}
    {[[28, 36], [72, 98]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map(angle => <ellipse key={angle} cy="-8" rx="5" ry="9" transform={`rotate(${angle})`} fill="#e6b7c4" />)}
      <circle r="4" fill="#cfb074" />
    </g>)}
  </svg>
}
