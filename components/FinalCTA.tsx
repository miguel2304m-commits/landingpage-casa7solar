import { Phone, Sun } from 'lucide-react';
import CTA from './CTA';

function SolarCity() {
  return <svg className="solar-city" viewBox="0 0 1440 400" aria-hidden="true"><defs><linearGradient id="city-face" x2="1" y2="1"><stop stopColor="#2a4654"/><stop offset="1" stopColor="#091623"/></linearGradient></defs>{Array.from({length:20},(_,i)=>{const x=i*83-70;const h=65+((i*73)%110);const y=350-h;return <g key={i} style={{animationDelay:`${i*.12}s`}}><path d={`M${x} ${y}l40-22 55 26v${h}l-40 22-55-26Z`} fill="url(#city-face)" stroke="#34495a"/><path d={`m${x} ${y} 55 26 40-22`} stroke="#587482"/><path className="city-roof" d={`m${x+7} ${y-1} 30-15 42 20-30 15Z`} fill="#18477a" stroke="#558bbb"/>{Array.from({length:3},(_,j)=><path className="city-window" key={j} d={`m${x+12} ${y+31+j*22} 28 13v7l-28-13Z`} fill="#ffd46a" opacity=".6"/>)}</g>})}</svg>;
}

export default function FinalCTA() {
  return <section className="final-cta section" aria-labelledby="final-title"><div className="final-sun" aria-hidden="true"/><SolarCity/><div className="container final-content" data-reveal><span className="eyebrow"><Sun size={16}/> O FUTURO NÃO ESPERA. A SUA ECONOMIA TAMBÉM NÃO.</span><h2 id="final-title">Seu próximo projeto<br />pode começar <span className="yellow">agora.</span></h2><p>Solicite uma análise e descubra o potencial<br />de economia do seu imóvel.</p><CTA>Pedir orçamento gratuito</CTA><a className="final-phone" href="tel:+5511912491955"><Phone size={15}/> +55 11 91249-1955</a></div></section>;
}
