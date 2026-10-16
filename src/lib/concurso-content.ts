type Mod = { title: string; lessons: string[] };
type Link = { label: string; url: string };

export type CourseDef = {
  slug: string; title: string; description: string;
  area: "comum" | "legislacao" | "especifico";
  profession?: string; sphere?: "federal" | "estadual" | "municipal";
  trail: 0 | 1 | 2; position: number; level: string; modules: Mod[]; resources: Link[];
};

const PLANALTO: Link = { label: "Legislação federal (Planalto)", url: "https://www.planalto.gov.br/ccivil_03/" };
const SAUDE: Link = { label: "Ministério da Saúde", url: "https://www.gov.br/saude/pt-br" };
const BVS: Link = { label: "Biblioteca Virtual em Saúde", url: "https://bvsalud.org/" };
const DOU: Link = { label: "Diário Oficial da União", url: "https://www.in.gov.br/" };
const COFEN: Link = { label: "COFEN — Conselho Federal de Enfermagem", url: "https://www.cofen.gov.br/" };
const CONTER: Link = { label: "CONTER — Conselho de Técnicos em Radiologia", url: "https://conter.gov.br/" };
const CNEN: Link = { label: "CNEN — Comissão Nacional de Energia Nuclear", url: "https://www.gov.br/cnen/pt-br" };

export const concursoTrails = [
  { title: "Conhecimentos comuns", description: "Língua Portuguesa, Raciocínio Lógico-Matemático e SUS: a base de quase todos os editais da saúde.", position: 1 },
  { title: "Legislação e esferas de governo", description: "Federal, estadual e municipal: legislação e conhecimentos locais conforme o seu edital.", position: 2 },
  { title: "Conhecimentos específicos", description: "Enfermagem, Técnico de Enfermagem e Radiologia Médica.", position: 3 },
];

export const concursoCourses: CourseDef[] = [
  // ---------- Comuns ----------
  {
    slug: "lingua-portuguesa", title: "Língua Portuguesa para concursos", area: "comum", trail: 0, position: 1, level: "Básico",
    description: "Interpretação de textos, gramática normativa e reescrita: o conteúdo mais cobrado em provas de nível técnico e superior.",
    resources: [BVS, PLANALTO],
    modules: [
      { title: "Leitura e interpretação", lessons: ["Compreensão e interpretação de textos", "Tipologia e gêneros textuais", "Coesão, coerência e articuladores", "Semântica: sentido, ambiguidade e figuras de linguagem"] },
      { title: "Gramática normativa", lessons: ["Ortografia, acentuação e emprego de maiúsculas", "Classes de palavras e morfologia", "Concordância verbal e nominal", "Regência verbal e crase"] },
      { title: "Sintaxe e reescrita", lessons: ["Pontuação e sintaxe do período simples", "Período composto: coordenação e subordinação", "Reescrita de frases e redação oficial"] },
    ],
  },
  {
    slug: "raciocinio-logico-matematico", title: "Raciocínio Lógico-Matemático", area: "comum", trail: 0, position: 2, level: "Básico",
    description: "Lógica proposicional, matemática básica, contagem e probabilidade com foco nos modelos de questões de concursos.",
    resources: [BVS, PLANALTO],
    modules: [
      { title: "Lógica proposicional", lessons: ["Proposições, conectivos e tabelas-verdade", "Equivalências e negações", "Argumentação lógica e silogismos"] },
      { title: "Matemática básica", lessons: ["Conjuntos e operações", "Razão, proporção e regra de três", "Porcentagem e juros simples"] },
      { title: "Contagem e probabilidade", lessons: ["Princípio fundamental da contagem e análise combinatória", "Probabilidade básica", "Sequências, padrões e problemas de raciocínio"] },
    ],
  },
  {
    slug: "sistema-unico-de-saude", title: "Sistema Único de Saúde (SUS)", area: "comum", trail: 0, position: 3, level: "Básico",
    description: "Princípios, organização, financiamento e legislação do SUS: matéria obrigatória nos concursos da área da saúde.",
    resources: [SAUDE, { label: "Lei 8.080/1990", url: "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm" }, { label: "Lei 8.142/1990", url: "https://www.planalto.gov.br/ccivil_03/leis/l8142.htm" }],
    modules: [
      { title: "Fundamentos e legislação", lessons: ["História da saúde pública e Reforma Sanitária", "Constituição Federal: saúde como direito (arts. 196 a 200)", "Lei 8.080/1990: organização e princípios do SUS", "Lei 8.142/1990: participação social e transferências"] },
      { title: "Organização do sistema", lessons: ["Decreto 7.508/2011: regiões de saúde e redes", "Financiamento do SUS e Lei Complementar 141/2012", "Atenção Primária e Estratégia Saúde da Família", "Redes de Atenção à Saúde"] },
      { title: "Vigilância e políticas", lessons: ["Vigilância epidemiológica, sanitária e ambiental", "Política Nacional de Humanização", "Segurança do paciente e qualidade", "Controle social: conselhos e conferências de saúde"] },
    ],
  },
  // ---------- Legislação por esfera ----------
  {
    slug: "legislacao-federal", title: "Legislação e conhecimentos federais", area: "legislacao", sphere: "federal", trail: 1, position: 4, level: "Intermediário",
    description: "Para concursos federais (ministérios, autarquias, hospitais universitários e institutos): legislação do servidor e organização do Estado.",
    resources: [PLANALTO, SAUDE, DOU],
    modules: [
      { title: "Legislação aplicada", lessons: ["Constituição Federal: princípios da administração pública (art. 37)", "Seguridade social: saúde, previdência e assistência", "Lei 8.112/1990: regime jurídico dos servidores federais", "Processo administrativo federal e improbidade administrativa"] },
      { title: "Conhecimentos federais", lessons: ["Organização do Estado brasileiro", "Ministério da Saúde: estrutura e atribuições", "Atualidades e políticas nacionais de saúde"] },
    ],
  },
  {
    slug: "legislacao-estadual", title: "Legislação e conhecimentos do estado", area: "legislacao", sphere: "estadual", trail: 1, position: 5, level: "Intermediário",
    description: "Para concursos estaduais (secretarias de saúde, hospitais e fundações): estrutura do estado e do SUS estadual. O conteúdo exato varia conforme o estado e o edital.",
    resources: [SAUDE, DOU],
    modules: [
      { title: "Legislação do estado", lessons: ["Constituição Estadual e organização do estado", "Estatuto dos servidores públicos estaduais", "Secretaria Estadual de Saúde e conselhos estaduais"] },
      { title: "Conhecimentos do estado", lessons: ["História, geografia e economia do estado", "Plano Estadual de Saúde e regionalização", "Comissão Intergestores Bipartite e pactuação", "Atualidades do estado"] },
    ],
  },
  {
    slug: "legislacao-municipal", title: "Legislação e conhecimentos do município", area: "legislacao", sphere: "municipal", trail: 1, position: 6, level: "Intermediário",
    description: "Para concursos municipais (prefeituras e secretarias de saúde): lei orgânica, estatuto do servidor e rede de saúde local. Adapte ao seu edital.",
    resources: [SAUDE, BVS],
    modules: [
      { title: "Legislação do município", lessons: ["Lei Orgânica do Município", "Estatuto dos servidores públicos municipais", "Plano, Fundo e Conselho Municipal de Saúde"] },
      { title: "Conhecimentos do município", lessons: ["História, geografia e cultura locais", "Organização administrativa e rede de saúde do município", "Atenção Primária e vigilância no território", "Atualidades locais"] },
    ],
  },
  // ---------- Específicos ----------
  {
    slug: "especifico-enfermagem", title: "Enfermagem: conhecimentos específicos", area: "especifico", profession: "Enfermagem", trail: 2, position: 7, level: "Específico",
    description: "Exercício profissional, processo de enfermagem, clínica, urgência e gerenciamento para concursos de enfermeiro(a).",
    resources: [COFEN, { label: "Lei 7.498/1986", url: "https://www.planalto.gov.br/ccivil_03/leis/l7498.htm" }, BVS],
    modules: [
      { title: "Fundamentos e exercício profissional", lessons: ["Lei 7.498/1986 e Decreto 94.406/1987", "Código de Ética dos Profissionais de Enfermagem", "Sistematização da Assistência e processo de enfermagem", "Segurança do paciente e Programa Nacional de Segurança do Paciente"] },
      { title: "Clínica e gerenciamento", lessons: ["Saúde do adulto e do idoso", "Saúde da mulher e da criança", "Urgência e emergência", "Controle de infecção relacionada à assistência", "Gerenciamento e liderança em enfermagem"] },
    ],
  },
  {
    slug: "especifico-tecnico-enfermagem", title: "Técnico de Enfermagem: conhecimentos específicos", area: "especifico", profession: "Técnico de Enfermagem", trail: 2, position: 8, level: "Específico",
    description: "Atribuições do técnico, biossegurança e técnicas de enfermagem mais cobradas nas provas de nível médio.",
    resources: [COFEN, { label: "Lei 7.498/1986", url: "https://www.planalto.gov.br/ccivil_03/leis/l7498.htm" }],
    modules: [
      { title: "Exercício profissional e biossegurança", lessons: ["Lei 7.498/1986: atribuições do técnico de enfermagem", "Ética profissional", "Biossegurança e precauções-padrão"] },
      { title: "Técnicas e procedimentos", lessons: ["Sinais vitais e medidas antropométricas", "Administração de medicamentos e cálculo de doses", "Curativos e cuidados com feridas", "Imunização e Programa Nacional de Imunizações", "Primeiros socorros e suporte básico de vida"] },
    ],
  },
  {
    slug: "especifico-radiologia", title: "Radiologia Médica: conhecimentos específicos", area: "especifico", profession: "Radiologia Médica", trail: 2, position: 9, level: "Específico",
    description: "Física das radiações, radioproteção, técnicas radiográficas e métodos de imagem para provas de técnico e tecnólogo em radiologia.",
    resources: [CONTER, CNEN, SAUDE],
    modules: [
      { title: "Física e radioproteção", lessons: ["Física das radiações e produção de raios X", "Interação da radiação com a matéria", "Radioproteção: princípio ALARA e limites de dose", "Normas da CNEN e Portaria SVS/MS 453/1998"] },
      { title: "Técnicas e imagem", lessons: ["Posicionamento e técnicas radiográficas", "Formação e qualidade da imagem", "Tomografia computadorizada", "Ressonância magnética: princípios e segurança", "Meios de contraste e situações de urgência"] },
    ],
  },
];

export const concursoMaterials = [
  { title: "Constituição Federal de 1988", description: "Texto oficial atualizado: base para saúde, seguridade social e administração pública.", category: "Legislação", kind: "link", url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm", included: true },
  { title: "Lei 8.112/1990: servidores federais", description: "Regime jurídico dos servidores públicos civis da União, das autarquias e fundações.", category: "Legislação", kind: "link", url: "https://www.planalto.gov.br/ccivil_03/leis/l8112cons.htm", included: true },
  { title: "Lei 8.080/1990: Lei Orgânica da Saúde", description: "Condições para promoção, proteção e recuperação da saúde e organização do SUS.", category: "SUS", kind: "link", url: "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm", included: true },
  { title: "Lei 8.142/1990: participação da comunidade", description: "Participação social no SUS e transferências intergovernamentais de recursos.", category: "SUS", kind: "link", url: "https://www.planalto.gov.br/ccivil_03/leis/l8142.htm", included: true },
  { title: "Decreto 7.508/2011", description: "Regulamenta a Lei 8.080/1990: organização, planejamento, assistência e articulação interfederativa.", category: "SUS", kind: "link", url: "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/decreto/d7508.htm", included: true },
  { title: "Ministério da Saúde", description: "Políticas, protocolos e publicações oficiais do SUS.", category: "SUS", kind: "link", url: "https://www.gov.br/saude/pt-br", included: true },
  { title: "Diário Oficial da União", description: "Acompanhe editais, retificações e convocações de concursos federais.", category: "Editais e diários", kind: "link", url: "https://www.in.gov.br/", included: true },
  { title: "COFEN: enfermagem", description: "Resoluções, código de ética e legislação de Enfermagem e Técnico de Enfermagem.", category: "Conselhos profissionais", kind: "link", url: "https://www.cofen.gov.br/", included: true },
  { title: "CONTER: radiologia", description: "Conselho profissional: normas e resoluções da Radiologia.", category: "Conselhos profissionais", kind: "link", url: "https://conter.gov.br/", included: true },
  { title: "CNEN: radioproteção", description: "Normas de proteção radiológica e requisitos de instalações radioativas.", category: "Conselhos profissionais", kind: "link", url: "https://www.gov.br/cnen/pt-br", included: true },
];

export const concursoNews = [
  { title: "Como ler um edital de concurso da saúde", content: "O edital é o seu mapa de estudos. Comece pelo cargo, requisitos, banca, etapas e critérios de desempate. Depois identifique o conteúdo programático: conhecimentos comuns (Português, Raciocínio Lógico, SUS), legislação da esfera e conhecimentos específicos do cargo.\n\nTransforme cada tópico em uma tarefa de estudo e acompanhe o que já foi revisado. Ao encontrar retificações, atualize seu plano.\n\nEste conteúdo é de apoio aos estudos e não garante aprovação. Confirme sempre as informações no edital oficial.", kind: "article", coverUrl: "/images/news-1.jpg" },
  { title: "Enfermagem e Radiologia: o que mais cai em específicas", content: "Nas provas de Enfermagem, os temas de segurança do paciente, legislação profissional, urgência e controle de infecção aparecem com frequência. Em Radiologia, físicas das radiações, radioproteção e posicionamento dominam as questões.\n\nUse essas informações para priorizar seus blocos de estudo, mas sempre compare com o conteúdo programático do seu edital.", kind: "article", coverUrl: "/images/course-3.jpg" },
  { title: "Rotina de estudos: por onde começar", content: "Divida a semana entre conteúdos comuns, legislação e matérias específicas. Alterne teoria e questões, e reserve um momento fixo para revisar erros.\n\nUma estratégia simples: bloco curto de teoria, bloco de questões e revisão no fim da semana. Ajuste conforme o tempo que falta para a prova.", kind: "article", coverUrl: "/images/course-1.jpg" },
];

export const concursoMentorships = [
  { title: "Aulão ao vivo: interpretação de texto para concursos", description: "Estratégias de leitura e análise de questões típicas de bancas da área da saúde.", status: "upcoming" },
  { title: "Plantão de dúvidas: SUS e legislação", description: "Tire dúvidas sobre Lei 8.080/1990, Lei 8.142/1990, Decreto 7.508/2011 e organização do SUS.", status: "upcoming" },
  { title: "Simulado comentado: raciocínio lógico-matemático", description: "Resolução comentada de questões de lógica proposicional, porcentagem e probabilidade.", status: "upcoming" },
];

export const concursoSettings = [
  { key: "highlight_title", value: "Sua preparação para concursos da saúde, em um só lugar." },
  { key: "highlight_subtitle", value: "Estude os conteúdos comuns, a legislação da sua esfera e as matérias específicas da sua profissão com uma comunidade que caminha junto." },
  { key: "video_url", value: "" },
  { key: "video_title", value: "Comece pelo seu plano" },
  { key: "whatsapp_group", value: "" },
  { key: "instagram", value: "" },
];
