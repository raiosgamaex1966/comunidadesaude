import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    fullName: text("full_name").notNull(),
    role: text("role").notNull().default("member"), // member | admin
    active: boolean("active").default(true).notNull(),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    whatsapp: text("whatsapp"),
    country: text("country").default("Brasil"),
  profession: text("profession"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)],
);

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trails = pgTable("trails", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  position: integer("position").default(0).notNull(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  coverUrl: text("cover_url"),
  level: text("level").default("Iniciante").notNull(), // Iniciante | Intermediário | Avançado
  status: text("status").default("published").notNull(), // published | coming_soon | draft
  trailId: integer("trail_id").references(() => trails.id, { onDelete: "set null" }),
  position: integer("position").default(0).notNull(),
  instructor: text("instructor").default("RCS"),
  area: text("area").default("comum").notNull(), // comum | legislacao | especifico
  profession: text("profession"), // para area = especifico
    sphere: text("sphere"), // federal | estadual | municipal (area = legislacao)
    ownerUserId: integer("owner_user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  position: integer("position").default(0).notNull(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url"),
  durationMin: integer("duration_min").default(10).notNull(),
  position: integer("position").default(0).notNull(),
  resources: text("resources"), // JSON string [{label,url}]
});

export const enrollments = pgTable(
  "enrollments",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("enroll_user_course_idx").on(t.userId, t.courseId)],
);

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    lessonId: integer("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
    courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    completedAt: timestamp("completed_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("progress_user_lesson_idx").on(t.userId, t.lessonId)],
);

export const lessonComments = pgTable("lesson_comments", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  topic: text("topic").default("Geral").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postComments = pgTable("post_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postLikes = pgTable(
  "post_likes",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => [uniqueIndex("like_post_user_idx").on(t.postId, t.userId)],
);

export const follows = pgTable(
  "follows",
  {
    id: serial("id").primaryKey(),
    followerId: integer("follower_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    followingId: integer("following_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => [uniqueIndex("follow_idx").on(t.followerId, t.followingId)],
);

export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").default("Evidências").notNull(),
  kind: text("kind").default("link").notNull(), // link | file | video
  url: text("url"),
  included: boolean("included").default(true).notNull(),
    price: text("price"),
    ownerUserId: integer("owner_user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  kind: text("kind").default("article").notNull(), // article | short
  videoUrl: text("video_url"),
  coverUrl: text("cover_url"),
  authorId: integer("author_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mentorships = pgTable("mentorships", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  scheduledAt: timestamp("scheduled_at"),
  recordingUrl: text("recording_url"),
    status: text("status").default("upcoming").notNull(), // upcoming | recorded
    ownerUserId: integer("owner_user_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const calls = pgTable("calls", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  hostId: integer("host_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  scheduledAt: timestamp("scheduled_at"),
  status: text("status").default("scheduled").notNull(), // scheduled | live | ended
  guestsAllowed: boolean("guests_allowed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savedItems = pgTable(
  "saved_items",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(), // post | lesson | mentorship | material | news
    refId: integer("ref_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("saved_idx").on(t.userId, t.kind, t.refId)],
);

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").default("").notNull(),
  folder: text("folder").default("Geral").notNull(),
  favorite: boolean("favorite").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const supportMessages = pgTable("support_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  senderId: integer("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body"),
  link: text("link"),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const examTargets = pgTable("exam_targets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  organ: text("organ").notNull(),
  sphere: text("sphere").notNull(),
  location: text("location"),
  profession: text("profession").notNull(),
  banca: text("banca"),
  examDate: timestamp("exam_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const podcasts = pgTable("podcasts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  audioUrl: text("audio_url").notNull(),
  subjectReference: text("subject_reference"), // Ex: SUS, Português, Radioproteção, Enfermagem
  courseId: integer("course_id").references(() => courses.id, { onDelete: "set null" }),
  durationMin: integer("duration_min").default(10).notNull(),
  coverUrl: text("cover_url"),
  ownerUserId: integer("owner_user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
