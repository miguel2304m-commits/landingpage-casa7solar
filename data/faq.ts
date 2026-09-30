export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqItems: readonly FAQItem[] = [
  {
    id: "funcionamento",
    question: "Como funciona energia solar?",
    answer:
      "Os painéis convertem a luz do sol em energia elétrica. O inversor adapta essa energia para uso no imóvel. Em sistemas conectados à rede, o excedente pode ser injetado na rede da distribuidora, conforme as regras aplicáveis à instalação.",
  },
  {
    id: "economia",
    question: "Quanto posso economizar?",
    answer:
      "O potencial pode chegar a até 95% de redução na conta de energia, mas esse resultado não é garantido. Consumo, tarifa, localização, sombreamento e dimensionamento influenciam a economia. Encargos e cobranças da distribuidora podem permanecer. Uma análise da sua conta permite estimar o seu cenário.",
  },
  {
    id: "durabilidade",
    question: "Quanto tempo dura um sistema solar?",
    answer:
      "Os painéis são projetados para operação de longo prazo. A vida útil e a perda de desempenho variam conforme o fabricante, as condições de instalação e a manutenção. Inversores e outros componentes têm ciclos de vida próprios. As garantias dos equipamentos são apresentadas na proposta.",
  },
  {
    id: "dias-nublados",
    question: "Funciona em dias nublados?",
    answer:
      "Sim. Os painéis aproveitam também a luz difusa, mas a geração costuma ser menor do que em dias de céu aberto. A avaliação do projeto considera as condições solares da região e a variação da geração ao longo do ano.",
  },
  {
    id: "instalacao-eletrica",
    question: "Preciso trocar toda a instalação elétrica?",
    answer:
      "Nem sempre. A equipe avalia a instalação existente, o padrão de entrada, o quadro elétrico e as proteções. Adequações podem ser necessárias para conectar o sistema com segurança; o escopo é definido depois da análise técnica.",
  },
  {
    id: "noite",
    question: "Energia solar funciona à noite?",
    answer:
      "Os painéis não geram energia sem luz solar. À noite, um sistema conectado à rede utiliza energia da distribuidora. Baterias podem fornecer energia quando fazem parte de um projeto dimensionado para isso. Um sistema convencional conectado à rede também se desliga em quedas de energia, por segurança; funcionamento durante apagões exige uma solução específica.",
  },
  {
    id: "investimento",
    question: "Quanto custa instalar?",
    answer:
      "O investimento depende do consumo, da potência necessária, dos equipamentos e das características do imóvel. Envie sua conta média e a cidade pelo simulador para iniciar uma análise. O orçamento detalhado é preparado após a avaliação do projeto.",
  },
  {
    id: "empresa",
    question: "Posso instalar em empresa?",
    answer:
      "Sim. Sistemas fotovoltaicos podem atender imóveis comerciais e empresariais. O projeto considera o perfil de consumo, os horários de operação, a área disponível e as condições de conexão com a distribuidora.",
  },
  {
    id: "telhado",
    question: "Preciso ter telhado próprio?",
    answer:
      "É necessário ter uma área adequada e autorização para instalar os equipamentos. Imóveis alugados ou em condomínio exigem a avaliação das autorizações e condições do local. A equipe pode analisar a viabilidade do seu imóvel e as alternativas disponíveis para o projeto.",
  },
  {
    id: "orcamento",
    question: "Como solicitar orçamento?",
    answer:
      "Clique em um dos botões de orçamento para falar com a Casa 7 Solar Energy pelo WhatsApp. Tenha em mãos sua conta de energia e a localização do imóvel. Você também pode preencher o simulador para enviar as informações iniciais na conversa.",
  },
];
