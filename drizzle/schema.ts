import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 授权码表：存储付费功能的授权码信息
 * 每个授权码在激活后24小时内可重复使用
 */
export const authCodes = mysqlTable("authCodes", {
  id: int("id").autoincrement().primaryKey(),
  /** 授权码，唯一标识符 */
  code: varchar("code", { length: 64 }).notNull().unique(),
  /** 功能类型：boneWeight(称骨算命), nameAvatar(网名头像), yearFortune(流年运势), monthFortune(流月运势) */
  featureType: mysqlEnum("featureType", ["boneWeight", "nameAvatar", "yearFortune", "monthFortune"]).notNull(),
  /** 授权码状态：unused(未使用), active(激活中), expired(已过期) */
  status: mysqlEnum("status", ["unused", "active", "expired"]).default("unused").notNull(),
  /** 激活时间，首次使用时设置 */
  activatedAt: timestamp("activatedAt"),
  /** 过期时间，激活后24小时 */
  expiresAt: timestamp("expiresAt"),
  /** 创建时间 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** 更新时间 */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AuthCode = typeof authCodes.$inferSelect;
export type InsertAuthCode = typeof authCodes.$inferInsert;