export const PROFESSIONS = [
  "Enfermagem",
  "Técnico de Enfermagem",
  "Radiologia Médica",
] as const;

export const PROFESSION_DETAILS: Record<string, {
  role: string; short: string; blurb: string; topics: string[];
  highlights: { title: string; text: string }[]; daily: string;
}> = {
  "Enfermagem": {
    role: "Enfermeiro(a)",
    short: "Enfermagem",
    blurb: "Assistência, gestão do cuidado e segurança do paciente.",
    topics: ["SAE e processo de enfermagem", "Legislação e ética (Lei 7.498/1986)", "Urgência e emergência", "Controle de infecção", "Gerenciamento e liderança"],
    highlights: [
      { title: "Segurança do paciente", text: "Cultura de segurança, identificação correta e notificação de incidentes." },
      { title: "Legislação profissional", text: "Lei 7.498/1986, Decreto 94.406/1987 e Código de Ética." },
      { title: "Gestão do cuidado", text: "Sistematização da assistência, indicadores e liderança de equipe." },
    ],
    daily: "Uma aula de específica por dia mantém a matéria viva até a prova.",
  },
  "Técnico de Enfermagem": {
    role: "Técnico(a) de Enfermagem",
    short: "Téc. Enfermagem",
    blurb: "Procedimentos, biossegurança e apoio assistencial.",
    topics: ["Atribuições do técnico", "Sinais vitais e antropometria", "Cálculo de doses e medicação", "Curativos e feridas", "Imunização e primeiros socorros"],
    highlights: [
      { title: "Cálculo de doses", text: "Regra de três, diluição e gotejamento: aparece em quase toda prova." },
      { title: "Biossegurança", text: "Precauções-padrão, EPIs e higiene das mãos." },
      { title: "Procedimentos", text: "Sinais vitais, curativos, punção venosa e administração de medicamentos." },
    ],
    daily: "Resolva 10 questões de cálculo por dia para ganhar velocidade na prova.",
  },
  "Radiologia Médica": {
    role: "Técnico/Tecnólogo em Radiologia",
    short: "Radiologia",
    blurb: "Imagem, radioproteção e técnica radiográfica.",
    topics: ["Física das radiações", "Radioproteção e normas CNEN", "Posicionamento e técnicas", "TC e ressonância magnética", "Meios de contraste"],
    highlights: [
      { title: "Radioproteção", text: "Princípio ALARA, limites de dose e normas da CNEN." },
      { title: "Física das radiações", text: "Produção de raios X e interação com a matéria." },
      { title: "Técnica e imagem", text: "Posicionamento, qualidade da imagem, TC e ressonância." },
    ],
    daily: "Revise uma posição radiográfica por dia junto com a norma de proteção.",
  },
};

export const AREAS = [
  { key: "comum", label: "Conhecimentos comuns", short: "Comuns" },
  { key: "legislacao", label: "Legislação e esferas", short: "Legislação" },
  { key: "especifico", label: "Específicos da profissão", short: "Específicos" },
] as const;

export const SPHERES = [
  { key: "federal", label: "Federal" },
  { key: "estadual", label: "Estadual" },
  { key: "municipal", label: "Municipal" },
] as const;

export const areaLabel = (k: string) => AREAS.find((a) => a.key === k)?.label ?? k;
export const sphereLabel = (k: string | null | undefined) => SPHERES.find((s) => s.key === k)?.label ?? "";
