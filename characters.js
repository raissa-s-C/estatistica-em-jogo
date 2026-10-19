/* Personagens em SVG: fada Lumi e gato Bigode */
/* =========================================================
   PERSONAGENS (SVG): fada Lumi e gato Bigode
   mood: "normal" | "happy" | "sad"
   ========================================================= */
function fairySVG(mood) {
  const ink = "#3a2d5c";
  const eyes = mood === "happy"
    ? `<path d="M45 56q6-7 12 0M63 56q6-7 12 0" stroke="${ink}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`
    : `<ellipse cx="51" cy="56" rx="3.6" ry="4.8" fill="${ink}"/><ellipse cx="69" cy="56" rx="3.6" ry="4.8" fill="${ink}"/>
       <circle cx="52.3" cy="54.2" r="1.4" fill="#fff"/><circle cx="70.3" cy="54.2" r="1.4" fill="#fff"/>
       ${mood === "sad" ? `<path d="M44 49L56 45M76 49L64 45" stroke="${ink}" stroke-width="2" stroke-linecap="round"/><path d="M42 62q-3.5 5 0 8q3.5-3 0-8z" fill="#9fd0ff"/>` : ""}`;
  const mouth = mood === "happy" ? `<path d="M53 66q7 9 14 0z" fill="#e8527f"/>`
    : mood === "sad" ? `<path d="M54 70q6-5 12 0" stroke="#c2456b" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
    : `<path d="M54 66q6 5 12 0" stroke="#c2456b" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  return `<svg class="fairy" viewBox="0 0 120 134" role="img" aria-label="Lumi, a fada dos dados">
    <g class="wing" style="--x:0"><ellipse cx="32" cy="60" rx="20" ry="33" transform="rotate(-24 32 60)" fill="rgba(190,222,255,.6)" stroke="rgba(255,255,255,.95)" stroke-width="1.6"/><ellipse cx="36" cy="92" rx="11" ry="18" transform="rotate(18 36 92)" fill="rgba(255,206,232,.6)" stroke="rgba(255,255,255,.95)" stroke-width="1.4"/></g>
    <g class="wing r"><ellipse cx="88" cy="60" rx="20" ry="33" transform="rotate(24 88 60)" fill="rgba(190,222,255,.6)" stroke="rgba(255,255,255,.95)" stroke-width="1.6"/><ellipse cx="84" cy="92" rx="11" ry="18" transform="rotate(-18 84 92)" fill="rgba(255,206,232,.6)" stroke="rgba(255,255,255,.95)" stroke-width="1.4"/></g>
    <path d="M34 52Q34 22 60 22Q86 22 86 52Q86 68 80 74L40 74Q34 68 34 52z" fill="#8fdcc0"/>
    <circle cx="35" cy="33" r="9" fill="#8fdcc0"/><circle cx="85" cy="33" r="9" fill="#8fdcc0"/>
    <circle cx="35" cy="33" r="3.4" fill="#ff9cc2"/><circle cx="85" cy="33" r="3.4" fill="#ff9cc2"/>
    <path d="M50 78Q60 83 70 78L82 110Q60 118 38 110z" fill="#ff9cc2"/>
    <path d="M50 78Q60 83 70 78L68 84Q60 88 52 84z" fill="#fff" fill-opacity=".7"/>
    <path d="M46 92Q60 98 74 92" stroke="#fff" stroke-opacity=".6" stroke-width="2" fill="none"/>
    <ellipse cx="45" cy="86" rx="5" ry="3.4" fill="#ffe5d3" transform="rotate(${mood === "happy" ? -50 : 25} 45 86)"/>
    <ellipse cx="75" cy="86" rx="5" ry="3.4" fill="#ffe5d3" transform="rotate(${mood === "happy" ? 50 : -25} 75 86)"/>
    <path d="M54 113v13M66 113v13" stroke="#ffe5d3" stroke-width="4.4" stroke-linecap="round"/>
    <ellipse cx="54" cy="127" rx="5.4" ry="3.2" fill="#ff7fb0"/><ellipse cx="66" cy="127" rx="5.4" ry="3.2" fill="#ff7fb0"/>
    <circle cx="60" cy="54" r="24" fill="#ffe5d3"/>
    <path d="M36 52Q40 30 60 30Q80 30 84 52Q72 41 60 43Q48 41 36 52z" fill="#8fdcc0"/>
    <path d="M60 14l2.4 5.2 5.6.7-4.2 3.8 1.2 5.5-5-2.8-5 2.8 1.2-5.5-4.2-3.8 5.6-.7z" fill="#ffd966" stroke="#ffb84d" stroke-width="1"/>
    ${eyes}${mouth}
    <circle cx="43" cy="64" r="4.6" fill="#ff9cc2" fill-opacity=".55"/><circle cx="77" cy="64" r="4.6" fill="#ff9cc2" fill-opacity=".55"/>
    <path class="tw" d="M14 24l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff" stroke="#ffd966"/>
    <path class="tw d2" d="M104 14l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z" fill="#fff" stroke="#9fc4ff"/>
    <path class="tw d3" d="M108 78l1.4 3.4 3.4 1.4-3.4 1.4-1.4 3.4-1.4-3.4-3.4-1.4 3.4-1.4z" fill="#fff" stroke="#ff9cc2"/>
  </svg>`;
}
function catSVG(mood) {
  const ink = "#4a3340";
  const eyes = mood === "happy" ? `<path d="M46 50q5-6 10 0M64 50q5-6 10 0" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
    : mood === "sad" ? `<path d="M46 52q5 4 10 0M64 52q5 4 10 0" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M44 45L56 48M76 45L64 48" stroke="${ink}" stroke-width="1.8" stroke-linecap="round"/>`
    : `<ellipse cx="51" cy="50" rx="3.4" ry="4.4" fill="${ink}"/><ellipse cx="69" cy="50" rx="3.4" ry="4.4" fill="${ink}"/><circle cx="52.2" cy="48.4" r="1.2" fill="#fff"/><circle cx="70.2" cy="48.4" r="1.2" fill="#fff"/>`;
  return `<svg class="cat" viewBox="0 0 120 108" role="img" aria-label="Bigode, o gatinho">
    <path d="M94 92q22-4 18-26q-2-10-12-9" stroke="#ffcf9e" stroke-width="11" fill="none" stroke-linecap="round"/>
    <ellipse cx="60" cy="82" rx="38" ry="25" fill="#ffd9b0"/>
    <ellipse cx="44" cy="102" rx="11" ry="6" fill="#fff0de"/><ellipse cx="76" cy="102" rx="11" ry="6" fill="#fff0de"/>
    <path d="M33 38L36 10L56 26z" fill="#ffd9b0"/><path d="M87 38L84 10L64 26z" fill="#ffd9b0"/>
    <path d="M38 30L39 18L49 26z" fill="#ff9cc2"/><path d="M82 30L81 18L71 26z" fill="#ff9cc2"/>
    <ellipse cx="60" cy="50" rx="30" ry="27" fill="#ffd9b0"/>
    <path d="M52 26v8M60 24v9M68 26v8" stroke="#f0b27d" stroke-width="3" stroke-linecap="round"/>
    ${eyes}
    <path d="M56.500 58h7l-3.500 4z" fill="#ff7fa8"/>
    <path d="M60 62q-3 5-7 2M60 62q3 5 7 2" stroke="${ink}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M30 56l-13-3M30 62l-13 3M90 56l13-3M90 62l13 3" stroke="${ink}" stroke-opacity=".55" stroke-width="1.4" stroke-linecap="round"/>
    <circle cx="40" cy="60" r="4.4" fill="#ff9cc2" fill-opacity=".5"/><circle cx="80" cy="60" r="4.4" fill="#ff9cc2" fill-opacity=".5"/>
  </svg>`;
}