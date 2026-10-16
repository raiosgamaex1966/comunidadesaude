type Guide = { focus: string; points: string[]; reflection: string };

const guides: Record<string, Guide> = {
  comum: {
    focus: "Conteúdo cobrado em praticamente todos os cargos",
    points: [
      "Estude a teoria em blocos curtos e resolva questões logo em seguida para fixar o assunto.",
      "Priorize os tópicos que mais aparecem na banca do seu concurso.",
      "Registre seus erros em um caderno e revise-os semanalmente.",
    ],
    reflection: "Reserve um bloco fixo por semana para Língua Portuguesa, Raciocínio Lógico e SUS.",
  },
  legislacao: {
    focus: "Legislação e conhecimentos da esfera do seu concurso",
    points: [
      "Confirme no edital quais leis e conhecimentos locais são cobrados e em qual versão.",
      "Estude o texto oficial da norma: leia, destaque e relacione com a rotina do serviço público.",
      "Acompanhe alterações legislativas recentes nas fontes oficiais antes da prova.",
    ],
    reflection: "Monte um quadro por lei: assunto, artigos mais cobrados e pegadinhas comuns.",
  },
  especifico: {
    focus: "Conhecimentos específicos da sua profissão",
    points: [
      "Compare o conteúdo programático do edital com os tópicos desta matéria.",
      "Aprofunde os temas de maior peso no cargo e resolva questões de provas anteriores.",
      "Consulte as normas do seu conselho profissional e protocolos oficiais atualizados.",
    ],
    reflection: "Transforme cada tópico do edital em uma pergunta e tente respondê-la sem consultar o material.",
  },
};

export function getHealthcareGuide(area: string): Guide | null {
  return guides[area] ?? null;
}
