# RCS Prime Comunity

Plataforma web para preparação de **concursos públicos da área da saúde**, focada em **Enfermagem**, **Técnico de Enfermagem** e **Radiologia Médica**. Reúne matérias organizadas por edital, plano individual de estudo, comunidade e um painel administrativo completo para publicação de conteúdo.

---

## Para quem serve

### Administrador (dono da comunidade)

Para quem administra e publica o conteúdo. É o único perfil com acesso ao painel de gestão: cria matérias, módulos, tópicos, materiais, atualizações e encontros, acompanha alunos, modera a comunidade e responde o suporte.

### Alunos/concurseiros

Para estudantes que se preparam para concursos de:

- **Enfermagem** (enfermeiros);
- **Técnico de Enfermagem**;
- **Radiologia Médica** (técnicos e tecnólogos).

Cada aluno vê um **painel personalizado** conforme a profissão escolhida em Configurações.

---

## Conteúdo pedagógico atual

A estrutura separa os estudos em três blocos:

1. **Conhecimentos comuns**
   - Língua Portuguesa;
   - Raciocínio Lógico-Matemático;
   - Sistema Único de Saúde (SUS).

2. **Legislação e conhecimentos por esfera**
   - Federal;
   - Estadual;
   - Municipal.

3. **Conhecimentos específicos por profissão**
   - Enfermagem;
   - Técnico de Enfermagem;
   - Radiologia Médica.

> **Importante:** conteúdos, leis e normas podem ser alterados. O estudante deve sempre conferir o edital oficial, a versão vigente da legislação e o conteúdo programático específico do concurso que pretende prestar.

---

## Painel do aluno por profissão

Cada profissão tem destaques próprios na área do aluno:

### Enfermagem
- Segurança do paciente e cultura de segurança;
- Legislação profissional (Lei 7.498/1986 e Código de Ética);
- Gestão do cuidado, SAE e liderança de equipe.

### Técnico de Enfermagem
- Cálculo de doses e administração de medicamentos;
- Biossegurança e precauções-padrão;
- Procedimentos: sinais vitais, curativos, imunização e primeiros socorros.

### Radiologia Médica
- Radioproteção e normas da CNEN;
- Física das radiações e produção de raios X;
- Posicionamento, técnica de imagem, TC e ressonância magnética.

---

## Funcionalidades

### Área pública

- Página de vendas na raiz (`/`) e em `/vendas`;
- Apresentação da proposta, público-alvo, recursos e fluxo de uso;
- Botão de entrada para a plataforma.

### Login e segurança

- Login por e-mail e senha;
- Senhas armazenadas com hash bcrypt;
- Sessões via cookie HTTP-only;
- Separação de papéis: `member` (aluno) e `admin` (administrador);
- Rotas administrativas protegidas: aluno que tentar acessar `/admin` é redirecionado;
- Botão de sair encerra a sessão.

### Administração (`/admin`)

O administrador pode:

- Ver indicadores gerais da plataforma;
- Gerenciar alunos;
- Criar e organizar trilhas;
- Criar, editar e excluir matérias;
- Criar módulos e tópicos;
- Associar matéria a área, profissão e esfera de governo;
- Publicar ou deixar matérias como rascunho;
- Gerenciar materiais, links e referências da Biblioteca;
- Gerenciar atualizações e notícias;
- Gerenciar aulões, encontros e gravações;
- Enviar notificações para os alunos;
- Responder conversas de suporte;
- Ajustar textos de destaque, vídeo e links institucionais.

### Área do aluno

- Catálogo de matérias com busca e filtros;
- Filtros por conhecimentos comuns, legislação e conteúdos específicos;
- Filtro por profissão;
- Página de matéria com módulos, tópicos, referências, progresso e comentários;
- Matrícula em matéria;
- Marcação de tópico estudado;
- Área **Meu concurso** para cadastrar órgão, esfera, profissão, banca e data da prova;
- Geração automática de plano com matérias comuns, legislação da esfera e conteúdos específicos da profissão;
- Progresso por plano de concurso;
- Comunidade com publicações, curtidas, comentários e seguidores;
- Biblioteca de materiais;
- Atualizações e artigos;
- Encontros e gravações;
- Salas ao vivo com câmera, microfone e compartilhamento de tela;
- Notas e anotações;
- Itens salvos;
- Histórico de progresso e constância de estudos;
- Chat de suporte.

---

## Instalação local

### Pré-requisitos

- Node.js 20 ou superior;
- npm;
- PostgreSQL 14 ou superior.

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar ambiente

Crie ou ajuste o arquivo `.env` na raiz:

```env
DATABASE_URL=postgresql://usuario:senha@host:5432/nome_do_banco
INITIAL_ADMIN_EMAIL=admin@seudominio.com
INITIAL_ADMIN_PASSWORD="uma-senha-forte-com-ao-menos-8-caracteres"
```

| Variável | Finalidade |
|---|---|
| `DATABASE_URL` | Conexão PostgreSQL usada pelo Drizzle ORM. |
| `INITIAL_ADMIN_EMAIL` | E-mail da conta administrativa em uma base vazia. |
| `INITIAL_ADMIN_PASSWORD` | Senha inicial do administrador. Use aspas se a senha tiver `#`, espaços ou caracteres especiais. |

> Não publique o `.env`, senhas ou a URL do banco em repositórios públicos.

### 3. Aplicar o schema do banco

```bash
npx drizzle-kit push
```

Cria ou atualiza as tabelas: usuários, sessões, trilhas, matérias, módulos, tópicos, matrículas, progresso, comentários, comunidade, materiais, notícias, encontros, chamadas, itens salvos, anotações, suporte, notificações, planos de concurso e configurações.

### 4. Iniciar em desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000`. Em uma base vazia, a aplicação cria a conta de administrador a partir das variáveis do `.env`, além do conteúdo inicial de demonstração.

### 5. Acessos

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | `robsoncordeiro1966@gmail.com` | `Rcs@2026` |
| Aluno — Enfermagem | `ana@exemplo.com` | `Enfermagem@2026` |
| Aluno — Téc. Enfermagem | `joao@exemplo.com` | `TecEnf@2026` |
| Aluno — Radiologia | `carla@exemplo.com` | `Radiologia@2026` |

> **Não há cadastro público.** Não existe autoatendimento de registro: o administrador cria cada conta de aluno. Remova o bloco "Acessos de teste" da tela de login (`src/app/auth/LoginForm.tsx`) antes de abrir a plataforma ao público.

### Como os alunos entram

1. O administrador acessa **Painel de gestão → Alunos**;
2. Clica em **Cadastrar aluno** e informa nome, e-mail, senha e profissão;
3. Envia o e-mail e a senha ao aluno por um canal seguro;
4. O aluno acessa `/auth`, faz login e cai direto no painel da profissão escolhida;
5. Se o aluno esquecer a senha, o administrador usa **Redefinir senha** na mesma tela;
6. O administrador pode **pausar** ou **remover** um acesso quando necessário.

Cada aluno vê somente a própria área: matérias liberadas, plano de concurso, comunidade e suporte. Rotas administrativas são bloqueadas para o papel `member`.

### 6. Gerar build de produção

```bash
npx next typegen
npm exec tsc -- --noEmit --pretty false
npm run build
npm run start
```

Em hospedagens gerenciadas, configure as mesmas variáveis de ambiente no painel do provedor e use um banco PostgreSQL persistente.

---

## Estrutura das permissões

| Papel | Acesso |
|---|---|
| `member` | Área do aluno: painel da profissão, matérias, plano de concurso, comunidade e suporte. |
| `admin` | Acesso completo ao painel de gestão: matérias, materiais, encontros, alunos, notificações e suporte. |

---

## Publicação de conteúdos

### Estado da matéria

- **Rascunho:** não aparece para alunos;
- **Publicado:** aparece no catálogo e nos planos de estudo;
- **Em breve:** aparece no catálogo, indicando que o conteúdo está em preparação.

### Vídeos

A plataforma trabalha com URL incorporável, como YouTube não listado ou Vimeo:

```text
https://www.youtube.com/embed/ID_DO_VIDEO
```

### Arquivos e apostilas

No estado atual, materiais usam links. Você pode apontar para Google Drive, OneDrive, Dropbox, PDF hospedado ou URL de ferramenta externa.

---

## Operação recomendada

1. Cadastre as trilhas principais (comuns, legislação, específicos);
2. Organize as matérias por área, profissão e esfera;
3. Crie módulos e tópicos com vídeos e referências;
4. Trabalhe em rascunho e revise antes de publicar;
5. Oriente os alunos a definir a profissão em Configurações;
6. Incentive o uso de **Meu concurso** para gerar o plano de estudos;
7. Crie aulões e atualizações conforme novos editais;
8. Use notificações e comunidade para avisos de editais e retificações;
9. Faça backup regular do banco PostgreSQL.

---

## Limitações atuais e próximas integrações recomendadas

A aplicação está funcional para login e publicação de conteúdo. Para uma operação comercial completa, considere adicionar:

- **Upload direto de arquivos:** S3, Cloudinary, Supabase Storage ou serviço equivalente. Atualmente materiais são publicados por URL;
- **Hospedagem profissional de vídeo:** Vimeo, YouTube não listado, Bunny Stream ou similar;
- **Pagamentos e assinaturas:** Stripe, Mercado Pago, Kiwify, Hotmart ou outro gateway, caso a venda seja feita dentro da plataforma;
- **Recuperação de senha por e-mail:** fluxo de redefinição com provedor de e-mail;
- **Cadastro de alunos pelo administrador:** criação de contas diretamente no painel;
- **Backup, monitoramento e logs:** banco gerenciado, backups automatizados, alertas e auditoria;
- **Política de privacidade, termos de uso e LGPD:** indispensáveis antes da abertura pública e da comercialização.

---

## Rotas principais

| Rota | Uso |
|---|---|
| `/` ou `/vendas` | Página de vendas pública. |
| `/auth` | Login. |
| `/admin` | Painel do administrador. |
| `/overview` | Painel do aluno (personalizado por profissão). |
| `/courses` | Catálogo de matérias. |
| `/concursos` | Plano individual por concurso. |
| `/community` | Comunidade de estudo. |
| `/materials` | Biblioteca de materiais. |
| `/mentorships` | Aulões e encontros. |
| `/chamadas` | Salas ao vivo. |
| `/support` | Atendimento privado. |
| `/settings` | Perfil, profissão e notificações. |

---

## Segurança operacional

- Use senhas fortes e exclusivas;
- Mantenha dependências, banco e ambiente de produção atualizados;
- Faça backup do banco antes de mudanças estruturais;
- Revise conteúdos jurídicos e legislação antes de publicar;
- Não prometa aprovação em concursos: a plataforma é uma ferramenta de organização e apoio aos estudos.
