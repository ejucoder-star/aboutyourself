/**
 * 称骨算命主页面
 * 设计风格：东方神秘主义 + 现代简约
 * - 深邃墨色背景配合金色点缀
 * - 中心对称布局
 * - 渐进式结果展示
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateBoneWeight, formatWeight, getFortuneDescription } from "@/lib/boneWeightData";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [hour, setHour] = useState<string>("");
  const [result, setResult] = useState<{
    total: number;
    yearWeight: number;
    monthWeight: number;
    dayWeight: number;
    hourWeight: number;
    ganZhi: string;
    zodiac: string;
    hourName: string;
    fortune: { poem: string; interpretation: string } | null;
  } | null>(null);

  const handleCalculate = () => {
    if (!year || !month || !day || !hour) {
      return;
    }

    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);
    const hourNum = parseInt(hour);

    const calculation = calculateBoneWeight(yearNum, monthNum, dayNum, hourNum);
    const fortune = getFortuneDescription(calculation.total);

    setResult({
      ...calculation,
      fortune
    });
  };

  const handleReset = () => {
    setYear("");
    setMonth("");
    setDay("");
    setHour("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card/50 relative overflow-hidden">
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 py-12 md:py-20">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              称骨算命
            </h1>
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            源自唐代袁天罡大师的命理学说，通过生辰八字推算骨重，揭示人生命运
          </p>
        </motion.div>

        {/* 输入表单 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <Card className="border-2 border-primary/20 shadow-2xl bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                输入生辰信息
              </CardTitle>
              <CardDescription>
                请输入您的公历出生年月日时，系统将自动计算您的骨重
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 出生年份 */}
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-base">出生年份</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="例如：1990"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    min="1900"
                    max="2100"
                    className="text-lg h-12"
                  />
                </div>

                {/* 出生月份 */}
                <div className="space-y-2">
                  <Label htmlFor="month" className="text-base">出生月份</Label>
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger id="month" className="text-lg h-12">
                      <SelectValue placeholder="选择月份" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <SelectItem key={m} value={m.toString()}>
                          {m}月
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 出生日期 */}
                <div className="space-y-2">
                  <Label htmlFor="day" className="text-base">出生日期</Label>
                  <Select value={day} onValueChange={setDay}>
                    <SelectTrigger id="day" className="text-lg h-12">
                      <SelectValue placeholder="选择日期" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <SelectItem key={d} value={d.toString()}>
                          {d}日
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 出生时辰 */}
                <div className="space-y-2">
                  <Label htmlFor="hour" className="text-base flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    出生时辰
                  </Label>
                  <Select value={hour} onValueChange={setHour}>
                    <SelectTrigger id="hour" className="text-lg h-12">
                      <SelectValue placeholder="选择时辰" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                        <SelectItem key={h} value={h.toString()}>
                          {h.toString().padStart(2, '0')}:00 - {(h + 1).toString().padStart(2, '0')}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleCalculate}
                  disabled={!year || !month || !day || !hour}
                  className="flex-1 h-12 text-lg font-semibold bg-primary hover:bg-primary/90"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  开始测算
                </Button>
                {result && (
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="h-12 px-8 text-lg"
                  >
                    重新测算
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 结果展示 */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              {/* 八字信息 */}
              <Card className="border-2 border-primary/30 shadow-xl bg-card/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">您的生辰八字</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">年柱</div>
                      <div className="text-2xl font-bold text-primary">
                        {result.ganZhi}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {result.zodiac}年
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">月份</div>
                      <div className="text-2xl font-bold text-primary">
                        {month}月
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">日期</div>
                      <div className="text-2xl font-bold text-primary">
                        {day}日
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-2">时辰</div>
                      <div className="text-2xl font-bold text-primary">
                        {result.hourName}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 骨重计算 */}
              <Card className="border-2 border-primary/30 shadow-xl bg-card/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">骨重计算</CardTitle>
                  <CardDescription>
                    根据您的生辰八字，各项骨重如下
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                      <span className="text-muted-foreground">年柱骨重</span>
                      <span className="text-lg font-semibold text-primary">
                        {formatWeight(result.yearWeight)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                      <span className="text-muted-foreground">月柱骨重</span>
                      <span className="text-lg font-semibold text-primary">
                        {formatWeight(result.monthWeight)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                      <span className="text-muted-foreground">日柱骨重</span>
                      <span className="text-lg font-semibold text-primary">
                        {formatWeight(result.dayWeight)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                      <span className="text-muted-foreground">时柱骨重</span>
                      <span className="text-lg font-semibold text-primary">
                        {formatWeight(result.hourWeight)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg border-2 border-primary/40">
                      <span className="text-lg font-semibold">总骨重</span>
                      <span className="text-3xl font-bold text-primary">
                        {formatWeight(result.total)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 命运描述 */}
              {result.fortune && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Card className="border-2 border-primary/40 shadow-2xl bg-gradient-to-br from-card/95 to-primary/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-3xl text-center flex items-center justify-center gap-3">
                        <Sparkles className="w-8 h-8 text-primary" />
                        称骨歌
                        <Sparkles className="w-8 h-8 text-primary" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {/* 诗句 */}
                      <div className="text-center p-8 bg-muted/30 rounded-xl">
                        <div className="text-xl md:text-2xl leading-relaxed whitespace-pre-line font-serif text-foreground">
                          {result.fortune.poem}
                        </div>
                      </div>

                      {/* 解释 */}
                      <div className="p-6 bg-primary/10 rounded-xl border border-primary/30">
                        <h3 className="text-xl font-semibold mb-4 text-primary">命理解析</h3>
                        <p className="text-lg leading-relaxed text-foreground/90">
                          {result.fortune.interpretation}
                        </p>
                      </div>

                      {/* 提示 */}
                      <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border/50">
                        <p>命运仅供参考，人生掌握在自己手中</p>
                        <p className="mt-2">积德行善，自强不息，方能改变命运</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 页脚 */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-20 text-muted-foreground text-sm"
        >
          <p>称骨算命源自唐代袁天罡《称骨歌》</p>
          <p className="mt-2">仅供娱乐参考，请勿过度迷信</p>
        </motion.footer>
      </div>
    </div>
  );
}
