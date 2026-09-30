"use client";

import Image from "next/image";
import { ArrowDown, ArrowUpRight, Instagram } from "lucide-react";
import { useEffect, useRef } from "react";
import { projects, projectsSource } from "@/data/projects";
import "./projects.css";

export default function Projects() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projects.length < 2) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    async function connectGallery() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      const gallery = galleryRef.current;
      const rail = railRef.current;
      if (disposed || !gallery || !rail) return;

      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => Math.max(0, rail.scrollWidth - rail.clientWidth);
        if (distance() === 0) return;

        const tween = gsap.to(rail, {
          scrollLeft: distance,
          ease: "none",
          scrollTrigger: {
            trigger: gallery,
            start: "top 100px",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        // Keep every project reachable by Tab, including cards outside the viewport.
        const handleFocus = (event: FocusEvent) => {
          if (!(event.target instanceof HTMLElement)) return;
          const card = event.target.closest<HTMLElement>(".project-card");
          const trigger = tween.scrollTrigger;
          if (!card || !trigger || !event.target.matches(":focus-visible")) return;
          const progress = Math.min(1, Math.max(0, card.offsetLeft / distance()));
          window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: "instant" });
          tween.progress(progress);
        };
        rail.addEventListener("focusin", handleFocus);
        return () => {
          rail.removeEventListener("focusin", handleFocus);
          rail.scrollLeft = 0;
        };
      });
      cleanup = () => media.revert();
    }

    void connectGallery();
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <section id="projetos" className="projects-section" aria-labelledby="projects-title">
      <div className="container">
        <div className="projects-heading">
          <div>
            <p className="eyebrow"><span /> ENERGIA NA PRÁTICA</p>
            <h2 id="projects-title" className="projects-title">Energia que já está<br /><span>gerando economia.</span></h2>
          </div>
          <p className="projects-intro">Conheça as instalações e acompanhe nossos projetos no Instagram.</p>
        </div>

        {projects.length > 0 ? (
          <div className="projects-gallery" ref={galleryRef}>
            <div className="projects-rail" ref={railRef} aria-label="Projetos da Casa 7 Solar Energy" role="list" tabIndex={0}>
              {projects.map((project, index) => (
                <article className="project-card" key={project.id} role="listitem">
                  <a href={project.sourceUrl} data-project target="_blank" rel="noopener noreferrer" aria-label={`Ver ${project.title} no Instagram (abre em nova aba)`}>
                    <div className="project-image">
                      <Image src={project.image} alt={project.imageAlt} width={project.imageWidth} height={project.imageHeight} sizes="(max-width: 640px) 85vw, (max-width: 1023px) 65vw, 520px" loading="lazy" />
                      <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
                      <span className="project-open" aria-hidden="true"><ArrowUpRight size={24} /></span>
                    </div>
                    <div className="project-caption">
                      <p>{project.category}{project.location ? ` · ${project.location}` : ""}</p>
                      <h3>{project.title}</h3>
                      {project.description && <span className="project-description">{project.description}</span>}
                      <span className="project-view">Ver projeto <ArrowUpRight size={16} aria-hidden="true" /></span>
                    </div>
                  </a>
                </article>
              ))}
            </div>
            <p className="projects-scroll-hint"><ArrowDown size={14} aria-hidden="true" /><span>Explore os projetos</span><span className="projects-gallery-count">{String(projects.length).padStart(2, "0")} PROJETOS</span></p>
          </div>
        ) : (
          <div className="projects-social-panel">
            <div className="projects-social-content">
              <div className="projects-profile">
                <Image src="/images/casa7-logo-original.jpg" alt="Logo Casa 7 Solar Energy" width={70} height={70} />
                <div><p>CASA 7 SOLAR ENERGY</p><span>{projectsSource.label}</span></div>
              </div>
              <h3>Do projeto ao telhado.<br />Acompanhe de perto.</h3>
              <p>Instalações, bastidores e energia solar em ação.<br className="projects-desktop-break" /> Conheça o nosso trabalho no perfil oficial.</p>
              <a className="projects-instagram-link" href={projectsSource.url} target="_blank" rel="noopener noreferrer" aria-label="Explorar projetos reais no Instagram (abre em nova aba)"><Instagram size={19} aria-hidden="true" />Explorar projetos reais<ArrowUpRight size={20} aria-hidden="true" /></a>
            </div>
            <div className="projects-solar-art" aria-hidden="true">
              <div className="projects-art-orbit" />
              <div className="projects-art-orbit projects-art-orbit-second" />
              <div className="projects-art-sun" />
              <div className="projects-art-panel"><div /><div /><div /><div /><div /><div /><div /><div /><div /><div /><div /><div /></div>
              <div className="projects-art-caption"><span /> CONECTADOS AO SOL.</div>
            </div>
            <span className="projects-social-corner" aria-hidden="true"><Instagram size={22} /></span>
          </div>
        )}
      </div>
    </section>
  );
}
