export const healthcareTrails = [
  { title: "Essenciais da prática clínica", description: "Fundamentos para uma assistência segura, humana e baseada em evidências.", position: 1 },
  { title: "Carreira e liderança em saúde", description: "Desenvolvimento profissional, colaboração entre equipes e gestão do cuidado.", position: 2 },
];

export const healthcareCourses = [
  {
    slug: "seguranca-do-paciente", title: "Segurança do paciente na prática",
    description: "Aprenda a reconhecer riscos, fortalecer a cultura de segurança e incorporar boas práticas à rotina assistencial.",
    level: "Iniciante", trail: 0, position: 1, coverUrl: "/images/course-1.jpg", status: "published",
    modules: [
      { title: "Fundamentos da segurança", lessons: ["O que é segurança do paciente", "Cultura de segurança e trabalho em equipe", "Identificação correta e comunicação segura"] },
      { title: "Segurança no dia a dia", lessons: ["Prevenção de eventos adversos", "Notificação e aprendizagem com incidentes", "Checklist para uma prática mais segura"] },
    ],
  },
  {
    slug: "comunicacao-clinica", title: "Comunicação clínica e cuidado humanizado",
    description: "Desenvolva escuta ativa, linguagem clara e conversas difíceis com pacientes, famílias e equipes.",
    level: "Iniciante", trail: 0, position: 2, coverUrl: "/images/course-2.jpg", status: "published",
    modules: [
      { title: "Comunicação que acolhe", lessons: ["Escuta ativa na consulta", "Empatia e linguagem acessível", "Decisão compartilhada"] },
      { title: "Conversas na prática", lessons: ["Comunicação de notícias difíceis", "Alinhamento entre profissionais", "Orientações para continuidade do cuidado"] },
    ],
  },
  {
    slug: "pratica-baseada-evidencias", title: "Prática baseada em evidências",
    description: "Transforme perguntas do cotidiano em decisões mais informadas, com leitura crítica e fontes confiáveis.",
    level: "Intermediário", trail: 0, position: 3, coverUrl: "/images/course-3.jpg", status: "published",
    modules: [
      { title: "Da dúvida à evidência", lessons: ["Como formular uma pergunta clínica", "Onde buscar evidências confiáveis", "Níveis de evidência: o essencial"] },
      { title: "Aplicação responsável", lessons: ["Leitura crítica sem complicação", "Diretrizes e protocolos: como interpretar", "Da evidência à prática com segurança"] },
    ],
  },
  {
    slug: "prevencao-infeccoes", title: "Prevenção e controle de infecções",
    description: "Revise medidas essenciais para reduzir riscos de infecção em diferentes ambientes de cuidado.",
    level: "Intermediário", trail: 0, position: 4, coverUrl: "/images/course-4.jpg", status: "published",
    modules: [
      { title: "Princípios de prevenção", lessons: ["Higiene das mãos: os momentos essenciais", "Precauções padrão e uso de EPIs", "Ambiente e equipamentos seguros"] },
      { title: "Aplicação em equipe", lessons: ["Reconhecendo riscos no serviço", "Monitoramento de boas práticas", "Como fortalecer a adesão da equipe"] },
    ],
  },
  {
    slug: "lideranca-em-saude", title: "Liderança e gestão do cuidado",
    description: "Coordene equipes, melhore processos e promova um ambiente de trabalho colaborativo e centrado nas pessoas.",
    level: "Intermediário", trail: 1, position: 1, coverUrl: "/images/course-5.jpg", status: "published",
    modules: [
      { title: "Liderar com propósito", lessons: ["Liderança no contexto da saúde", "Feedback e colaboração interdisciplinar", "Organização do cuidado e fluxos"] },
      { title: "Qualidade e melhoria", lessons: ["Indicadores de qualidade assistencial", "Melhoria contínua em pequenos ciclos", "Cuidar de quem cuida"] },
    ],
  },
  {
    slug: "saude-digital-lgpd", title: "Saúde digital e proteção de dados",
    description: "Entenda boas práticas de registro, privacidade e uso responsável de tecnologias na assistência.",
    level: "Avançado", trail: 1, position: 2, coverUrl: "/images/course-6.jpg", status: "coming_soon",
    modules: [{ title: "Em preparação", lessons: ["Prontuário e documentação responsável", "Privacidade e dados sensíveis"] }],
  },
] as const;

export const healthcareMaterials = [
  { title: "Segurança do paciente — OMS", description: "Portal oficial com recursos, estratégias e documentos para a cultura de segurança.", category: "Segurança do paciente", kind: "link", url: "https://www.who.int/teams/integrated-health-services/patient-safety", included: true },
  { title: "Biblioteca Virtual em Saúde", description: "Encontre literatura científica e fontes confiáveis em português para apoiar decisões.", category: "Evidências", kind: "link", url: "https://bvsalud.org/", included: true },
  { title: "PubMed: pesquisa em saúde", description: "Base de referência para encontrar artigos científicos e revisões da literatura.", category: "Evidências", kind: "link", url: "https://pubmed.ncbi.nlm.nih.gov/", included: true },
  { title: "Proteção de dados pessoais — ANPD", description: "Informações oficiais sobre privacidade, LGPD e tratamento de dados sensíveis.", category: "Saúde digital", kind: "link", url: "https://www.gov.br/anpd/pt-br", included: true },
  { title: "Organização Pan-Americana da Saúde", description: "Informações, publicações e iniciativas de saúde pública para as Américas.", category: "Saúde pública", kind: "link", url: "https://www.paho.org/pt", included: true },
];

export const healthcareNews = [
  { title: "Por que a cultura de segurança começa na conversa", content: "Uma equipe que se sente à vontade para sinalizar riscos aprende mais rápido e cuida melhor. A comunicação aberta, o registro responsável de incidentes e a revisão de processos são pilares de uma cultura de segurança.\n\nEm vez de procurar culpados, vale perguntar: o que no sistema permitiu que isso acontecesse? Como podemos reduzir a chance de repetir?\n\nEste conteúdo é educativo e não substitui protocolos locais ou orientação profissional específica.", kind: "article", coverUrl: "/images/news-1.jpg" },
  { title: "5 perguntas para uma busca de evidências mais útil", content: "Antes de abrir uma base científica, defina a dúvida com clareza: para quem é a pergunta? Qual intervenção ou exposição? Com o que comparar? Qual desfecho importa? Em que contexto?\n\nUma pergunta bem formulada ajuda a encontrar fontes relevantes e a interpretar resultados com mais cautela.", kind: "article", coverUrl: "/images/course-3.jpg" },
  { title: "Agenda da comunidade: encontros e discussões", content: "Nossos encontros são espaços de troca entre profissionais de diferentes áreas. Compartilhe experiências, apresente dúvidas gerais e conheça perspectivas de outras especialidades.\n\nImportante: não compartilhe dados que identifiquem pacientes em publicações, comentários ou chamadas.", kind: "article", coverUrl: "/images/course-1.jpg" },
];

export const healthcareMentorships = [
  { title: "Roda de conversa: segurança do paciente", description: "Um encontro para trocar experiências sobre cultura de segurança, comunicação e melhoria do cuidado.", status: "upcoming" },
  { title: "Encontro interdisciplinar: comunicação em equipe", description: "Debate sobre comunicação entre diferentes profissionais e continuidade do cuidado.", status: "upcoming" },
];

export const healthcarePosts = [
  { topic: "Vivências", content: "O que mudou na rotina de vocês depois que começaram a usar um checklist de passagem de plantão? Aqui na equipe, a comunicação ficou muito mais clara. 💬 #SegurançaDoPaciente" },
  { topic: "Dúvidas", content: "Quais fontes vocês usam para acompanhar diretrizes e evidências da sua área? Quero organizar uma rotina semanal de atualização profissional." },
  { topic: "Avisos", content: "Boas-vindas à RCS Prime Comunity! Este é um espaço para profissionais de saúde aprenderem e trocarem experiências. Apresente sua área de atuação e conte o que gostaria de estudar. 💙 Lembre-se: preserve sempre a privacidade dos pacientes." },
];

export const healthcareSettings = [
  { key: "highlight_title", value: "Aprender juntos transforma o cuidado." },
  { key: "highlight_subtitle", value: "Uma comunidade para quem vive a saúde: atualize conhecimentos, compartilhe experiências e fortaleça sua prática todos os dias." },
  { key: "video_url", value: "" },
  { key: "video_title", value: "Sua jornada começa aqui" },
  { key: "whatsapp_group", value: "" },
  { key: "instagram", value: "" },
];
