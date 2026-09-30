import Header from '@/components/Header';
import Hero, { TrustStrip } from '@/components/Hero';
import Experience from '@/components/Experience';
import SavingsSection from '@/components/SavingsSection';
import HowItWorks from '@/components/HowItWorks';
import Solutions from '@/components/Solutions';
import Calculator from '@/components/Calculator';
import Projects from '@/components/Projects';
import Impact from '@/components/Impact';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Home() {
  return <><Experience/><Header/><main id="conteudo"><Hero/><TrustStrip/><SavingsSection/><HowItWorks/><Solutions/><Calculator/><Projects/><Impact/><FinalCTA/></main><Footer/><WhatsAppButton/></>;
}
