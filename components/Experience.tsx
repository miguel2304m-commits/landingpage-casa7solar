'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  useEffect(() => {
    const media = gsap.matchMedia();
    let lenis: Lenis | undefined;
    const progress = document.querySelector<HTMLElement>('.scroll-progress');
    const updateProgress = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = `scaleX(${range > 0 ? window.scrollY / range : 0})`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    media.add('(prefers-reduced-motion: no-preference)', () => {
      lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: { offset: -85 }, syncTouch: false });
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element => {
          gsap.from(element, { y: 32, opacity: 0, duration: .85, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 94%', once: true } });
        });
        gsap.to('.hero-copy', { y: -80, opacity: .12, ease: 'none', scrollTrigger: { trigger: '#inicio', start: 'top top', end: 'bottom 30%', scrub: true } });
        gsap.to('.bill-number', { y: -90, opacity: 0, stagger: .12, ease: 'none', scrollTrigger: { trigger: '.question-section', start: 'center center', end: 'bottom top', scrub: 1 } });
        gsap.fromTo('.energy-track-fill', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 85%', end: 'bottom 45%', scrub: .5 } });
        const impactTexts = gsap.utils.toArray<HTMLElement>('.impact-line');
        if (impactTexts.length) {
          const timeline = gsap.timeline({ scrollTrigger: { trigger: '.impact', start: 'top top', end: 'bottom bottom', scrub: .7 } });
          timeline.to(impactTexts[0], { opacity: 0, y: -30, duration: 1 }).fromTo(impactTexts[1], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }).to(impactTexts[1], { opacity: 0, y: -30, duration: 1 }, '+=.5').fromTo(impactTexts[2], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }).to('.impact-panel', { filter: 'drop-shadow(0 0 65px #ffc33277)', duration: 1 }, '<');
        }
        gsap.utils.toArray<HTMLElement>('.energy-node').forEach((node, index) => gsap.from(node, { opacity: .3, y: 12, scrollTrigger: { trigger: '.energy-flow', start: `top ${85 - index * 6}%`, end: 'bottom 40%', scrub: true } }));
      });
      const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 1000);
      return () => { window.clearTimeout(refresh); context.revert(); gsap.ticker.remove(tick); lenis?.destroy(); lenis = undefined; };
    });
    media.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const cursor = document.querySelector<HTMLElement>('.custom-cursor');
      if (!cursor) return;
      const move = (event: PointerEvent) => {
        cursor.style.opacity = '1'; cursor.style.left = `${event.clientX}px`; cursor.style.top = `${event.clientY}px`;
        const target = event.target as Element;
        cursor.classList.toggle('is-active', !!target.closest('a, button, input, summary'));
        cursor.classList.toggle('is-project', !!target.closest('[data-project]'));
        cursor.textContent = target.closest('[data-project]') ? 'VER' : '';
      };
      const leave = () => { cursor.style.opacity = '0'; };
      document.addEventListener('pointermove', move); document.addEventListener('pointerleave', leave);
      const cleanups = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic], [data-tilt]')).map(element => {
        const tilt = element.hasAttribute('data-tilt');
        const over = (event: PointerEvent) => { const r = element.getBoundingClientRect(); const x = (event.clientX - r.left - r.width / 2) / r.width; const y = (event.clientY - r.top - r.height / 2) / r.height; element.style.transform = tilt ? `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)` : `translate(${x * 8}px, ${y * 8}px)`; };
        const out = () => { element.style.transform = ''; };
        element.addEventListener('pointermove', over); element.addEventListener('pointerleave', out);
        return () => { out(); element.removeEventListener('pointermove', over); element.removeEventListener('pointerleave', out); };
      });
      return () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); cleanups.forEach(cleanup => cleanup()); };
    });
    updateProgress();
    return () => { media.revert(); window.removeEventListener('scroll', updateProgress); };
  }, []);
  return <><div className="scroll-progress" aria-hidden="true" /><div className="custom-cursor" aria-hidden="true" /></>;
}
