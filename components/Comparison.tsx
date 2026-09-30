'use client';

import { useState } from 'react';
import { ChevronsLeftRight } from 'lucide-react';
import ArchitectureArt from './ArchitectureArt';

export default function Comparison() {
  const [position, setPosition] = useState(50);
  return <section className="section comparison-section"><div className="container comparison-layout"><div data-reveal><span className="eyebrow">O MESMO TELHADO. OUTRO FUTURO.</span><h2>Uma mudança<br />que faz <span className="yellow">diferença.</span></h2><p className="section-copy">De um espaço que recebe o sol a um sistema que produz energia. Explore essa transformação.</p><p className="comparison-hint"><ChevronsLeftRight size={19} /> Arraste para comparar</p><small className="muted">Comparação ilustrativa. Não representa uma instalação realizada.</small></div><div className="comparison" data-reveal><div className="comparison-base"><ArchitectureArt solar /></div><div className="comparison-before" style={{clipPath:`inset(0 ${100-position}% 0 0)`}}><ArchitectureArt solar={false} /></div><span className="compare-label before-label">ANTES</span><span className="compare-label after-label">COM ENERGIA SOLAR</span><div className="comparison-divider" style={{left:`${position}%`}}><span><ChevronsLeftRight size={22}/></span></div><input type="range" min="0" max="100" value={position} onChange={event=>setPosition(Number(event.target.value))} aria-label="Comparar casa antes e depois da instalação solar" aria-valuetext={`${position}% da imagem sem painéis solares`} /></div></div></section>;
}
