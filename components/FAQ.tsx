import { ArrowUpRight, Plus } from "lucide-react";
import { faqItems } from "@/data/faq";
import { whatsappUrl } from "@/lib/whatsapp";
import "./conversion.css";

export default function FAQ() {
  return (
    <section id="faq" className="conversion-section faq-section" aria-labelledby="faq-title">
      <div className="conversion-shell faq-layout">
        <div className="faq-intro">
          <span className="conversion-eyebrow"><span /> Tudo às claras</span>
          <h2 id="faq-title">Dúvidas sobre<br /><em>energia solar?</em></h2>
          <p>Informação é o primeiro passo para uma boa decisão.</p>
          <a className="faq-contact" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Converse com a nossa equipe <ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
        <div className="faq-list">
          {faqItems.map((item, index) => (
            <details className="faq-item" key={item.id} name="solar-faq">
              <summary><span className="faq-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span>{item.question}</span><Plus className="faq-plus" size={18} strokeWidth={1.5} aria-hidden="true" /></summary>
              <div className="faq-answer"><p>{item.answer}</p></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
