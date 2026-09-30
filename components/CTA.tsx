import { ArrowUpRight } from 'lucide-react';
import { whatsappUrl } from '@/lib/whatsapp';

export default function CTA({ children = 'Quero meu orçamento', href, secondary = false, className = '' }: { children?: React.ReactNode; href?: string; secondary?: boolean; className?: string }) {
  const url = href || whatsappUrl();
  const external = url.startsWith('https://');
  return <a href={url} className={`button ${secondary ? 'button-secondary' : 'button-primary'} ${className}`} data-magnetic {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}><span>{children}</span><ArrowUpRight size={19} strokeWidth={1.8} /></a>;
}
