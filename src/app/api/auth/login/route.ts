import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, verifyPassword } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";

// Redirecionamento relativo: o Host do sandbox (0.0.0.0:3000) não é alcançável
// pelo navegador do usuário quando a aplicação passa por um proxy/domínio público.
function redirectTo(path: string, status = 303) {
  return new Response(null, { status, headers: { Location: path } });
}

function homeFor(role: string) {
  if (role === "admin") return "/admin";
  return "/overview";
}

export async function POST(request: Request) {
  await ensureSeeded();
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");

  const fail = (message: string) => redirectTo(`/auth?erro=${encodeURIComponent(message)}`);

  if (!/^\S+@\S+\.\S+$/.test(email)) return fail("Informe um e-mail válido.");
  if (!password) return fail("Informe sua senha.");

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || !(await verifyPassword(password, user.passwordHash))) return fail("E-mail ou senha incorretos.");
  if (!user.active) return fail("Este acesso está desativado. Fale com a administração da comunidade.");

  await createSession(user.id);
  return redirectTo(homeFor(user.role));
}
