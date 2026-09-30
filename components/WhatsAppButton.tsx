import { whatsappUrl } from '@/lib/whatsapp';
import { ArrowUpRight } from 'lucide-react';

export function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.5 11.6a8.4 8.4 0 0 1-12.4 7.5L3 20.5l1.4-5A8.4 8.4 0 1 1 20.5 11.6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M8.1 7.6c-.8 1.3-.1 3.3 1.8 5.2 1.9 1.9 4 2.6 5.2 1.8l.8-1.3-2.4-1.2-.9.9c-1.2-.5-2.2-1.5-2.7-2.7l.9-.9-1.2-2.3-1.5.5Z" fill="currentColor"/></svg>;
}

export default function WhatsAppButton() {
  return <><a className="whatsapp-float" href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="Conversar com a Casa 7 pelo WhatsApp"><WhatsAppIcon size={28} /><span>Vamos conversar?</span></a><div className="mobile-cta"><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={21} /> Solicitar orçamento <ArrowUpRight size={18} /></a></div></>;
}
