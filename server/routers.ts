import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { nanoid } from "nanoid";
import * as db from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // 授权码相关路由
  authCode: router({
    /**
     * 验证授权码
     * 如果授权码未使用，则激活它
     * 如果已激活，检查是否过期
     */
    verify: publicProcedure
      .input(z.object({
        code: z.string().min(1, "授权码不能为空"),
      }))
      .mutation(async ({ input }) => {
        const { valid, authCode, reason } = await db.isAuthCodeValid(input.code);
        
        if (!valid) {
          return {
            success: false,
            message: reason || "授权码无效",
          };
        }

        // 如果是未使用状态，激活它
        if (authCode!.status === "unused") {
          const activated = await db.activateAuthCode(input.code);
          return {
            success: true,
            message: "授权码验证成功，已激活，24小时内有效",
            authCode: activated,
          };
        }

        // 如果已激活，返回剩余时间
        const now = new Date();
        const expiresAt = authCode!.expiresAt!;
        const remainingHours = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60));
        
        return {
          success: true,
          message: `授权码有效，剩余${remainingHours}小时`,
          authCode: authCode!,
        };
      }),

    /**
     * 生成授权码（管理员功能）
     */
    generate: publicProcedure
      .input(z.object({
        featureType: z.enum(["boneWeight", "nameAvatar", "yearFortune", "monthFortune"]),
        count: z.number().min(1).max(100).default(1),
      }))
      .mutation(async ({ input }) => {
        const codes = [];
        
        for (let i = 0; i < input.count; i++) {
          const code = nanoid(16); // 生成16位随机字符串
          const authCode = await db.createAuthCode({
            code,
            featureType: input.featureType,
          });
          codes.push(authCode);
        }

        return {
          success: true,
          message: `成功生成${input.count}个授权码`,
          codes,
        };
      }),

    /**
     * 获取所有授权码列表（管理员功能）
     */
    list: publicProcedure
      .query(async () => {
        const codes = await db.getAllAuthCodes();
        return {
          success: true,
          codes,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
