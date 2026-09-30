import { ArrowUp, Instagram } from 'lucide-react';
import Brand from './Brand';

export default function Footer() {
  return <footer className="footer"><div className="container"><div className="footer-top"><Brand/><p>A energia que transforma.<br /><span>A economia que fica.</span></p><a href="https://www.instagram.com/casa7solarenergy/" target="_blank" rel="noopener noreferrer"><Instagram size={18}/> @casa7solarenergy</a><a className="back-top" href="#inicio" aria-label="Voltar ao início"><ArrowUp size={20}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Casa 7 Solar Energy. Todos os direitos reservados.</span><span>Residencial & empresarial <i/> Energia para um novo amanhã.</span></div></div></footer>;
}
