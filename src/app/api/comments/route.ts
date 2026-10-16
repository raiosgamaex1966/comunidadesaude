import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { postComments, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json([], { status: 401 });
  const postId = Number(new URL(req.url).searchParams.get("postId"));
  const rows = await db
    .select({ id: postComments.id, content: postComments.content, createdAt: postComments.createdAt, author: { fullName: users.fullName, avatarUrl: users.avatarUrl } })
    .from(postComments).innerJoin(users, eq(postComments.userId, users.id))
    .where(eq(postComments.postId, postId)).orderBy(asc(postComments.createdAt));
  return NextResponse.json(rows);
}
