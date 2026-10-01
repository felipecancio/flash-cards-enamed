/**
 * Configuração editável da página de venda.
 * Textos, preço, autores, amostra, entrega e suporte ficam aqui.
 * A URL de pagamento NÃO fica neste arquivo: use NEXT_PUBLIC_CHECKOUT_URL.
 *
 * Não preencha com dados fictícios. Nome, CRM, instituição, depoimento,
 * questão clínica e preço riscado só entram quando forem reais e autorizados.
 */

export type Author = {
  name: string;
  /** Ex.: CRM/SP 000000 */
  crm: string;
  specialty: string;
  /** Atuação profissional que possa ser declarada */
  practice: string;
  /** O que esta pessoa fez neste material */
  contribution: string;
};

export type ClinicalAlternative = {
  letter: string;
  text: string;
};

export type ClinicalNote = {
  letter: string;
  explanation: string;
};

export type ClinicalSample = {
  /**
   * true somente depois que um médico identificado aprovar este texto
   * para a página pública. Com false, o enunciado não é renderizado.
   */
  validated: boolean;
  /** Quem aprovou a exibição. Ex.: "Nome Sobrenome, CRM/UF 000000" */
  approvedBy: string;
  area: string;
  stem: string;
  alternatives: ClinicalAlternative[];
  answerLetter: string;
  reasoning: string;
  incorrect: ClinicalNote[];
};

export type IncludedItem = {
  id: string;
  title: string;
  description: string;
};

export type Bonus = {
  /** true somente quando o arquivo final estiver pronto para entrega */
  ready: boolean;
  title: string;
  description: string;
};

export type LegalDocument = {
  /** true somente depois de substituir o texto pendente pelo documento final */
  ready: boolean;
  paragraphs: string[];
};

export const site = {
  name: "200 Casos Clínicos Resolvidos para o Enamed",
  shortName: "200 Casos",

  seo: {
    description:
      "200 casos clínicos autorais para treinar a conduta, entender as outras alternativas e revisar com uma regra para a prova do Enamed.",
  },

  cta: {
    /** Única ação da página. */
    label: "Acessar Agora",
  },

  nav: [
    { href: "#material", label: "O material" },
    { href: "#conteudo", label: "Conteúdo" },
    { href: "#oferta", label: "Oferta" },
    { href: "#duvidas", label: "Dúvidas" },
  ],

  hero: {
    title: "Treine o raciocínio por trás da resposta.",
    subtitle:
      "200 casos clínicos baseados nas últimas provas do Enamed, para você escolher a conduta, entender por que as outras alternativas ficam de fora e sair com uma regra de ouro gravada pra prova.",
    /**
     * Esta frase só aparece se editorial.commentsReviewedByIdentifiedPhysicians
     * for true e houver ao menos um médico completo em authors.
     */
    editorialClaim:
      "Material original, com comentários exclusivos de médicos experientes.",
    facts: ["Baseado no INEP", "Aprovado por médicos", "Atualizado para 2027"],
    mockupCaption:
      "Exemplo real: a decisão do caso e a regra que você leva para a prova.",
  },

  /**
   * Trecho real do volume 01, para mostrar o formato do caderno.
   * A resolução completa fica na página seguinte do PDF.
   */
  notebookPreview: {
    kicker: "Caso 001 · Clínica médica",
    hook: "O potássio muda a ordem das condutas",
    theme: "Cetoacidose diabética",
    alternatives: [
      { letter: "A", text: "Manter apenas fluidos até a cetonemia desaparecer." },
      { letter: "B", text: "Infundir bicarbonato antes de corrigir o potássio." },
      { letter: "C", text: "Corrigir o potássio antes de iniciar insulina." },
      { letter: "D", text: "Começar insulina e repor potássio simultaneamente." },
    ],
    answerLetter: "C",
    rule: "Antes de protocolar insulina na cetoacidose, leia o potássio.",
  },

  pricing: {
    current: 97,
    /**
     * De R$ 197 por R$ 97, conforme a condição comercial desta oferta.
     * Não há prazo, contador nem quantidade limitada nesta página.
     */
    reference: 197,
    referenceVerified: true as boolean,
    launchLabel: "Preço de lançamento:",
  },

  editorial: {
    /**
     * true somente quando os comentários tiverem sido produzidos ou revisados
     * pelos médicos identificados em authors.
     */
    commentsReviewedByIdentifiedPhysicians: false as boolean,
  },

  /**
   * Deixe vazio até ter nome, CRM, especialidade, atuação e contribuição reais,
   * com autorização de cada pessoa. Não há foto: o componente não inventa imagem.
   *
   * Exemplo de item válido — não descomente com dados fictícios:
   * {
   *   name: "Nome completo",
   *   crm: "CRM/UF 000000",
   *   specialty: "Especialidade",
   *   practice: "Atuação atual",
   *   contribution: "O que fez neste caderno",
   * }
   */
  authors: [] as Author[],

  /**
   * Rascunho da amostra. Não escreva um caso fictício para “completar” a página.
   * Cole aqui somente uma questão real do produto, já aprovada.
   * Se o item tiver cinco alternativas, inclua a letra E em alternatives e incorrect.
   */
  clinicalSample: {
    validated: false as boolean,
    approvedBy: "",
    area: "",
    stem: "",
    alternatives: [
      { letter: "A", text: "" },
      { letter: "B", text: "" },
      { letter: "C", text: "" },
      { letter: "D", text: "" },
    ],
    answerLetter: "",
    reasoning: "",
    incorrect: [
      { letter: "A", explanation: "" },
      { letter: "B", explanation: "" },
      { letter: "C", explanation: "" },
      { letter: "D", explanation: "" },
    ],
  } satisfies ClinicalSample,

  /**
   * Textos de diagramação. Não são um caso clínico.
   * Só aparecem no ambiente de desenvolvimento, com aviso visível.
   */
  layoutDemo: {
    banner: "Demonstração de diagramação. Não é um caso clínico revisado.",
    area: "Formato da página",
    stem: "Espaço do enunciado. A história clínica aprovada entra neste bloco.",
    alternatives: [
      { letter: "A", text: "Espaço da alternativa A." },
      { letter: "B", text: "Espaço da alternativa B." },
      { letter: "C", text: "Espaço da alternativa C." },
      { letter: "D", text: "Espaço da alternativa D." },
    ],
    answer: "A letra do gabarito aparece neste ponto.",
    reasoning:
      "Espaço do raciocínio clínico que justifica a resposta neste contexto.",
    incorrect: [
      {
        letter: "A",
        explanation:
          "Espaço para explicar por que esta opção não é a melhor neste contexto.",
      },
      {
        letter: "B",
        explanation:
          "Espaço para explicar por que esta opção não é a melhor neste contexto.",
      },
      {
        letter: "C",
        explanation:
          "Espaço para explicar por que esta opção não é a melhor neste contexto.",
      },
      {
        letter: "D",
        explanation:
          "Espaço para explicar por que esta opção não é a melhor neste contexto.",
      },
    ],
    footer:
      "Este quadro ilustra a diagramação. Não faz parte dos 200 casos.",
  },

  difficulty: {
    title: "A questão pede a melhor conduta",
    paragraphs: [
      "Na prova, reconhecer o quadro é só o começo. O ponto é decidir a conduta mais adequada naquele contexto.",
      "Você escolhe a alternativa antes de ver a resposta e registra o achado que sustentou a decisão. Depois compara com o raciocínio e com o motivo de cada alternativa que ficou de fora.",
      "De cada caso sai uma regra curta. É essa frase que você revisa quando a prova se aproxima.",
    ],
  },

  material: {
    title: "O que você treina em cada caso",
    intro:
      "O caso treina a decisão da prova: escolher a conduta, entender as outras opções e guardar uma regra para usar de novo.",
  },

  anatomy: [
    {
      title: "O dado que decide",
      text: "Você aprende a apontar o achado que muda a conduta, antes de ver a resposta.",
    },
    {
      title: "O caminho até a resposta",
      text: "O comentário mostra o raciocínio clínico que sustenta a escolha.",
    },
    {
      title: "Por que as outras ficam de fora",
      text: "Cada alternativa restante é comentada naquele caso, para a dúvida não voltar igual na prova.",
    },
    {
      title: "Uma regra para lembrar",
      text: "Você sai com uma frase curta, pronta para revisar quando o tema reaparecer.",
    },
    {
      title: "O que revisar de novo",
      text: "Você marca se acertou, chutou ou errou e retoma em dois e em sete dias, com a regra que faltou.",
    },
  ],

  included: [
    {
      id: "cases",
      title: "200 casos para decidir",
      description:
        "Questões autorais em que a tarefa é escolher a melhor conduta, como na prova.",
    },
    {
      id: "resolution",
      title: "O raciocínio da resposta",
      description:
        "Você vê por que aquela conduta se sustenta e onde o seu caminho coincidiu ou se afastou.",
    },
    {
      id: "rules",
      title: "Uma regra por caso",
      description:
        "Uma frase para levar à revisão e reconhecer a mesma decisão quando ela voltar.",
    },
    {
      id: "log",
      title: "Revisão do que escapou",
      description:
        "Acertei, chutei ou errei. O que não ficou sólido volta em dois e em sete dias.",
    },
    {
      id: "sources",
      title: "Base para aprofundar",
      description:
        "Quando a regra pedir mais, o caso indica a referência para você conferir e estudar o ponto.",
    },
  ] satisfies IncludedItem[],

  areasNote:
    "A prática percorre as grandes áreas da prova. Em cada uma, o foco é a decisão clínica, não a lista de temas soltos.",

  areas: [
    { name: "Clínica médica", cases: 40, detail: "Urgência, tempo de decisão e condições crônicas." },
    { name: "Cirurgia geral", cases: 30, detail: "Abdome agudo, trauma e decisão operatória." },
    { name: "Ginecologia e obstetrícia", cases: 35, detail: "Gestação, parto, puerpério e ginecologia." },
    { name: "Pediatria", cases: 35, detail: "Urgências, infecção e cuidado infantil." },
    { name: "Medicina de família e comunidade", cases: 20, detail: "Cuidado longitudinal, prevenção e APS." },
    { name: "Saúde coletiva", cases: 20, detail: "Vigilância, rastreamento e organização do SUS." },
    { name: "Saúde mental", cases: 20, detail: "Risco, diagnóstico diferencial e acompanhamento." },
  ],

  bonuses: {
    errorNotebook: {
      ready: false as boolean,
      title: "Caderno de erros imprimível",
      description:
        "Folhas para anotar a decisão do gabarito e o ponto que você quer revisar.",
    },
    reviewGuide: {
      ready: false as boolean,
      title: "Roteiro de revisão de 21 dias",
      description:
        "Uma sequência para distribuir os casos ao longo de três semanas, em sessões que cabem na rotina.",
    },
  } satisfies { errorNotebook: Bonus; reviewGuide: Bonus },

  method: {
    title: "Como isso entra na preparação",
    intro:
      "Cada caso é uma decisão completa. Você treina o momento da prova e guarda o que precisa voltar.",
    errorNotebookNote:
      "O caderno de erros imprimível é a folha prevista para esse registro.",
    steps: [
      {
        id: "solve",
        title: "Decida antes de ver a resposta",
        text: "Escolha a conduta e nomeie o achado que sustentou essa escolha. É o mesmo gesto da prova.",
      },
      {
        id: "compare",
        title: "Compare o seu raciocínio",
        text: "Veja se o caminho que você fez se sustenta e por que as outras alternativas ficam de fora.",
      },
      {
        id: "record",
        title: "Guarde a regra",
        text: "Fique com a frase do caso e marque se acertou, chutou ou errou. A revisão nasce desse registro.",
      },
      {
        id: "review",
        title: "Volte em 2 e em 7 dias",
        text: "Reabra o que não ficou sólido. Se a regra pedir mais, a referência do caso indica onde aprofundar.",
      },
    ],
  },

  audience: {
    title: "Para quem é",
    studentsTitle: "Estudantes de Medicina",
    studentsText:
      "Quem se prepara para o Enamed e quer treinar a escolha da conduta em casos objetivos, com uma regra para revisar depois.",
    doctorsTitle: "Médicos",
    doctorsText:
      "Quem quer revisar a decisão clínica com casos comentados e sair sabendo qual regra ainda precisa voltar.",
    value:
      "200 decisões para treinar. De cada uma fica uma regra, e você sabe o que reabrir em dois e em sete dias.",
  },

  authorsSection: {
    title: "Autores e revisão",
    intro:
      "Cada médico identificado aparece com nome, CRM, especialidade, atuação e a contribuição neste caderno.",
    empty:
      "Nenhum perfil é publicado enquanto esses dados não estiverem preenchidos, com autorização de quem será identificado.",
  },

  delivery: {
    title: "Entrega e acesso",
    /**
     * Se a entrega não for pela Hotmart, altere os dois campos.
     * O texto da página usa estes valores.
     */
    platformName: "Hotmart",
    accessArea: "área do produto da Hotmart",
    /** E-mail público de suporte. Vazio até ser definido. */
    supportEmail: "",
  },

  offer: {
    title: "O que a compra inclui",
    intro:
      "Os 200 casos, a resolução comentada e mais três formas de estudar: simulado, flashcards e leitura no celular.",
    trustLine: "Acesso imediato e Compra Segura",
  },

  guarantee: {
    badge: "Garantia incondicional",
    title: "Compra sem risco",
    body: "Se você não gostar 100% do material, peça seu dinheiro de volta a qualquer momento.",
  },

  faqTitle: "Dúvidas frequentes",

  studyBonuses: {
    title: "3 Bônus Complementares pra aumentar a eficiência da sua preparação:",
    intro: "Resolva, teste seu desempenho e retome os pontos que precisam de revisão.",
    items: [
      {
        id: "simulado",
        title: "Mini-simulado de Treino",
        lead: "Treine como na prova: resolva casos clínicos sem pistas e confira seu desempenho ao final.",
        points: [
          "Sessões de 10, 20 ou 40 questões, em novas combinações dos casos disponíveis.",
          "Cronômetro opcional, ou o treino sem marcar o tempo.",
          "Resultado por área e gabarito comentado quando você finaliza.",
          "Dá para refazer os casos que errou, no celular ou no tablet.",
        ],
      },
      {
        id: "flashcards",
        title: "Flashcards Exclusivos",
        lead: "Revise decisões clínicas em cartões rápidos: pense na conduta, vire o cartão e confira a resposta.",
        points: [
          "Situações curtas para lembrar a conduta, sem reler o caso inteiro.",
          "Revisão geral ou focada em uma área.",
          "Você marca Lembrei ou Rever, e a sessão seguinte prioriza o que ainda falha.",
          "Cabe numa pausa, no celular ou no tablet.",
        ],
      },
      {
        id: "mobile",
        title: "Leitura no celular",
        lead: "Os 200 casos em PDF, para abrir no telefone e estudar um caso de cada vez.",
        points: [
          "Questão, resolução comentada e regra, na ordem do material.",
          "As mesmas áreas do caderno, para retomar um bloco quando quiser.",
          "Também abre no tablet, para ler com a tela maior.",
        ],
      },
    ],
  },

  seller: {
    /** Nome ou razão social de quem vende. Vazio até ser definido. */
    legalName: "",
    /** CPF ou CNPJ, se quiser exibir. Vazio não aparece. */
    document: "",
  },

  legal: {
    privacy: {
      ready: false as boolean,
      paragraphs: [
        "TEXTO PENDENTE — substitua pela política de privacidade da venda antes de marcar ready como true. Informe o responsável pelos dados, o e-mail de contato, a finalidade do tratamento e os direitos de quem compra.",
      ],
    },
    terms: {
      ready: false as boolean,
      paragraphs: [
        "TEXTO PENDENTE — substitua pelos termos da compra antes de marcar ready como true. Descreva o produto digital, o pagamento, o reembolso de 7 dias e os limites do material.",
      ],
    },
  } satisfies { privacy: LegalDocument; terms: LegalDocument },

  footer: {
    disclaimer: "Material educacional de treino e revisão para a preparação do Enamed.",
  },
};

export function getDeliveryLead() {
  return `Depois que o pagamento é aprovado, você recebe por e-mail as instruções para acessar o material digital e baixar os arquivos na ${site.delivery.accessArea}.`;
}

export function getDeliverySteps() {
  return [
    "O pagamento é aprovado no checkout.",
    "O e-mail usado na compra recebe as instruções para acessar o material digital.",
    `Os arquivos são baixados na ${site.delivery.accessArea}.`,
  ];
}

export function getFaq(supportEmail: string | null) {
  const refundContact = supportEmail
    ? `Para pedir o reembolso, escreva para ${supportEmail} dentro desse prazo.`
    : "O pedido é feito pelo contato de suporte da compra, dentro desse prazo.";

  const bonuses = [
    site.bonuses.errorNotebook.ready ? "o caderno de erros imprimível" : null,
    site.bonuses.reviewGuide.ready ? "o roteiro de revisão de 21 dias" : null,
  ].filter((item): item is string => Boolean(item));

  const bonusText =
    bonuses.length === 0
      ? ""
      : bonuses.length === 1
        ? ` Nesta oferta também entra ${bonuses[0]}.`
        : ` Nesta oferta também entram ${bonuses[0]} e ${bonuses[1]}.`;

  return [
    {
      question: "Qual é o formato do material?",
      answer:
        "PDF, para estudar no celular ou impresso. Em cada caso você tem a questão, a resolução comentada e uma regra para a prova.",
    },
    {
      question: "Como eu recebo os arquivos?",
      answer: `Depois que o pagamento é aprovado, o e-mail da compra recebe as instruções de acesso. O download é feito na ${site.delivery.accessArea}.`,
    },
    {
      question: "Dá para estudar no celular?",
      answer: "Sim. O material é PDF e abre no telefone, para encaixar um caso na rotina.",
    },
    {
      question: "Posso imprimir?",
      answer: "Sim. Dá para imprimir e resolver no papel, no horário do seu estudo.",
    },
    {
      question: "Quando o acesso é liberado?",
      answer:
        "Assim que o pagamento é aprovado, as instruções chegam no e-mail da compra, com o caminho para baixar os arquivos.",
    },
    {
      question: "Como eu uso isso na preparação?",
      answer:
        "Decida a conduta antes de ver a resposta, compare com o raciocínio e guarde a regra do caso. O que você chutou ou errou volta em dois e em sete dias.",
    },
    {
      question: "Quais áreas entram nos 200 casos?",
      answer:
        "Clínica médica, 40. Cirurgia geral, 30. Ginecologia e obstetrícia, 35. Pediatria, 35. Medicina de família e comunidade, 20. Saúde coletiva, 20. Saúde mental, 20.",
    },
    {
      question: "O que vem na compra?",
      answer: `200 casos autorais, com a resolução comentada e uma regra por caso. Também entram o mini-simulado, os flashcards e a leitura do material no celular.${bonusText}`,
    },
    {
      question: "Como peço o reembolso?",
      answer: `A compra tem garantia incondicional de reembolso. Se você não gostar 100% do material, peça seu dinheiro de volta a qualquer momento. ${refundContact}`,
    },
  ];
}
