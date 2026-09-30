import CTA from './CTA';

export default function Impact() {
  return <section className="impact" aria-label="Aproveite a energia do sol"><div className="impact-sticky"><div className="impact-glow" aria-hidden="true"/><div className="impact-panel" aria-hidden="true"><div className="impact-panel-cells"/></div><span className="eyebrow">A ENERGIA DO AMANHÃ JÁ ESTÁ AQUI</span><div className="impact-copy"><h2 className="impact-line">Todo dia<br /><span className="yellow">o sol nasce.</span></h2><h2 className="impact-line">E todo dia existe<br /><span className="yellow">energia disponível.</span></h2><h2 className="impact-line">A pergunta é:<br /><span className="yellow">você está aproveitando?</span></h2></div><CTA>Quero energia solar</CTA><span className="impact-footnote">Sua economia é o nosso propósito.</span></div></section>;
}
