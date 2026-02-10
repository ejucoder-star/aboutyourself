/**
 * 管理后台页面
 * 用于生成和管理授权码
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";
import { Key, Plus, RefreshCw, Copy } from "lucide-react";

export default function Admin() {
  const [featureType, setFeatureType] = useState<"boneWeight" | "nameAvatar" | "yearFortune" | "monthFortune">("nameAvatar");
  const [count, setCount] = useState<number>(1);

  // 获取授权码列表
  const { data: codesData, refetch } = trpc.authCode.list.useQuery();

  // 生成授权码
  const generateMutation = trpc.authCode.generate.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      refetch();
    },
    onError: (error) => {
      toast.error("生成失败：" + error.message);
    },
  });

  const handleGenerate = () => {
    if (count < 1 || count > 100) {
      toast.error("数量必须在1-100之间");
      return;
    }
    generateMutation.mutate({ featureType, count });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("已复制到剪贴板");
  };

  const getFeatureTypeName = (type: string) => {
    const names: Record<string, string> = {
      boneWeight: "称骨算命",
      nameAvatar: "网名头像推荐",
      yearFortune: "流年运势",
      monthFortune: "流月运势",
    };
    return names[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; text: string }> = {
      unused: { variant: "secondary", text: "未使用" },
      active: { variant: "default", text: "激活中" },
      expired: { variant: "destructive", text: "已过期" },
    };
    const config = variants[status] || { variant: "outline" as const, text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-6xl mx-auto space-y-8">
        {/* 标题 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">授权码管理后台</h1>
          <p className="text-muted-foreground">生成和管理付费功能授权码</p>
        </div>

        {/* 生成授权码 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              生成授权码
            </CardTitle>
            <CardDescription>
              选择功能类型和数量，生成新的授权码
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="featureType">功能类型</Label>
                <Select value={featureType} onValueChange={(value: any) => setFeatureType(value)}>
                  <SelectTrigger id="featureType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nameAvatar">网名头像推荐</SelectItem>
                    <SelectItem value="yearFortune">流年运势</SelectItem>
                    <SelectItem value="monthFortune">流月运势</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="count">生成数量（1-100）</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="w-full"
            >
              <Key className="w-4 h-4 mr-2" />
              {generateMutation.isPending ? "生成中..." : `生成 ${count} 个授权码`}
            </Button>
          </CardContent>
        </Card>

        {/* 授权码列表 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>授权码列表</CardTitle>
                <CardDescription>
                  共 {codesData?.codes?.length || 0} 个授权码
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>授权码</TableHead>
                    <TableHead>功能类型</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>激活时间</TableHead>
                    <TableHead>过期时间</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {codesData?.codes && codesData.codes.length > 0 ? (
                    codesData.codes.map((code) => (
                      <TableRow key={code.id}>
                        <TableCell className="font-mono text-sm">{code.code}</TableCell>
                        <TableCell>{getFeatureTypeName(code.featureType)}</TableCell>
                        <TableCell>{getStatusBadge(code.status)}</TableCell>
                        <TableCell>
                          {code.activatedAt
                            ? new Date(code.activatedAt).toLocaleString("zh-CN")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {code.expiresAt
                            ? new Date(code.expiresAt).toLocaleString("zh-CN")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {new Date(code.createdAt).toLocaleString("zh-CN")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(code.code)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        暂无授权码，请先生成
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
