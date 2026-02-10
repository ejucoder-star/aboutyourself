import { eq, and, gt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, authCodes, InsertAuthCode, AuthCode } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ========== 授权码相关函数 ==========

/**
 * 创建新的授权码
 */
export async function createAuthCode(code: InsertAuthCode): Promise<AuthCode> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(authCodes).values(code);
  const insertId = Number(result[0].insertId);
  
  const created = await db.select().from(authCodes).where(eq(authCodes.id, insertId)).limit(1);
  if (!created[0]) {
    throw new Error("Failed to create auth code");
  }
  
  return created[0];
}

/**
 * 根据授权码查询
 */
export async function getAuthCodeByCode(code: string): Promise<AuthCode | undefined> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(authCodes).where(eq(authCodes.code, code)).limit(1);
  return result[0];
}

/**
 * 激活授权码
 */
export async function activateAuthCode(code: string): Promise<AuthCode> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24小时后过期

  await db.update(authCodes)
    .set({
      status: "active",
      activatedAt: now,
      expiresAt: expiresAt,
    })
    .where(eq(authCodes.code, code));

  const updated = await getAuthCodeByCode(code);
  if (!updated) {
    throw new Error("Failed to activate auth code");
  }

  return updated;
}

/**
 * 检查授权码是否有效（未使用或激活中且未过期）
 */
export async function isAuthCodeValid(code: string): Promise<{ valid: boolean; authCode?: AuthCode; reason?: string }> {
  const authCode = await getAuthCodeByCode(code);
  
  if (!authCode) {
    return { valid: false, reason: "授权码不存在" };
  }

  // 如果是未使用状态，直接返回有效
  if (authCode.status === "unused") {
    return { valid: true, authCode };
  }

  // 如果是激活状态，检查是否过期
  if (authCode.status === "active") {
    if (authCode.expiresAt && new Date() < authCode.expiresAt) {
      return { valid: true, authCode };
    } else {
      // 已过期，更新状态
      const db = await getDb();
      if (db) {
        await db.update(authCodes)
          .set({ status: "expired" })
          .where(eq(authCodes.code, code));
      }
      return { valid: false, reason: "授权码已过期" };
    }
  }

  // 已过期状态
  return { valid: false, reason: "授权码已过期" };
}

/**
 * 获取所有授权码列表
 */
export async function getAllAuthCodes(): Promise<AuthCode[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(authCodes).orderBy(authCodes.createdAt);
}
