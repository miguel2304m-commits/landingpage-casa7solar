'use client';

import dynamic from 'next/dynamic';
import { ArrowDown, ArrowUpRight, Check, ShieldCheck, Sun, Zap } from 'lucide-react';
import CTA from './CTA';
import './hero-sky.css';

const SolarScene = dynamic(() => import('./SolarScene'), { ssr: false, loading: () => <div className="scene-placeholder" aria-hidden="true"><div /><div /><div /></div> });

export default function Hero() {
  return <section id="inicio" className="hero" aria-labelledby="hero-title"><div className="hero-stage">
    <div className="hero-grid" aria-hidden="true" /><div className="solar-halo" aria-hidden="true" /><div className="hero-stars" aria-hidden="true" />
    <div className="container hero-content"><div className="hero-copy">
      <div className="eyebrow hero-enter"><span className="status-dot" /> O FUTURO É SOLAR. E COMEÇA AGORA.</div>
      <h1 id="hero-title" className="hero-enter">Transforme<br />sol em<br /><span>economia.</span><span className="headline-spark" aria-hidden="true">✳</span></h1>
      <p className="hero-description hero-enter">Energia solar para residências e empresas<br className="desktop-break" /> que querem reduzir custos e investir no futuro.</p>
      <div className="hero-actions hero-enter"><CTA /><a href="#como-funciona" className="text-link">Entender como funciona <ArrowUpRight size={16} /></a></div>
      <div className="hero-reassurance hero-enter"><span><Check size={14} /> Orçamento gratuito</span><span><Check size={14} /> Projeto sob medida</span></div>
    </div></div>
    <div className="hero-scene"><SolarScene /></div>
    <div className="scene-annotation"><span className="annotation-cross">+</span><span>TECNOLOGIA FOTOVOLTAICA<br /><b>Potência para um novo amanhã.</b></span><i /></div>
    <a href="#economia" className="saving-badge hero-enter"><span className="saving-icon"><Zap size={21} fill="currentColor" /></span><span className="saving-badge-copy">MENOS CONTA. MAIS POSSIBILIDADES.<strong><small>ATÉ</small> 95<small>%</small></strong><span>de economia na conta de luz<sup>*</sup></span></span><ArrowUpRight size={18} /></a>
    <div className="container hero-bottom"><a href="#economia" className="scroll-cue"><span><ArrowDown size={17} /></span> EXPLORE UMA NOVA ENERGIA</a><span className="hero-coordinate"><span /> ENERGIA LIMPA. IMPACTO REAL.</span></div>
    <span className="hero-side-label">CASA 7 SOLAR ENERGY — EST. NO FUTURO</span>
  </div></section>;
}

export function TrustStrip() {
  return <div className="trust-strip"><div className="container"><span><Sun size={20} /> A energia vem do sol.<b>A tranquilidade, da Casa 7.</b></span><span><ShieldCheck size={18} /> Projeto personalizado</span><span><Zap size={18} /> Residencial e empresarial</span><a href="#simule">Descubra seu potencial <ArrowUpRight size={17} /></a></div></div>;
}
