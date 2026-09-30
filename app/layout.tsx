import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Casa 7 Solar Energy | Energia Solar Residencial e Empresarial',
  description: 'Reduza seus gastos com energia com soluções de energia solar residencial e empresarial. Solicite seu orçamento com a Casa 7 Solar Energy.',
  keywords: ['Casa 7 Solar Energy', 'energia solar São Paulo', 'placas solares', 'instalação de placas solares', 'energia fotovoltaica', 'energia solar residencial', 'energia solar empresarial', 'orçamento energia solar'],
  openGraph: {
    title: 'Transforme sol em economia. | Casa 7 Solar Energy',
    description: 'O futuro da sua energia começa aqui. Conheça nossas soluções solares para sua casa e sua empresa.',
    locale: 'pt_BR', type: 'website', siteName: 'Casa 7 Solar Energy',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: '#060c17', width: 'device-width', initialScale: 1 };

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': ['Organization', 'LocalBusiness'], '@id': '#casa7', name: 'Casa 7 Solar Energy', description: 'Energia Solar Residencial e Empresarial', telephone: '+55-11-91249-1955', sameAs: ['https://www.instagram.com/casa7solarenergy/'] },
    { '@type': 'Service', name: 'Energia solar residencial e empresarial', serviceType: 'Projeto e instalação de sistemas fotovoltaicos', provider: { '@id': '#casa7' } },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><a className="skip-link" href="#conteudo">Pular para o conteúdo</a>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></body></html>;
}
