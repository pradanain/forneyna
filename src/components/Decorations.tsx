export function FlowerSprig({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 150 240" fill="none" aria-hidden="true">
    <g stroke="#89927b" strokeWidth="2" strokeLinecap="round">
      <path d="M69 232C89 173 53 107 89 38M70 192C47 152 26 122 24 85M76 166C103 148 123 119 120 91" />
      <path d="M76 190C113 182 109 161 109 161C86 161 76 190 76 190Z" fill="#a5ab94" />
      <path d="M70 148C49 138 46 114 46 114C70 119 70 148 70 148Z" fill="#a5ab94" />
      <path d="M73 102C102 101 103 82 103 82C82 80 73 102 73 102Z" fill="#b0b59d" />
    </g>
    {[[89, 36, 1], [25, 83, 0.8], [120, 87, 0.7]].map(([x, y, s], i) => <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 60, 120, 180, 240, 300].map(r => <ellipse key={r} cy="-14" rx="10" ry="17" transform={`rotate(${r})`} fill={i === 1 ? '#efd6ce' : '#edc0cb'} stroke="#cc94a0" strokeWidth="0.7" />)}
      <circle r="7" fill="#c6a466" /><circle r="3" fill="#ad894d" />
    </g>) }
  </svg>
}

export function Bow({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 160 100" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M78 44C56 10 7 7 15 31C22 51 56 48 78 44ZM81 43C99 10 148 5 147 27C146 46 105 47 81 43Z" />
      <path d="M77 47C55 63 55 76 43 87L60 80L67 91C69 68 76 56 81 46M86 46C99 61 97 83 114 92L113 76L130 81C104 57 103 54 86 46Z" />
      <ellipse cx="81" cy="44" rx="6" ry="7" />
    </g>
  </svg>
}
