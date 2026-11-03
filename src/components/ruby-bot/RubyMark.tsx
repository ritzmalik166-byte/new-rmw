/* Ruby's mark in the site's palette: a navy speech bubble on a pink offset
   bubble (the same hard-shadow move as the buttons), carrying a white "R"
   and a spark. Replaces the old photo avatar wherever Ruby appears. */
export function RubyMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Ruby">
      <path
        d="M10 6h28a6 6 0 0 1 6 6v18a6 6 0 0 1-6 6H22l-9 8v-8h-3a6 6 0 0 1-6-6V12a6 6 0 0 1 6-6z"
        transform="translate(3 2)"
        fill="#c9356e"
      />
      <path
        d="M10 6h28a6 6 0 0 1 6 6v18a6 6 0 0 1-6 6H22l-9 8v-8h-3a6 6 0 0 1-6-6V12a6 6 0 0 1 6-6z"
        fill="#161b46"
        stroke="#fff8ed"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 30V13h7.2c3.6 0 5.8 2 5.8 5.1 0 2.4-1.3 4-3.4 4.7L30 30h-4.1l-3.6-6.8h-2.1V30zm3.7-9.9h3.2c1.5 0 2.4-.8 2.4-2.1s-.9-2.1-2.4-2.1h-3.2z"
        fill="#fff8ed"
      />
      <path d="M36 11l1.2 2.8L40 15l-2.8 1.2L36 19l-1.2-2.8L32 15l2.8-1.2z" fill="#c9356e" />
    </svg>
  );
}
