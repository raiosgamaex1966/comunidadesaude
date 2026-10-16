import { db, pool } from "@/db";
import {
  users, trails, courses, modules, lessons, materials, news, mentorships, posts, postComments,
  siteSettings, calls, notifications,
} from "@/db/schema";
import { count, eq, inArray, isNull } from "drizzle-orm";
import bcrypt from "bcryptjs";
import {
  concursoCourses, concursoMaterials, concursoMentorships, concursoNews, concursoSettings, concursoTrails,
} from "@/lib/concurso-content";
// Conteúdo da versão anterior da demonstração: usado apenas para removê-lo na conversão.
import {
  healthcareCourses, healthcareMaterials, healthcareMentorships, healthcareNews, healthcarePosts, healthcareTrails,
} from "@/lib/healthcare-content";

const CONTENT_VERSION = "2";
const placeholder = "preview-without-login";
const initialAdminEmail = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
const initialAdminPassword = process.env.INITIAL_ADMIN_PASSWORD;

function initialCredentialsOrNull() {
  if (!initialAdminEmail || !initialAdminPassword || initialAdminPassword.length < 8) return null;
  return { email: initialAdminEmail, password: initialAdminPassword };
}

function requiredAdminCredentials() {
  const credentials = initialCredentialsOrNull();
  if (!credentials) throw new Error("Defina INITIAL_ADMIN_EMAIL e INITIAL_ADMIN_PASSWORD antes de iniciar uma base de dados vazia.");
  return credentials;
}

let seeding: Promise<void> | null = null;
let alreadyCheckedSeed = false;

async function withSeedLock<T>(fn: () => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("select pg_advisory_lock(727301)");
    return await fn();
  } finally {
    try { await client.query("select pg_advisory_unlock(727301)"); } finally { client.release(); }
  }
}

export async function ensureSeeded() {
  if (alreadyCheckedSeed) return;
  if (!seeding) {
    seeding = (async () => {
      try {
        const [{ value }] = await db.select({ value: count() }).from(users);
        if (Number(value) > 0) {
          alreadyCheckedSeed = true;
          return;
        }
        await withSeedLock(runSeed);
        alreadyCheckedSeed = true;
      } catch (e) {
        console.error("Seed check failed", e);
      } finally {
        seeding = null;
      }
    })();
  }
  return seeding;
}

export async function runSeed() {
  const [{ value }] = await db.select({ value: count() }).from(users);
  if (Number(value) === 0) {
    const credentials = requiredAdminCredentials();
    const [admin] = await db.insert(users).values({
      email: credentials.email, passwordHash: await bcrypt.hash(credentials.password, 12), fullName: "Robson Cordeiro", role: "admin", country: "Brasil",
      bio: "Fundador da RCS Prime Comunity. Preparação para concursos da área da saúde.",
    }).returning();
    await db.insert(users).values([
      { email: "ana@exemplo.com", passwordHash: await bcrypt.hash("Enfermagem@2026", 12), fullName: "Ana Souza", country: "Brasil", profession: "Enfermagem", bio: "Enfermeira | Estudando para concursos federais." },
      { email: "joao@exemplo.com", passwordHash: await bcrypt.hash("TecEnf@2026", 12), fullName: "João Miguel", country: "Portugal", profession: "Técnico de Enfermagem", bio: "Técnico de Enfermagem | Foco em concursos municipais." },
      { email: "carla@exemplo.com", passwordHash: await bcrypt.hash("Radiologia@2026", 12), fullName: "Carla Mendes", country: "Angola", profession: "Radiologia Médica", bio: "Tecnóloga em Radiologia | Preparação para concursos estaduais." },
    ]);
    await installConcursoContent(admin.id);
    return;
  }

  const credentials = initialCredentialsOrNull();
  const [existingAdmin] = credentials
    ? await db.select().from(users).where(eq(users.email, credentials.email)).limit(1)
    : await db.select().from(users).where(eq(users.role, "admin")).limit(1);
  if (existingAdmin?.passwordHash === placeholder && credentials) {
    await db.update(users).set({ passwordHash: await bcrypt.hash(credentials.password, 12), active: true, role: "admin" }).where(eq(users.id, existingAdmin.id));
  }
  const [marker] = await db.select().from(siteSettings).where(eq(siteSettings.key, "healthcare_content_version"));
  if (marker?.value === CONTENT_VERSION) {
    if (existingAdmin) await assignLegacyOwnership(existingAdmin.id);
    return;
  }

  // Conversão: remove somente a demonstração anterior (matérias genéricas de saúde) e instala o catálogo de concursos.
  await db.delete(courses).where(inArray(courses.slug, healthcareCourses.map((c) => c.slug)));
  await db.delete(trails).where(inArray(trails.title, healthcareTrails.map((t) => t.title)));
  await db.delete(materials).where(inArray(materials.title, healthcareMaterials.map((m) => m.title)));
  await db.delete(news).where(inArray(news.title, healthcareNews.map((n) => n.title)));
  await db.delete(mentorships).where(inArray(mentorships.title, healthcareMentorships.map((m) => m.title)));
  await db.delete(posts).where(inArray(posts.content, healthcarePosts.map((p) => p.content)));
  const [admin] = await db.select().from(users).where(eq(users.role, "admin")).limit(1);
  await installConcursoContent(admin.id);
}

async function userIdByEmail(email: string, fallback: number) {
  const [u] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  return u?.id ?? fallback;
}

async function installConcursoContent(adminId: number) {
  const ana = await userIdByEmail("ana@exemplo.com", adminId);
  const joao = await userIdByEmail("joao@exemplo.com", adminId);
  const carla = await userIdByEmail("carla@exemplo.com", adminId);

  // Perfis de demonstração com profissão
  const profiles: [string, string, string][] = [
    ["ana@exemplo.com", "Enfermagem", "Enfermeira | Estudando para concursos municipais."],
    ["joao@exemplo.com", "Técnico de Enfermagem", "Técnico de Enfermagem | Foco em concursos estaduais."],
    ["carla@exemplo.com", "Radiologia Médica", "Tecnóloga em Radiologia | Preparação para concursos federais."],
  ];
  for (const [email, profession, bio] of profiles) await db.update(users).set({ profession, bio }).where(eq(users.email, email));

  const ts = await db.insert(trails).values(concursoTrails.map((t) => ({ ...t }))).returning();
  for (const c of concursoCourses) {
    const [course] = await db.insert(courses).values({
      slug: c.slug, title: c.title, description: c.description, coverUrl: null, level: c.level, status: "published",
      trailId: ts[c.trail].id, position: c.position, instructor: "Equipe RCS Prime",
      area: c.area, profession: c.profession ?? null, sphere: c.sphere ?? null, ownerUserId: adminId,
    }).returning();
    const resources = JSON.stringify(c.resources);
    for (let mi = 0; mi < c.modules.length; mi++) {
      const m = c.modules[mi];
      const [mod] = await db.insert(modules).values({ courseId: course.id, title: m.title, position: mi + 1 }).returning();
      await db.insert(lessons).values(m.lessons.map((title, li) => ({
        moduleId: mod.id, courseId: course.id, slug: `${c.slug}-m${mi + 1}-a${li + 1}`, title, position: li + 1,
        description: `Tópico recorrente em editais: ${title}. Estude a teoria, resolva questões da banca do seu concurso e revise com resumos. Confirme sempre o conteúdo programático e a legislação vigente no edital.`,
        videoUrl: null, durationMin: 20 + li * 5, resources,
      })));
    }
  }

  await db.insert(materials).values(concursoMaterials.map((m) => ({ ...m, ownerUserId: adminId })));
  await db.insert(news).values(concursoNews.map((n) => ({ ...n, authorId: adminId })));
  const now = Date.now();
  await db.insert(mentorships).values(concursoMentorships.map((m, i) => ({ ...m, scheduledAt: new Date(now + (i * 3 + 3) * 86400000), ownerUserId: adminId })));

  const ps = await db.insert(posts).values([
    { userId: ana, topic: "Rotina de estudos", content: "Como vocês organizam a semana entre Português, Raciocínio Lógico e SUS? Estou dividindo em blocos de 50 minutos e fazendo a revisão dos erros aos domingos. 📚" },
    { userId: carla, topic: "SUS", content: "Dica que me ajudou: montar uma linha do tempo com a CF/88, a Lei 8.080/1990 e a Lei 8.142/1990 para fixar o que cada norma regula. Alguém tem outra técnica?" },
    { userId: joao, topic: "Legislação", content: "Vou prestar um concurso municipal e o edital cobra Lei Orgânica e Estatuto dos servidores do município. Como vocês estão organizando esse estudo?" },
    { userId: adminId, topic: "Avisos", content: "Boas-vindas à RCS Prime Comunity! Aqui você encontra conteúdos comuns, legislação por esfera e matérias da sua profissão. Comece em “Meu concurso” e monte seu plano. ✅ Confirme sempre as informações no edital oficial." },
  ]).returning();
  await db.insert(postComments).values([
    { postId: ps[0].id, userId: adminId, content: "Ótima rotina, Ana! Revisar os erros semanalmente é um dos hábitos que mais ajudam." },
    { postId: ps[2].id, userId: ana, content: "Comece pelo conteúdo programático do edital e liste as leis citadas. Depois estude pelo texto oficial." },
  ]);

  await db.insert(calls).values({ code: "rcs-boas-vindas", title: "Encontro de boas-vindas aos concurseiros da saúde", hostId: adminId, scheduledAt: new Date(now + 2 * 86400000), status: "scheduled", guestsAllowed: true }).onConflictDoNothing();
  await db.update(calls).set({ title: "Encontro de boas-vindas aos concurseiros da saúde" }).where(eq(calls.code, "rcs-boas-vindas"));
  await db.update(notifications).set({ body: "Monte seu plano em “Meu concurso” e comece pelos conhecimentos comuns." }).where(eq(notifications.title, "Bem-vindo à RCS Prime Comunity"));

  for (const s of [...concursoSettings, { key: "healthcare_content_version", value: CONTENT_VERSION }]) {
    await db.insert(siteSettings).values(s).onConflictDoUpdate({ target: siteSettings.key, set: { value: s.value } });
  }
}


async function assignLegacyOwnership(adminId: number) {
  await db.update(courses).set({ ownerUserId: adminId }).where(isNull(courses.ownerUserId));
  await db.update(materials).set({ ownerUserId: adminId }).where(isNull(materials.ownerUserId));
  await db.update(mentorships).set({ ownerUserId: adminId }).where(isNull(mentorships.ownerUserId));
}
