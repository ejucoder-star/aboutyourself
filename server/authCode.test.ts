import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-admin",
    email: "admin@example.com",
    name: "Test Admin",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("authCode system", () => {
  it("should generate auth codes successfully", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.authCode.generate({
      featureType: "nameAvatar",
      count: 2,
    });

    expect(result.success).toBe(true);
    expect(result.codes).toHaveLength(2);
    expect(result.codes[0]?.featureType).toBe("nameAvatar");
    expect(result.codes[0]?.status).toBe("unused");
  });

  it("should verify unused auth code and activate it", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // 先生成一个授权码
    const generateResult = await caller.authCode.generate({
      featureType: "yearFortune",
      count: 1,
    });

    const code = generateResult.codes[0]?.code;
    expect(code).toBeDefined();

    // 验证授权码
    const verifyResult = await caller.authCode.verify({ code: code! });

    expect(verifyResult.success).toBe(true);
    expect(verifyResult.authCode?.status).toBe("active");
    expect(verifyResult.authCode?.activatedAt).toBeDefined();
    expect(verifyResult.authCode?.expiresAt).toBeDefined();
  });

  it("should allow reusing active auth code within 24 hours", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // 生成并激活授权码
    const generateResult = await caller.authCode.generate({
      featureType: "monthFortune",
      count: 1,
    });

    const code = generateResult.codes[0]?.code;
    
    // 第一次验证（激活）
    const firstVerify = await caller.authCode.verify({ code: code! });
    expect(firstVerify.success).toBe(true);
    expect(firstVerify.authCode?.status).toBe("active");

    // 第二次验证（应该仍然有效）
    const secondVerify = await caller.authCode.verify({ code: code! });
    expect(secondVerify.success).toBe(true);
    expect(secondVerify.authCode?.status).toBe("active");
  });

  it("should reject invalid auth code", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.authCode.verify({ code: "invalid-code-12345" });

    expect(result.success).toBe(false);
    expect(result.message).toContain("不存在");
  });

  it("should list all auth codes", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // 生成几个授权码
    await caller.authCode.generate({
      featureType: "nameAvatar",
      count: 3,
    });

    const listResult = await caller.authCode.list();

    expect(listResult.success).toBe(true);
    expect(listResult.codes.length).toBeGreaterThanOrEqual(3);
  });

  it("should calculate expiration time correctly (24 hours)", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const generateResult = await caller.authCode.generate({
      featureType: "yearFortune",
      count: 1,
    });

    const code = generateResult.codes[0]?.code;
    const verifyResult = await caller.authCode.verify({ code: code! });

    const activatedAt = verifyResult.authCode?.activatedAt;
    const expiresAt = verifyResult.authCode?.expiresAt;

    expect(activatedAt).toBeDefined();
    expect(expiresAt).toBeDefined();

    // 验证过期时间是激活时间的24小时后
    const timeDiff = new Date(expiresAt!).getTime() - new Date(activatedAt!).getTime();
    const expectedDiff = 24 * 60 * 60 * 1000; // 24小时的毫秒数

    expect(Math.abs(timeDiff - expectedDiff)).toBeLessThan(1000); // 允许1秒误差
  });
});
