'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import Brand from './Brand';
import { whatsappUrl } from '@/lib/whatsapp';

const links = [['Início', 'inicio'], ['Como funciona', 'como-funciona'], ['Soluções', 'solucoes'], ['Projetos', 'projetos'], ['Simule', 'simule']];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  return <header className={`header ${scrolled || open ? 'is-scrolled' : ''}`}><div className="container header-inner">
    <Brand />
    <nav className={`navigation ${open ? 'is-open' : ''}`} id="main-navigation" aria-label="Navegação principal">{links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}</nav>
    <a className="header-cta" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Orçamento <ArrowUpRight size={16} /></a>
    <button type="button" className="menu-toggle" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
  </div></header>;
}
